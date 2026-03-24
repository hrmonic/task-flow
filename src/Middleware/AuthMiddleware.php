<?php

declare(strict_types=1);

namespace App\Middleware;

use App\Services\JwtService;
use App\Services\ResponseService;
use Throwable;

final class AuthMiddleware
{
    private function readAuthorizationHeader(): string
    {
        $candidates = [
            $_SERVER['HTTP_AUTHORIZATION'] ?? '',
            $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '',
        ];

        foreach ($candidates as $value) {
            if (is_string($value) && trim($value) !== '') {
                return trim($value);
            }
        }

        if (function_exists('getallheaders')) {
            $headers = getallheaders();
            if (is_array($headers)) {
                foreach ($headers as $name => $value) {
                    if (strcasecmp((string) $name, 'Authorization') !== 0) {
                        continue;
                    }
                    if (is_string($value) && trim($value) !== '') {
                        return trim($value);
                    }
                }
            }
        }

        return '';
    }

    public function run(callable $handler): void
    {
        $authHeader = $this->readAuthorizationHeader();
        if (!preg_match('/^Bearer\s+(.+)$/', $authHeader, $matches)) {
            $meta = [];
            if (($_ENV['APP_ENV'] ?? 'dev') !== 'prod') {
                $meta['reason'] = 'Missing or malformed Authorization Bearer header';
            }
            ResponseService::json(false, null, 'Unauthorized', $meta, 401);
            return;
        }

        try {
            $payload = (new JwtService())->decode($matches[1]);
            $userId = (string) ($payload['sub'] ?? '');
            if ($userId === '') {
                $meta = [];
                if (($_ENV['APP_ENV'] ?? 'dev') !== 'prod') {
                    $meta['reason'] = 'Token payload missing subject';
                }
                ResponseService::json(false, null, 'Unauthorized', $meta, 401);
                return;
            }
        } catch (Throwable $e) {
            $meta = [];
            if (($_ENV['APP_ENV'] ?? 'dev') !== 'prod') {
                $meta['reason'] = $e->getMessage();
            }
            ResponseService::json(false, null, 'Unauthorized', $meta, 401);
            return;
        }

        $handler($userId);
    }
}
