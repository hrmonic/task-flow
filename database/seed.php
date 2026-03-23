<?php

declare(strict_types=1);

require_once __DIR__ . '/../vendor/autoload.php';

use App\Config\Database;
use Dotenv\Dotenv;

if (file_exists(__DIR__ . '/../.env')) {
    Dotenv::createImmutable(__DIR__ . '/..')->load();
}

$pdo = Database::connection();
$sql = file_get_contents(__DIR__ . '/seeds/demo_data.sql');
if ($sql === false) {
    throw new RuntimeException('Cannot read seed file');
}
$pdo->exec($sql);
echo "Seed completed." . PHP_EOL;
