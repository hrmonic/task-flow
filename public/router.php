<?php

declare(strict_types=1);

$uri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
$uri = rawurldecode($uri);

if (str_starts_with($uri, '/assets/')) {
    $relative = ltrim($uri, '/');
    $file = __DIR__ . DIRECTORY_SEPARATOR . str_replace('/', DIRECTORY_SEPARATOR, $relative);
    if (is_file($file)) {
        return false;
    }
}

require __DIR__ . '/index.php';
