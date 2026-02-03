<?php

/* ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
 */
/** @var \Core\Router $router */

use App\Controllers\Web\HomeController;
use App\Controllers\Api\IngresoController;
//web
$router->route('GET', '/', [HomeController::class, 'index']);

//api
$router->route('GET', '/ingresos',        [IngresoController::class, 'index']);
$router->route('POST','/ingresos',       [IngresoController::class, 'store']);
$router->route('GET', '/ingresos/{id}',   [IngresoController::class, 'show']);
$router->route('PUT' ,'/ingresos/{id}',   [IngresoController::class, 'update']);
$router->route('DELETE','/ingresos/{id}',[IngresoController::class, 'delete']);
