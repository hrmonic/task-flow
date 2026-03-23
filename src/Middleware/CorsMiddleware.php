<?php

declare(strict_types=1);

namespace App\Middleware;

final class CorsMiddleware
{
    public function handle(): void
    {
        $origin = (string) ($_ENV['CORS_ALLOW_ORIGIN'] ?? 'http://localhost:8080');
        header('Access-Control-Allow-Origin: ' . $origin);
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-CSRF-Token');
        header('Access-Control-Allow-Methods: GET, POST, PATCH, DELETE, OPTIONS');
        header('Access-Control-Allow-Credentials: true');

        if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
            http_response_code(204);
            exit;
        }
    }
}
