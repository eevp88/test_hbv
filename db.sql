-- Tabla principal: Pacientes
CREATE TABLE pacientes (
    id_paciente INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(255) NOT NULL,
    fecha_nacimiento DATE,
    RUN VARCHAR(50) UNIQUE,
    edad INT,
    genero VARCHAR(50),
    direccion VARCHAR(255),
    telefono VARCHAR(50),
    email VARCHAR(100),
    ficha_clinica int UNIQUE,   
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla:  Ingreso de Enfermería
CREATE TABLE ingreso_enfermeria (
    id_ingreso INT PRIMARY KEY AUTO_INCREMENT,
    id_paciente INT NOT NULL,
    
    -- Encabezado
    hospital_nombre VARCHAR(255) DEFAULT 'HOSPITAL BASE VALDIVIA',
    hospital_servicio VARCHAR(255) DEFAULT 'SERVICIO DE SALUD VALDIVIA',
    hospital_area VARCHAR(255) DEFAULT 'SERVICIO MEDICINA',
    procedencia VARCHAR(255),
    peso DECIMAL(5,2),
    talla DECIMAL(5,2),
    
    -- Datos del ingreso
    diagnostico TEXT,
    fecha_ingreso DATETIME NOT NULL,
    anamnesis TEXT,
    enfermero_nombre VARCHAR(255),
    enfermero_run VARCHAR(50),
    enfermero_codigo VARCHAR(50),
    pertenencias TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (id_paciente) REFERENCES pacientes(id_paciente) ON DELETE CASCADE
);

-- Tabla: Signos Vitales (puede haber múltiples registros por hoja)
CREATE TABLE signos_vitales (
    id_signo INT PRIMARY KEY AUTO_INCREMENT,
    id_ingreso INT NOT NULL,
    fecha datetime DEFAULT CURRENT_TIMESTAMP,
    fc INT, -- Frecuencia Cardíaca
    pa VARCHAR(10), -- Presión Arterial (ej: 120/80)
    tax DECIMAL(4,2), -- Temperatura Axilar
    ttr DECIMAL(4,2), -- Temperatura Timpánica/Rectal
    er INT, -- Escala de Riesgo
    pvc INT, -- Presión Venosa Central
    sato2 INT, -- Saturación de Oxígeno
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (id_ingreso) REFERENCES ingreso_enfermeria(id_ingreso) ON DELETE CASCADE
);

-- Tabla: Movilización
CREATE TABLE movilizacion_paciente (
    id_movilizacion INT PRIMARY KEY AUTO_INCREMENT,
    id_ingreso INT NOT NULL,
    -- Actividad
    actividad VARCHAR(20) NOT NULL, 
    inmovilizacion SET('TABLA ESPINAL', 'COLLAR', 'FERULA', 'VALVA YESO') DEFAULT '',
    fuerza_muscular varchar(20) not null,
    sensibilidad varchar(20) not null,
    observaciones TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_ingreso) REFERENCES ingreso_enfermeria(id_ingreso) ON DELETE CASCADE,
    CONSTRAINT chk_actividad CHECK (actividad IN ('MOVILIZA SOLO', 'MOVILIZA CON AYUDA', 'NO SE MOVILIZA')),
    CONSTRAINT chk_fuerza CHECK (fuerza_muscular IN ('NORMAL', 'DISMINUIDA')),
    CONSTRAINT chk_sensibilidad CHECK (sensibilidad IN ('NORMAL', 'DISMINUIDA', 'AUMENTADA') )

);

-- Tabla: Higiene
CREATE TABLE higiene_paciente (
    id_higiene INT PRIMARY KEY AUTO_INCREMENT,
    id_ingreso INT NOT NULL,

    higiene VARCHAR(20) NOT NULL,
    estado_piel VARCHAR(20) NOT NULL,
    heridas SET('OPERATORIA', 'CORTANTE', 'PENETRANTE', 'ULCERA', 'QUEMADURA', 'CONTUSA') DEFAULT '',
    caracteristicas_heridas SET('LIMPIA', 'SUCIA', 'CONTAMINADA', 'INFECTADA', 'ABRASIVA') DEFAULT '',
    vendaje_heridas SET( 'LIMPIO', 'SUCIOS', 'FIJOS', 'SIN VENDAJE') DEFAULT '',
    observaciones TEXT,
    FOREIGN KEY (id_ingreso) REFERENCES ingreso_enfermeria(id_ingreso) ON DELETE CASCADE,
    CONSTRAINT chk_higiene CHECK (higiene IN ('ASEADO', 'DESASEADO', 'AUTONOMO', 'AYUDA PARCIAL', 'AYUDA TOTAL')),
    CONSTRAINT chk_estado_piel CHECK (estado_piel IN ('INTEGRA/HIDRATADA', 'DESHIDRATADA', 'SUDOROSA'))
);

-- Tabla: Seguridad
CREATE TABLE seguridad_paciente (
    id_seguridad INT PRIMARY KEY AUTO_INCREMENT,
    id_ingreso INT NOT NULL,
    habitos SET ('ALCOHOL', 'TABACO', 'DROGAS', 'VIF', 'MALTRATO') DEFAULT '',
    frecuencia_habitos SET ('AISLADO', 'OCASIONAL', 'FRECUENTE') DEFAULT '',
    alergias SET ('MEDICAMENTOS', 'ANESTESIA', 'ALIMENTOS', 'INSECTOS') DEFAULT '',
    estado_temperancia VARCHAR(20) NOT NULL,
    vacunas SET('ANTIRRABICA', 'TETANOS') DEFAULT '',
    ant_morbidosos SET('HTA', 'DM', 'EPI', 'ERC','EPOC') DEFAULT '',    
    observaciones TEXT,
    FOREIGN KEY (id_ingreso) REFERENCES ingreso_enfermeria(id_ingreso) ON DELETE CASCADE,
    CONSTRAINT chk_estado_temperancia CHECK (estado_temperancia IN ('SOBRIO', 'ALIENTO ETILICO', 'EBRIO', 'COMA ETILICO'))

);

-- Tabla: Termorregulación
CREATE TABLE termorregulacion_paciente (
    id_termorregulacion INT PRIMARY KEY AUTO_INCREMENT,
    id_ingreso INT NOT NULL,
    estado_termorregulacion  VARCHAR(20) NOT NULL,   
    observaciones TEXT,
    FOREIGN KEY (id_ingreso) REFERENCES ingreso_enfermeria(id_ingreso) ON DELETE CASCADE,
    CONSTRAINT chk_termorregulacion CHECK (estado_termorregulacion IN ('NORMAL', 'HIPOTERMICO', 'HIPERTERMICO'))
);

CREATE TABLE realizacion_personal_paciente (
    id_realizacion INT PRIMARY KEY AUTO_INCREMENT,
    id_ingreso INT NOT NULL,
    situacion_laboral VARCHAR(20) NOT NULL,
    estado_animico VARCHAR(20) NOT NULL,
    red_apoyo VARCHAR(20) NOT NULL,
    acompañamiento VARCHAR(20) not null,
    observaciones TEXT,
    FOREIGN KEY (id_ingreso) REFERENCES ingreso_enfermeria(id_ingreso) ON DELETE CASCADE,
    CONSTRAINT chk_situacion_laboral CHECK (situacion_laboral IN ('CESANTE', 'TRABAJA', 'JUBILADO', 'INVALIDEZ') ),
    CONSTRAINT chk_estado_animico CHECK (estado_animico IN ('TRANQUILO', 'TRISTE/DEPRESION', 'EUFORICO', 'ANSIOSO', 'AGRESIVO')),
    CONSTRAINT chk_red_apoyo CHECK (red_apoyo IN ('VIVE SOLO', 'VIVE CON FAMILIA', 'HOGAR', 'ABANDONO') ), 
    CONSTRAINT chk_acompañamiento CHECK (acompañamiento IN ('FAMILIAR', 'AMIGO', 'CUIDADOR', 'FUNCIONARIO', 'SOLO'))
); 





-- Tabla: Soluciones Administradas
CREATE TABLE soluciones_administradas_paciente (
    id_solucion INT PRIMARY KEY AUTO_INCREMENT,
    id_ingreso INT NOT NULL,
    descripcion TEXT,
    FOREIGN KEY (id_ingreso) REFERENCES ingreso_enfermeria(id_ingreso) ON DELETE CASCADE
); 


create Table procedimientos_administrados_paciente (
    id_procedimiento_admin INT PRIMARY KEY AUTO_INCREMENT,
    id_ingreso INT NOT NULL,
    nombre_procedimiento VARCHAR(255) NOT NULL,
    fecha_intalacion DATETIME NOT NULL,
    observaciones TEXT,
    descripcion TEXT,
    FOREIGN KEY (id_ingreso) REFERENCES ingreso_enfermeria(id_ingreso) ON DELETE CASCADE
);

-- Tabla: Procedimientos al Ingreso
CREATE TABLE procedimientos_ingreso_paciente (
    id_procedimiento INT PRIMARY KEY AUTO_INCREMENT,
    id_ingreso INT NOT NULL,
    monitos_cardiaco BOOLEAN DEFAULT FALSE,
    CSV BOOLEAN DEFAULT FALSE,
    EXAMEN_FISICO BOOLEAN DEFAULT FALSE,
    vvp BOOLEAN DEFAULT FALSE,
    vvc BOOLEAN DEFAULT FALSE,
    SMPT BOOLEAN DEFAULT FALSE,
    sonda_foley BOOLEAN DEFAULT FALSE,
    SNG BOOLEAN DEFAULT FALSE,
    INTUBACION BOOLEAN DEFAULT FALSE,
    VMI_VMNI BOOLEAN DEFAULT FALSE,
    hemograma BOOLEAN DEFAULT FALSE,
    PBQ_CK BOOLEAN DEFAULT FALSE,
    GSA_GSV BOOLEAN DEFAULT FALSE,
    HEMOCULTIVO BOOLEAN DEFAULT FALSE,
    ECG BOOLEAN DEFAULT FALSE,
    RX_TORAX BOOLEAN DEFAULT FALSE,
    LINEA_ARTERIAL BOOLEAN DEFAULT FALSE,
    ECO BOOLEAN DEFAULT FALSE,
    TAC BOOLEAN DEFAULT FALSE,
    TT BOOLEAN DEFAULT FALSE,
    MMV BOOLEAN DEFAULT FALSE,
    HGT BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (id_ingreso) REFERENCES ingreso_enfermeria(id_ingreso) ON DELETE CASCADE
);

-- Tabla: Comunicación
CREATE TABLE comunicacion_paciente (
    id_comunicacion INT PRIMARY KEY AUTO_INCREMENT,
    id_ingreso  INT NOT NULL,
    conciencia varchar(20) not null,
    con_verbal varchar(20) not null,
    alt_sensorial SET ('VISUAL', 'AUDITIVA', 'LENTES', 'AUDIFONOS') DEFAULT '' ,
    BOCA VARCHAR(20) NOT NULL,
    pupilas SET ('ISOCORIA', 'ANISOCORIA', 'MIOSIS', 'MIDRIASIS', 'RFM') DEFAULT '',
    observaciones TEXT,
    FOREIGN KEY (id_ingreso) REFERENCES ingreso_enfermeria(id_ingreso) ON DELETE CASCADE,
    CONSTRAINT chk_conciencia CHECK (conciencia IN ('CONCIENTE', 'DESORIENTADO', 'LETARGICO', 'INCONCIENCIA/COMA', 'EBRIO')),
    CONSTRAINT chk_con_verbal CHECK (con_verbal IN ('COMPLETA COHERENTE', 'PARCIAL', 'AUSENTE', 'DISARTRIA')),
    CONSTRAINT chk_boca CHECK (boca IN ('SANA', 'CON LESIONES', 'EDENTADO', 'PROTESIS'))

); 


-- Tabla: Oxigenación
CREATE TABLE oxigenacion_paciente (
    id_oxigenacion INT PRIMARY KEY AUTO_INCREMENT,
    id_ingreso INT NOT NULL,
    via_aeria SET('PERMEABLE', 'SECRECIONES', 'CANULA MAYO', 'TOT') DEFAULT '',
    respiracion VARCHAR(20) NOT NULL, 
    oxigenoterapia SET('BIGOTERA', 'MMV', 'MAF', 'TUBO T', 'AMBU') DEFAULT '',
    tos varchar(20) not null,
    color_piel SET('ROSADA', 'PALIDA', 'CINOTICA', 'LIVIDECES') DEFAULT '',
    secrecion SET( 'MUCOSA', 'PURULENTA', 'HEMATICA', 'ABUNDANTE', 'REGULAR', 'ESCASA') DEFAULT '',
    observaciones TEXT,
    FOREIGN KEY (id_ingreso) REFERENCES ingreso_enfermeria(id_ingreso) ON DELETE CASCADE,
    CONSTRAINT chk_respiracion CHECK (respiracion IN ('NORMAL', 'DISNEA', 'POLIPNEA', 'PARADOJAL', 'GASPING', 'APNEA')),
    CONSTRAINT chk_tos CHECK (tos IN ('AUSENTE', 'SECA', 'PRODUCTIVA', 'INFECTIVA'))
);

-- Tabla: Nutrición e Hidratación
CREATE TABLE nutricion_hidratacion_paciente (
    id_nutricion INT PRIMARY KEY AUTO_INCREMENT,
    id_ingreso INT NOT NULL,
    estado_nutricional VARCHAR(20) NOT NULL,
    alimentacion varchar(20) not null,
    apetito VARCHAR(20) NOT NULL,
    piel_mucosas VARCHAR(20) NOT NULL,
    abdomen SET( 'BLANDO', 'DEPRESIBLE', 'DOLOROSO', 'DISTENDIDO', 'ASCITIS') DEFAULT '', 
    otra SET('SNG/SNY', 'GASTRO', 'YEYUNO', 'ENTERAL', 'PARENTERAL') DEFAULT '',
    observaciones TEXT,

    FOREIGN KEY (id_ingreso) REFERENCES ingreso_enfermeria(id_ingreso) ON DELETE CASCADE,
    CONSTRAINT chk_estado_nutricional CHECK (estado_nutricional IN ('NORMAL', 'ENFLAQUECIDO', 'DESNUTRIDO', 'OBESO')),
    CONSTRAINT chk_alimentacion CHECK (alimentacion IN ('SOLO', 'CON AYUDA', 'NO SE ALIMENTA', 'NAUSEAS', 'VOMITOS')),
    CONSTRAINT chk_apetito CHECK (apetito IN ('BUENO', 'REGULAR', 'MALO')),
    CONSTRAINT chk_piel_mucosas CHECK (piel_mucosas IN ('HIDRATADA', 'DESHIDRATADA', 'EDEMA', 'SIN EDEMA', 'ICTERICIA'))
);

-- Tabla: Eliminación
CREATE TABLE eliminacion_paciente (
    id_eliminacion INT PRIMARY KEY AUTO_INCREMENT,
    id_ingreso INT NOT NULL,

    intestinal SET('DIARREA', 'INCONTINENCIA', 'RECTORRAGIA', 'MELENA', 'ESTREÑIMIENTO', 'ACOLIA', 'PAÑALES',  'OSTOMIA') DEFAULT '',
    urinaria SET('INCONTINENCIA', 'RETENCION', 'RETENCION', 'DISURIA', 'TENESMO', 'PAÑALES', 'SONDA FOLEY') DEFAULT '',
    patron_sueno VARCHAR(20) NOT NULL, 
    vestrise_desvestrise VARCHAR(20) NOT NULL,
    aprendizaje varchar(20) not null,
    observaciones TEXT,

    FOREIGN KEY (id_ingreso) REFERENCES ingreso_enfermeria(id_ingreso) ON DELETE CASCADE,
    CONSTRAINT chk_patron_sueno CHECK (patron_sueno IN ('NORMAL', 'DISCONTINUO', 'INSOMNIO', 'MEDICACION')),
    CONSTRAINT chk_vestrise_desvestrise CHECK (vestrise_desvestrise IN ('AUTONOMO', 'AYUDA PARCIAL', 'AYUDA TOTAL')),
    CONSTRAINT chk_aprendizaje CHECK (aprendizaje IN ('LECTURA', 'TELEVISION', 'MANUALIDADES', 'DEPORTE'))
   
);

-- Tabla: Creencias y Valores
CREATE TABLE creencias_valores_paciente (
    id_creencias INT PRIMARY KEY AUTO_INCREMENT,
    id_ingreso INT NOT NULL,
    solicita_servicios_religiosos BOOLEAN DEFAULT FALSE,
    observaciones TEXT,
    FOREIGN KEY (id_ingreso) REFERENCES ingreso_enfermeria(id_ingreso) ON DELETE CASCADE
);

-- Índices para mejorar el rendimiento
CREATE INDEX idx_ingreso_paciente ON ingreso_enfermeria(id_paciente);
CREATE INDEX idx_ingreso_fecha ON ingreso_enfermeria(fecha_ingreso);
CREATE INDEX idx_signos_ingreso ON signos_vitales(id_ingreso);



-- ============================================
-- DATOS DE PRUEBA - SISTEMA DE INGRESO ENFERMERÍA
-- ============================================

-- 1. Insertar Pacientes
INSERT INTO pacientes (nombre, fecha_nacimiento, RUN, edad, genero, direccion, telefono, email, ficha_clinica) VALUES
('Juan Pérez González', '1985-03-15', '12345678-9', 39, 'MASCULINO', 'Av. Los Robles 123, Valdivia', '+56912345678', 'juan.perez@email.com', 1001),
('María Carmen Soto', '1992-07-22', '23456789-0', 32, 'FEMENINO', 'Calle Los Alerces 456, Valdivia', '+56923456789', 'maria.soto@email.com', 1002),
('Pedro Alejandro Muñoz', '1978-11-08', '34567890-1', 46, 'MASCULINO', 'Pasaje Las Flores 789, Valdivia', '+56934567890', 'pedro.munoz@email.com', 1003),
('Ana Patricia Rivera', '2000-01-30', '45678901-2', 25, 'FEMENINO', 'Los Laureles 321, Valdivia', '+56945678901', 'ana.rivera@email.com', 1004),
('Carlos Eduardo Torres', '1965-09-12', '56789012-3', 59, 'MASCULINO', 'Av. Ramón Picarte 654, Valdivia', '+56956789012', 'carlos.torres@email.com', 1005);

-- 2. Insertar Ingresos de Enfermería
INSERT INTO ingreso_enfermeria (id_paciente, procedencia, peso, talla, diagnostico, fecha_ingreso, anamnesis, enfermero_nombre, enfermero_run, enfermero_codigo, pertenencias) VALUES
(1, 'SERVICIO DE URGENCIA', 75.5, 1.75, 'Neumonía adquirida en la comunidad', '2026-01-20 08:30:00', 'Paciente masculino de 39 años con cuadro de fiebre, tos productiva y disnea de 3 días de evolución', 'Rosa Martínez', '11111111-1', 'ENF001', 'Reloj, billetera, celular'),
(2, 'POLICLINICO', 62.0, 1.62, 'Diabetes Mellitus descompensada', '2026-01-21 10:15:00', 'Paciente femenina con diagnóstico de DM2, presenta poliuria, polidipsia y glicemia elevada', 'Luis Fernández', '22222222-2', 'ENF002', 'Cartera, documentos, celular'),
(3, 'TRASLADO OTRO CENTRO', 88.3, 1.80, 'Infarto agudo al miocardio', '2026-01-22 14:45:00', 'Paciente con dolor precordial intenso de 2 horas de evolución, con alteraciones en ECG', 'Carmen López', '33333333-3', 'ENF003', 'Billetera, llaves, celular'),
(4, 'SERVICIO DE URGENCIA', 58.0, 1.58, 'Apendicitis aguda', '2026-01-23 16:20:00', 'Paciente joven con dolor abdominal en fosa ilíaca derecha, náuseas y vómitos', 'Jorge Ramírez', '44444444-4', 'ENF004', 'Celular, documentos'),
(5, 'DOMICILIO', 70.0, 1.68, 'EPOC reagudizado', '2026-01-24 09:00:00', 'Paciente con antecedentes de EPOC, presenta disnea progresiva y expectoración purulenta', 'Patricia Vargas', '55555555-5', 'ENF005', 'Bastón, inhaladores, documentos');

-- 3. Insertar Signos Vitales
INSERT INTO signos_vitales (id_ingreso, fecha, fc, pa, tax, ttr, er, pvc, sato2) VALUES
(1, '2026-01-20 08:45:00', 98, '130/85', 38.5, 38.8, 3, NULL, 92),
(1, '2026-01-20 14:00:00', 92, '125/80', 37.8, 38.0, 2, NULL, 94),
(2, '2026-01-21 10:30:00', 88, '145/90', 36.5, 36.7, 2, NULL, 98),
(3, '2026-01-22 15:00:00', 105, '160/95', 36.2, 36.5, 4, 8, 96),
(4, '2026-01-23 16:35:00', 95, '120/75', 37.2, 37.5, 2, NULL, 99),
(5, '2026-01-24 09:15:00', 102, '140/88', 36.8, 37.0, 3, NULL, 88);

-- 4. Insertar Movilización
INSERT INTO movilizacion_paciente (id_ingreso, actividad, inmovilizacion, fuerza_muscular, sensibilidad, observaciones) VALUES
(1, 'MOVILIZA CON AYUDA', '', 'DISMINUIDA', 'NORMAL', 'Requiere asistencia para movilizarse por debilidad generalizada'),
(2, 'MOVILIZA SOLO', '', 'NORMAL', 'DISMINUIDA', 'Refiere parestesias en extremidades inferiores'),
(3, 'NO SE MOVILIZA', 'TABLA ESPINAL', 'DISMINUIDA', 'NORMAL', 'Paciente en reposo absoluto post IAM'),
(4, 'MOVILIZA CON AYUDA', '', 'NORMAL', 'AUMENTADA', 'Dolor abdominal limita movilización'),
(5, 'MOVILIZA SOLO', '', 'DISMINUIDA', 'NORMAL', 'Presenta fatiga al caminar distancias cortas');

-- 5. Insertar Higiene
INSERT INTO higiene_paciente (id_ingreso, higiene, estado_piel, heridas, caracteristicas_heridas, vendaje_heridas, observaciones) VALUES
(1, 'ASEADO', 'DESHIDRATADA', '', '', 'SIN VENDAJE', 'Piel seca, requiere hidratación'),
(2, 'AUTONOMO', 'INTEGRA/HIDRATADA', '', '', 'SIN VENDAJE', 'Paciente mantiene higiene independiente'),
(3, 'AYUDA TOTAL', 'SUDOROSA', '', '', 'SIN VENDAJE', 'Requiere aseo completo por enfermería'),
(4, 'ASEADO', 'INTEGRA/HIDRATADA', 'OPERATORIA', 'LIMPIA', 'LIMPIO', 'Herida quirúrgica en hipogastrio'),
(5, 'AYUDA PARCIAL', 'INTEGRA/HIDRATADA', '', '', 'SIN VENDAJE', 'Requiere ayuda para higiene corporal');

-- 6. Insertar Seguridad
INSERT INTO seguridad_paciente (id_ingreso, habitos, frecuencia_habitos, alergias, estado_temperancia, vacunas, ant_morbidosos, observaciones) VALUES
(1, 'TABACO', 'FRECUENTE', '', 'SOBRIO', 'TETANOS', 'HTA', 'Fumador de 20 cigarrillos/día por 15 años'),
(2, '', '', 'MEDICAMENTOS', 'SOBRIO', '', 'DM,HTA', 'Alérgica a penicilina'),
(3, 'ALCOHOL,TABACO', 'OCASIONAL', '', 'SOBRIO', 'TETANOS', 'HTA,DM', 'Consumo social de alcohol'),
(4, '', '', 'ALIMENTOS', 'SOBRIO', 'TETANOS', '', 'Alérgica a mariscos'),
(5, 'TABACO', 'FRECUENTE', '', 'SOBRIO', '', 'EPOC,HTA', 'Ex fumador, abandonó hace 2 años');

-- 7. Insertar Termorregulación
INSERT INTO termorregulacion_paciente (id_ingreso, estado_termorregulacion, observaciones) VALUES
(1, 'HIPERTERMICO', 'Fiebre persistente, requiere antipiréticos'),
(2, 'NORMAL', 'Temperatura corporal dentro de rangos normales'),
(3, 'NORMAL', 'Sin alteraciones en termorregulación'),
(4, 'NORMAL', 'Afebril al ingreso'),
(5, 'NORMAL', 'Sin fiebre actual');

-- 8. Insertar Realización Personal
INSERT INTO realizacion_personal_paciente (id_ingreso, situacion_laboral, estado_animico, red_apoyo, acompañamiento, observaciones) VALUES
(1, 'TRABAJA', 'ANSIOSO', 'VIVE CON FAMILIA', 'FAMILIAR', 'Preocupado por ausencia laboral'),
(2, 'TRABAJA', 'TRANQUILO', 'VIVE CON FAMILIA', 'FAMILIAR', 'Buena contención familiar'),
(3, 'JUBILADO', 'TRISTE/DEPRESION', 'VIVE SOLO', 'FAMILIAR', 'Vive solo, hijos visitan ocasionalmente'),
(4, 'TRABAJA', 'ANSIOSO', 'VIVE CON FAMILIA', 'FAMILIAR', 'Primera hospitalización, ansiosa'),
(5, 'INVALIDEZ', 'TRANQUILO', 'VIVE CON FAMILIA', 'CUIDADOR', 'Pensionado por EPOC, esposa es cuidadora principal');

-- 9. Insertar Soluciones Administradas
INSERT INTO soluciones_administradas_paciente (id_ingreso, descripcion) VALUES
(1, 'Suero Fisiológico 0.9% 1000ml + Ceftriaxona 2g EV c/12hrs'),
(2, 'Suero Glucosalino 1000ml + Insulina cristalina según esquema'),
(3, 'Suero Fisiológico 0.9% 500ml + Heparina sódica 5000UI EV c/8hrs'),
(4, 'Suero Ringer Lactato 1000ml'),
(5, 'Suero Fisiológico 0.9% 1000ml + Metilprednisolona 40mg EV c/12hrs');

-- 10. Insertar Procedimientos Administrados
INSERT INTO procedimientos_administrados_paciente (id_ingreso, nombre_procedimiento, fecha_intalacion, observaciones, descripcion) VALUES
(1, 'Vía Venosa Periférica', '2026-01-20 08:35:00', 'Instalada en antebrazo izquierdo', 'Catéter 20G, sin complicaciones'),
(2, 'Control de Glicemia Capilar', '2026-01-21 10:20:00', 'HGT cada 6 horas', 'Glicemia al ingreso: 385 mg/dl'),
(3, 'Monitor Cardíaco Continuo', '2026-01-22 14:50:00', 'Monitorización permanente', 'Ritmo sinusal, sin arritmias'),
(4, 'Sonda Foley', '2026-01-23 16:25:00', 'Instalada previo a cirugía', 'Sonda 16Fr, drenando orina clara'),
(5, 'Oxigenoterapia', '2026-01-24 09:05:00', 'Bigotera 3 lts/min', 'SatO2 objetivo >90%');

-- 11. Insertar Procedimientos al Ingreso
INSERT INTO procedimientos_ingreso_paciente (id_ingreso, monitos_cardiaco, CSV, EXAMEN_FISICO, vvp, vvc, SMPT, sonda_foley, SNG, INTUBACION, VMI_VMNI, hemograma, PBQ_CK, GSA_GSV, HEMOCULTIVO, ECG, RX_TORAX, LINEA_ARTERIAL, ECO, TAC, TT, MMV, HGT) VALUES
(1, TRUE, TRUE, TRUE, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, TRUE, TRUE, FALSE, TRUE, TRUE, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE),
(2, FALSE, TRUE, TRUE, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, TRUE, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, TRUE),
(3, TRUE, TRUE, TRUE, TRUE, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, TRUE, TRUE, TRUE, FALSE, TRUE, TRUE, TRUE, TRUE, FALSE, TRUE, FALSE, FALSE),
(4, TRUE, TRUE, TRUE, TRUE, FALSE, FALSE, TRUE, FALSE, FALSE, FALSE, TRUE, FALSE, FALSE, FALSE, TRUE, TRUE, FALSE, TRUE, FALSE, FALSE, FALSE, FALSE),
(5, TRUE, TRUE, TRUE, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, TRUE, TRUE, TRUE, FALSE, TRUE, TRUE, FALSE, FALSE, FALSE, FALSE, TRUE, FALSE);

-- 12. Insertar Comunicación
INSERT INTO comunicacion_paciente (id_ingreso, conciencia, con_verbal, alt_sensorial, BOCA, pupilas, observaciones) VALUES
(1, 'CONCIENTE', 'COMPLETA COHERENTE', '', 'SANA', 'ISOCORIA,RFM', 'Paciente orientado en tiempo y espacio'),
(2, 'CONCIENTE', 'COMPLETA COHERENTE', 'VISUAL,LENTES', 'CON LESIONES', 'ISOCORIA,RFM', 'Usa lentes para visión lejana, presenta aftas bucales'),
(3, 'LETARGICO', 'PARCIAL', 'AUDITIVA', 'EDENTADO', 'ISOCORIA,RFM', 'Hipoacusia bilateral, usa prótesis dental'),
(4, 'CONCIENTE', 'COMPLETA COHERENTE', '', 'SANA', 'ISOCORIA,RFM', 'Alerta y colaboradora'),
(5, 'CONCIENTE', 'COMPLETA COHERENTE', '', 'PROTESIS', 'ISOCORIA,RFM', 'Usa prótesis dental superior');

-- 13. Insertar Oxigenación
INSERT INTO oxigenacion_paciente (id_ingreso, via_aeria, respiracion, oxigenoterapia, tos, color_piel, secrecion, observaciones) VALUES
(1, 'SECRECIONES', 'POLIPNEA', 'BIGOTERA', 'PRODUCTIVA', 'PALIDA', 'PURULENTA,ABUNDANTE', 'Requiere aspiración de secreciones frecuente'),
(2, 'PERMEABLE', 'NORMAL', '', 'AUSENTE', 'ROSADA', '', 'Sin requerimientos de oxígeno'),
(3, 'PERMEABLE', 'NORMAL', 'BIGOTERA', 'AUSENTE', 'PALIDA', '', 'O2 2 lts/min por protocolo'),
(4, 'PERMEABLE', 'NORMAL', '', 'AUSENTE', 'ROSADA', '', 'Función respiratoria normal'),
(5, 'SECRECIONES', 'DISNEA', 'MMV', 'PRODUCTIVA', 'CINOTICA', 'MUCOSA,REGULAR', 'Disnea de medianos esfuerzos, requiere nebulizaciones');

-- 14. Insertar Nutrición e Hidratación
INSERT INTO nutricion_hidratacion_paciente (id_ingreso, estado_nutricional, alimentacion, apetito, piel_mucosas, abdomen, otra, observaciones) VALUES
(1, 'NORMAL', 'CON AYUDA', 'REGULAR', 'DESHIDRATADA', 'BLANDO,DEPRESIBLE', '', 'Dieta blanda, buena tolerancia'),
(2, 'OBESO', 'SOLO', 'BUENO', 'HIDRATADA', 'BLANDO,DEPRESIBLE', '', 'Dieta para diabético, 1800 calorías'),
(3, 'NORMAL', 'NO SE ALIMENTA', 'MALO', 'HIDRATADA', 'BLANDO,DEPRESIBLE', '', 'Reposo digestivo por 24 horas'),
(4, 'NORMAL', 'NAUSEAS', 'MALO', 'HIDRATADA', 'DOLOROSO,DISTENDIDO', '', 'Náuseas persistentes, dieta suspendida'),
(5, 'ENFLAQUECIDO', 'CON AYUDA', 'REGULAR', 'DESHIDRATADA', 'BLANDO,DEPRESIBLE', '', 'Pérdida de peso progresiva, suplementación nutricional');

-- 15. Insertar Eliminación
INSERT INTO eliminacion_paciente (id_ingreso, intestinal, urinaria, patron_sueno, vestrise_desvestrise, aprendizaje, observaciones) VALUES
(1, '', '', 'DISCONTINUO', 'AYUDA PARCIAL', 'TELEVISION', 'Dificultad para conciliar el sueño en ambiente hospitalario'),
(2, 'ESTREÑIMIENTO', '', 'NORMAL', 'AUTONOMO', 'LECTURA', 'Sin evacuación hace 3 días'),
(3, '', 'SONDA FOLEY', 'MEDICACION', 'AYUDA TOTAL', 'TELEVISION', 'Sedación leve, requiere asistencia total'),
(4, '', 'DISURIA', 'DISCONTINUO', 'AUTONOMO', 'TELEVISION', 'Molestias al orinar'),
(5, '', '', 'INSOMNIO', 'AYUDA PARCIAL', 'LECTURA', 'Insomnio de conciliación');

-- 16. Insertar Creencias y Valores
INSERT INTO creencias_valores_paciente (id_ingreso, solicita_servicios_religiosos, observaciones) VALUES
(1, FALSE, 'Sin solicitudes especiales'),
(2, TRUE, 'Solicita visita de capellán católico'),
(3, FALSE, ''),
(4, FALSE, 'Sin creencias religiosas específicas'),
(5, TRUE, 'Practica religión evangélica, solicita visita pastoral');