<?php

declare(strict_types=1);

namespace App\Middleware;

final class RateLimitMiddleware
{
    public function __construct(private readonly int $maxPerMinute) {}

    public function handle(): bool
    {
        $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
        $bucket = sys_get_temp_dir() . '/taskflow-rate-limit-' . md5($ip) . '-' . date('YmdHi');
        $count = file_exists($bucket) ? (int) file_get_contents($bucket) : 0;
        $count++;
        file_put_contents($bucket, (string) $count);
        return $count <= $this->maxPerMinute;
    }
}
