<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Repositories\BoardRepository;
use App\Services\ResponseService;
use App\Services\ValidationService;
use Throwable;

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

    public function update(string $userId, array $payload): void
    {
        $id = (string) ($payload['id'] ?? '');
        if (!$this->boards->belongsToUser($id, $userId)) {
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
        if (!$this->boards->belongsToUser($id, $userId)) {
            ResponseService::json(false, null, 'Board not found', [], 404);
            return;
        }
        $this->boards->delete($id, $userId);
        ResponseService::json(true, ['deleted' => true], null);
    }
}
