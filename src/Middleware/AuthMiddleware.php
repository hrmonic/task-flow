<?php

declare(strict_types=1);

namespace App\Middleware;

use App\Services\JwtService;
use App\Services\ResponseService;
use Throwable;

final class AuthMiddleware
{
    public function run(callable $handler): void
    {
        $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
        if (!preg_match('/^Bearer\s+(.+)$/', $authHeader, $matches)) {
            ResponseService::json(false, null, 'Unauthorized', [], 401);
            return;
        }

        try {
            $payload = (new JwtService())->decode($matches[1]);
            $userId = (string) ($payload['sub'] ?? '');
            if ($userId === '') {
                ResponseService::json(false, null, 'Unauthorized', [], 401);
                return;
            }
            $handler($userId);
        } catch (Throwable) {
            ResponseService::json(false, null, 'Unauthorized', [], 401);
        }
    }
}
