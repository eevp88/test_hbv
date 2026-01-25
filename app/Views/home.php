<?php ob_start(); ?>


<div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
    <div>
        <h1 class="h3 fw-bold mb-1">Gestión de Admisión de Pacientes</h1>
        <p class="text-muted mb-0">Panel centralizado para admisiones.</p>
    </div>
    <div>
        <button class="btn btn-primary d-inline-flex align-items-center gap-2 px-4 py-2">
            <span class="material-symbols-outlined">person_add</span>
            <span>
                Agregar Paciente
            </span>
        </button>
    </div>
</div>
<section class="card shadow-sm border-0">
    <div class="card-body p-4">
        <table id="patientsTable" class="table table-striped" style="width:100%">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Edad</th>
                    <th>Género</th>
                    <th>Fecha de Admisión</th>
                    <th>Estado</th>
                </tr>
            </thead>
            <tbody>
                <!-- Aquí se llenarán los datos dinámicamente -->
            </tbody>
        </table>
    </div>
</section>
<?php
$content = ob_get_clean();
require __DIR__ . '/layouts/main.php';