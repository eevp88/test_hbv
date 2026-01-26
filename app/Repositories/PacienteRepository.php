<?php

namespace App\Repositories;


ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

use App\Entities\Paciente;
use Core\Database;
use PDO;

class PacienteRepository
{
    private PDO $db;
    public function __construct() {
        $this->db = Database::connection();
    }

    public function findByRun(string $run): ?Paciente
    {
        $stmt = $this->db->prepare(
            "SELECT * FROM pacientes WHERE RUN = :run"
        );
        $stmt->execute(['run' => $run]);

        $data = $stmt->fetch();
        return $data ? new Paciente($data) : null;
    }

    public function findById(int $id): ?Paciente
    {
        $stmt = $this->db->prepare(
            "SELECT * FROM pacientes WHERE id_paciente = :id"
        );
        $stmt->execute(['id' => $id]);

        $data = $stmt->fetch();
        return $data ? new Paciente($data) : null;
    }

    public function create(Paciente $paciente): int
    {
        $stmt = $this->db->prepare(
            "INSERT INTO pacientes
             (nombre, run, edad, genero, telefono, email, ficha_clinica)
             VALUES (:nombre, :run, :edad, :genero, :telefono, :email, :ficha)"
        );

        $stmt->execute([
            'nombre' => $paciente->nombre,
            'run' => $paciente->run,
            'edad' => $paciente->edad,
            'genero' => $paciente->genero,
            'telefono' => $paciente->telefono,
            'email' => $paciente->email,
            'ficha' => $paciente->ficha_clinica
        ]);

        return (int) $this->db->lastInsertId();
    }

    public function update(Paciente $paciente): bool
    {
        $stmt = $this->db->prepare(
            "UPDATE pacientes SET
             nombre = :nombre,
             edad = :edad,
             genero = :genero,
             telefono = :telefono,
             email = :email
             WHERE id_paciente = :id"
        );

        return $stmt->execute([
            'id' => $paciente->id_paciente,
            'nombre' => $paciente->nombre,
            'edad' => $paciente->edad,
            'genero' => $paciente->genero,
            'telefono' => $paciente->telefono,
            'email' => $paciente->email
        ]);
    }
}
