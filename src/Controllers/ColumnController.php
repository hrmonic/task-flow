<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Repositories\BoardRepository;
use App\Repositories\ColumnRepository;
use App\Services\ResponseService;
use App\Services\ValidationService;
use Throwable;

final class ColumnController
{
    private ColumnRepository $columns;
    private BoardRepository $boards;
    public function __construct() { $this->columns = new ColumnRepository(); $this->boards = new BoardRepository(); }

    public function index(string $userId, array $payload): void
    {
        $boardId = (string) ($payload['id'] ?? '');
        if (!$this->boards->belongsToUser($boardId, $userId)) {
            ResponseService::json(false, null, 'Board not found', [], 404);
            return;
        }
        ResponseService::json(true, $this->columns->findByBoard($boardId), null);
    }

    public function create(string $userId, array $payload): void
    {
        $boardId = (string) ($payload['id'] ?? '');
        if (!$this->boards->belongsToUser($boardId, $userId)) {
            ResponseService::json(false, null, 'Board not found', [], 404);
            return;
        }
        $name = ValidationService::requiredString($payload, 'name', 2, 120);
        $color = isset($payload['color']) ? (string) $payload['color'] : null;
        ResponseService::json(true, $this->columns->create($boardId, $name, $color), null, [], 201);
    }

    public function update(string $userId, array $payload): void
    {
        $columnId = (string) ($payload['id'] ?? '');
        $boardId = $this->columns->boardIdByColumnId($columnId);
        if (!$boardId || !$this->boards->belongsToUser($boardId, $userId)) {
            ResponseService::json(false, null, 'Column not found', [], 404);
            return;
        }
        try {
            if (array_key_exists('name', $payload)) {
                $payload['name'] = ValidationService::requiredString($payload, 'name', 2, 120);
            }
            $this->columns->update($columnId, $payload);
        } catch (Throwable $e) {
            ResponseService::json(false, null, $e->getMessage(), [], 422);

            return;
        }
        ResponseService::json(true, ['updated' => true], null);
    }

    public function delete(string $userId, array $payload): void
    {
        $columnId = (string) ($payload['id'] ?? '');
        $boardId = $this->columns->boardIdByColumnId($columnId);
        if (!$boardId || !$this->boards->belongsToUser($boardId, $userId)) {
            ResponseService::json(false, null, 'Column not found', [], 404);
            return;
        }
        $this->columns->delete($columnId);
        ResponseService::json(true, ['deleted' => true], null);
    }
}
