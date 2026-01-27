--  Tabla principal: Pacientes
CREATE TABLE pacientes (
    id_paciente INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(255) null,
    fecha_nacimiento DATE,
    run VARCHAR(50) UNIQUE,
    edad INT,
    genero VARCHAR(50),
    direccion VARCHAR(255),
    telefono VARCHAR(50),
    email VARCHAR(100),
    ficha_clinica varchar(25) UNIQUE,   
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


--  Tabla:  Ingreso de Enfermería
CREATE TABLE ingreso_enfermeria (
    id_ingreso INT PRIMARY KEY AUTO_INCREMENT,
    id_paciente INT null,
    
    
    hospital_nombre VARCHAR(255) DEFAULT 'HOSPITAL BASE VALDIVIA',
    hospital_servicio VARCHAR(255) DEFAULT 'SERVICIO DE SALUD VALDIVIA',
    hospital_area VARCHAR(255) DEFAULT 'SERVICIO MEDICINA',
    procedencia VARCHAR(255),
    peso DECIMAL(5,2),
    talla DECIMAL(5,2),
    
    
    diagnostico TEXT,
    fecha_ingreso DATE null,
    hora_ingreso  TIME null,
    anamnesis TEXT,
    nombre_enfermero VARCHAR(255),
    run_enfermero VARCHAR(50),
    codigo_enfermero VARCHAR(50),
    pertenencias TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    fecha_termino DATE null,
    hora_termino TIME null,

    observaciones_finales TEXT,

    fc INT,
    pa VARCHAR(10), 
    tax DECIMAL(5,2), 
    ttr DECIMAL(5,2), 
    er INT, 
    pvc INT,
    sato2 INT, 
    gcs INT, 
    eva int,
    fio2 int,
    hgt_sv int,

    

    actividad VARCHAR(20) null, 
    inmovilizacion  varchar(50) NULL,
    fuerza_muscular varchar(20) null,
    sensibilidad varchar(20) null,
    observaciones_movilizacion TEXT,    

    
    higiene VARCHAR(20) null,
    estado_piel VARCHAR(20) null,
    heridas varchar(80) NULL,
    caracteristicas_heridas varchar(60) NULL,
    vendaje_heridas varchar(60) NULL,
    observaciones_higiene TEXT,
  


    habitos varchar(60) NULL,
    frecuencia_habitos varchar(60) NULL,
    alergias varchar(60) NULL,
    estado_temperancia VARCHAR(20) null,
    vacunas varchar(60) NULL,
    ant_morbidos varchar(60) NULL,    
    observaciones_seguridad TEXT,



    estado_termorregulacion  VARCHAR(20) null,   
    observaciones_termorregulacion TEXT,


    situacion_laboral VARCHAR(20) null,
    estado_animico VARCHAR(20) null,
    red_apoyo VARCHAR(20) null,
    acompanamiento VARCHAR(20) null,
    observaciones_realizacion_personal TEXT,



    descripcion_soluciones_administradas TEXT,


  

    tet BOOLEAN DEFAULT FALSE,
    tet_altura DECIMAL(5,2),
    tet_fecha DATETIME,

    s_foley BOOLEAN DEFAULT FALSE,
    s_foley_fecha DATETIME,

    sng_sny BOOLEAN DEFAULT FALSE,
    sng_sny_fecha DATETIME,

    cvc BOOLEAN DEFAULT FALSE,
    cvc_fecha DATETIME,

    vvp_adm BOOLEAN DEFAULT FALSE,
    vvp_adm_fecha DATETIME,




    monitor_cardiaco BOOLEAN DEFAULT FALSE,
    csv BOOLEAN DEFAULT FALSE,
    examen_fisico BOOLEAN DEFAULT FALSE,
    vvp_ingreso BOOLEAN DEFAULT FALSE,
    vvc BOOLEAN DEFAULT FALSE,
    smpt BOOLEAN DEFAULT FALSE,
    sonda_foley BOOLEAN DEFAULT FALSE,
    sng BOOLEAN DEFAULT FALSE,
    intubacion BOOLEAN DEFAULT FALSE,
    vmi_vmni BOOLEAN DEFAULT FALSE,
    hemograma BOOLEAN DEFAULT FALSE,
    pbq_ck BOOLEAN DEFAULT FALSE,
    gsa_gsv BOOLEAN DEFAULT FALSE,
    hemocultivo BOOLEAN DEFAULT FALSE,
    ecg BOOLEAN DEFAULT FALSE,
    rx_torax BOOLEAN DEFAULT FALSE,
    linea_arterial BOOLEAN DEFAULT FALSE,
    eco BOOLEAN DEFAULT FALSE,
    tac BOOLEAN DEFAULT FALSE,
    tt BOOLEAN DEFAULT FALSE,
    ttpa BOOLEAN DEFAULT FALSE,
    naricera BOOLEAN DEFAULT FALSE,
    mmv BOOLEAN DEFAULT FALSE,
    hgt BOOLEAN DEFAULT FALSE,


    conciencia varchar(20) null,
    com_verbal varchar(20) null,
    alt_sensorial varchar(30) NULL ,
    boca VARCHAR(20) null,
    pupilas varchar(30) NULL,
    observaciones_comunicacion TEXT,



    via_aerea varchar(50) NULL,
    respiracion VARCHAR(20) null, 
    oxigenoterapia varchar(50) NULL,
    tos varchar(20) null,
    color_piel varchar(50) NULL,
    secrecion varchar(70) NULL,
    observaciones_oxigenacion TEXT,



    estado_nutricional VARCHAR(20) null,
    alimentacion varchar(20) null,
    apetito VARCHAR(20) null,
    piel_mucosas VARCHAR(20) null,
    abdomen varchar(70) NULL, 
    otra varchar(60) NULL,
    observaciones_nutricion TEXT,

    intestinal varchar(110) NULL,
    urinaria varchar(80),
    patron_sueno VARCHAR(20) null, 
    vestrise_desvestrise VARCHAR(20) null,
    aprendizaje varchar(20) null,
    observaciones_eliminacion TEXT,

    solicita_servicios_religiosos BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (id_paciente) REFERENCES pacientes(id_paciente) ON DELETE CASCADE,
 
   	CONSTRAINT chk_actividad CHECK (actividad IN ('MOVILIZA SOLO', 'MOVILIZA CON AYUDA', 'NO SE MOVILIZA')),
    CONSTRAINT chk_fuerza CHECK (fuerza_muscular IN ('NORMAL', 'DISMINUIDA')),
    CONSTRAINT chk_sensibilidad CHECK (sensibilidad IN ('NORMAL', 'DISMINUIDA', 'AUMENTADA')),
    CONSTRAINT chk_higiene CHECK (higiene IN ('ASEADO', 'DESASEADO', 'AUTONOMO', 'AYUDA PARCIAL', 'AYUDA TOTAL')),
    CONSTRAINT chk_estado_piel CHECK (estado_piel IN ('INTEGRA/HIDRATADA', 'DESHIDRATADA', 'SUDOROSA')),  
    CONSTRAINT chk_estado_temperancia CHECK (estado_temperancia IN ('SOBRIO', 'ALIENTO ETILICO', 'EBRIO', 'COMA ETILICO')),
    CONSTRAINT chk_termorregulacion CHECK (estado_termorregulacion IN ('NORMAL', 'HIPOTERMICO', 'HIPERTERMICO')),
    CONSTRAINT chk_situacion_laboral CHECK (situacion_laboral IN ('CESANTE', 'TRABAJA', 'JUBILADO', 'INVALIDEZ') ),
    CONSTRAINT chk_estado_animico CHECK (estado_animico IN ('TRANQUILO', 'TRISTE/DEPRESION', 'EUFORICO', 'ANSIOSO', 'AGRESIVO')),
    CONSTRAINT chk_red_apoyo CHECK (red_apoyo IN ('VIVE SOLO', 'VIVE CON FAMILIA', 'HOGAR', 'ABANDONO') ), 
    CONSTRAINT chk_acompanamiento CHECK (acompanamiento IN ('FAMILIAR', 'AMIGO', 'CUIDADOR', 'FUNCIONARIO', 'SOLO')),
    CONSTRAINT chk_conciencia CHECK (conciencia IN ('CONCIENTE', 'DESORIENTADO', 'LETARGICO', 'INCONCIENCIA/COMA', 'EBRIO')),
    CONSTRAINT chk_com_verbal CHECK (com_verbal IN ('COMPLETA COHERENTE', 'PARCIAL', 'AUSENTE', 'DISARTRIA')),
    CONSTRAINT chk_boca CHECK (boca IN ('SANA', 'CON LESIONES', 'EDENTADO', 'PROTESIS')),
    CONSTRAINT chk_respiracion CHECK (respiracion IN ('NORMAL', 'DISNEA', 'POLIPNEA', 'PARADOJAL', 'GASPING', 'APNEA')),
    CONSTRAINT chk_tos CHECK (tos IN ('AUSENTE', 'SECA', 'PRODUCTIVA', 'INFECTIVA')),
    CONSTRAINT chk_estado_nutricional CHECK (estado_nutricional IN ('NORMAL', 'ENFLAQUECIDO', 'DESNUTRIDO', 'OBESO')),
    CONSTRAINT chk_alimentacion CHECK (alimentacion IN ('SOLO', 'CON AYUDA', 'NO SE ALIMENTA', 'NAUSEAS', 'VOMITOS')),
    CONSTRAINT chk_apetito CHECK (apetito IN ('BUENO', 'REGULAR', 'MALO')),
    CONSTRAINT chk_piel_mucosas CHECK (piel_mucosas IN ('HIDRATADA', 'DESHIDRATADA', 'EDEMA', 'SIN EDEMA', 'ICTERICIA')) ,
    CONSTRAINT chk_patron_sueno CHECK (patron_sueno IN ('NORMAL', 'DISCONTINUO', 'INSOMNIO', 'MEDICACION')),
    CONSTRAINT chk_vestrise_desvestrise CHECK (vestrise_desvestrise IN ('AUTONOMO', 'AYUDA PARCIAL', 'AYUDA TOTAL')),
    CONSTRAINT chk_aprendizaje CHECK (aprendizaje IN ('LECTURA', 'TELEVISION', 'MANUALIDADES', 'DEPORTE')),
    INDEX idx_ingreso_paciente (id_paciente),
    INDEX idx_ingreso_fecha (fecha_ingreso)
); 