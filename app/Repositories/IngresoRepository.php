<?php

namespace App\Repositories;

use Core\Database;
use PDO;

class IngresoRepository
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::connection();
    }

    public function findAll(): array
    {
        $stmt = $this->db->query(
            "SELECT
                i.*,
                p.*
            FROM
                ingreso_enfermeria i,
                pacientes p
            WHERE
            i.id_paciente = p.id_paciente ORDER BY fecha_ingreso DESC"
        );

        return $stmt->fetchAll();
    }

    public function findById(int $id): ?array
    {
        $stmt = $this->db->prepare(
            "SELECT * FROM ingreso_enfermeria WHERE id_ingreso = :id"
        );
        $stmt->execute(['id' => $id]);

        $result = $stmt->fetch();

        return $result ?: null;
    }

    public function create(array $data): int
    {
        $stmt = $this->db->prepare(
            "INSERT INTO ingreso_enfermeria (id_paciente, fecha_ingreso, diagnostico)
             VALUES (:id_paciente, :fecha, :diagnostico)"
        );

        $stmt->execute([
            'id_paciente' => $data['id_paciente'],
            'fecha'       => $data['fecha'],
            'diagnostico' => $data['diagnostico']
        ]);

        return (int) $this->db->lastInsertId();
    }

    public function update(int $id, array $data): bool
    {
        $stmt = $this->db->prepare(
            "UPDATE ingreso_enfermeria
             SET fecha_ingreso = :fecha, diagnostico = :diagnostico
             WHERE id_ingreso = :id"
        );

        return $stmt->execute([
            'id'     => $id,
            'fecha'  => $data['fecha'],
            'diagnostico' => $data['diagnostico']
        ]);
    }

    public function delete(int $id): bool
    {
        $stmt = $this->db->prepare(
            "DELETE FROM ingreso_enfermeria WHERE id_ingreso = :id"
        );

        return $stmt->execute(['id' => $id]);
    }

    public function exists(int $id): bool
    {
        $stmt = $this->db->prepare(
            "SELECT COUNT(1) FROM ingreso_enfermeria WHERE id_ingreso = :id"
        );
        $stmt->execute(['id' => $id]);

        return $stmt->fetchColumn() > 0;
    }
}