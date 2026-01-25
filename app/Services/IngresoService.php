<?php

namespace App\Services;

use App\Repositories\IngresoRepository;

class IngresoService
{
    private IngresoRepository $repository;

    public function __construct()
    {
        $this->repository = new IngresoRepository();
    }

    public function listar(): array
    {
        return $this->repository->findAll();
    }

    public function obtener(int $id): array
    {
        $ingreso = $this->repository->findById($id);

        if (!$ingreso) {
            throw new \DomainException('Ingreso no encontrado');
        }

        return $ingreso;
    }

    public function crear(array $data): int
    {
        // aquí van reglas de negocio
        if (empty($data['paciente_id'])) {
            throw new \InvalidArgumentException('Paciente requerido');
        }

        return $this->repository->create($data);
    }

    public function actualizar(int $id, array $data): void
    {
        if (!$this->repository->exists($id)) {
            throw new \DomainException('Ingreso no existe');
        }

        $this->repository->update($id, $data);
    }

    public function eliminar(int $id): void
    {
        $this->repository->delete($id);
    }
}
