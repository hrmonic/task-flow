<?php

declare(strict_types=1);

require_once __DIR__ . '/../vendor/autoload.php';

use App\Config\Database;
use Dotenv\Dotenv;

if (file_exists(__DIR__ . '/../.env')) {
    Dotenv::createImmutable(__DIR__ . '/..')->load();
}

$pdo = Database::connection();
$files = glob(__DIR__ . '/migrations/*.sql') ?: [];
sort($files);

foreach ($files as $file) {
    echo "Running migration: " . basename($file) . PHP_EOL;
    $sql = file_get_contents($file);
    if ($sql === false) {
        throw new RuntimeException('Cannot read migration file: ' . $file);
    }
    $pdo->exec($sql);
}

echo "Migrations completed." . PHP_EOL;
