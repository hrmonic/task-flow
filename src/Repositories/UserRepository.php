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
}
