<?php

declare(strict_types=1);

$router = require dirname(__DIR__) . '/app/Bootstrap/app.php';
//$router = require BASE_PATH . '/Bootstrap/app.php';
$method = $_SERVER['REQUEST_METHOD'] ?? null;
$uri    = $_SERVER['REQUEST_URI'] ?? null;

$uri = parse_url($uri, PHP_URL_PATH);


if ($method === null || $uri === null) {
    http_response_code(500);
    echo 'This application must be executed via HTTP';
    exit;
}

$router->dispatch($method, $uri);

