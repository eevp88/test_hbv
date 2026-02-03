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

    public function show(int $id)
    {
        $ingreso = $this->service->obtener($id);
        if ($ingreso) {
            return Response::json($ingreso);
        } else {
            Response::json(['message' => 'Ingreso no encontrado'], 404);
        }
    }

    public function update(int $id): void
    {
        $data = Request::json();
        $resultado = $this->service->actualizarIngreso($id, $data);
        Response::json($resultado);
    }

    public function delete(int $id): void
    {
        $exito = $this->service->eliminar($id);
        if ($exito) {
            Response::json(['message' => 'Ingreso eliminado exitosamente']);
        } else {
            Response::json(['message' => 'Ingreso no encontrado'], 404);
        }
    }
}
