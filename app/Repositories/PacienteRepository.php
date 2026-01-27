<?php

namespace App\Repositories;


/* ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL); */

use App\Entities\Paciente;
use Core\Database;
use PDO;

class PacienteRepository
{
    private PDO $db;
    public function __construct()
    {
        $this->db = Database::connection();
    }

    public function findByRun(string $run): ?Paciente
    {
        $stmt = $this->db->prepare(
            "SELECT * FROM pacientes WHERE run = :run"
        );
       
        $bind = array(
            'run' => $run
        );
        $stmt->execute($bind);
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
             (nombre, run, edad, fecha_nacimiento, genero, direccion, telefono, email, ficha_clinica)
             VALUES (:nombre, :run, :edad, :fecha_nacimiento, :genero, :direccion, :telefono, :email, :ficha_clinica)"
        );

        $bindVal = array(
            'nombre' => $paciente->nombre,
            'run' => $paciente->run,
            'edad' => $paciente->edad,
            'fecha_nacimiento' => $paciente->fecha_nacimiento ,
            'genero' => $paciente->genero,
            'direccion' => $paciente->direccion,
            'telefono' => $paciente->telefono,
            'email' => $paciente->email,
            'ficha_clinica' => $paciente->ficha_clinica
            );

        $stmt->execute($bindVal);

        $idPaciente = (int) $this->db->lastInsertId();
        return $idPaciente;
    }

    public function update(Paciente $paciente): bool
    {
        $stmt = $this->db->prepare(
            "UPDATE pacientes SET
             nombre = :nombre,
             edad = :edad,
             fecha_nacimiento = :fecha_nacimiento,
             genero = :genero,
             direccion = :direccion,
             telefono = :telefono,
             email = :email,
             ficha_clinica = :ficha_clinica
             WHERE id_paciente = :id"
        );

          $bindVal = [
            'id' => $paciente->id_paciente,
            'nombre' => $paciente->nombre,
            'edad' => $paciente->edad,
            'fecha_nacimiento' => $paciente->fecha_nacimiento ,
            'genero' => $paciente->genero,
            'direccion' => $paciente->direccion,
            'telefono' => $paciente->telefono,
            'email' => $paciente->email,
            'ficha_clinica' => $paciente->ficha_clinica
        ];

        return $stmt->execute($bindVal);
    }
}
