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
                b.job_key,
                b.rubric_key,
                b.icon_key,
                b.created_at,
                b.updated_at,
                CASE WHEN b.user_id = :owner_user_id THEN 1 ELSE 0 END AS is_owner
             FROM boards b
             LEFT JOIN board_contributors bc ON bc.board_id = b.id AND bc.user_id = :contrib_user_id
             WHERE b.user_id = :where_owner_user_id OR bc.user_id = :where_contrib_user_id
             ORDER BY b.created_at DESC'
        );
        $stmt->execute([
            'owner_user_id' => $userId,
            'contrib_user_id' => $userId,
            'where_owner_user_id' => $userId,
            'where_contrib_user_id' => $userId,
        ]);
        return $stmt->fetchAll();
    }

    public function create(
        string $userId,
        string $name,
        ?string $description,
        ?string $jobKey = null,
        ?string $rubricKey = null,
        ?string $iconKey = null
    ): array
    {
        $id = Uuid::uuid4()->toString();
        $this->pdo->beginTransaction();
        $stmt = $this->pdo->prepare(
            'INSERT INTO boards (id, user_id, name, description, job_key, rubric_key, icon_key, created_at, updated_at)
             VALUES (:id,:user_id,:name,:description,:job_key,:rubric_key,:icon_key,NOW(),NOW())'
        );
        $stmt->execute([
            'id' => $id,
            'user_id' => $userId,
            'name' => $name,
            'description' => $description,
            'job_key' => $jobKey,
            'rubric_key' => $rubricKey,
            'icon_key' => $iconKey,
        ]);
        $owner = $this->pdo->prepare(
            "INSERT INTO board_contributors (board_id, user_id, role, added_by, created_at)
             VALUES (:board_id, :user_id, 'owner', :added_by, NOW())"
        );
        $owner->execute(['board_id' => $id, 'user_id' => $userId, 'added_by' => $userId]);
        $this->pdo->commit();
        return [
            'id' => $id,
            'name' => $name,
            'description' => $description,
            'job_key' => $jobKey,
            'rubric_key' => $rubricKey,
            'icon_key' => $iconKey,
        ];
    }

    public function belongsToUser(string $boardId, string $userId): bool
    {
        $stmt = $this->pdo->prepare(
            'SELECT 1
             FROM boards b
             LEFT JOIN board_contributors bc ON bc.board_id = b.id AND bc.user_id = :join_user_id
             WHERE b.id = :id AND (b.user_id = :owner_user_id OR bc.user_id = :contrib_user_id)
             LIMIT 1'
        );
        $stmt->execute([
            'id' => $boardId,
            'join_user_id' => $userId,
            'owner_user_id' => $userId,
            'contrib_user_id' => $userId,
        ]);
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
     * @param array{name?: string, description?: string|null, job_key?: string|null, rubric_key?: string|null, icon_key?: string|null} $fields
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
        if (array_key_exists('job_key', $fields)) {
            $set[] = 'job_key = :job_key';
            $params['job_key'] = $fields['job_key'];
        }
        if (array_key_exists('rubric_key', $fields)) {
            $set[] = 'rubric_key = :rubric_key';
            $params['rubric_key'] = $fields['rubric_key'];
        }
        if (array_key_exists('icon_key', $fields)) {
            $set[] = 'icon_key = :icon_key';
            $params['icon_key'] = $fields['icon_key'];
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
