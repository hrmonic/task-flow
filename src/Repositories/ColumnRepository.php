<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Config\Database;
use PDO;
use Ramsey\Uuid\Uuid;

final class ColumnRepository
{
    private PDO $pdo;
    public function __construct() { $this->pdo = Database::connection(); }

    public function findByBoard(string $boardId): array
    {
        $stmt = $this->pdo->prepare('SELECT id, board_id, name, position, color, created_at FROM columns WHERE board_id = :board_id ORDER BY position ASC');
        $stmt->execute(['board_id' => $boardId]);
        return $stmt->fetchAll();
    }

    public function create(string $boardId, string $name, ?string $color): array
    {
        $stmtPos = $this->pdo->prepare('SELECT COALESCE(MAX(position), 0) + 1 FROM columns WHERE board_id = :board_id');
        $stmtPos->execute(['board_id' => $boardId]);
        $position = (int) $stmtPos->fetchColumn();

        $id = Uuid::uuid4()->toString();
        $stmt = $this->pdo->prepare('INSERT INTO columns (id, board_id, name, position, color, created_at) VALUES (:id,:board_id,:name,:position,:color,NOW())');
        $stmt->execute(['id' => $id, 'board_id' => $boardId, 'name' => $name, 'position' => $position, 'color' => $color ?: '#64748b']);
        return ['id' => $id, 'board_id' => $boardId, 'name' => $name, 'position' => $position, 'color' => $color ?: '#64748b'];
    }

    public function update(string $id, array $payload): void
    {
        $fields = [];
        $params = ['id' => $id];
        foreach (['name', 'position', 'color'] as $field) {
            if (!array_key_exists($field, $payload)) {
                continue;
            }
            if ($field === 'color') {
                $c = trim((string) $payload['color']);
                if ($c === '') {
                    continue;
                }
                if (!preg_match('/^#[0-9A-Fa-f]{6}$/', $c)) {
                    throw new \InvalidArgumentException('Invalid column color (use #RRGGBB)');
                }
                $fields[] = 'color = :color';
                $params['color'] = $c;

                continue;
            }
            $fields[] = $field . ' = :' . $field;
            $params[$field] = $payload[$field];
        }
        if ($fields === []) { return; }
        $stmt = $this->pdo->prepare('UPDATE columns SET ' . implode(', ', $fields) . ' WHERE id = :id');
        $stmt->execute($params);
    }

    public function delete(string $id): void
    {
        $stmt = $this->pdo->prepare('DELETE FROM columns WHERE id = :id');
        $stmt->execute(['id' => $id]);
    }

    public function boardIdByColumnId(string $id): ?string
    {
        $stmt = $this->pdo->prepare('SELECT board_id FROM columns WHERE id = :id');
        $stmt->execute(['id' => $id]);
        $value = $stmt->fetchColumn();
        return $value === false ? null : (string) $value;
    }

    /**
     * Réordonne les positions (1-based) dans une transaction pour un même board.
     * Position temporaire 0 pour éviter les collisions pendant les UPDATE.
     */
    public function moveToPosition(string $columnId, int $requestedPosition): void
    {
        $this->pdo->beginTransaction();
        try {
            $lock = $this->pdo->prepare('SELECT board_id, position FROM columns WHERE id = :id FOR UPDATE');
            $lock->execute(['id' => $columnId]);
            $row = $lock->fetch(PDO::FETCH_ASSOC);
            if ($row === false) {
                $this->pdo->rollBack();
                throw new \RuntimeException('Column not found');
            }

            $boardId = (string) $row['board_id'];
            $oldPos = (int) $row['position'];

            $this->pdo->prepare('UPDATE columns SET position = 0 WHERE id = :id')->execute(['id' => $columnId]);

            $cntStmt = $this->pdo->prepare('SELECT COUNT(*) FROM columns WHERE board_id = :b');
            $cntStmt->execute(['b' => $boardId]);
            $n = (int) $cntStmt->fetchColumn();
            $newPos = max(1, min($requestedPosition, $n));

            if ($newPos === $oldPos) {
                $this->pdo->prepare('UPDATE columns SET position = :p WHERE id = :id')->execute(['p' => $oldPos, 'id' => $columnId]);
                $this->pdo->commit();

                return;
            }

            if ($oldPos < $newPos) {
                $s = $this->pdo->prepare(
                    'UPDATE columns SET position = position - 1
                     WHERE board_id = :b AND id != :id AND position > :old AND position <= :new'
                );
                $s->execute(['b' => $boardId, 'id' => $columnId, 'old' => $oldPos, 'new' => $newPos]);
            } else {
                $s = $this->pdo->prepare(
                    'UPDATE columns SET position = position + 1
                     WHERE board_id = :b AND id != :id AND position >= :new AND position < :old'
                );
                $s->execute(['b' => $boardId, 'id' => $columnId, 'new' => $newPos, 'old' => $oldPos]);
            }

            $this->pdo->prepare('UPDATE columns SET position = :p WHERE id = :id')->execute(['p' => $newPos, 'id' => $columnId]);
            $this->pdo->commit();
        } catch (\Throwable $e) {
            $this->pdo->rollBack();
            throw $e;
        }
    }
}
