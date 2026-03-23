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
        foreach (['name', 'position'] as $field) {
            if (array_key_exists($field, $payload)) {
                $fields[] = $field . ' = :' . $field;
                $params[$field] = $payload[$field];
            }
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
}
