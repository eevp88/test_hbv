<?php

declare(strict_types=1);

error_reporting(E_ALL);
ini_set('display_errors', '1');

define('BASE_PATH', dirname(__DIR__));

/*
|--------------------------------------------------------------------------
| Autoload PSR-4 simple
|--------------------------------------------------------------------------
*/
spl_autoload_register(function (string $class): void {
    $prefixes = [
        'Core\\' => BASE_PATH . '/Core/',
        'App\\'  => BASE_PATH . '/',
    ];

    foreach ($prefixes as $prefix => $baseDir) {
        if (str_starts_with($class, $prefix)) {
            $relative = str_replace('\\', '/', substr($class, strlen($prefix)));
            $file = $baseDir . $relative . '.php';

            if (file_exists($file)) {
                require_once $file;
            }
            return;
        }
    }
});

/*
|--------------------------------------------------------------------------
| Helper de vistas
|--------------------------------------------------------------------------
*/
function view(string $view, array $data = []): string
{
    $viewsPath = BASE_PATH . '/Views/';
    $viewFile  = $viewsPath . $view . '.php';

    if (!file_exists($viewFile)) {
        throw new RuntimeException("La vista no existe: {$view}");
    }

    extract($data, EXTR_SKIP);

    ob_start();
    require $viewFile;
    return ob_get_clean();
}

/*
|--------------------------------------------------------------------------
| Router
|--------------------------------------------------------------------------
*/

use Core\Router;

$router = new Router();

/*
|--------------------------------------------------------------------------
| Cargar rutas
|--------------------------------------------------------------------------
*/
require BASE_PATH . '/routes/routes.php';

return $router;