
const cargarIngresos = async () => {
    try {
        let { response } = await tx.request({
            method : "GET",
            url    : "/ingresos",
            headers: {
                "Content-Type": "application/json"
            },
            params : {}
        });

        let columns = [
            { title: "Accionres", data: null, render: function (data, type, row) {
                return `
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary" onclick="verIngreso(${row.id_ingreso})" title="Edit">
                        <span class="material-symbols-outlined" style="font-size: 16px;">edit</span>
                        </button>
                        <button class="btn btn-outline-secondary" onclick="verIngresoPDF(${row.id_ingreso})"  title="PDF">
                        <span class="material-symbols-outlined" style="font-size: 16px;">picture_as_pdf</span>
                        </button>
                        <button class="btn btn-outline-danger" onclick="eliminarIngreso(${row.id_ingreso})" title="Delete">
                        <span class="material-symbols-outlined" style="font-size: 16px;">delete</span>
                        </button>
                    </div>
                
                `;
            }},
             { title: "Paciente", data: null, render: function (data, type, row) {
                return `<div class="d-flex align-items-center">
                            <div class="patient-avatar text-white me-3" style="background-color: ${generarColorAvatar(row.nombre)}">${obtenerIniciales(row.nombre)}</div>
                            <div>
                                <div class="fw-semibold">${row.nombre}</div>
                                <div class="text-muted small">${row.genero}, ${row.edad} </div>
                            </div>
                        </div>`
                // return `${row.nombres} ${row.apellido_paterno} ${row.apellido_materno}`;
            }},
             
            { title: "ID Ingreso", data: "id_ingreso" },
            { title: "Fecha de Ingreso", data: "fecha_ingreso" },
            { title: "RUT Paciente", data: "RUN" },
            { title : "Ficha Clinica", data: "ficha_clinica" },
            { title : "Procedentablecia", data: "procedencia" },
            { title: "Diagnóstico", data: "diagnostico" }
        ];

        tablaInit({ columnas: columns, datos: response , idContenedor: "patientsTableDiv" });

    } catch (error) {
        console.error("Error al cargar los ingresos:", error);
    }
}   


const tablaInit = (data) => {
    let { columnas, datos, idContenedor } = data;
    let config = {
        'lengthMenu': [[10, 25, 50, 100, -1], [10, 25, 50, 100, 'Todos']],
        'dom': 'lBfrtip',
        'columns': columnas,
        'data': datos,
        'language':{
            "sProcessing":     "Procesando...",
            "sLengthMenu":     "Mostrar _MENU_ registros",
            "sZeroRecords":    "No se encontraron resultados",
            "sEmptyTable":     "Ningún dato disponible en esta tabla",
            "sInfo":           "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
            "sInfoEmpty":      "Mostrando registros del 0 al 0 de un total de 0 registros",
            "sInfoFiltered":   "(filtrado de un total de _MAX_ registros)",
            "sInfoPostFix":    "",
            "sSearch":         "Buscar:",
            "sUrl":            "",
            "sInfoThousands":  ",",
            "sLoadingRecords": "Cargando...",
            "oPaginate": {
            "sFirst":    "Primero",
            "sLast":     "Último",
            "sNext":     "Siguiente",
            "sPrevious": "Anterior"
            },
            "oAria": {
            "sSortAscending":  ": Activar para ordenar la columna de manera ascendente",
            "sSortDescending": ": Activar para ordenar la columna de manera descendente"
            }
        }
        
    }


    $(`#${idContenedor}`).html("");
    var tabla = $('<table />', 
            {'class':'table table-striped table-bordered table-hover nowrap'})
        .appendTo( $(`#${idContenedor}`))
        .DataTable(config);
        $($(`#${idContenedor}`)).add('.dataTable').wrap('<div class="dataTables_scroll" />');
        return tabla;



}

const tx = {
    strQuery: (params) => {
        let esc = encodeURIComponent;
        let query = Object.keys(params)
            .map(k => esc(k) + '=' + esc(params[k]))
            .join('&');
        return query;
    }, 
    request : async (data) => {
        let { method, headers, url, body, params } = data;

        let config = {
            headers : headers,
            mode  : 'cors',
            cache : 'no-cache',
            method  : data.method
        }

        if (method == "GET") {
            let param = tx.strQuery(params);
            url = `${url}?${param}`;
        } else if (method == "POST") {
            
            config["body"] = JSON.stringify(body);
        }

        let consulta = await fetch(url, config);
        let response = await consulta.json();
        let status = consulta.status;

        if (status < 200 || status > 299) {
            console.error(consulta);
            throw new Error("Problemas de comunicación con el servidor");
        }

        return {response, status};
    }

}

const obtenerIniciales = (str) => {
    if (!str || str.length < 1) return '';
    let first = str.charAt(0).toUpperCase();
    let second = str.length > 1 ? str.charAt(1).toLowerCase() : '';
    return first + second;
}

const generarColorAvatar = (str) => {
    if (!str) return '#007bff'; // Color por defecto (primary)
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    let hue = Math.abs(hash) % 360;
    return `hsl(${hue}, 70%, 50%)`;
}





const abrirModalAgregarIngreso = async (id) => {
    // Cargar formulario vacío en el modal
    let html = `
        <form>
            <div class="card shadow-sm">
                <div class="card-header">
                    <div class="card-title">
                        <div class="section-icon-bg bg-light text-secondary">
                            <span class="material-symbols-outlined">person</span>
                        </div>
                        Identificación del Paciente
                    </div>
                </div>
                <div class="card-body p-3">
                    <div class="row g-2 high-density-row">
                        <div class="col-md-4">
                            <label class="form-label">Nombre Completo</label>
                            <input class="form-control" placeholder="Nombres y Apellidos" type="text" />
                        </div>
                        <div class="col-md-2">
                            <label class="form-label">RUT / ID</label>
                            <input class="form-control" placeholder="12.345.678-9" type="text" />
                        </div>
                        <div class="col-md-1">
                            <label class="form-label">Edad</label>
                            <input class="form-control" type="number" />
                        </div>
                        <div class="col-md-2">
                            <label class="form-label">Fecha Ingreso</label>
                            <input class="form-control" type="date" />
                        </div>
                        <div class="col-md-1">
                            <label class="form-label">Hora</label>
                            <input class="form-control" type="time" />
                        </div>
                        <div class="col-md-2">
                            <label class="form-label">N° Ficha</label>
                            <input class="form-control" type="text" />
                        </div>
                        <div class="col-md-3">
                            <label class="form-label">Procedencia</label>
                            <select class="form-select">
                                <option disabled="" selected="">Seleccione...</option>
                                <option>Urgencias</option>
                                <option>Consultorio/Policlínico</option>
                                <option>Traslado Externo</option>
                                <option>Domicilio</option>
                            </select>
                        </div>
                        <div class="col-md-9">
                            <label class="form-label">Diagnóstico Médico de Ingreso</label>
                            <input class="form-control" placeholder="Diagnóstico principal y secundarios" type="text" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="card shadow-sm">
                <div class="card-header">
                    <div class="card-title">
                        <div class="section-icon-bg bg-light text-secondary">
                            <span class="material-symbols-outlined">vital_signs</span>
                        </div>
                        Signos Vitales y Examen Físico General
                    </div>
                </div>
                <div class="card-body p-3">
                    <div class="table-responsive mb-3">
                        <table class="table table-bordered align-middle text-center table-vitals mb-0">
                            <thead>
                                <tr>
                                    <th>FC <small class="d-block text-muted">lpm</small></th>
                                    <th>FR <small class="d-block text-muted">rpm</small></th>
                                    <th>PA <small class="d-block text-muted">mmHg</small></th>
                                    <th>T° AX <small class="d-block text-muted">°C</small></th>
                                    <th>SAT O2 <small class="d-block text-muted">%</small></th>
                                    <th>FiO2 <small class="d-block text-muted">%</small></th>
                                    <th>HGT <small class="d-block text-muted">mg/dL</small></th>
                                    <th>EVA <small class="d-block text-muted">0-10</small></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><input class="form-control form-control-sm border-0 text-center" type="text" />
                                    </td>
                                    <td><input class="form-control form-control-sm border-0 text-center" type="text" />
                                    </td>
                                    <td><input class="form-control form-control-sm border-0 text-center"
                                            placeholder="120/80" type="text" /></td>
                                    <td><input class="form-control form-control-sm border-0 text-center" type="text" />
                                    </td>
                                    <td><input class="form-control form-control-sm border-0 text-center" type="text" />
                                    </td>
                                    <td><input class="form-control form-control-sm border-0 text-center"
                                            placeholder="21%" type="text" /></td>
                                    <td><input class="form-control form-control-sm border-0 text-center" type="text" />
                                    </td>
                                    <td><input class="form-control form-control-sm border-0 text-center" type="text" />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="row g-2">
                        <div class="col-md-2">
                            <label class="form-label">Peso (Kg)</label>
                            <input class="form-control" step="0.1" type="number" />
                        </div>
                        <div class="col-md-2">
                            <label class="form-label">Talla (cm)</label>
                            <input class="form-control" type="number" />
                        </div>
                        <div class="col-md-2">
                            <label class="form-label">IMC</label>
                            <input class="form-control bg-light" readonly="" type="text" />
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">Estado de Conciencia (GCS)</label>
                            <div class="input-group">
                                <span class="input-group-text bg-white small">Puntos:</span>
                                <input class="form-control" placeholder="15" type="number" />
                                <input class="form-control w-50" placeholder="Observaciones de conciencia"
                                    type="text" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card shadow-sm">
                <div class="card-header">
                    <div class="card-title">
                        <div class="section-icon-bg bg-light text-secondary">
                            <span class="material-symbols-outlined">fact_check</span>
                        </div>
                        Valoración Integral de Enfermería
                    </div>
                </div>
                <div class="card-body p-3">
                    <div class="mb-4">
                        <h6 class="sub-section-title">Actividad y Reposo</h6>
                        <div class="row g-3">
                            <div class="col-md-4">
                                <label class="form-label">Patrón de Sueño</label>
                                <select class="form-select">
                                    <option>Normal / Reparador</option>
                                    <option>Insomnio</option>
                                    <option>Fragmentado</option>
                                    <option>Usa fármacos para dormir</option>
                                </select>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Movilidad Física</label>
                                <select class="form-select">
                                    <option>Autónomo</option>
                                    <option>Requiere ayuda (Bastón/Andador)</option>
                                    <option>Silla de Ruedas</option>
                                    <option>Postrado</option>
                                </select>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Capacidad de Autocuidado (Índice Barthel)</label>
                                <input class="form-control" placeholder="Puntaje / Clasificación" type="text" />
                            </div>
                            <div class="col-12">
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" id="act1" type="checkbox" />
                                    <label class="form-check-label small" for="act1">Disnea de esfuerzo</label>
                                </div>
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" id="act2" type="checkbox" />
                                    <label class="form-check-label small" for="act2">Fatiga crónica</label>
                                </div>
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" id="act3" type="checkbox" />
                                    <label class="form-check-label small" for="act3">Contracturas/Atrofia</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr class="my-3 opacity-10" />
                    <div class="mb-4">
                        <h6 class="sub-section-title">Percepción y Cognición</h6>
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label">Estado Sensorial</label>
                                <div class="d-flex gap-3">
                                    <div class="form-check">
                                        <input class="form-check-input" id="sens1" type="checkbox" />
                                        <label class="form-check-label small" for="sens1">Déficit Visual
                                            (Lentes)</label>
                                    </div>
                                    <div class="form-check">
                                        <input class="form-check-input" id="sens2" type="checkbox" />
                                        <label class="form-check-label small" for="sens2">Déficit Auditivo
                                            (Audífono)</label>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Orientación</label>
                                <div class="d-flex gap-2">
                                    <div class="form-check">
                                        <input checked="" class="form-check-input" type="checkbox" />
                                        <label class="form-check-label small">Tiempo</label>
                                    </div>
                                    <div class="form-check">
                                        <input checked="" class="form-check-input" type="checkbox" />
                                        <label class="form-check-label small">Espacio</label>
                                    </div>
                                    <div class="form-check">
                                        <input checked="" class="form-check-input" type="checkbox" />
                                        <label class="form-check-label small">Persona</label>
                                    </div>
                                </div>
                            </div>
                            <div class="col-12">
                                <label class="form-label">Observaciones Cognitivas (Confusión, Memoria,
                                    Lenguaje)</label>
                                <textarea class="form-control" rows="1"></textarea>
                            </div>
                        </div>
                    </div>
                    <hr class="my-3 opacity-10" />
                    <div class="mb-4">
                        <h6 class="sub-section-title">Autocuidado y Eliminación</h6>
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label">Eliminación Urinaria</label>
                                <select class="form-select mb-2">
                                    <option>Espontánea</option>
                                    <option>Incontinencia</option>
                                    <option>Retención</option>
                                    <option>Disuria</option>
                                    <option>Sonda Folley / Talla Vesical</option>
                                </select>
                                <input class="form-control form-control-sm" placeholder="Características de la orina"
                                    type="text" />
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Eliminación Intestinal</label>
                                <select class="form-select mb-2">
                                    <option>Normal</option>
                                    <option>Estreñimiento</option>
                                    <option>Diarrea</option>
                                    <option>Ostomía</option>
                                </select>
                                <input class="form-control form-control-sm" placeholder="Frecuencia y consistencia"
                                    type="text" />
                            </div>
                        </div>
                    </div>
                    <hr class="my-3 opacity-10" />
                    <div class="mb-4">
                        <h6 class="sub-section-title">Sexualidad y Reproducción</h6>
                        <div class="row g-3">
                            <div class="col-md-4">
                                <label class="form-label">FUR (Mujeres)</label>
                                <input class="form-control" type="date" />
                            </div>
                            <div class="col-md-8">
                                <label class="form-label">Problemas o inquietudes expresadas</label>
                                <input class="form-control" placeholder="Disfunción, menopausia, etc." type="text" />
                            </div>
                        </div>
                    </div>
                    <hr class="my-3 opacity-10" />
                    <div class="mb-4">
                        <h6 class="sub-section-title">Afrontamiento y Tolerancia al Estrés</h6>
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label">Reacción frente a la hospitalización</label>
                                <select class="form-select">
                                    <option>Tranquilo / Colaborador</option>
                                    <option>Ansioso / Angustiado</option>
                                    <option>Agresivo / Hostil</option>
                                    <option>Indiferente / Retraído</option>
                                </select>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Red de Apoyo Familiar</label>
                                <select class="form-select">
                                    <option>Presente y Activa</option>
                                    <option>Presente pero limitada</option>
                                    <option>Ausente / Abandono</option>
                                </select>
                            </div>
                            <div class="col-12">
                                <label class="form-label">Principales Temores / Preocupaciones</label>
                                <input class="form-control" type="text" />
                            </div>
                        </div>
                    </div>
                    <hr class="my-3 opacity-10" />
                    <div>
                        <h6 class="sub-section-title">Seguridad y Protección</h6>
                        <div class="row g-3">
                            <div class="col-md-4">
                                <label class="form-label">Puntaje Riesgo Caídas (Downton)</label>
                                <input class="form-control" placeholder="Ej: 3 (Alto Riesgo)" type="number" />
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Puntaje Riesgo UPP (Braden)</label>
                                <input class="form-control" placeholder="Ej: 14 (Riesgo Moderado)" type="number" />
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Integridad de la Piel</label>
                                <select class="form-select">
                                    <option>Intacta</option>
                                    <option>Lesionada (Especifique en observaciones)</option>
                                    <option>Equimosis / Hematomas</option>
                                </select>
                            </div>
                            <div class="col-12">
                                <label class="form-label">Alergias Conocidas</label>
                                <input class="form-control border-danger"
                                    placeholder="Medicamentos, Alimentos, Látex, etc." type="text" />
                            </div>
                            <div class="col-12">
                                <label class="form-label">Vías Invasivas al Ingreso</label>
                                <div class="p-2 border rounded bg-light">
                                    <div class="form-check form-check-inline">
                                        <input class="form-check-input" id="via1" type="checkbox" />
                                        <label class="form-check-label small" for="via1">VVP</label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input class="form-check-input" id="via2" type="checkbox" />
                                        <label class="form-check-label small" for="via2">CVC</label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input class="form-check-input" id="via3" type="checkbox" />
                                        <label class="form-check-label small" for="via3">SNG/SNY</label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input class="form-check-input" id="via4" type="checkbox" />
                                        <label class="form-check-label small" for="via4">Drenajes</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card shadow-sm border-primary">
                <div class="card-header bg-light">
                    <div class="card-title text-secondary">
                        <span class="material-symbols-outlined">how_to_reg</span>
                        Cierre de Registro - Profesional Responsable
                    </div>
                </div>
                <div class="card-body p-3">
                    <div class="row g-3">
                        <div class="col-md-5">
                            <label class="form-label">Nombre del Enfermero(a) que recibe</label>
                            <input class="form-control" placeholder="Nombre completo" type="text" />
                        </div>
                        <div class="col-md-3">
                            <label class="form-label">RUT / Registro SIS</label>
                            <input class="form-control" type="text" />
                        </div>
                        <div class="col-md-2">
                            <label class="form-label">Fecha Término</label>
                            <input class="form-control" type="date" />
                        </div>
                        <div class="col-md-2">
                            <label class="form-label">Hora Término</label>
                            <input class="form-control" type="time" />
                        </div>
                        <div class="col-12">
                            <label class="form-label">Observaciones Finales / Pendientes</label>
                            <textarea class="form-control"
                                placeholder="Información relevante para la entrega de turno..." rows="2"></textarea>
                        </div>
                    </div>
                </div>
            </div>
            <div class="sticky-bottom-bar">
                <div class="container d-flex flex-column flex-sm-row justify-content-end gap-3 px-4">
                    <button
                        class="btn btn-outline-secondary px-4 d-flex align-items-center justify-content-center gap-2"
                        type="button">
                        <span class="material-symbols-outlined">cancel</span>
                        Cancelar Ingreso
                    </button>
                    <button class="btn btn-success px-5 d-flex align-items-center justify-content-center gap-2 fw-bold"
                        type="submit">
                        <span class="material-symbols-outlined">save</span>
                        Guardar y Finalizar Admisión
                    </button>
                </div>
            </div>
        </form>
    `;

    // Establecer el contenido en el modal
    document.getElementById('ingresoModalBody').innerHTML = html;

    // Mostrar el modal
    let modal = new bootstrap.Modal(document.getElementById('ingresoModal'));
    modal.show();
}

const verIngreso = abrirModalAgregarIngreso;
