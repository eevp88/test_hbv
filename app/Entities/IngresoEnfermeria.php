<?php

namespace App\Entities;


/*
TODO
validaciones
*/


class IngresoEnfermeria
{
    public $id_ingreso;
    public $id_paciente;
    public $hospital_nombre;
    public $hospital_servicio;
    public $hospital_area;
    public $procedencia;
    public $peso;
    public $talla;
    public $diagnostico;
    public $fecha_ingreso;
    public $anamnesis;
    public $nombre_enfermero;
    public $run_enfermero;
    public $codigo_enfermero;
    public $pertenencias;

    public $fecha_termino; 
    public $hora_termino; 
    public $observaciones_finales;
    public $hora_ingreso;

    //signos vitales

    public $fc;
    public $pa;
    public $tax;
    public $ttr;
    public $er;
    public $pvc;
    public $sato2;
    public $gcs;
    public $fio2;
    public $hgt_sv;
    public $eva;



    //movilizacion

    public $actividad;
    public $inmovilizacion;
    public $fuerza_muscular;
    public $sensibilidad;
    public $observaciones_movilizacion;

    //higene

    public $higiene;
    public $estado_piel;
    public $heridas;
    public $caracteristicas_heridas;
    public $vendaje_heridas;
    public $observaciones_higiene;

    //seguridad

    public $habitos;
    public $frecuencia_habitos;
    public $alergias;
    public $estado_temperancia;
    public $vacunas;
    public $ant_morbidos;
    public $observaciones_seguridad;

    //termoregulacion

    public $estado_termorregulacion;
    public $observaciones_termorregulacion;

    //realizacion personal
    public $situacion_laboral;
    public $estado_animico;
    public $red_apoyo;
    public $acompanamiento;
    public $observaciones_realizacion_personal;

    //soluciones administradas
    public $descripcion_soluciones_administradas;

    // procedimiebntos al administrados 
    public $tet;
    public $tet_altura;
    public $tet_fecha;
    public $s_foley;
    public $s_foley_fecha;
    public $sng_sny;
    public $sng_sny_fecha;
    public $cvc;
    public $cvc_fecha;
    public $vvp_adm ;
    public $vvp_adm_fecha;
    //procedimientos al ingreso

    public $monitor_cardiaco;
    public $csv;
    public $examen_fisico;
    public $vvp_ingreso;
    public $vvc;
    public $smpt;
    public $sonda_foley;
    public $sng;
    public $intubacion;
    public $vmi_vmni;
    public $hemograma;
    public $pbq_ck;
    public $gsa_gsv;
    public $hemocultivo;
    public $ecg;
    public $rx_torax;
    public $linea_arterial;
    public $eco;
    public $tac;
    public $tt;
    public $ttpa;
    public $naricera;
    public $mmv;
    public $hgt;

    //comuniucacion

    public $conciencia;
    public $com_verbal;
    public $alt_sensorial;
    public $boca;
    public $pupilas;
    public $observaciones_comunicacion;


    //oxigenacion
    public $via_aerea;
    public $respiracion;
    public $oxigenoterapia;
    public $tos;
    public $color_piel;
    public $secrecion;
    public $observaciones_oxigenacion;
    //nutricion

    public $estado_nutricional;
    public $alimentacion;
    public $apetito;
    public $piel_mucosas;
    public $abdomen;
    public $otra;
    public $observaciones_nutricion;

    // eliminacion
    public $intestinal;
    public $urinaria;
    public $patron_sueno;
    public $vestrise_desvestrise;
    public $aprendizaje;
    public $observaciones_eliminacion;

    public $solicita_servicios_religiosos;

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
        return array_filter(get_object_vars($this), fn($v) => $v !== null);
    }
}
