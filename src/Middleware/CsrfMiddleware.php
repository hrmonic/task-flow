<?php

declare(strict_types=1);

namespace App\Middleware;

use App\Services\CsrfService;

/**
 * Protège les écritures API (surtout refresh cookie + JWT) contre le CSRF navigateur.
 * Les formulaires HTML de la SPA envoient X-CSRF-Token (lu depuis la meta de la page d’accueil).
 */
final class CsrfMiddleware
{
    /** @var list<string> */
    private const EXEMPT_PATHS = [
        '/api/auth/register',
        '/api/auth/login',
    ];

    public function handle(string $method, string $path): bool
    {
        if (!in_array($method, ['POST', 'PATCH', 'DELETE', 'PUT'], true)) {
            return true;
        }
        if (!str_starts_with($path, '/api/')) {
            return true;
        }
        foreach (self::EXEMPT_PATHS as $exempt) {
            if ($path === $exempt) {
                return true;
            }
        }

        $header = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
        $sent = is_string($header) ? trim($header) : '';

        return CsrfService::validateToken($sent);
    }
}
