<?php

namespace Core;

class Request
{

    public static function json(): array
    {
        // Intentamos leer JSON primero
        $raw = file_get_contents('php://input');
        $raw = trim($raw, "\xEF\xBB\xBF"); // eliminar BOM UTF-8
        $raw = trim($raw);                 // eliminar espacios extra

        // Quitar comillas externas si existen
        if (substr($raw, 0, 1) === '"' && substr($raw, -1) === '"') {
            $raw = substr($raw, 1, -1);          // quitar comillas externas
            $raw = str_replace('\"', '"', $raw); // deshacer escapes
        }
        if ($raw) {
            $json = json_decode($raw, true);
            if (json_last_error() === JSON_ERROR_NONE && is_array($json)) {
                return $json; // JSON tiene prioridad absoluta
            }
        }

        // Si no hay JSON válido, usamos POST tradicional
        if (!empty($_POST)) {
            return $_POST;
        }

        // Si no hay POST, usamos GET
        if (!empty($_GET)) {
            return $_GET;
        }

        return [];
    }

    public static function input(string $key, mixed $default = null): mixed
    {
        $data = self::json();
        return $data[$key] ?? $default;
    }

    public static function method(): string
    {
        return $_SERVER['REQUEST_METHOD'];
    }

    public static function uri(): string
    {
        return parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    }
}
