<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Repositories\BoardRepository;
use App\Services\ResponseService;
use App\Services\ValidationService;

final class BoardController
{
    private BoardRepository $boards;
    public function __construct() { $this->boards = new BoardRepository(); }

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

    public function delete(string $userId, array $payload): void
    {
        $id = (string) ($payload['id'] ?? '');
        if (!$this->boards->belongsToUser($id, $userId)) {
            ResponseService::json(false, null, 'Board not found', [], 404);
            return;
        }
        $this->boards->delete($id, $userId);
        ResponseService::json(true, ['deleted' => true], null);
    }
}
