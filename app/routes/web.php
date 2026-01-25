<?php

use App\Controllers\Web\HomeController;

/** @var \Core\Router $router */

$router->get('/', [HomeController::class, 'index']);

