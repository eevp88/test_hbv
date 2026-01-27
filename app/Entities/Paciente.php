<?php

namespace App\Entities;



/* ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL); */

use InvalidArgumentException;

/* 
    TODO
    validaciones  
    id_paciente INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(255) NOT NULL,
    fecha_nacimiento DATE,
    RUN VARCHAR(50) UNIQUE,
    edad INT,
    genero VARCHAR(50),
    direccion VARCHAR(255),
    telefono VARCHAR(50),
    email VARCHAR(100),
    ficha_clinica int UNIQUE,  */

class Paciente
{
    public ?int $id_paciente = null;
    public ?string $run = null;
    public ?string $nombre = null;
    public ?string $fecha_nacimiento = null;
    public ?int $edad = null;
    public ?string $genero = null;
    public ?string $direccion = null;
    public ?string $telefono = null;
    public ?string $email = null;
    public ?string $ficha_clinica = null;

    public function __construct(array $data = [])
    {
        if (!isset($data['run']) || !is_string($data['run']) || $data['run'] === '') {
            throw new InvalidArgumentException('RUN inválido o ausente');
        }

        $this->run = $data['run'];

        $this->nombre = $data['nombre'] ?? null;
        $this->fecha_nacimiento = $data['fecha_nacimiento'] ?? null;
        $this->edad = isset($data['edad']) ? (int)$data['edad'] : null;
        $this->genero = $data['genero'] ?? null;
        $this->direccion = $data['direccion'] ?? null;
        $this->telefono = $data['telefono'] ?? null;
        $this->email = $data['email'] ?? null;
        $this->ficha_clinica = $data['ficha_clinica'] ?? null;
    }
}