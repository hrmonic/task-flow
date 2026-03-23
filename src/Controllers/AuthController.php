<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Repositories\UserRepository;
use App\Services\JwtService;
use App\Services\ResponseService;
use App\Services\ValidationService;
use Throwable;

final class AuthController
{
    private UserRepository $users;
    private JwtService $jwt;

    public function __construct()
    {
        $this->users = new UserRepository();
        $this->jwt = new JwtService();
    }

    public function register(array $payload): void
    {
        try {
            $name = ValidationService::requiredString($payload, 'name', 2, 120);
            $email = ValidationService::email($payload, 'email');
            $password = ValidationService::requiredString($payload, 'password', 8, 200);

            if ($this->users->findByEmail($email)) {
                ResponseService::json(false, null, 'Email already exists', [], 409);
                return;
            }

            $user = $this->users->create($name, $email, password_hash($password, PASSWORD_ARGON2ID));
            $access = $this->jwt->createAccessToken($user['id']);
            $refresh = $this->jwt->createRefreshToken($user['id']);
            setcookie('refresh_token', $refresh, ['expires' => time() + 604800, 'path' => '/', 'httponly' => true, 'samesite' => 'Lax']);
            ResponseService::json(true, ['token' => $access, 'user' => $user], null, [], 201);
        } catch (Throwable $e) {
            ResponseService::json(false, null, $e->getMessage(), [], 422);
        }
    }

    public function login(array $payload): void
    {
        try {
            $email = ValidationService::email($payload, 'email');
            $password = ValidationService::requiredString($payload, 'password', 8, 200);
            $user = $this->users->findByEmail($email);
            if (!$user || !password_verify($password, (string) $user['password_hash'])) {
                ResponseService::json(false, null, 'Invalid credentials', [], 401);
                return;
            }

            $this->users->updateLastLogin((string) $user['id']);
            $access = $this->jwt->createAccessToken((string) $user['id']);
            $refresh = $this->jwt->createRefreshToken((string) $user['id']);
            setcookie('refresh_token', $refresh, ['expires' => time() + 604800, 'path' => '/', 'httponly' => true, 'samesite' => 'Lax']);
            ResponseService::json(true, ['token' => $access, 'refresh_token' => $refresh, 'user' => ['id' => $user['id'], 'name' => $user['name'], 'email' => $user['email']]], null);
        } catch (Throwable $e) {
            ResponseService::json(false, null, $e->getMessage(), [], 422);
        }
    }

    public function refresh(array $payload): void
    {
        try {
            $refresh = (string) ($payload['refresh_token'] ?? ($_COOKIE['refresh_token'] ?? ''));
            if ($refresh === '') {
                ResponseService::json(false, null, 'Missing refresh token', [], 401);
                return;
            }
            $decoded = $this->jwt->decode($refresh);
            if (($decoded['typ'] ?? '') !== 'refresh') {
                ResponseService::json(false, null, 'Invalid token type', [], 401);
                return;
            }
            $access = $this->jwt->createAccessToken((string) $decoded['sub']);
            ResponseService::json(true, ['token' => $access], null);
        } catch (Throwable) {
            ResponseService::json(false, null, 'Invalid refresh token', [], 401);
        }
    }

    public function me(string $userId, array $payload): void
    {
        $user = $this->users->findPublicById($userId);
        if ($user === null) {
            ResponseService::json(false, null, 'User not found', [], 404);

            return;
        }
        ResponseService::json(true, $user, null);
    }

    public function changePassword(string $userId, array $payload): void
    {
        try {
            $current = ValidationService::requiredString($payload, 'current_password', 8, 200);
            $newPlain = ValidationService::requiredString($payload, 'new_password', 8, 200);
            if ($current === $newPlain) {
                ResponseService::json(
                    false,
                    null,
                    "Le nouveau mot de passe doit être différent de l'actuel.",
                    [],
                    422
                );

                return;
            }

            $hash = $this->users->findPasswordHashById($userId);
            if ($hash === null || !password_verify($current, $hash)) {
                ResponseService::json(false, null, 'Mot de passe actuel incorrect.', [], 422);

                return;
            }

            $this->users->updatePasswordHash($userId, password_hash($newPlain, PASSWORD_ARGON2ID));
            ResponseService::json(true, ['updated' => true], null);
        } catch (Throwable $e) {
            ResponseService::json(false, null, $e->getMessage(), [], 422);
        }
    }
}
