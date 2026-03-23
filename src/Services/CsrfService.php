<?php

declare(strict_types=1);

namespace App\Services;

final class CsrfService
{
    public static function token(): string
    {
        if (session_status() !== PHP_SESSION_ACTIVE) {
            session_start();
        }
        if (empty($_SESSION['_csrf'])) {
            $_SESSION['_csrf'] = bin2hex(random_bytes(16));
        }
        return (string) $_SESSION['_csrf'];
    }
}
