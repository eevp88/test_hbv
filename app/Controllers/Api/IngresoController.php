<?php


namespace App\Controllers\Api;

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

use Core\Request;
use Core\Response;
use App\Services\IngresoEnfermeriaService;

class IngresoController
{
    private IngresoEnfermeriaService $service;

    public function __construct() {
         $this->service = new IngresoEnfermeriaService();
    }

    public function index()
    {
        return Response::json($this->service->listar());
    }

    public function store(): void
    {
        $data = Request::json();  
        $resultado = $this->service->registrarIngresoCompleto($data);

        header('Content-Type: application/json');
        echo json_encode($resultado);

        Response::json($resultado);
    }
}



/* namespace App\Controllers\Api;


use App\Services\IngresoService;

class IngresoController
{
    private IngresoService $service;

    public function __construct()
    {
        $this->service = new IngresoService();
    }

    public function index()
    {
        return Response::json($this->service->listar());
    }

    public function show($id)
    {
        return Response::json($this->service->obtener((int)$id));
    }

    public function store()
    {
        $id = $this->service->crear(Request::json());
        Response::json(['id' => $id], 201);
    }
}
 */