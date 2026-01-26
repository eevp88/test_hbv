<?php



namespace App\Services;


ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

use App\Repositories\PacienteRepository;
use App\Repositories\IngresoEnfermeriaRepository;
use App\Entities\Paciente;
use App\Entities\IngresoEnfermeria;
use Core\Database;
use PDO;
use Exception;
use InvalidArgumentException;

class IngresoEnfermeriaService
{
    private PacienteRepository $pacienteRepo;
    private IngresoEnfermeriaRepository $ingresoRepo;
    private PDO $db;
    public function __construct()
    {
        $this->db = Database::connection();
        $this->pacienteRepo = new PacienteRepository();
        $this->ingresoRepo = new IngresoEnfermeriaRepository();
    }

    public function registrarIngresoCompleto(array $datos): array
    {

        $data = $this->normalizar($datos);
        

        try {
            $this->db->beginTransaction();



            $paciente = new Paciente($data);
            $existente = $this->pacienteRepo->findByRun($paciente->run);

            if ($existente) {
                $paciente->id_paciente = $existente->id_paciente;
                $this->pacienteRepo->update($paciente);
                $pacienteId = $existente->id_paciente;
            } else {
                $pacienteId = $this->pacienteRepo->create($paciente);
            }

            $data['id_paciente'] = $pacienteId;
            $this->validar($data);

            $ingreso = new IngresoEnfermeria($data);

            $ingresoId = $this->ingresoRepo->create($ingreso);

            $this->db->commit();

            return [
                'success' => true,
                'paciente_id' => $pacienteId,
                'ingreso_id' => $ingresoId
            ];
        } catch (Exception $e) {
            $this->db->rollBack();
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    public function listar(): array
    {
        return $this->ingresoRepo->findAll();
    }

    public function obtener(int $id): ?IngresoEnfermeria
    {
        $ingreso = $this->ingresoRepo->findById($id);

        if (!$ingreso) {
            throw new \DomainException('Ingreso no encontrado');
        }

        return $ingreso;
    }

   
    /**
     * Normaliza datos crudos del request
     */
    private function normalizar(array $data): array
    {
        // 1. BOOLEANOS
        $boolFields = [
            'tet','s_foley','sng_sny','cvc','vvp_adm',
            'monitor_cardiaco','csv','examen_fisico','vvp_ingreso',
            'vvc','smpt','sonda_foley','sng','intubacion',
            'vmi_vmni','hemograma','pbq_ck','gsa_gsv',
            'hemocultivo','ecg','rx_torax','linea_arterial',
            'eco','tac','tt','ttpa','naricera','mmv','hgt',
            'solicita_servicios_religiosos'
        ];

        foreach ($boolFields as $f) {
            $data[$f] = !empty($data[$f]) ? 1 : 0;
        }

        // 2. ENTEROS
        $intFields = [
            'fc','er','pvc','sato2','gcs','eva',
            'fio2','hgt_sv'
        ];

        foreach ($intFields as $f) {
            if (!array_key_exists($f, $data) || $data[$f] === '' || $data[$f] === null) {
                $data[$f] = null;
            } elseif (!is_numeric($data[$f])) {
                throw new InvalidArgumentException("Campo $f debe ser numérico");
            } else {
                $data[$f] = (int) $data[$f];
            }
        }

        // 3. DECIMALES
        $decimalFields = ['tax','ttr','peso','talla','tet_altura'];

        foreach ($decimalFields as $f) {
            if (!array_key_exists($f, $data) || $data[$f] === '' || $data[$f] === null) {
                $data[$f] = null;
            } elseif (!is_numeric($data[$f])) {
                throw new InvalidArgumentException("Campo $f debe ser decimal");
            } else {
                $data[$f] = (float) $data[$f];
            }
        }

        // 4. SET opcionales → si viene vacío, no se inserta
        $setFields = [
            'via_aerea','alt_sensorial','color_piel','secrecion',
            'heridas','caracteristicas_heridas','vendaje_heridas',
            'habitos','frecuencia_habitos','alergias',
            'vacunas','ant_morbidos','abdomen','otra',
            'intestinal','urinaria'
        ];

        foreach ($setFields as $f) {
            if (empty($data[$f])) {
                unset($data[$f]);
            }
        }

        return $data;
    }

    /**
     * Validaciones de negocio mínimas
     */
    private function validar(array $data): void
    {
        $required = [
            'id_paciente',
            'actividad',
            'higiene',
            'estado_piel',
            'estado_temperancia',
            'estado_termorregulacion',
            'situacion_laboral',
            'estado_animico',
            'red_apoyo',
            'acompanamiento',
            'conciencia',
            'com_verbal',
            'boca',
            'respiracion',
            'tos',
            'estado_nutricional',
            'alimentacion',
            'apetito',
            'piel_mucosas',
            'patron_sueno',
            'vestrise_desvestrise',
            'aprendizaje'
        ];

        foreach ($required as $field) {
            if (empty($data[$field])) {
                throw new InvalidArgumentException("Campo obligatorio faltante: $field");
            }
        }
    }
}




/* 
namespace App\Services;

//use App\Repositories\IngresoRepository;

use App\Repositories\IngresoRepository;
class IngresoService
{
    private IngresoRepository $repository;

    public function __construct()
    {
        $this->repository = new IngresoRepository();
    }

    public function listar(): array
    {
        return $this->repository->findAll();
    }

    public function obtener(int $id): array
    {
        $ingreso = $this->repository->findById($id);

        if (!$ingreso) {
            throw new \DomainException('Ingreso no encontrado');
        }

        return $ingreso;
    }

    public function crear(array $data): int
    {
        // aquí van reglas de negocio
        if (empty($data['paciente_id'])) {
            throw new \InvalidArgumentException('Paciente requerido');
        }

        return $this->repository->create($data);
    }

    public function actualizar(int $id, array $data): void
    {
        if (!$this->repository->exists($id)) {
            throw new \DomainException('Ingreso no existe');
        }

        $this->repository->update($id, $data);
    }

    public function eliminar(int $id): void
    {
        $this->repository->delete($id);
    }
}
 */