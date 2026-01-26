<?php

namespace App\Entities;

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

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
    public $id_paciente;
    public $nombre;
    public $fecha_nacimiento;
    public $run;
    public $edad;
    public $genero;
    public $direccion;
    public $telefono;
    public $email;
    public $ficha_clinica;

    public function __construct(array $data = [])
    {
        foreach ($data as $key => $value) {
            if (property_exists($this, $key)) {
                $this->$key = $value;
            }
        }
    }

    public function toArray(): array
    {
        return get_object_vars($this);
    }
}
