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
        $stmt = $this->pdo->prepare(
            'SELECT DISTINCT
                b.id,
                b.name,
                b.description,
                b.created_at,
                b.updated_at,
                CASE WHEN b.user_id = :user_id THEN 1 ELSE 0 END AS is_owner
             FROM boards b
             LEFT JOIN board_contributors bc ON bc.board_id = b.id AND bc.user_id = :user_id
             WHERE b.user_id = :user_id OR bc.user_id = :user_id
             ORDER BY b.created_at DESC'
        );
        $stmt->execute(['user_id' => $userId]);
        return $stmt->fetchAll();
    }

    public function create(string $userId, string $name, ?string $description): array
    {
        $id = Uuid::uuid4()->toString();
        $this->pdo->beginTransaction();
        $stmt = $this->pdo->prepare('INSERT INTO boards (id, user_id, name, description, created_at, updated_at) VALUES (:id,:user_id,:name,:description,NOW(),NOW())');
        $stmt->execute(['id' => $id, 'user_id' => $userId, 'name' => $name, 'description' => $description]);
        $owner = $this->pdo->prepare(
            "INSERT INTO board_contributors (board_id, user_id, role, added_by, created_at)
             VALUES (:board_id, :user_id, 'owner', :added_by, NOW())"
        );
        $owner->execute(['board_id' => $id, 'user_id' => $userId, 'added_by' => $userId]);
        $this->pdo->commit();
        return ['id' => $id, 'name' => $name, 'description' => $description];
    }

    public function belongsToUser(string $boardId, string $userId): bool
    {
        $stmt = $this->pdo->prepare(
            'SELECT 1
             FROM boards b
             LEFT JOIN board_contributors bc ON bc.board_id = b.id AND bc.user_id = :user_id
             WHERE b.id = :id AND (b.user_id = :user_id OR bc.user_id = :user_id)
             LIMIT 1'
        );
        $stmt->execute(['id' => $boardId, 'user_id' => $userId]);
        return (bool) $stmt->fetchColumn();
    }

    public function isOwner(string $boardId, string $userId): bool
    {
        $stmt = $this->pdo->prepare('SELECT 1 FROM boards WHERE id = :id AND user_id = :user_id LIMIT 1');
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
