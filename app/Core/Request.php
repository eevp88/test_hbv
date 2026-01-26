<?php

namespace Core;

class Request
{
    public static function json(): array
    {
        $raw = file_get_contents('php://input');

        if ($raw === '' || $raw === false) {
            return [];
        }

        $data = json_decode($raw, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new \RuntimeException(
                'JSON inválido: ' . json_last_error_msg()
            );
        }

        if (!is_array($data)) {
            return [];
        }

        return $data;
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
