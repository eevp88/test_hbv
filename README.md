# Sistema de Gestión de Ingresos de Pacientes

Un sistema web para la gestión de ingresos de pacientes en el servicio de medicina de un hospital. Desarrollado con PHP, con base de datos MySQL y interfaz moderna con Bootstrap 5.

## 🚀 Características

- **Gestión de Ingresos**: Registro y consulta de ingresos de pacientes
- **API REST**: Endpoints para integración con otros sistemas
- **Interfaz Moderna**: Dashboard responsivo con Bootstrap 5 y Material Symbols
- **Base de Datos**: MySQL con estructura optimizada para datos médicos
- **Arquitectura MVC**: Separación clara de responsabilidades
-

## 🛠️ Tecnologías Utilizadas

- **Backend**: PHP 8.1+
- **Base de Datos**: MySQL 8.0
- **Frontend**: HTML5, CSS3, JavaScript
- **Framework CSS**: Bootstrap 5.3
- **Iconos**: Material Symbols

## 📋 Requisitos

- PHP 8.1+ con extensiones PDO 
- MySQL 8.0+
- Git

## 🚀 Instalación y Configuración

### 1. Clonar el Repositorio

```bash
git clone <url-del-repositorio>
cd test_hbv
```

### 2. Configurar la Base de Datos

Asegúrate de que MySQL esté corriendo localmente. Ejecuta el script de base de datos:

```bash
mysql -u root -p < db.sql
```

### 3. Configurar Usuarios de Base de Datos

Crea el usuario de la aplicación en MySQL:

```bash
mysql -u root -p -e "
CREATE DATABASE IF NOT EXISTS ingreso_pacientes_db;
CREATE USER 'ingreso_user'@'localhost' IDENTIFIED BY 'ingreso_pass';
GRANT ALL PRIVILEGES ON ingreso_pacientes_db.* TO 'ingreso_user'@'localhost';
FLUSH PRIVILEGES;
"
```


## 📁 Estructura del Proyecto

```
test_hbv/
├── app/                          # Código de la aplicación
│   ├── Bootstrap/
│   │   └── app.php              # Inicialización de la aplicación
│   ├── Controllers/             # Controladores MVC
│   │   ├── Api/
│   │   │   └── IngresoController.php
│   │   └── Web/
│   │       └── HomeController.php
│   ├── Core/                    # Núcleo del framework
│   │   ├── Database.php         # Conexión a base de datos
│   │   ├── Request.php          # Manejo de peticiones HTTP
│   │   ├── Response.php         # Manejo de respuestas HTTP
│   │   └── Router.php           # Enrutamiento
│   ├── Repositories/            # Capa de acceso a datos
│   │   └── IngresoRepository.php
│   ├── Services/                # Lógica de negocio
│   │   └── IngresoService.php
│   ├── Views/                   # Plantillas de vista
│   │   ├── home.php
│   │   └── layouts/
│   │       └── main.php
│   └── routes/                  # Definición de rutas
│        └── routes.php
├── public/                      # Archivos públicos
│   ├── index.php               # Punto de entrada
│   └── assets/                 # CSS, JS, imágenes
│       ├── css/
│       ├── js/
│       └── fonts/
├── db.sql                      # Script de base de datos
└── README.md                   # Este archivo
```

## 🔌 Endpoints de la API

### Ingresos de Pacientes

- **GET /ingresos**: Lista todos los ingresos
- **GET /ingresos/{id}**: Obtiene un ingreso específico
- **POST /ingresos/** : Crea un ingreso



## 🎨 Interfaz de Usuario

La aplicación incluye:

- **Vista de Ingresos**: Tabla interactiva con filtros y paginación


## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo `LICENSE` para más detalles.

## TODO

- validaciones de datos en js y php
- corecciones de intefaz grafica formulario
