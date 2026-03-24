<?php

declare(strict_types=1);

require_once __DIR__ . '/../vendor/autoload.php';

use App\Config\Database;
use Dotenv\Dotenv;

if (file_exists(__DIR__ . '/../.env')) {
    Dotenv::createImmutable(__DIR__ . '/..')->load();
}

$pdo = Database::connection();
$pdo->exec(
    'CREATE TABLE IF NOT EXISTS schema_migrations (
        filename VARCHAR(255) PRIMARY KEY,
        applied_at DATETIME NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4'
);
$files = glob(__DIR__ . '/migrations/*.sql') ?: [];
sort($files);

/**
 * Détection minimale pour baseliner une base déjà existante sans rejouer les anciennes migrations.
 */
function migrationLooksApplied(PDO $pdo, string $filename): bool
{
    $tableByMigration = [
        '001_create_users.sql' => 'users',
        '002_create_boards.sql' => 'boards',
        '003_create_columns.sql' => 'columns',
        '004_create_tasks.sql' => 'tasks',
        '005_create_board_contributors_and_invitations.sql' => 'board_contributors',
        '006_create_task_activity_logs.sql' => 'task_activity_logs',
        '007_add_board_icon_fields.sql' => 'boards',
    ];
    $table = $tableByMigration[$filename] ?? null;
    if ($table === null) {
        return false;
    }
    if ($filename === '007_add_board_icon_fields.sql') {
        $stmt = $pdo->prepare(
            'SELECT COUNT(*)
             FROM information_schema.columns
             WHERE table_schema = DATABASE()
               AND table_name = :table_name
               AND column_name IN (\'job_key\', \'rubric_key\', \'icon_key\')'
        );
        $stmt->execute(['table_name' => 'boards']);
        return (int) $stmt->fetchColumn() === 3;
    }
    $stmt = $pdo->prepare(
        'SELECT COUNT(*)
         FROM information_schema.tables
         WHERE table_schema = DATABASE() AND table_name = :table_name'
    );
    $stmt->execute(['table_name' => $table]);
    return (int) $stmt->fetchColumn() > 0;
}

foreach ($files as $file) {
    $filename = basename($file);
    $exists = $pdo->prepare('SELECT 1 FROM schema_migrations WHERE filename = :filename LIMIT 1');
    $exists->execute(['filename' => $filename]);
    if ((bool) $exists->fetchColumn()) {
        echo "Skipping migration (already applied): " . $filename . PHP_EOL;
        continue;
    }

    if (migrationLooksApplied($pdo, $filename)) {
        $markExisting = $pdo->prepare('INSERT INTO schema_migrations (filename, applied_at) VALUES (:filename, NOW())');
        $markExisting->execute(['filename' => $filename]);
        echo "Baselined existing migration: " . $filename . PHP_EOL;
        continue;
    }

    echo "Running migration: " . $filename . PHP_EOL;
    $sql = file_get_contents($file);
    if ($sql === false) {
        throw new RuntimeException('Cannot read migration file: ' . $file);
    }
    $pdo->exec($sql);
    $mark = $pdo->prepare('INSERT INTO schema_migrations (filename, applied_at) VALUES (:filename, NOW())');
    $mark->execute(['filename' => $filename]);
}

echo "Migrations completed." . PHP_EOL;
