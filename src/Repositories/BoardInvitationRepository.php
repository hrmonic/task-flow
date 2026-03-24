<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Config\Database;
use PDO;
use Ramsey\Uuid\Uuid;

final class BoardInvitationRepository
{
    private PDO $pdo;

    public function __construct()
    {
        $this->pdo = Database::connection();
    }

    public function listContributors(string $boardId): array
    {
        $stmt = $this->pdo->prepare(
            "SELECT u.id, u.name, u.email, bc.role, bc.created_at
             FROM board_contributors bc
             INNER JOIN users u ON u.id = bc.user_id
             WHERE bc.board_id = :board_id
             ORDER BY bc.role = 'owner' DESC, u.name ASC"
        );
        $stmt->execute(['board_id' => $boardId]);
        return $stmt->fetchAll();
    }

    public function isContributor(string $boardId, string $userId): bool
    {
        $stmt = $this->pdo->prepare('SELECT 1 FROM board_contributors WHERE board_id = :board_id AND user_id = :user_id LIMIT 1');
        $stmt->execute(['board_id' => $boardId, 'user_id' => $userId]);
        return (bool) $stmt->fetchColumn();
    }

    public function hasPendingInvitation(string $boardId, string $inviteeUserId): bool
    {
        $stmt = $this->pdo->prepare(
            "SELECT 1
             FROM board_invitations
             WHERE board_id = :board_id AND invitee_user_id = :invitee_user_id AND status = 'pending'
             LIMIT 1"
        );
        $stmt->execute(['board_id' => $boardId, 'invitee_user_id' => $inviteeUserId]);
        return (bool) $stmt->fetchColumn();
    }

    public function createInvitation(string $boardId, string $inviterUserId, string $inviteeUserId): array
    {
        $id = Uuid::uuid4()->toString();
        $stmt = $this->pdo->prepare(
            "INSERT INTO board_invitations (id, board_id, inviter_user_id, invitee_user_id, status, created_at)
             VALUES (:id, :board_id, :inviter_user_id, :invitee_user_id, 'pending', NOW())"
        );
        $stmt->execute([
            'id' => $id,
            'board_id' => $boardId,
            'inviter_user_id' => $inviterUserId,
            'invitee_user_id' => $inviteeUserId,
        ]);

        return [
            'id' => $id,
            'board_id' => $boardId,
            'inviter_user_id' => $inviterUserId,
            'invitee_user_id' => $inviteeUserId,
            'status' => 'pending',
        ];
    }

    public function removeContributor(string $boardId, string $userId): void
    {
        $stmt = $this->pdo->prepare("DELETE FROM board_contributors WHERE board_id = :board_id AND user_id = :user_id AND role != 'owner'");
        $stmt->execute(['board_id' => $boardId, 'user_id' => $userId]);
    }

    public function listPendingInvitationsForUser(string $userId): array
    {
        $stmt = $this->pdo->prepare(
            "SELECT
                i.id,
                i.board_id,
                i.status,
                i.created_at,
                b.name AS board_name,
                inviter.id AS inviter_id,
                inviter.name AS inviter_name,
                inviter.email AS inviter_email
             FROM board_invitations i
             INNER JOIN boards b ON b.id = i.board_id
             INNER JOIN users inviter ON inviter.id = i.inviter_user_id
             WHERE i.invitee_user_id = :user_id AND i.status = 'pending'
             ORDER BY i.created_at DESC"
        );
        $stmt->execute(['user_id' => $userId]);
        return $stmt->fetchAll();
    }

    public function findInvitationForInvitee(string $invitationId, string $inviteeUserId): ?array
    {
        $stmt = $this->pdo->prepare(
            "SELECT id, board_id, inviter_user_id, invitee_user_id, status
             FROM board_invitations
             WHERE id = :id AND invitee_user_id = :invitee_user_id
             LIMIT 1"
        );
        $stmt->execute(['id' => $invitationId, 'invitee_user_id' => $inviteeUserId]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public function acceptInvitation(string $invitationId, string $inviteeUserId): void
    {
        $this->pdo->beginTransaction();
        try {
            $inv = $this->findInvitationForInvitee($invitationId, $inviteeUserId);
            if (!$inv || (string) $inv['status'] !== 'pending') {
                $this->pdo->rollBack();
                return;
            }

            $insertContributor = $this->pdo->prepare(
                "INSERT IGNORE INTO board_contributors (board_id, user_id, role, added_by, created_at)
                 VALUES (:board_id, :user_id, 'contributor', :added_by, NOW())"
            );
            $insertContributor->execute([
                'board_id' => (string) $inv['board_id'],
                'user_id' => $inviteeUserId,
                'added_by' => (string) $inv['inviter_user_id'],
            ]);

            $updateInvitation = $this->pdo->prepare(
                "UPDATE board_invitations
                 SET status = 'accepted', responded_at = NOW()
                 WHERE id = :id AND invitee_user_id = :invitee_user_id AND status = 'pending'"
            );
            $updateInvitation->execute(['id' => $invitationId, 'invitee_user_id' => $inviteeUserId]);
            $this->pdo->commit();
        } catch (\Throwable $e) {
            $this->pdo->rollBack();
            throw $e;
        }
    }

    public function rejectInvitation(string $invitationId, string $inviteeUserId): void
    {
        $stmt = $this->pdo->prepare(
            "UPDATE board_invitations
             SET status = 'rejected', responded_at = NOW()
             WHERE id = :id AND invitee_user_id = :invitee_user_id AND status = 'pending'"
        );
        $stmt->execute(['id' => $invitationId, 'invitee_user_id' => $inviteeUserId]);
    }
}
