# Sistema de Gestión de Ingresos de Pacientes

Un sistema web para la gestión de ingresos de pacientes en el servicio de medicina de un hospital. Desarrollado con PHP, con base de datos MySQL y interfaz moderna con Bootstrap 5.

## 🚀 Características

- **Gestión de Ingresos**: Registro y consulta de ingresos de pacientes
- **API REST**: Endpoints para integración con otros sistemas
- **Interfaz Moderna**: Dashboard responsivo con Bootstrap 5 y Material Symbols
- **Base de Datos**: MySQL con estructura optimizada para datos médicos
- **Arquitectura MVC**: Separación clara de responsabilidades
- **Autenticación**: Sistema de usuarios con permisos

## 🛠️ Tecnologías Utilizadas

- **Backend**: PHP 8.1+
- **Base de Datos**: MySQL 8.0
- **Frontend**: HTML5, CSS3, JavaScript
- **Framework CSS**: Bootstrap 5.3
- **Iconos**: Material Symbols

## 📋 Requisitos

- PHP 8.1+ con extensiones PDO y MySQLi
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

### 4. Configurar Usuarios de Base de Datos

Crea el usuario de la aplicación en MySQL:

```bash
mysql -u root -p -e "
CREATE DATABASE IF NOT EXISTS ingreso_pacientes_db;
CREATE USER 'ingreso_user'@'localhost' IDENTIFIED BY 'ingreso_pass';
GRANT ALL PRIVILEGES ON ingreso_pacientes_db.* TO 'ingreso_user'@'localhost';
FLUSH PRIVILEGES;
"
```

### 5. Iniciar el Servidor de Desarrollo

```bash
# Desde el directorio public/
cd public
php -S localhost:8000
```

### 6. Verificar la Instalación

```bash
# Probar la conexión a la aplicación
curl http://localhost:8000/

# Probar la API
curl http://localhost:8000/ingresos
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
│       ├── api.php
│       ├── routes.php
│       └── web.php
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

### Ejemplos de Uso

```bash
# Obtener todos los ingresos
curl http://localhost:8000/ingresos

# Obtener un ingreso específico
curl http://localhost:8000/ingresos/1
```

### Respuesta de Ejemplo

```json
[
  {
    "id_ingreso": 1,
    "id_paciente": 1,
    "hospital_nombre": "HOSPITAL BASE VALDIVIA",
    "diagnostico": "Neumonía adquirida en la comunidad",
    "fecha_ingreso": "2026-01-20 08:30:00",
    "enfermero_nombre": "Rosa Martínez",
    "pertenencias": "Reloj, billetera, celular"
  }
]
```

## 🎨 Interfaz de Usuario

La aplicación incluye un dashboard moderno con:

- **Vista de Ingresos**: Tabla interactiva con filtros y paginación
- **Estadísticas**: Métricas en tiempo real (pacientes del día, camas disponibles, etc.)
- **Navegación**: Menú lateral con secciones de Dashboard, Admissions y Reports
- **Responsive**: Diseño adaptativo para móviles y tablets

## 🔧 Desarrollo

### Ejecutar en Modo Desarrollo

```bash
# Iniciar el servidor PHP built-in
cd public
php -S localhost:8000

# O en background
php -S localhost:8000 &
```

### Ejecutar Pruebas

```bash
# Verificar sintaxis PHP
php -l app/Core/Database.php

# Probar conexión a BD
php -r "require 'app/Core/Database.php'; echo \Core\Database::connection() ? 'OK' : 'ERROR';"
```

### Monitoreo y Logs

```bash
# Ver logs de errores de PHP
tail -f /var/log/php/error.log

# Ver logs de MySQL
tail -f /var/log/mysql/error.log

# O verificar estado de MySQL
sudo systemctl status mysql
```

## 🤝 Contribución

1. Haz un fork del proyecto
2. Crea una rama para tu funcionalidad (`git checkout -b feature/nueva-funcionalidad`)
3. Confirma tus cambios (`git commit -am 'Agrega nueva funcionalidad'`)
4. Sube a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo `LICENSE` para más detalles.

## 📞 Soporte

Para soporte técnico o preguntas:
- Email: soporte@hospitalmedicine.cl
- Documentación: [Wiki del Proyecto](https://github.com/usuario/test_hbv/wiki)

---

**Servicio de Medicina Hospitalaria** - Sistema de Control de Ingresos
