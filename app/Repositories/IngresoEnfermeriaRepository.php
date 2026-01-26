<?php


namespace App\Repositories;

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

use App\Entities\IngresoEnfermeria;
use Core\Database;
use PDO;

class IngresoEnfermeriaRepository
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
        //todo respuesta en array de IngresosEnfermeria 
    }

    public function findById(int $id): ?IngresoEnfermeria
    {
        $stmt = $this->db->prepare(
            "SELECT * FROM ingreso_enfermeria WHERE id_ingreso = :id"
        );
        $stmt->execute(['id' => $id]);

        $data = $stmt->fetch();
        return $data ? new IngresoEnfermeria($data) : null;
    }

    public function create(IngresoEnfermeria $ingreso): int
    {
        $data = $ingreso->toArray();
        unset($data['id_ingreso']);

        
        $cols = implode(',', array_keys($data));
        $vals = ':' . implode(',:', array_keys($data));

        $stmt = $this->db->prepare(
            "INSERT INTO ingreso_enfermeria ($cols) VALUES ($vals)"
        );

        $stmt->execute($data);
        return (int) $this->db->lastInsertId();
    }
}


/* 

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
} */