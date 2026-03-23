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
        return $stmt->fetchAll();
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
        return ['id' => $id] + $payload + ['column_id' => $columnId, 'position' => $position];
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

    public function move(string $id, string $columnId, int $position): void
    {
        $stmt = $this->pdo->prepare('UPDATE tasks SET column_id = :column_id, position = :position, updated_at = NOW() WHERE id = :id');
        $stmt->execute(['id' => $id, 'column_id' => $columnId, 'position' => $position]);
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
