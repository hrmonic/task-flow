<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Repositories\BoardRepository;
use App\Repositories\BoardInvitationRepository;
use App\Repositories\UserRepository;
use App\Services\InvitationMailerService;
use App\Services\ResponseService;
use App\Services\ValidationService;
use Throwable;

final class BoardController
{
    private BoardRepository $boards;
    private BoardInvitationRepository $invitations;
    private UserRepository $users;
    private InvitationMailerService $mailer;
    public function __construct()
    {
        $this->boards = new BoardRepository();
        $this->invitations = new BoardInvitationRepository();
        $this->users = new UserRepository();
        $this->mailer = new InvitationMailerService();
    }

    public function index(string $userId, array $payload): void
    {
        ResponseService::json(true, $this->boards->findByUser($userId), null);
    }

    public function create(string $userId, array $payload): void
    {
        $name = ValidationService::requiredString($payload, 'name', 2, 120);
        $description = isset($payload['description']) ? trim((string) $payload['description']) : null;
        ResponseService::json(true, $this->boards->create($userId, $name, $description), null, [], 201);
    }

    public function update(string $userId, array $payload): void
    {
        $id = (string) ($payload['id'] ?? '');
        if (!$this->boards->isOwner($id, $userId)) {
            ResponseService::json(false, null, 'Board not found', [], 404);

            return;
        }

        try {
            $fields = [];
            if (array_key_exists('name', $payload)) {
                $fields['name'] = ValidationService::requiredString($payload, 'name', 2, 120);
            }
            if (array_key_exists('description', $payload)) {
                $raw = trim((string) $payload['description']);
                if (mb_strlen($raw) > 2000) {
                    ResponseService::json(false, null, 'Description too long', [], 422);

                    return;
                }
                $fields['description'] = $raw === '' ? null : $raw;
            }
            if ($fields === []) {
                ResponseService::json(true, ['updated' => true], null);

                return;
            }
            $this->boards->update($id, $userId, $fields);
            ResponseService::json(true, ['updated' => true], null);
        } catch (Throwable $e) {
            ResponseService::json(false, null, $e->getMessage(), [], 422);
        }
    }

    public function delete(string $userId, array $payload): void
    {
        $id = (string) ($payload['id'] ?? '');
        if (!$this->boards->isOwner($id, $userId)) {
            ResponseService::json(false, null, 'Board not found', [], 404);
            return;
        }
        $this->boards->delete($id, $userId);
        ResponseService::json(true, ['deleted' => true], null);
    }

    public function contributors(string $userId, array $payload): void
    {
        $boardId = (string) ($payload['id'] ?? '');
        if (!$this->boards->belongsToUser($boardId, $userId)) {
            ResponseService::json(false, null, 'Board not found', [], 404);
            return;
        }

        ResponseService::json(
            true,
            [
                'contributors' => $this->invitations->listContributors($boardId),
                'can_manage' => $this->boards->isOwner($boardId, $userId),
            ],
            null
        );
    }

    public function inviteContributor(string $userId, array $payload): void
    {
        $boardId = (string) ($payload['id'] ?? '');
        if (!$this->boards->isOwner($boardId, $userId)) {
            ResponseService::json(false, null, 'Board not found', [], 404);
            return;
        }

        try {
            $identifier = ValidationService::requiredString($payload, 'identifier', 2, 190);
            $invitee = $this->users->findByEmailOrName($identifier);
            if ($invitee === null) {
                ResponseService::json(false, null, "Utilisateur introuvable (email ou nom).", [], 404);
                return;
            }
            $inviteeId = (string) $invitee['id'];
            if ($inviteeId === $userId) {
                ResponseService::json(false, null, "Vous ne pouvez pas vous inviter vous-même.", [], 422);
                return;
            }
            if ($this->invitations->isContributor($boardId, $inviteeId)) {
                ResponseService::json(false, null, "Cet utilisateur est déjà contributeur.", [], 409);
                return;
            }
            if ($this->invitations->hasPendingInvitation($boardId, $inviteeId)) {
                ResponseService::json(false, null, "Une invitation est déjà en attente.", [], 409);
                return;
            }

            $invitation = $this->invitations->createInvitation($boardId, $userId, $inviteeId);
            $boardName = 'Tableau';
            foreach ($this->boards->findByUser($userId) as $board) {
                if ((string) $board['id'] === $boardId) {
                    $boardName = (string) $board['name'];
                    break;
                }
            }
            $inviter = $this->users->findPublicById($userId);
            $mailSent = $this->mailer->sendInvitation(
                (string) $invitee['email'],
                (string) $invitee['name'],
                $inviter ? (string) $inviter['name'] : 'Un utilisateur',
                $boardName
            );

            ResponseService::json(
                true,
                ['invitation' => $invitation, 'mail_sent' => $mailSent],
                null,
                ['mail_warning' => $mailSent ? null : "Invitation créée mais e-mail non envoyé."]
            );
        } catch (Throwable $e) {
            ResponseService::json(false, null, $e->getMessage(), [], 422);
        }
    }

    public function removeContributor(string $userId, array $payload): void
    {
        $boardId = (string) ($payload['id'] ?? '');
        $targetUserId = (string) ($payload['user_id'] ?? '');
        if (!$this->boards->isOwner($boardId, $userId)) {
            ResponseService::json(false, null, 'Board not found', [], 404);
            return;
        }
        if ($targetUserId === '' || $targetUserId === $userId) {
            ResponseService::json(false, null, "Suppression impossible pour ce contributeur.", [], 422);
            return;
        }

        $this->invitations->removeContributor($boardId, $targetUserId);
        ResponseService::json(true, ['removed' => true], null);
    }
}
