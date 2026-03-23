<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Config\Database;
use PDO;
use Ramsey\Uuid\Uuid;

final class UserRepository
{
    private PDO $pdo;
    public function __construct() { $this->pdo = Database::connection(); }

    public function findByEmail(string $email): ?array
    {
        $stmt = $this->pdo->prepare('SELECT * FROM users WHERE email = :email LIMIT 1');
        $stmt->execute(['email' => $email]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public function create(string $name, string $email, string $passwordHash): array
    {
        $id = Uuid::uuid4()->toString();
        $stmt = $this->pdo->prepare('INSERT INTO users (id, name, email, password_hash, created_at) VALUES (:id,:name,:email,:password_hash,NOW())');
        $stmt->execute(['id' => $id, 'name' => $name, 'email' => $email, 'password_hash' => $passwordHash]);
        return ['id' => $id, 'name' => $name, 'email' => $email];
    }

    public function updateLastLogin(string $id): void
    {
        $stmt = $this->pdo->prepare('UPDATE users SET last_login_at = NOW() WHERE id = :id');
        $stmt->execute(['id' => $id]);
    }

    /**
     * @return array{id: string, name: string, email: string, created_at: string, last_login_at: ?string}|null
     */
    public function findPasswordHashById(string $id): ?string
    {
        $stmt = $this->pdo->prepare('SELECT password_hash FROM users WHERE id = :id LIMIT 1');
        $stmt->execute(['id' => $id]);
        $v = $stmt->fetchColumn();

        return $v === false ? null : (string) $v;
    }

    public function updatePasswordHash(string $id, string $passwordHash): void
    {
        $stmt = $this->pdo->prepare('UPDATE users SET password_hash = :h WHERE id = :id');
        $stmt->execute(['h' => $passwordHash, 'id' => $id]);
    }

    public function findPublicById(string $id): ?array
    {
        $stmt = $this->pdo->prepare(
            'SELECT id, name, email, created_at, last_login_at FROM users WHERE id = :id LIMIT 1'
        );
        $stmt->execute(['id' => $id]);
        $row = $stmt->fetch();
        if ($row === false) {
            return null;
        }

        return [
            'id' => (string) $row['id'],
            'name' => (string) $row['name'],
            'email' => (string) $row['email'],
            'created_at' => (string) $row['created_at'],
            'last_login_at' => $row['last_login_at'] !== null ? (string) $row['last_login_at'] : null,
        ];
    }
}
