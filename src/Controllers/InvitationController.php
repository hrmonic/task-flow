<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Repositories\BoardInvitationRepository;
use App\Services\ResponseService;

final class InvitationController
{
    private BoardInvitationRepository $invitations;

    public function __construct()
    {
        $this->invitations = new BoardInvitationRepository();
    }

    public function index(string $userId): void
    {
        ResponseService::json(true, $this->invitations->listPendingInvitationsForUser($userId), null);
    }

    public function accept(string $userId, array $payload): void
    {
        $id = (string) ($payload['id'] ?? '');
        $inv = $this->invitations->findInvitationForInvitee($id, $userId);
        if (!$inv || (string) $inv['status'] !== 'pending') {
            ResponseService::json(false, null, "Invitation introuvable.", [], 404);
            return;
        }
        $this->invitations->acceptInvitation($id, $userId);
        ResponseService::json(true, ['accepted' => true], null);
    }

    public function reject(string $userId, array $payload): void
    {
        $id = (string) ($payload['id'] ?? '');
        $inv = $this->invitations->findInvitationForInvitee($id, $userId);
        if (!$inv || (string) $inv['status'] !== 'pending') {
            ResponseService::json(false, null, "Invitation introuvable.", [], 404);
            return;
        }
        $this->invitations->rejectInvitation($id, $userId);
        ResponseService::json(true, ['rejected' => true], null);
    }
}
