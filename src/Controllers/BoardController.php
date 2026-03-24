<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Repositories\BoardRepository;
use App\Repositories\BoardInvitationRepository;
use App\Repositories\TaskActivityRepository;
use App\Repositories\TaskRepository;
use App\Repositories\UserRepository;
use App\Services\InvitationMailerService;
use App\Services\ResponseService;
use App\Services\ValidationService;
use Throwable;

final class BoardController
{
    private BoardRepository $boards;
    private BoardInvitationRepository $invitations;
    private TaskActivityRepository $activities;
    private UserRepository $users;
    private InvitationMailerService $mailer;
    public function __construct()
    {
        $this->boards = new BoardRepository();
        $this->invitations = new BoardInvitationRepository();
        $this->activities = new TaskActivityRepository();
        $this->users = new UserRepository();
        $this->mailer = new InvitationMailerService();
    }

    public function index(string $userId, array $payload): void
    {
        ResponseService::json(true, $this->boards->findByUser($userId), null);
    }

    public function dashboard(string $userId, array $payload): void
    {
        $boards = $this->boards->findByUser($userId);
        $ids = array_map(static fn (array $b): string => (string) $b['id'], $boards);
        $tasksRepo = new TaskRepository();
        $aggByBoard = $tasksRepo->aggregateByBoardIds($ids);
        $hotRows = $tasksRepo->hotTasksByBoardIds($ids, 5);
        $hotByBoard = [];
        foreach ($hotRows as $row) {
            $bid = $row['board_id'];
            if (!isset($hotByBoard[$bid])) {
                $hotByBoard[$bid] = [];
            }
            $hotByBoard[$bid][] = [
                'id' => $row['id'],
                'title' => $row['title'],
                'priority' => $row['priority'],
                'due_date' => $row['due_date'],
                'column_name' => $row['column_name'],
            ];
        }

        $merged = [];
        $totals = [
            'boards' => count($boards),
            'tasks' => 0,
            'urgent' => 0,
            'high' => 0,
            'overdue' => 0,
            'due_this_week' => 0,
        ];

        foreach ($boards as $b) {
            $id = (string) $b['id'];
            $a = $aggByBoard[$id] ?? null;
            $tasksTotal = $a !== null ? (int) $a['tasks_total'] : 0;
            $urgent = $a !== null ? (int) $a['urgent'] : 0;
            $high = $a !== null ? (int) $a['high_pri'] : 0;
            $medium = $a !== null ? (int) $a['medium_pri'] : 0;
            $low = $a !== null ? (int) $a['low_pri'] : 0;
            $overdue = $a !== null ? (int) $a['overdue'] : 0;
            $dueWeek = $a !== null ? (int) $a['due_week'] : 0;

            $totals['tasks'] += $tasksTotal;
            $totals['urgent'] += $urgent;
            $totals['high'] += $high;
            $totals['overdue'] += $overdue;
            $totals['due_this_week'] += $dueWeek;

            $merged[] = [
                'id' => $id,
                'name' => $b['name'],
                'description' => $b['description'] ?? null,
                'job_key' => $b['job_key'] ?? null,
                'rubric_key' => $b['rubric_key'] ?? null,
                'icon_key' => $b['icon_key'] ?? null,
                'is_owner' => (bool) (int) ($b['is_owner'] ?? 0),
                'stats' => [
                    'tasks_total' => $tasksTotal,
                    'urgent' => $urgent,
                    'high' => $high,
                    'medium' => $medium,
                    'low' => $low,
                    'overdue' => $overdue,
                    'due_this_week' => $dueWeek,
                ],
                'hot_tasks' => $hotByBoard[$id] ?? [],
            ];
        }

        ResponseService::json(true, ['boards' => $merged, 'totals' => $totals], null);
    }

    public function create(string $userId, array $payload): void
    {
        $name = ValidationService::requiredString($payload, 'name', 2, 120);
        $description = isset($payload['description']) ? trim((string) $payload['description']) : null;
        $jobKey = isset($payload['job_key']) ? trim((string) $payload['job_key']) : null;
        $rubricKey = isset($payload['rubric_key']) ? trim((string) $payload['rubric_key']) : null;
        $iconKey = isset($payload['icon_key']) ? trim((string) $payload['icon_key']) : null;
        $jobKey = $jobKey === '' ? null : mb_substr($jobKey, 0, 80);
        $rubricKey = $rubricKey === '' ? null : mb_substr($rubricKey, 0, 80);
        $iconKey = $iconKey === '' ? null : mb_substr($iconKey, 0, 120);
        ResponseService::json(
            true,
            $this->boards->create($userId, $name, $description, $jobKey, $rubricKey, $iconKey),
            null,
            [],
            201
        );
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
            if (array_key_exists('job_key', $payload)) {
                $raw = trim((string) $payload['job_key']);
                $fields['job_key'] = $raw === '' ? null : mb_substr($raw, 0, 80);
            }
            if (array_key_exists('rubric_key', $payload)) {
                $raw = trim((string) $payload['rubric_key']);
                $fields['rubric_key'] = $raw === '' ? null : mb_substr($raw, 0, 80);
            }
            if (array_key_exists('icon_key', $payload)) {
                $raw = trim((string) $payload['icon_key']);
                $fields['icon_key'] = $raw === '' ? null : mb_substr($raw, 0, 120);
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

    public function activity(string $userId, array $payload): void
    {
        $boardId = (string) ($payload['id'] ?? '');
        if (!$this->boards->belongsToUser($boardId, $userId)) {
            ResponseService::json(false, null, 'Board not found', [], 404);
            return;
        }
        ResponseService::json(true, $this->activities->latestByBoard($boardId, 80), null);
    }
}
