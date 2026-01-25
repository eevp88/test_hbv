<?php

namespace Core;

class Router
{
    private array $routes = [];

    public function get(string $path, array $handler): void
    {
        $this->add('GET', $path, $handler);
    }

    public function post(string $path, array $handler): void
    {
        $this->add('POST', $path, $handler);
    }

    public function put(string $path, array $handler): void
    {
        $this->add('PUT', $path, $handler);
    }

    public function delete(string $path, array $handler): void
    {
        $this->add('DELETE', $path, $handler);
    }

    private function add(string $method, string $path, array $handler): void
    {
        $this->routes[$method][$path] = $handler;
    }


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
}

    /* public function dispatch(string $method, string $uri): void
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

                // HTML
                if (is_string($response)) {
                    echo $response;
                    return;
                }

                // API JSON
                if (is_array($response) || is_object($response)) {
                    header('Content-Type: application/json');
                    echo json_encode($response);
                    return;
                }

                return;
            }
        }

            $this->notFound();
    }
 */
   /*  public function dispatch(string $method, string $uri): void
    {
        $path = parse_url($uri, PHP_URL_PATH);

        if (!isset($this->routes[$method])) {
            $this->notFound();
            return;
        }

        foreach ($this->routes[$method] as $route => $handler) {

            $pattern = preg_replace('#\{[\w]+\}#', '([\w-]+)', $route);
            $pattern = "#^{$pattern}$#";

            if (!preg_match($pattern, $path, $matches)) {
                continue;
            }

            array_shift($matches);

            [$controller, $action] = $handler;

            $class = 'App\\Controllers\\' . $controller;

            if (!class_exists($class)) {
                throw new \RuntimeException("Controller {$class} no existe");
            }

            $instance = new $class();

            if (!method_exists($instance, $action)) {
                throw new \RuntimeException("Método {$action} no existe en {$class}");
            }

            $response = $instance->$action(...$matches);

            if (is_string($response)) {
                echo $response;
            }

            return;
        }

        $this->notFound();
    }
 */
    private function notFound(): void
    {
        http_response_code(404);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['error' => 'Route not found']);
    }
}