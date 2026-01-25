<?php

namespace Core;

use PDO;

class Database
{
    private static ?PDO $connection = null;

    public static function connection(): PDO
    {
        if (!self::$connection) {
            self::$connection = new PDO(
                'mysql:host=127.0.0.1;port=3306;dbname=ingreso_pacientes_db;charset=utf8mb4',
                'ingreso_user',
                'ingreso_pass',
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
                ]
            );
        }

        return self::$connection;
    }
}