<?php

declare(strict_types=1);

namespace App\Services;

use RuntimeException;

final class JwtService
{
    public function createAccessToken(string $userId): string
    {
        $now = time();
        $ttl = (int) ($_ENV['JWT_ACCESS_TTL'] ?? 900);
        return $this->encode(['sub' => $userId, 'iat' => $now, 'exp' => $now + $ttl, 'typ' => 'access']);
    }

    public function createRefreshToken(string $userId): string
    {
        $now = time();
        $ttl = (int) ($_ENV['JWT_REFRESH_TTL'] ?? 604800);
        return $this->encode(['sub' => $userId, 'iat' => $now, 'exp' => $now + $ttl, 'typ' => 'refresh']);
    }

    public function decode(string $jwt): array
    {
        $parts = explode('.', $jwt);
        if (count($parts) !== 3) {
            throw new RuntimeException('Malformed token');
        }

        [$header64, $payload64, $signature] = $parts;
        $expected = $this->base64UrlEncode(hash_hmac('sha256', $header64 . '.' . $payload64, $this->secret(), true));
        if (!hash_equals($expected, $signature)) {
            throw new RuntimeException('Invalid signature');
        }

        $payload = json_decode($this->base64UrlDecode($payload64), true);
        if (!is_array($payload)) {
            throw new RuntimeException('Invalid payload');
        }
        if (($payload['exp'] ?? 0) < time()) {
            throw new RuntimeException('Token expired');
        }

        return $payload;
    }

    private function secret(): string
    {
        return (string) ($_ENV['JWT_SECRET'] ?? 'change-me');
    }

    private function encode(array $payload): string
    {
        $header = ['alg' => 'HS256', 'typ' => 'JWT'];
        $header64 = $this->base64UrlEncode(json_encode($header, JSON_UNESCAPED_SLASHES));
        $payload64 = $this->base64UrlEncode(json_encode($payload, JSON_UNESCAPED_SLASHES));
        $signature = $this->base64UrlEncode(hash_hmac('sha256', $header64 . '.' . $payload64, $this->secret(), true));
        return $header64 . '.' . $payload64 . '.' . $signature;
    }

    private function base64UrlEncode(string $data): string
    {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    private function base64UrlDecode(string $data): string
    {
        return base64_decode(strtr($data . str_repeat('=', (4 - strlen($data) % 4) % 4), '-_', '+/')) ?: '';
    }
}
