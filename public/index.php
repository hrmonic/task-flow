<?php

declare(strict_types=1);

use App\Config\Router;
use App\Controllers\AuthController;
use App\Controllers\BoardController;
use App\Controllers\ColumnController;
use App\Controllers\TaskController;
use App\Middleware\AuthMiddleware;
use App\Middleware\CorsMiddleware;
use App\Middleware\RateLimitMiddleware;
use App\Middleware\SecurityHeadersMiddleware;
use App\Services\ResponseService;
use Dotenv\Dotenv;

require_once __DIR__ . '/../vendor/autoload.php';

if (file_exists(__DIR__ . '/../.env')) {
    Dotenv::createImmutable(__DIR__ . '/..')->load();
}

require_once __DIR__ . '/includes/base_path.php';
$tfBase = taskflow_public_base_path();

$rawPath = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';

$path = $rawPath;
if ($tfBase !== '') {
    if (str_starts_with($path, $tfBase . '/')) {
        $path = substr($path, strlen($tfBase)) ?: '/';
    } elseif ($path === $tfBase) {
        $path = '/';
    }
}
if ($path === '' || $path === false) {
    $path = '/';
}
if (!str_starts_with($path, '/')) {
    $path = '/' . $path;
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if (str_starts_with($path, '/assets/')) {
    $localPath = str_replace('/', DIRECTORY_SEPARATOR, $path);
    $fullPath = realpath(__DIR__ . $localPath);
    $publicRoot = realpath(__DIR__);
    $insidePublic = false;
    if ($fullPath !== false && $publicRoot !== false) {
        $fp = strtolower(str_replace('\\', '/', $fullPath));
        $pr = strtolower(rtrim(str_replace('\\', '/', $publicRoot), '/'));
        $insidePublic = str_starts_with($fp, $pr . '/');
    }
    if ($fullPath !== false && $publicRoot !== false && $insidePublic && is_file($fullPath)) {
        $ext = strtolower(pathinfo($fullPath, PATHINFO_EXTENSION));
        $mime = match ($ext) {
            'css' => 'text/css; charset=utf-8',
            'js' => 'text/javascript; charset=utf-8',
            'json' => 'application/json; charset=utf-8',
            'png' => 'image/png',
            'jpg', 'jpeg' => 'image/jpeg',
            'gif' => 'image/gif',
            'svg' => 'image/svg+xml',
            'ico' => 'image/x-icon',
            'woff2' => 'font/woff2',
            default => 'application/octet-stream',
        };
        header('Content-Type: ' . $mime);
        header('X-Content-Type-Options: nosniff');
        header('Cache-Control: public, max-age=3600');
        readfile($fullPath);
        exit;
    }

    http_response_code(404);
    exit;
}

$cors = new CorsMiddleware();
$cors->handle();
(new SecurityHeadersMiddleware())->handle();

$rateLimit = new RateLimitMiddleware((int) ($_ENV['RATE_LIMIT_PER_MINUTE'] ?? 60));
if (!$rateLimit->handle()) {
    ResponseService::json(false, null, 'Too many requests', ['code' => 429], 429);
    exit;
}

if ($path === '/' || $path === '/index.html') {
    require __DIR__ . '/views/app.php';
    exit;
}

if ($path === '/favicon.ico') {
    http_response_code(204);
    exit;
}

$router = new Router();
$auth = new AuthMiddleware();

$authController = new AuthController();
$boardController = new BoardController();
$columnController = new ColumnController();
$taskController = new TaskController();

$router->post('/api/auth/register', fn(array $params) => $authController->register($params));
$router->post('/api/auth/login', fn(array $params) => $authController->login($params));
$router->post('/api/auth/refresh', fn(array $params) => $authController->refresh($params));

$router->get('/api/boards', fn(array $params) => $auth->run(fn(string $userId) => $boardController->index($userId, $params)));
$router->post('/api/boards', fn(array $params) => $auth->run(fn(string $userId) => $boardController->create($userId, $params)));
$router->patch('/api/boards/{id}', fn(array $params) => $auth->run(fn(string $userId) => $boardController->update($userId, $params)));
$router->delete('/api/boards/{id}', fn(array $params) => $auth->run(fn(string $userId) => $boardController->delete($userId, $params)));

$router->get('/api/boards/{id}/columns', fn(array $params) => $auth->run(fn(string $userId) => $columnController->index($userId, $params)));
$router->post('/api/boards/{id}/columns', fn(array $params) => $auth->run(fn(string $userId) => $columnController->create($userId, $params)));
$router->patch('/api/columns/{id}', fn(array $params) => $auth->run(fn(string $userId) => $columnController->update($userId, $params)));
$router->delete('/api/columns/{id}', fn(array $params) => $auth->run(fn(string $userId) => $columnController->delete($userId, $params)));

$router->get('/api/columns/{id}/tasks', fn(array $params) => $auth->run(fn(string $userId) => $taskController->index($userId, $params)));
$router->post('/api/columns/{id}/tasks', fn(array $params) => $auth->run(fn(string $userId) => $taskController->create($userId, $params)));
$router->patch('/api/tasks/{id}', fn(array $params) => $auth->run(fn(string $userId) => $taskController->update($userId, $params)));
$router->patch('/api/tasks/{id}/move', fn(array $params) => $auth->run(fn(string $userId) => $taskController->move($userId, $params)));
$router->delete('/api/tasks/{id}', fn(array $params) => $auth->run(fn(string $userId) => $taskController->delete($userId, $params)));

try {
    $router->dispatch($method, $path);
} catch (Throwable $e) {
    $env = $_ENV['APP_ENV'] ?? 'dev';
    $expose = $env !== 'prod';
    ResponseService::json(
        false,
        null,
        $expose ? $e->getMessage() : 'Internal server error',
        $expose ? ['type' => get_class($e)] : [],
        500
    );
}
