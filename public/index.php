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

$cors = new CorsMiddleware();
$cors->handle();
(new SecurityHeadersMiddleware())->handle();

$rateLimit = new RateLimitMiddleware((int) ($_ENV['RATE_LIMIT_PER_MINUTE'] ?? 60));
if (!$rateLimit->handle()) {
    ResponseService::json(false, null, 'Too many requests', ['code' => 429], 429);
    exit;
}

$path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($path === '/' || $path === '/index.html') {
    require __DIR__ . '/views/app.php';
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
    ResponseService::json(false, null, $e->getMessage(), ['type' => get_class($e)], 500);
}
