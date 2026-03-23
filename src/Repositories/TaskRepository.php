<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Config\Database;
use PDO;
use Ramsey\Uuid\Uuid;

final class TaskRepository
{
    private PDO $pdo;
    public function __construct() { $this->pdo = Database::connection(); }

    public function findByColumn(string $columnId): array
    {
        $stmt = $this->pdo->prepare('SELECT id, column_id, title, description, priority, position, due_date, created_at, updated_at FROM tasks WHERE column_id = :column_id ORDER BY position ASC');
        $stmt->execute(['column_id' => $columnId]);
        $rows = $stmt->fetchAll();

        return array_map(
            static fn (array $r): array => $r + ['assignees' => []],
            $rows
        );
    }

    public function create(string $columnId, array $payload): array
    {
        $stmtPos = $this->pdo->prepare('SELECT COALESCE(MAX(position), 0) + 1 FROM tasks WHERE column_id = :column_id');
        $stmtPos->execute(['column_id' => $columnId]);
        $position = (int) $stmtPos->fetchColumn();

        $id = Uuid::uuid4()->toString();
        $stmt = $this->pdo->prepare(
            'INSERT INTO tasks (id, column_id, title, description, priority, position, due_date, created_at, updated_at)
             VALUES (:id,:column_id,:title,:description,:priority,:position,:due_date,NOW(),NOW())'
        );
        $stmt->execute([
            'id' => $id,
            'column_id' => $columnId,
            'title' => $payload['title'],
            'description' => $payload['description'] ?? null,
            'priority' => $payload['priority'] ?? 'medium',
            'position' => $position,
            'due_date' => $payload['due_date'] ?? null,
        ]);
        return ['id' => $id] + $payload + ['column_id' => $columnId, 'position' => $position, 'assignees' => []];
    }

    public function update(string $id, array $payload): void
    {
        $allowed = ['title', 'description', 'priority', 'due_date'];
        $fields = [];
        $params = ['id' => $id];
        foreach ($allowed as $field) {
            if (array_key_exists($field, $payload)) {
                $fields[] = $field . ' = :' . $field;
                $params[$field] = $payload[$field];
            }
        }
        if ($fields === []) { return; }
        $fields[] = 'updated_at = NOW()';
        $stmt = $this->pdo->prepare('UPDATE tasks SET ' . implode(', ', $fields) . ' WHERE id = :id');
        $stmt->execute($params);
    }

    /**
     * Réordonne les positions (1-based) dans une transaction : même colonne ou changement de colonne.
     * Utilise une position temporaire 0 (hors plage métier) pour éviter les collisions pendant les UPDATE.
     */
    public function move(string $id, string $targetColumnId, int $requestedPosition): void
    {
        $this->pdo->beginTransaction();
        try {
            $lock = $this->pdo->prepare('SELECT column_id, position FROM tasks WHERE id = :id FOR UPDATE');
            $lock->execute(['id' => $id]);
            $row = $lock->fetch(PDO::FETCH_ASSOC);
            if ($row === false) {
                $this->pdo->rollBack();
                throw new \RuntimeException('Task not found');
            }

            $sourceColumnId = (string) $row['column_id'];
            $oldPos = (int) $row['position'];

            $this->pdo->prepare('UPDATE tasks SET position = 0, updated_at = NOW() WHERE id = :id')->execute(['id' => $id]);

            if ($sourceColumnId === $targetColumnId) {
                $cntStmt = $this->pdo->prepare('SELECT COUNT(*) FROM tasks WHERE column_id = :c');
                $cntStmt->execute(['c' => $sourceColumnId]);
                $n = (int) $cntStmt->fetchColumn();
                $newPos = max(1, min($requestedPosition, $n));

                if ($newPos === $oldPos) {
                    $this->pdo->prepare('UPDATE tasks SET position = :p, updated_at = NOW() WHERE id = :id')->execute(['p' => $oldPos, 'id' => $id]);
                    $this->pdo->commit();

                    return;
                }

                if ($oldPos < $newPos) {
                    $s = $this->pdo->prepare(
                        'UPDATE tasks SET position = position - 1, updated_at = NOW()
                         WHERE column_id = :c AND id != :id AND position > :old AND position <= :new'
                    );
                    $s->execute(['c' => $sourceColumnId, 'id' => $id, 'old' => $oldPos, 'new' => $newPos]);
                } else {
                    $s = $this->pdo->prepare(
                        'UPDATE tasks SET position = position + 1, updated_at = NOW()
                         WHERE column_id = :c AND id != :id AND position >= :new AND position < :old'
                    );
                    $s->execute(['c' => $sourceColumnId, 'id' => $id, 'new' => $newPos, 'old' => $oldPos]);
                }

                $this->pdo->prepare('UPDATE tasks SET position = :p, updated_at = NOW() WHERE id = :id')->execute(['p' => $newPos, 'id' => $id]);
            } else {
                $this->pdo->prepare(
                    'UPDATE tasks SET position = position - 1, updated_at = NOW()
                     WHERE column_id = :c AND position > :old'
                )->execute(['c' => $sourceColumnId, 'old' => $oldPos]);

                $mStmt = $this->pdo->prepare('SELECT COUNT(*) FROM tasks WHERE column_id = :c');
                $mStmt->execute(['c' => $targetColumnId]);
                $m = (int) $mStmt->fetchColumn();
                $newPos = max(1, min($requestedPosition, $m + 1));

                $this->pdo->prepare(
                    'UPDATE tasks SET position = position + 1, updated_at = NOW()
                     WHERE column_id = :c AND position >= :new'
                )->execute(['c' => $targetColumnId, 'new' => $newPos]);

                $this->pdo->prepare(
                    'UPDATE tasks SET column_id = :col, position = :p, updated_at = NOW() WHERE id = :id'
                )->execute(['col' => $targetColumnId, 'p' => $newPos, 'id' => $id]);
            }

            $this->pdo->commit();
        } catch (\Throwable $e) {
            $this->pdo->rollBack();
            throw $e;
        }
    }

    public function delete(string $id): void
    {
        $stmt = $this->pdo->prepare('DELETE FROM tasks WHERE id = :id');
        $stmt->execute(['id' => $id]);
    }

    public function boardIdByTaskId(string $taskId): ?string
    {
        $stmt = $this->pdo->prepare('SELECT c.board_id FROM tasks t INNER JOIN columns c ON c.id = t.column_id WHERE t.id = :id');
        $stmt->execute(['id' => $taskId]);
        $value = $stmt->fetchColumn();
        return $value === false ? null : (string) $value;
    }
}
