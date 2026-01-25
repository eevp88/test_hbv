<?php

namespace App\Controllers\Api;

use Core\Request;
use Core\Response;
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
