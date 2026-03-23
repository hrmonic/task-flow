<?php

declare(strict_types=1);

namespace App\Config;

use App\Services\ResponseService;

final class Router
{
    private array $routes = [];

    public function get(string $pattern, callable $handler): void { $this->add('GET', $pattern, $handler); }
    public function post(string $pattern, callable $handler): void { $this->add('POST', $pattern, $handler); }
    public function patch(string $pattern, callable $handler): void { $this->add('PATCH', $pattern, $handler); }
    public function delete(string $pattern, callable $handler): void { $this->add('DELETE', $pattern, $handler); }

    private function add(string $method, string $pattern, callable $handler): void
    {
        $this->routes[$method][] = ['pattern' => $pattern, 'handler' => $handler];
    }

    public function dispatch(string $method, string $path): void
    {
        $list = $this->routes[$method] ?? [];

        foreach ($list as $route) {
            $regex = '#^' . preg_replace('/\{([a-zA-Z_][a-zA-Z0-9_]*)\}/', '(?P<$1>[^/]+)', $route['pattern']) . '$#';
            if (preg_match($regex, $path, $matches) !== 1) {
                continue;
            }

            $params = array_filter($matches, static fn($k) => !is_int($k), ARRAY_FILTER_USE_KEY);
            $body = json_decode((string) file_get_contents('php://input'), true) ?? [];
            $query = $_GET ?? [];
            $payload = array_merge($params, $query, is_array($body) ? $body : []);

            ($route['handler'])($payload);
            return;
        }

        ResponseService::json(false, null, 'Route not found', ['method' => $method, 'path' => $path], 404);
    }
}
