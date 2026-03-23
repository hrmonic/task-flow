<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Config\Database;
use PDO;
use Ramsey\Uuid\Uuid;

final class BoardRepository
{
    private PDO $pdo;
    public function __construct() { $this->pdo = Database::connection(); }

    public function findByUser(string $userId): array
    {
        $stmt = $this->pdo->prepare('SELECT id, name, description, created_at, updated_at FROM boards WHERE user_id = :user_id ORDER BY created_at DESC');
        $stmt->execute(['user_id' => $userId]);
        return $stmt->fetchAll();
    }

    public function create(string $userId, string $name, ?string $description): array
    {
        $id = Uuid::uuid4()->toString();
        $stmt = $this->pdo->prepare('INSERT INTO boards (id, user_id, name, description, created_at, updated_at) VALUES (:id,:user_id,:name,:description,NOW(),NOW())');
        $stmt->execute(['id' => $id, 'user_id' => $userId, 'name' => $name, 'description' => $description]);
        return ['id' => $id, 'name' => $name, 'description' => $description];
    }

    public function belongsToUser(string $boardId, string $userId): bool
    {
        $stmt = $this->pdo->prepare('SELECT 1 FROM boards WHERE id = :id AND user_id = :user_id');
        $stmt->execute(['id' => $boardId, 'user_id' => $userId]);
        return (bool) $stmt->fetchColumn();
    }

    public function delete(string $id, string $userId): void
    {
        $stmt = $this->pdo->prepare('DELETE FROM boards WHERE id = :id AND user_id = :user_id');
        $stmt->execute(['id' => $id, 'user_id' => $userId]);
    }

    /**
     * @param array{name?: string, description?: string|null} $fields
     */
    public function update(string $id, string $userId, array $fields): void
    {
        $set = [];
        $params = ['id' => $id, 'user_id' => $userId];
        if (array_key_exists('name', $fields)) {
            $set[] = 'name = :name';
            $params['name'] = $fields['name'];
        }
        if (array_key_exists('description', $fields)) {
            $set[] = 'description = :description';
            $params['description'] = $fields['description'];
        }
        if ($set === []) {
            return;
        }
        $set[] = 'updated_at = NOW()';
        $sql = 'UPDATE boards SET ' . implode(', ', $set) . ' WHERE id = :id AND user_id = :user_id';
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
    }
}
