<?php

use App\Controllers\Api\IngresoController;

/** @var \Core\Router $router */

$router->get('/ingresos',        [IngresoController::class, 'index']);
$router->post('/ingresos',       [IngresoController::class, 'store']);
$router->get('/ingresos/{id}',   [IngresoController::class, 'show']);
$router->put('/ingresos/{id}',   [IngresoController::class, 'update']);
$router->delete('/ingresos/{id}',[IngresoController::class, 'delete']);

