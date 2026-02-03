<?php



namespace App\Services;


/* ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL); */

use App\Repositories\PacienteRepository;
use App\Repositories\IngresoEnfermeriaRepository;
use App\Entities\Paciente;
use App\Entities\IngresoEnfermeria;
use Core\Database;
use PDO;
use Exception;
use InvalidArgumentException;
use DomainException;

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

        
        try {
            $this->db->beginTransaction();

            $paciente = new Paciente($datos);
            if (empty($paciente->run)) {
                throw new InvalidArgumentException('RUN no inicializado en Paciente');
            }

            $existente = $this->pacienteRepo->findByRun($paciente->run);
            
            if ($existente) {
                $paciente->id_paciente = $existente->id_paciente;
                $this->pacienteRepo->update($paciente);
                $pacienteId = $existente->id_paciente;
            } else {
                $pacienteId = $this->pacienteRepo->create($paciente);
            }

            $datos['id_paciente'] = $pacienteId;

            $ingreso = new IngresoEnfermeria($datos);
          
               
            $ingresoId = $this->ingresoRepo->create($ingreso);

             

            $this->db->commit();

            return [
                'success' => true,
                'message' => 'Ingreso registrado correctamente',
                'paciente_id' => $pacienteId,
                'ingreso_id' => $ingresoId
            ];
        } catch (Exception | InvalidArgumentException | DomainException   $e) {
            $this->db->rollBack();
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    public function actualizarIngreso(int $id, array $datos): array
    {
        try {
            $ingresoExistente = $this->ingresoRepo->findById($id);

            if (!$ingresoExistente) {
                throw new DomainException('Ingreso no encontrado para actualizar');
            }

            $datos['id_ingreso'] = $id;
            $ingresoActualizado = new IngresoEnfermeria($datos);

            $this->ingresoRepo->update($ingresoActualizado);

            return [
                'success' => true,
                'message' => 'Ingreso actualizado correctamente',
                'ingreso_id' => $id
            ];
        } catch (Exception | InvalidArgumentException | DomainException $e) {
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

        //busco paciente asociado
        $paciente = $this->pacienteRepo->findById($ingreso->id_paciente);
        $ingreso->paciente = $paciente; 
        
        return $ingreso;
    }

    public function eliminar(int $id): array
    {
        try {
            $ingresoExistente = $this->ingresoRepo->findById($id);

            if (!$ingresoExistente) {
                throw new DomainException('Ingreso no encontrado para eliminar');
            }

            $this->ingresoRepo->delete($id);

            return [
                'success' => true,
                'message' => 'Ingreso eliminado correctamente',
                'ingreso_id' => $id
            ];
        } catch (Exception | DomainException $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    /**
     * Normaliza datos crudos del request
     * 
     */

    private function normalizar(array $data): array
    {
        /* ===============================
        * 1. BOOLEANOS (true -> 1, falsy -> 0)
        * =============================== */

        $boolFields = [
            'tet',
            's_foley',
            'sng_sny',
            'cvc',
            'vvp_adm',
            'monitor_cardiaco',
            'csv',
            'examen_fisico',
            'vvp_ingreso',
            'vvc',
            'smpt',
            'sonda_foley',
            'sng',
            'intubacion',
            'vmi_vmni',
            'hemograma',
            'pbq_ck',
            'gsa_gsv',
            'hemocultivo',
            'ecg',
            'rx_torax',
            'linea_arterial',
            'eco',
            'tac',
            'tt',
            'ttpa',
            'naricera',
            'mmv',
            'hgt',
            'solicita_servicios_religiosos'
        ];

        foreach ($boolFields as $f) {
            if (array_key_exists($f, $data)) {
                $data[$f] = $data[$f] ? 1 : 0;
            }
        }

        /* ===============================
        * 2. ENTEROS (NULL permitido)
        * =============================== */
        $intFields = [
            'fc',
            'er',
            'pvc',
            'sato2',
            'gcs',
            'eva',
            'fio2',
            'hgt_sv'
        ];

        foreach ($intFields as $f) {
            if (!array_key_exists($f, $data) || $data[$f] === '' || $data[$f] === null) {
                $data[$f] = null;
                continue;
            }

            if (!is_numeric($data[$f])) {
                throw new InvalidArgumentException("Campo $f debe ser entero");
            }

            $data[$f] = (int)$data[$f];
        }

        /* ===============================
        * 3. DECIMALES (acepta , y . | NULL permitido)
        * =============================== */
        $decimalFields = ['tax', 'ttr', 'peso', 'talla', 'tet_altura'];

        foreach ($decimalFields as $f) {
            if (!array_key_exists($f, $data) || $data[$f] === '' || $data[$f] === null) {
                $data[$f] = null;
                continue;
            }

            if (is_string($data[$f])) {
                $data[$f] = str_replace(',', '.', $data[$f]);
            }

            if (!is_numeric($data[$f])) {
                throw new InvalidArgumentException("Campo $f debe ser decimal");
            }

            $data[$f] = (float)$data[$f];
        }

        /* ===============================
        * 4. CAMPOS NULLABLE ('' -> NULL)
        * =============================== */
        $nullableFields = [
            'inmovilizacion',
            'oxigenoterapia',
            'via_aerea',
            'alt_sensorial',
            'color_piel',
            'secrecion',
            'heridas',
            'caracteristicas_heridas',
            'vendaje_heridas',
            'habitos',
            'frecuencia_habitos',
            'alergias',
            'vacunas',
            'ant_morbidos',
            'abdomen',
            'otra',
            'intestinal',
            'urinaria',
            'observaciones_higiene',
            'observaciones_seguridad',
            'observaciones_termorregulacion',
            'observaciones_realizacion_personal'
        ];

        foreach ($nullableFields as $f) {
            if (array_key_exists($f, $data) && $data[$f] === '') {
                $data[$f] = null;
            }
        }

        /* ===============================
        * 5. CAMPOS NOT NULL (validación dura)
        * =============================== */
        $requiredFields = [
            'actividad',
            'fuerza_muscular',
            'sensibilidad',
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

        foreach ($requiredFields as $f) {
            if ($f ==  'actividad') {
                var_dump($data['actividad']);
                exit;
            }
            if (!array_key_exists($f, $data) || $data[$f] === '' || $data[$f] === null) {
                throw new InvalidArgumentException("Campo obligatorio $f no puede ser NULL");
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

    private function prepararDatosIngreso(array $datos, int $idPaciente): IngresoEnfermeria
    {

        // Convertir arrays a formato SET
        $datosFormateados = [];

        // ========================================
        // CAMPOS OBLIGATORIOS CON VALORES DEFAULT
        // ========================================
        $valoresObligatorios = [
            'id_paciente' => $idPaciente,
            'fecha_ingreso' => $datos['fecha_ingreso'] ?? date('Y-m-d H:i:s'),

            // Campos con CHECK constraints (OBLIGATORIOS)
            'actividad' => $datos['actividad'] ?? 'MOVILIZA SOLO',
            'fuerza_muscular' => $datos['fuerza_muscular'] ?? 'NORMAL',
            'sensibilidad' => $datos['sensibilidad'] ?? 'NORMAL',
            'higiene' => $datos['higiene'] ?? 'ASEADO',
            'estado_piel' => $datos['estado_piel'] ?? 'INTEGRA/HIDRATADA',
            'estado_temperancia' => $datos['estado_temperancia'] ?? 'SOBRIO',
            'estado_termorregulacion' => $datos['estado_termorregulacion'] ?? 'NORMAL',
            'situacion_laboral' => $datos['situacion_laboral'] ?? 'TRABAJA',
            'estado_animico' => $datos['estado_animico'] ?? 'TRANQUILO',
            'red_apoyo' => $datos['red_apoyo'] ?? 'VIVE CON FAMILIA',
            'acompanamiento' => $datos['acompanamiento'] ?? 'FAMILIAR',
            'conciencia' => $datos['conciencia'] ?? 'CONCIENTE',
            'com_verbal' => $datos['com_verbal'] ?? 'COMPLETA COHERENTE',
            'boca' => $datos['boca'] ?? 'SANA',
            'respiracion' => $datos['respiracion'] ?? 'NORMAL',
            'tos' => $datos['tos'] ?? 'AUSENTE',
            'estado_nutricional' => $datos['estado_nutricional'] ?? 'NORMAL',
            'alimentacion' => $datos['alimentacion'] ?? 'SOLO',
            'apetito' => $datos['apetito'] ?? 'BUENO',
            'piel_mucosas' => $datos['piel_mucosas'] ?? 'HIDRATADA',
            'patron_sueno' => $datos['patron_sueno'] ?? 'NORMAL',
            'vestrise_desvestrise' => $datos['vestrise_desvestrise'] ?? 'AUTONOMO',
            'aprendizaje' => $datos['aprendizaje'] ?? 'TELEVISION'
        ];

        // ========================================
        // CAMPOS OPCIONALES
        // ========================================
        $camposOpcionales = [
            'hospital_nombre' => $datos['hospital_nombre'] ?? 'HOSPITAL BASE VALDIVIA',
            'hospital_servicio' => $datos['hospital_servicio'] ?? 'SERVICIO DE SALUD VALDIVIA',
            'hospital_area' => $datos['hospital_area'] ?? 'SERVICIO MEDICINA',
            'procedencia' => $datos['procedencia'] ?? null,
            'peso' => $datos['peso'] ?? null,
            'talla' => $datos['talla'] ?? null,
            'diagnostico' => $datos['diagnostico'] ?? null,
            'anamnesis' => $datos['anamnesis'] ?? null,
            'nombre_enfermero' => $datos['nombre_enfermero'] ?? null,
            'run_enfermero' => $datos['run_enfermero'] ?? null,
            'codigo_enfermero' => $datos['codigo_enfermero'] ?? null,
            'pertenencias' => $datos['pertenencias'] ?? null,

            // Signos vitales
            'fc' => $datos['fc'] ?? null,
            'pa' => $datos['pa'] ?? null,
            'tax' => $datos['tax'] ?? null,
            'ttr' => $datos['ttr'] ?? null,
            'er' => $datos['er'] ?? null,
            'pvc' => $datos['pvc'] ?? null,
            'sato2' => $datos['sato2'] ?? null,
            'gcs' => $datos['gcs'] ?? null,

            // Observaciones
            'observaciones_movilizacion' => $datos['observaciones_movilizacion'] ?? null,
            'observaciones_higiene' => $datos['observaciones_higiene'] ?? null,
            'observaciones_seguridad' => $datos['observaciones_seguridad'] ?? null,
            'observaciones_termorregulacion' => $datos['observaciones_termorregulacion'] ?? null,
            'observaciones_realizacion_personal' => $datos['observaciones_realizacion_personal'] ?? null,
            'observaciones_comunicacion' => $datos['observaciones_comunicacion'] ?? null,
            'observaciones_oxigenacion' => $datos['observaciones_oxigenacion'] ?? null,
            'observaciones_nutricion' => $datos['observaciones_nutricion'] ?? null,
            'observaciones_eliminacion' => $datos['observaciones_eliminacion'] ?? null,

            // Soluciones
            'descripcion_soluciones_administradas' => $datos['descripcion_soluciones_administradas'] ?? null,

            // Procedimientos con fecha
            'tet' => $this->toBool($datos['tet'] ?? false),
            'tet_altura' => $datos['tet_altura'] ?? null,
            'tet_fecha' => $datos['tet_fecha'] ?? null,
            's_foley' => $this->toBool($datos['s_foley'] ?? false),
            's_foley_fecha' => $datos['s_foley_fecha'] ?? null,
            'sng_sny' => $this->toBool($datos['sng_sny'] ?? false),
            'sng_sny_fecha' => $datos['sng_sny_fecha'] ?? null,
            'cvc' => $this->toBool($datos['cvc'] ?? false),
            'cvc_fecha' => $datos['cvc_fecha'] ?? null,
            'vvp_adm' => $this->toBool($datos['vvp_adm'] ?? false),
            'vvp_adm_fecha' => $datos['vvp_adm_fecha'] ?? null,

            // Procedimientos al ingreso (booleanos)
            'monitor_cardiaco' => $this->toBool($datos['monitor_cardiaco'] ?? false),
            'csv' => $this->toBool($datos['csv'] ?? false),
            'EXAMEN_FISICO' => $this->toBool($datos['EXAMEN_FISICO'] ?? false),
            'vvp_ingreso' => $this->toBool($datos['vvp_ingreso'] ?? false),
            'vvc' => $this->toBool($datos['vvc'] ?? false),
            'smpt' => $this->toBool($datos['smpt'] ?? false),
            'sonda_foley' => $this->toBool($datos['sonda_foley'] ?? false),
            'sng' => $this->toBool($datos['sng'] ?? false),
            'intubacion' => $this->toBool($datos['intubacion'] ?? false),
            'vmi_vmni' => $this->toBool($datos['vmi_vmni'] ?? false),
            'hemograma' => $this->toBool($datos['hemograma'] ?? false),
            'pbq_ck' => $this->toBool($datos['pbq_ck'] ?? false),
            'gsa_gsv' => $this->toBool($datos['gsa_gsv'] ?? false),
            'hemocultivo' => $this->toBool($datos['hemocultivo'] ?? false),
            'ecg' => $this->toBool($datos['ecg'] ?? false),
            'rx_torax' => $this->toBool($datos['rx_torax'] ?? false),
            'linea_arterial' => $this->toBool($datos['linea_arterial'] ?? false),
            'eco' => $this->toBool($datos['eco'] ?? false),
            'tac' => $this->toBool($datos['tac'] ?? false),
            'tt' => $this->toBool($datos['tt'] ?? false),
            'mmv' => $this->toBool($datos['mmv'] ?? false),
            'hgt' => $this->toBool($datos['hgt'] ?? false),

            // Creencias
            'solicita_servicios_religiosos' => $this->toBool($datos['solicita_servicios_religiosos'] ?? false)
        ];

        // ========================================
        // CAMPOS SET (arrays convertidos a string)
        // ========================================
        $camposSET = [
            'inmovilizacion' => $this->arrayToSet($datos['inmovilizacion'] ?? []),
            'heridas' => $this->arrayToSet($datos['heridas'] ?? []),
            'caracteristicas_heridas' => $this->arrayToSet($datos['caracteristicas_heridas'] ?? []),
            'vendaje_heridas' => $this->arrayToSet($datos['vendaje_heridas'] ?? []),
            'habitos' => $this->arrayToSet($datos['habitos'] ?? []),
            'frecuencia_habitos' => $this->arrayToSet($datos['frecuencia_habitos'] ?? []),
            'alergias' => $this->arrayToSet($datos['alergias'] ?? []),
            'vacunas' => $this->arrayToSet($datos['vacunas'] ?? []),
            'ant_morbidos' => $this->arrayToSet($datos['ant_morbidos'] ?? []),
            'alt_sensorial' => $this->arrayToSet($datos['alt_sensorial'] ?? []),
            'pupilas' => $this->arrayToSet($datos['pupilas'] ?? []),
            'via_aeria' => $this->arrayToSet($datos['via_aeria'] ?? []),
            'oxigenoterapia' => $this->arrayToSet($datos['oxigenoterapia'] ?? []),
            'color_piel' => $this->arrayToSet($datos['color_piel'] ?? []),
            'secrecion' => $this->arrayToSet($datos['secrecion'] ?? []),
            'abdomen' => $this->arrayToSet($datos['abdomen'] ?? []),
            'otra' => $this->arrayToSet($datos['otra'] ?? []),
            'intestinal' => $this->arrayToSet($datos['intestinal'] ?? []),
            'urinaria' => $this->arrayToSet($datos['urinaria'] ?? [])
        ];

        // Combinar todos los datos
        $datosFormateados = array_merge($valoresObligatorios, $camposOpcionales, $camposSET);

        return new IngresoEnfermeria($datosFormateados);
    }

    private function arrayToSet($array): string
    {
        if (empty($array)) return '';
        return is_array($array) ? implode(',', $array) : $array;
    }

    private function toBool($value): int
    {
        return isset($value) && ($value === 'on' || $value === '1' || $value === 1 || $value === true) ? 1 : 0;
    }
}
