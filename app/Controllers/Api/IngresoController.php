<?php


namespace App\Controllers\Api;
/* 
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL); */

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
        Response::json($resultado);
    }
}
