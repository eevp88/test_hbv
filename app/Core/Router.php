<?php

namespace Core;

class Router
{
    private array $routes = [];

    public function route(string|array $method, ?string $uri = null, ?array $handler = null): void
    {
        // Forma declarativa
        if (is_array($method)) {
            $method  = strtoupper($method['method']);
            $uri     = $method['uri'] ?? null;
            $handler = $method['handler'] ?? null;
        }

        if (!$method || !$uri || !$handler) {
            throw new \InvalidArgumentException('Ruta mal definida');
        }

        $this->routes[$method][$uri] = $handler;
    }

 public function dispatch(): void
    {
        $method = Request::method();
        $uri    = Request::uri();

        foreach ($this->routes[$method] ?? [] as $route => $handler) {
            $pattern = '#^' . preg_replace('#\{[\w]+\}#', '([\w-]+)', $route) . '$#';

            if (preg_match($pattern, $uri, $matches)) {
                array_shift($matches);

                [$controller, $action] = $handler;
                $result = (new $controller())->$action(...$matches);

                if ($result === null) {
                    return;
                }

                if (is_string($result)) {
                    echo $result;
                    return;
                }

                if (is_array($result)) {
                    Response::json($result);
                    return;
                }

                throw new \RuntimeException('Tipo de respuesta no soportado');
            }
        }

        $this->notFound();
    }


/* 
    public function dispatch(string $method, string $uri): void
    {
        $uri = parse_url($uri, PHP_URL_PATH);

        if (!isset($this->routes[$method])) {
            $this->notFound();
            return;
        }

        foreach ($this->routes[$method] as $route => $handler) {
            $pattern = '#^' . preg_replace('#\{[\w]+\}#', '([\w-]+)', $route) . '$#';

            if (preg_match($pattern, $uri, $matches)) {
                array_shift($matches);

                [$controller, $action] = $handler;

                if (!class_exists($controller)) {
                    throw new \RuntimeException("Controller {$controller} no existe");
                }

                $instance = new $controller();

                if (!method_exists($instance, $action)) {
                    throw new \RuntimeException("Método {$action} no existe en {$controller}");
                }

                $response = $instance->$action(...$matches);

                if (!is_string($response)) {
                    throw new \RuntimeException(
                        "{$controller}::{$action} debe retornar string"
                    );
                }

                echo $response;
                return;
            }
        }

        $this->notFound();
    } */

   
    private function notFound(): void
    {
        http_response_code(404);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['error' => 'Route not found']);
    }
}