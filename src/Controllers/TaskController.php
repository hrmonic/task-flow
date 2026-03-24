<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Repositories\BoardRepository;
use App\Repositories\ColumnRepository;
use App\Repositories\TaskActivityRepository;
use App\Repositories\TaskRepository;
use App\Services\ResponseService;
use App\Services\ValidationService;

final class TaskController
{
    private TaskRepository $tasks;
    private ColumnRepository $columns;
    private BoardRepository $boards;
    private TaskActivityRepository $activities;
    public function __construct()
    {
        $this->tasks = new TaskRepository();
        $this->columns = new ColumnRepository();
        $this->boards = new BoardRepository();
        $this->activities = new TaskActivityRepository();
    }

    public function index(string $userId, array $payload): void
    {
        $columnId = (string) ($payload['id'] ?? '');
        $boardId = $this->columns->boardIdByColumnId($columnId);
        if (!$boardId || !$this->boards->belongsToUser($boardId, $userId)) {
            ResponseService::json(false, null, 'Column not found', [], 404);
            return;
        }
        ResponseService::json(true, $this->tasks->findByColumn($columnId), null);
    }

    public function create(string $userId, array $payload): void
    {
        $columnId = (string) ($payload['id'] ?? '');
        $boardId = $this->columns->boardIdByColumnId($columnId);
        if (!$boardId || !$this->boards->belongsToUser($boardId, $userId)) {
            ResponseService::json(false, null, 'Column not found', [], 404);
            return;
        }
        $payload['title'] = ValidationService::requiredString($payload, 'title', 2, 255);
        $task = $this->tasks->create($columnId, $payload);
        $this->activities->log(
            (string) $boardId,
            (string) $task['id'],
            $userId,
            'task_created',
            ['title' => (string) ($task['title'] ?? '')]
        );
        ResponseService::json(true, $task, null, [], 201);
    }

    public function update(string $userId, array $payload): void
    {
        $taskId = (string) ($payload['id'] ?? '');
        $boardId = $this->tasks->boardIdByTaskId($taskId);
        if (!$boardId || !$this->boards->belongsToUser($boardId, $userId)) {
            ResponseService::json(false, null, 'Task not found', [], 404);
            return;
        }
        $this->tasks->update($taskId, $payload);
        $this->activities->log($boardId, $taskId, $userId, 'task_updated', ['fields' => array_keys($payload)]);
        ResponseService::json(true, ['updated' => true], null);
    }

    public function move(string $userId, array $payload): void
    {
        $taskId = (string) ($payload['id'] ?? '');
        $targetColumnId = (string) ($payload['column_id'] ?? '');
        $position = (int) ($payload['position'] ?? 1);
        if ($position < 1) {
            ResponseService::json(false, null, 'Invalid position', [], 422);

            return;
        }
        $boardId = $this->tasks->boardIdByTaskId($taskId);
        $targetBoardId = $this->columns->boardIdByColumnId($targetColumnId);
        if (!$boardId || !$targetBoardId || $boardId !== $targetBoardId || !$this->boards->belongsToUser($boardId, $userId)) {
            ResponseService::json(false, null, 'Task or target column not found', [], 404);
            return;
        }
        $this->tasks->move($taskId, $targetColumnId, $position);
        $this->activities->log(
            $boardId,
            $taskId,
            $userId,
            'task_moved',
            ['column_id' => $targetColumnId, 'position' => $position]
        );
        ResponseService::json(true, ['moved' => true], null);
    }

    public function delete(string $userId, array $payload): void
    {
        $taskId = (string) ($payload['id'] ?? '');
        $boardId = $this->tasks->boardIdByTaskId($taskId);
        if (!$boardId || !$this->boards->belongsToUser($boardId, $userId)) {
            ResponseService::json(false, null, 'Task not found', [], 404);
            return;
        }
        $this->tasks->delete($taskId);
        ResponseService::json(true, ['deleted' => true], null);
    }
}
