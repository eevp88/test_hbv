<?php


namespace App\Repositories;

/* ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
 */
use App\Entities\IngresoEnfermeria;
use Core\Database;
use PDO;

class IngresoEnfermeriaRepository
{

    private PDO $db;
    private string $logFile;
    private bool $loggingEnabled = false;


    public function __construct()
    {
        $this->db = Database::connection();

        // Crear carpeta logs si no existe
        $this->setupLogging();
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

        $sql =  "INSERT INTO ingreso_enfermeria ($cols) VALUES ($vals)";


        // 📝 LOGGING (solo si está habilitado)
        $this->writeLog("=== INICIO DEBUG ===");
        $this->writeLog("SQL: " . $sql);
        $this->writeLog("Total campos: " . count($data));


        // Log solo las primeras 10 keys para no saturar
        $keysPreview = array_keys($data);
        $this->writeLog("Primeros campos: " . implode(', ', $keysPreview) . "...");

        $this->debugSQLParameters($sql, $data);
        $this->writeLog("=== FIN DEBUG ===\n");


        $stmt = $this->db->prepare($sql);
        $stmt->execute($data);
        $lastId = (int) $this->db->lastInsertId();
        $this->writeLog("✅ Insert exitoso. ID: $lastId\n");
        return $lastId;
    }


    private function debugSQLParameters(string $sql, array $params): void
    {
        preg_match_all('/:(\w+)/', $sql, $matches);
        $sqlParams = array_unique($matches[0]);
        $passedParams = array_map(fn($key) => ":$key", array_keys($params));

        $this->writeLog("🔍 DEBUG PARÁMETROS:");
        $this->writeLog("  Placeholders en SQL: " . count($sqlParams));
        $this->writeLog("  Parámetros pasados: " . count($passedParams));

        $missing = array_diff($sqlParams, $passedParams);
        $extra = array_diff($passedParams, $sqlParams);

        if (!empty($missing)) {
            $this->writeLog("  ❌ FALTANTES: " . implode(', ', $missing));
        }

        if (!empty($extra)) {
            $this->writeLog("  ⚠️  EXTRAS: " . implode(', ', $extra));
        }

        if (empty($missing) && empty($extra)) {
            $this->writeLog("  ✅ Todos los parámetros coinciden");
        }
    }


    private function writeLog(string $message): void
    {
        $timestamp = date('Y-m-d H:i:s');
        file_put_contents(
            $this->logFile,
            "[$timestamp] $message\n",
            FILE_APPEND
        );
    }

    private function setupLogging(): void
    {
        $possiblePaths = [
            __DIR__ . '/../../logs/debug.log',           // Carpeta logs del proyecto
            '/tmp/hospital_debug.log',                   // Temporal del sistema
            sys_get_temp_dir() . '/hospital_debug.log'   // Temporal multiplataforma
        ];

        foreach ($possiblePaths as $path) {
            $dir = dirname($path);

            // Intentar crear el directorio si no existe
            if (!is_dir($dir)) {
                @mkdir($dir, 0777, true);
            }

            // Verificar si podemos escribir
            if (is_dir($dir) && is_writable($dir)) {
                $this->logFile = $path;
                $this->loggingEnabled = true;

                // Crear el archivo si no existe
                if (!file_exists($path)) {
                    @file_put_contents($path, "=== Log iniciado ===\n");
                }

                $this->writeLog("✅ Logging habilitado en: " . $path);
                break;
            }
        }

        if (!$this->loggingEnabled) {
            // Si no se puede escribir logs, continuar sin logging
            error_log("WARNING: No se pudo habilitar logging para IngresoEnfermeriaRepository");
        }
    }
}
