<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Config\Database;
use PDO;
use Ramsey\Uuid\Uuid;

final class TaskActivityRepository
{
    private PDO $pdo;

    public function __construct()
    {
        $this->pdo = Database::connection();
    }

    public function log(string $boardId, string $taskId, string $actorUserId, string $action, ?array $details = null): void
    {
        $stmt = $this->pdo->prepare(
            'INSERT INTO task_activity_logs (id, board_id, task_id, actor_user_id, action, details, created_at)
             VALUES (:id, :board_id, :task_id, :actor_user_id, :action, :details, NOW())'
        );
        $stmt->execute([
            'id' => Uuid::uuid4()->toString(),
            'board_id' => $boardId,
            'task_id' => $taskId,
            'actor_user_id' => $actorUserId,
            'action' => $action,
            'details' => $details ? json_encode($details, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) : null,
        ]);
    }

    public function latestByBoard(string $boardId, int $limit = 60): array
    {
        $stmt = $this->pdo->prepare(
            'SELECT l.id, l.task_id, l.action, l.details, l.created_at, u.name AS actor_name
             FROM task_activity_logs l
             INNER JOIN users u ON u.id = l.actor_user_id
             WHERE l.board_id = :board_id
             ORDER BY l.created_at DESC
             LIMIT :lim'
        );
        $stmt->bindValue(':board_id', $boardId);
        $stmt->bindValue(':lim', max(1, min(200, $limit)), PDO::PARAM_INT);
        $stmt->execute();
        $rows = $stmt->fetchAll();
        return array_map(
            static function (array $row): array {
                $decoded = null;
                if (isset($row['details']) && is_string($row['details']) && $row['details'] !== '') {
                    $tmp = json_decode($row['details'], true);
                    if (is_array($tmp)) {
                        $decoded = $tmp;
                    }
                }
                $row['details'] = $decoded;
                return $row;
            },
            $rows
        );
    }
}
