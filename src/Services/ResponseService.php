<?php

declare(strict_types=1);

namespace App\Services;

final class ResponseService
{
    public static function json(bool $success, mixed $data = null, ?string $error = null, array $meta = [], int $status = 200): void
    {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(
            ['success' => $success, 'data' => $data, 'error' => $error, 'meta' => $meta],
            JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
        );
    }
}
