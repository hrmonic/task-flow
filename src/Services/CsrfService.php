<?php

declare(strict_types=1);

namespace App\Services;

final class CsrfService
{
    public static function token(): string
    {
        self::startSessionIfNeeded();
        if (empty($_SESSION['_csrf'])) {
            $_SESSION['_csrf'] = bin2hex(random_bytes(16));
        }

        return (string) $_SESSION['_csrf'];
    }

    public static function validateToken(string $sent): bool
    {
        if (session_status() !== PHP_SESSION_ACTIVE) {
            return false;
        }
        $expected = $_SESSION['_csrf'] ?? '';
        if ($expected === '' || $sent === '') {
            return false;
        }

        return hash_equals($expected, $sent);
    }

    public static function startSessionIfNeeded(): void
    {
        if (session_status() === PHP_SESSION_ACTIVE) {
            return;
        }
        session_name('taskflow_sid');
        session_start([
            'cookie_httponly' => true,
            'cookie_samesite' => 'Lax',
            'cookie_secure' => ($_ENV['APP_ENV'] ?? 'dev') === 'prod',
        ]);
    }
}
