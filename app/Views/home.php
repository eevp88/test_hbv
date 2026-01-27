<?php ob_start(); ?>


<div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
    <div>
        <h1 class="h3 fw-bold mb-1">Gestión de Admisión de Pacientes</h1>
        <p class="text-muted mb-0">Panel centralizado para admisiones.</p>
    </div>
    <div>
        <button class="btn btn-primary d-inline-flex align-items-center gap-2 px-4 py-2" onclick="abrirModalAgregarIngreso()">
            <span class="material-symbols-outlined">person_add</span>
            <span>
                Agregar Paciente
            </span>
        </button>
    </div>
</div>
<section class="card shadow-sm border-0">
    <div class="card-body p-4 table-responsive" id="patientsTableDiv">
    </div>
</section>

<div class="modal fade" id="ingresoModal" tabindex="-1" aria-labelledby="ingresoModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="ingresoModalLabel">Detalles del Ingreso</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body" id="ingresoModalBody">
                <!-- Contenido dinámico -->
            </div>
             <div class="modal-footer">
                
                <div class="container d-flex flex-column flex-sm-row justify-content-end gap-3 px-4">
                    <button
                        class="btn btn-outline-secondary px-4 d-flex align-items-center justify-content-center gap-2"
                        type="button">
                        <span class="material-symbols-outlined">cancel</span>
                        Cancelar Ingreso
                    </button>
                    <button class="btn btn-success px-5 d-flex align-items-center justify-content-center gap-2 fw-bold"
                        type="submit"
                        onclick="guardarIngreso()">
                        <span class="material-symbols-outlined">save</span>
                        Guardar y Finalizar Admisión
                    </button>
                </div>
            </div>
        </div>
    </div>




</div>

<script>
    document.addEventListener('DOMContentLoaded', function () {
        soloNumero();
       cargarIngresos();
    });
</script>
<?php
$content = ob_get_clean();
require __DIR__ . '/layouts/main.php';