
const cargarIngresos = async () => {
    try {
        let { response } = await tx.request({
            method: "GET",
            url: "/ingresos",
            headers: {
                "Content-Type": "application/json"
            },
            params: {}
        });

        let columns = [
            {
                title: "Acciones", data: null, render: function (data, type, row) {
                    return `
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary" onclick="abrirModalAgregarIngreso(${row.id_ingreso})" title="Edit">
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
                }
            },
            {
                title: "Paciente", data: null, render: function (data, type, row) {
                    return `<div class="d-flex align-items-center">
                            <div class="patient-avatar text-white me-3" style="background-color: ${generarColorAvatar(row.nombre)}">${obtenerIniciales(row.nombre)}</div>
                            <div>
                                <div class="fw-semibold">${row.nombre}</div>
                                <div class="text-muted small">${row.genero}, ${row.edad} </div>
                            </div>
                        </div>`
                    // return `${row.nombres} ${row.apellido_paterno} ${row.apellido_materno}`;
                }
            },

            { title: "ID Ingreso", data: "id_ingreso" },
            { title: "Fecha de Ingreso", data: "fecha_ingreso" },
            { title: "RUT Paciente", data: "run" },
            { title: "Ficha Clinica", data: "ficha_clinica" },
            { title: "Procedentablecia", data: "procedencia" },
            { title: "Diagnóstico", data: "diagnostico" }
        ];

        tablaInit({ columnas: columns, datos: response, idContenedor: "patientsTableDiv" });

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
        'language': {
            "sProcessing": "Procesando...",
            "sLengthMenu": "Mostrar _MENU_ registros",
            "sZeroRecords": "No se encontraron resultados",
            "sEmptyTable": "Ningún dato disponible en esta tabla",
            "sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
            "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
            "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
            "sInfoPostFix": "",
            "sSearch": "Buscar:",
            "sUrl": "",
            "sInfoThousands": ",",
            "sLoadingRecords": "Cargando...",
            "oPaginate": {
                "sFirst": "Primero",
                "sLast": "Último",
                "sNext": "Siguiente",
                "sPrevious": "Anterior"
            },
            "oAria": {
                "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
                "sSortDescending": ": Activar para ordenar la columna de manera descendente"
            }
        }

    }


    $(`#${idContenedor}`).html("");
    var tabla = $('<table />',
        { 'class': 'table table-striped table-bordered table-hover nowrap' })
        .appendTo($(`#${idContenedor}`))
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
    request: async (data) => {
        let { method, headers, url, body, params } = data;

        let config = {
            headers: headers,
            mode: 'cors',
            cache: 'no-cache',
            method: data.method
        }

        if (method == "GET") {
            let param = tx.strQuery(params);
            url = `${url}?${param}`;
        } else if (method == "POST") {
            config["body"] = JSON.stringify(body);
        } else if (method == "PUT") {
            config["body"] = JSON.stringify(body);
        } else if (method == "DELETE") {
            let param = tx.strQuery(params);
            url = `${url}?${param}`;
        }

        let consulta = await fetch(url, config);
        let response = await consulta.json();
        let status = consulta.status;

        if (status < 200 || status > 299) {
            console.error(consulta);
            throw new Error("Problemas de comunicación con el servidor");
        }

        return { response, status };
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

const toggleCheckbox = (checkboxId) => {
    const checkbox = document.getElementById(checkboxId);
    checkbox.checked = !checkbox.checked;
}

const soloNumero = () => {
    const modal = document.getElementById('ingresoModal');
    modal.addEventListener('input', (event) => {
        const input = event.target;
        if (!input.classList.contains('solo-numero')) return;

        let val = input.value.trim();

        // 1️Normalizar separador decimal: ',' -> '.'
        val = val.replace(',', '.');

        // 2️Excepción "x/y" (presión arterial)
        const regexFraccion = /^\d{1,3}\/\d{1,3}$/;
        if (regexFraccion.test(val)) {
            input.value = val;
            return;
        }

        // 3️Leer límites configurables
        let maxEnteros = parseInt(input.getAttribute('max-dig')) || 4;
        let maxDecimales = parseInt(input.getAttribute('dec-dig')) || 2;

        // 4️Eliminar caracteres inválidos
        val = val.replace(/[^0-9.-]/g, '');

        // 5 Mantener solo un signo negativo al inicio
        val = val.replace(/(?!^)-/g, '');

        // 6️ Separar parte entera y decimal
        let [entera, decimal] = val.split('.');
        if (!decimal) decimal = '';

        // 7️ Limitar decimales
        decimal = decimal.slice(0, maxDecimales);

        // 8️ Limitar enteros
        entera = entera.slice(0, maxEnteros);

        // 9️ Reconstruir valor normalizado
        val = decimal.length > 0 ? entera + '.' + decimal : entera;

        input.value = val;
    });
}



const abrirModalAgregarIngreso = async (id) => {
    // Cargar formulario vacío en el modal
    let idFromulario = id ? "FormularioEdicionIngreso" : "FormularioIngreso";
    let html = `
        <form id="${idFromulario}">
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
                        <div class="col-md-3">
                            <label class="form-label">Nombre Completo</label>
                            <input class="form-control" placeholder="Nombres y Apellidos" type="text" name="nombre" id="nombre" required />
                        </div>
                        <div class="col-md-3">
                            <label class="form-label">RUT</label>
                            <input class="form-control" placeholder="12.345.678-9" type="text" name="run" required/>
                        </div>
                        <div class="col-md-3">
                            <label class="form-label">Edad</label>
                            <input class="form-control" type="number" name="edad" id="edad" />
                        </div>
                         <div class="col-md-3">
                            <label class="form-label">Fecha Nacimiento</label>
                            <input class="form-control" type="date" name="fecha_nacimiento" id="fecha_nacimiento" />
                        </div>
                        <div class="col-md-2">
                            <label class="form-label">Fecha Ingreso</label>
                            <input class="form-control" type="date" name="fecha_ingreso" id="fecha_ingreso"  required/>
                        </div>
                        <div class="col-md-2">
                            <label class="form-label">Hora</label>
                            <input class="form-control" type="time" name="hora_ingreso" id="hora_ingreso" required/>
                        </div>
                        <div class="col-md-2">
                            <label class="form-label">N° Ficha</label>
                            <input class="form-control solo-numero" type="text" max-dig="10" name="ficha_clinica" id="ficha_clinica" />
                        </div>

                         <div class="col-md-2">
                            <label class="form-label">Genero</label>
                            <select class="form-select" name="genero" id="genero" required>
                                    <option value="">Seleccione...</option>
                                    <option value="MASCULINO">MASCULINO</option>
                                    <option value="FEMENINO">FEMENINO</option>
                                    
                                </select>
                        </div>
                        
                        <div class="col-md-2">
                            <label class="form-label">Telefono</label>
                            <input class="form-control" type="text" name="telefono" id="telefono" />
                        </div>
                        <div class="col-md-2">
                            <label class="form-label">Correo Electronico</label>
                            <input class="form-control" type="text" name="email" id="email" />
                        </div>
                        <div class="col-md-2">
                            <label class="form-label">Dirección</label>
                            <input class="form-control" type="text" name="direccion" id="direccion" />
                        </div>

                        <div class="col-md-2">
                            <label class="form-label">Procedencia</label>
                            <input class="form-control" type="text" name="procedencia" id="procedencia" />
                        </div>
                        <div class="col-md-8">
                            <label class="form-label">Diagnóstico Médico de Ingreso</label>
                            <input class="form-control" placeholder="Diagnóstico principal y secundarios" type="text" name="diagnostico" id="diagnostico" />
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
                        Signos Vitales y Anamnesis
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
                                    <td><input class="form-control form-control-sm border-0 text-center solo-numero" type="text" name="fc" id="fc" />
                                    </td>
                                    <td><input class="form-control form-control-sm border-0 text-center solo-numero" type="text" name="fr" id="fr" />
                                    </td>
                                    <td><input class="form-control form-control-sm border-0 text-center solo-numero" placeholder="120/80" type="text" name="pa" id="pa" /></td>

                                    <td><input class="form-control form-control-sm border-0 text-center solo-numero" type="text" name="tax" id="tax" />
                                    </td>
                                    <td><input class="form-control form-control-sm border-0 text-center solo-numero" type="text" name="sato2" id="sato2" />
                                    </td>
                                    <td><input class="form-control form-control-sm border-0 text-center solo-numero" placeholder="21%" type="text" name="fio2" id="fio2" /></td>
                                    <td><input class="form-control form-control-sm border-0 text-center solo-numero" type="text" name="hgt_sv" id="hgt_sv" />
                                    </td>
                                    <td><input class="form-control form-control-sm border-0 text-center solo-numero" type="text" name="eva" id="eva" />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="row g-2">
                        <div class="col-md-2">
                            <label class="form-label">Peso (Kg)</label>
                            <input class="form-control" step="0.1" type="number" name="peso" id="peso" />
                        </div>
                        <div class="col-md-2">
                            <label class="form-label">Talla (cm)</label>
                            <input class="form-control" type="number" name="talla" id="talla" />
                        </div>

                         <div class="col-md-8">
                            <label class="form-label">Anamnesis</label>
                            <textarea class="form-control"
                                placeholder="Información relevante para la entrega de turno..." rows="2" name="anamnesis" id="anamnesis"></textarea>
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
                        <h6 class="sub-section-title">Comunicación</h6>
                        <div class="row g-3">
                            <div class="col-md-3">
                                <label class="form-label">Conciencia</label>
                                <select class="form-select" name="conciencia" id="conciencia" required>
                                    <option value="">Seleccione...</option>
                                    <option value="CONCIENTE">CONCIENTE</option>
                                    <option value="DESORIENTADO">DESORIENTADO</option>
                                    <option value="LETARGICO">LETARGICO</option>
                                    <option value="INCONCIENCIA/COMA">INCONCIENCIA/COMA</option>
                                    <option value="EBRIO">EBRIO</option>
                                </select>
                            </div>

                            <div class="col-md-3">
                                <label class="form-label">Com. Verbal</label>
                                <select class="form-select" name="com_verbal" id="com_verbal" required>
                                    <option value="">Seleccione...</option>
                                    <option value="COMPLETA COHERENTE">COMPLETA COHERENTE</option>
                                    <option value="PARCIAL">PARCIAL</option>
                                    <option value="AUSENTE">AUSENTE</option>
                                    <option value="DISARTRIA">DISARTRIA</option>
                                </select>
                            </div>

                            <div class="col-md-3">
                                <label class="form-label">Alt. Sensorial</label>
                                <select class="form-select" name="alt_sensorial" id="alt_sensorial">
                                    <option value="">Seleccione...</option>
                                    <option value="VISUAL">VISUAL</option>
                                    <option value="AUDITIVA">AUDITIVA</option>
                                    <option value="LENTES">LENTES</option>
                                    <option value="AUDIFONOS">AUDIFONOS</option>
                                </select>
                            </div>


                             <div class="col-md-3">
                                <label class="form-label">Boca</label>
                                <select class="form-select" name="boca" id="boca" required>
                                    <option value="">Seleccione...</option>
                                    <option value="SANA">SANA</option>
                                    <option value="CON LESIONES">CON LESIONES</option>
                                    <option value="EDENTADO">EDENTADO</option>
                                    <option value="PROTESIS">PROTESIS</option>
                                </select>
                            </div>


                             <div class="col-md-3">
                                <label class="form-label">Pupilas</label>
                                <select class="form-select" name="pupilas" id="pupilas">
                                    <option value="">Seleccione...</option>
                                    <option value="ISOCORIA">ISOCORIA</option>
                                    <option value="ANISOCORIA">ANISOCORIA</option>
                                    <option value="MIOSIS">MIOSIS</option>
                                    <option value="MIDRIASIS">MIDRIASIS</option>
                                    <option value="RFM">RFM</option>
                                </select>
                            </div>

                            <div class="col-md-9">
                                <label class="form-label">Observación </label>
                                <textarea class="form-control" name="observaciones_comunicacion" id="observaciones_comunicacion"
                                placeholder="Información relevante para la entrega de turno..." rows="2"></textarea>
                            </div>
                        </div>
                    </div>
                    <hr class="my-3 opacity-10" />
                    <div class="mb-4">
                        <h6 class="sub-section-title">Oxigenación</h6>
                        <div class="row g-3">
                            <div class="col-md-3">
                                <label class="form-label">Via. Aérea</label>
                                <div class="d-flex gap-2">
                                    <div class="form-check">
                                        <input  type="checkbox" class="form-check-input" name="via_aerea" value="PERMEABLE">
                                        <label class="form-check-label small">PERMEABLE</label>
                                    </div>
                                    <div class="form-check">
                                        <input  type="checkbox" class="form-check-input" name="via_aerea" value="SECRECIONES">
                                        <label class="form-check-label small">SECRECIONES</label>
                                    </div>
                                    <div class="form-check">                                        
                                        <input  class="form-check-input" type="checkbox" name="via_aerea" value="CANULA MAYO">
                                        <label class="form-check-label small">CANULA MAYO</label>
                                    </div>

                                    <div class="form-check">                                        
                                        <input  class="form-check-input" type="checkbox" name="via_aerea" value="TOT">
                                        <label class="form-check-label small">TOT</label>
                                    </div>
                                </div>
                            </div>
                             <div class="col-md-3">
                                <label class="form-label">Respiracion</label>
                                <select class="form-select" name="respiracion" id="respiracion" required >
                                     <option value="">Seleccione...</option>
                                    <option value="NORMAL">NORMAL</option>
                                    <option value="DISNEA">DISNEA</option>
                                    <option value="POLIPNEA">POLIPNEA</option>
                                    <option value="PARADOJAL">PARADOJAL</option>
                                    <option value="GASPING">GASPING</option>
                                    <option value="APNEA">APNEA</option>
                                </select>
                            </div>

                            <div class="col-md-3">
                                <label class="form-label">Oxigenoterapia</label>
                                <select class="form-select" name="oxigenoterapia" id="oxigenoterapia">
                                    <option value="">Seleccione...</option>
                                    <option value="BIGOTERA">BIGOTERA</option>
                                    <option value="MMV">MMV</option>
                                    <option value="MAF">MAF</option>
                                    <option value="TUBO T">TUBO T</option>
                                    <option value="AMBU">AMBÚ</option>
                                </select>
                            </div>

                            <div class="col-md-3">
                                <label class="form-label">Tos</label>
                                <select class="form-select" name="tos" id="tos" required >
                                    <option value="">Seleccione...</option>
                                    <option value="AUSENTE">AUSENTE</option>
                                    <option value="SECA">SECA</option>
                                    <option value="PRODUCTIVA">PRODUCTIVA</option>
                                    <option value="INFECTIVA">INFECTIVA</option>
                                </select>
                            </div>




                            <div class="col-md-3">
                                <label class="form-label">Color Piel</label>
                                <div class="d-flex gap-2">
                                    <div class="form-check">
                                        <input  type="checkbox" class="form-check-input" name="color_piel" value="ROSADA">
                                        <label class="form-check-label small">ROSADA</label>
                                    </div>
                                    <div class="form-check">
                                        <input  type="checkbox" class="form-check-input" name="color_piel" value="PALIDA">
                                        <label class="form-check-label small">PALIDA</label>
                                    </div>
                                    <div class="form-check">                                        
                                        <input  class="form-check-input" type="checkbox" name="color_piel" value="CIANOTICA">
                                        <label class="form-check-label small">CIANÓTICA</label>
                                    </div>

                                    <div class="form-check">                                        
                                        <input  class="form-check-input" type="checkbox" name="color_piel" value="LIVIDECES">
                                        <label class="form-check-label small">LIVIDECES</label>
                                    </div>
                                </div>
                            </div>


                           
                            <div class="col-md-3">
                                <label class="form-label">Secreción</label>
                                <div class="d-flex flex-wrap gap-2">
                                    <div class="form-check form-check-inline">
                                        <input  type="checkbox" class="form-check-input" name="secrecion" value="MUCOSA">
                                        <label class="form-check-label small">MUCOSA</label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input  type="checkbox" class="form-check-input" name="secrecion" value="PURULENTA">
                                        <label class="form-check-label small">PURULENTA</label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input  type="checkbox" class="form-check-input" name="secrecion" value="HEMATICA">
                                        <label class="form-check-label small">HEMATICA</label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input  type="checkbox" class="form-check-input" name="secrecion" value="ABUNDANTE">
                                        <label class="form-check-label small">ABUNDANTE</label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input  type="checkbox" class="form-check-input" name="secrecion" value="REGULAR">
                                        <label class="form-check-label small">REGULAR</label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input  type="checkbox" class="form-check-input" name="secrecion" value="ESCASA">
                                        <label class="form-check-label small">ESCASA</label>
                                    </div>
                                </div>
                            </div>

                             <div class="col-md-6">
                                <label class="form-label">Observación </label>
                                <textarea class="form-control" name="observaciones_oxigenacion" id="observaciones_oxigenacion"
                                placeholder="Información relevante para la entrega de turno..." rows="2" ></textarea>
                            </div>

                        </div>
                    </div>
                    <hr class="my-3 opacity-10" />
                    <div class="mb-4">
                        <h6 class="sub-section-title">Nutrición e Hidratación</h6>
                        <div class="row g-3">
                            <div class="col-md-4">
                                <label class="form-label">Estado Nutricional</label>
                                <select class="form-select mb-2" name="estado_nutricional" required> 
                                    <option value="">Seleccione...</option>
                                    <option value="NORMAL">NORMAL</option> 
                                    <option value="ENFLAQUECIDO">ENFLAQUECIDO</option> 
                                    <option value="DESNUTRIDO">DESNUTRIDO</option> 
                                    <option value="OBESO">OBESO</option> 
                                </select>
                            </div>
                             <div class="col-md-4">
                                <label class="form-label">Alimentación</label>
                                <select class="form-select mb-2" name="alimentacion" required> 
                                    <option value="">Seleccione...</option>
                                    <option value="SOLO">SOLO</option> 
                                    <option value="CON AYUDA">CON AYUDA</option> 
                                    <option value="NO SE ALIMENTA">NO SE ALIMENTA</option> 
                                    <option value="NAUSEAS">NAUSEAS</option> 
                                     <option value="VOMITOS">VOMITOS</option> 
                                </select>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Apetito</label>
                                <select class="form-select mb-2" name="apetito" required> 
                                    <option value="">Seleccione...</option>
                                    <option value="BUENO">BUENO</option> 
                                    <option value="REGULAR">REGULAR</option> 
                                    <option value="MALO">MALO</option> 
                                </select>
                            </div>



                            <div class="col-md-4">
                                <label class="form-label">Piel y Mucosas</label>
                                <select class="form-select mb-2" name="piel_mucosas" required> 
                                    <option value="">Seleccione...</option>
                                    <option value="HIDRATADA">HIDRATADA</option> 
                                    <option value="DESHIDRATADA">DESHIDRATADA</option> 
                                    <option value="EDEMA">EDEMA</option> 
                                    <option value="SIN EDEMA">SIN EDEMA</option> 
                                    <option value="ICTERICIA">ICTERICIA</option> 
                                </select>
                            </div>



                             <div class="col-md-3">
                                <label class="form-label">Abdomen</label>
                                <div class="d-flex flex-wrap gap-2">
                                    <div class="form-check form-check-inline">
                                        <input  type="checkbox" class="form-check-input" name="abdomen" value="BLANDO">
                                        <label class="form-check-label small">BLANDO</label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input  type="checkbox" class="form-check-input" name="abdomen" value="DEPRESIBLE">
                                        <label class="form-check-label small">DEPRESIBLE</label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input  type="checkbox" class="form-check-input" name="abdomen" value="DOLOROSO">
                                        <label class="form-check-label small">DOLOROSO</label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input  type="checkbox" class="form-check-input" name="abdomen" value="DISTENDIDO">
                                        <label class="form-check-label small">DISTENDIDO</label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input  type="checkbox" class="form-check-input" name="abdomen" value="ASCITIS">
                                        <label class="form-check-label small">ASCITIS</label>
                                    </div>
                                   
                                </div>
                            </div>

                            <div class="col-md-3">
                                <label class="form-label">Otras</label>
                                <div class="d-flex flex-wrap gap-2">
                                    <div class="form-check form-check-inline">
                                        <input  type="checkbox" class="form-check-input" name="otra" value="SNG/SNY">
                                        <label class="form-check-label small">SNG/SNY</label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input  type="checkbox" class="form-check-input" name="otra" value="GASTRO">
                                        <label class="form-check-label small">GASTRO</label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input  type="checkbox" class="form-check-input" name="otra" value="YEYUNO">
                                        <label class="form-check-label small">YEYUNO</label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input  type="checkbox" class="form-check-input" name="otra" value="ENTERAL">
                                        <label class="form-check-label small">ENTERAL</label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input  type="checkbox" class="form-check-input" name="otra" value="PARENTERAL">
                                        <label class="form-check-label small">PARENTERAL</label>
                                    </div>  
                                </div>
                            </div>

                             <div class="col-md-6">
                                <label class="form-label">Observación </label>
                                <textarea class="form-control" name="observaciones_nutricion" id="observaciones_nutricion"
                                placeholder="Información relevante para la entrega de turno..." rows="2" ></textarea>
                            </div>


                            
                        </div>
                    </div>
                    <hr class="my-3 opacity-10" />
                    <div class="mb-4">
                        <h6 class="sub-section-title">Eliminación</h6>
                        <div class="row g-3">
                            <div class="col-md-4">
                                <label class="form-label">Intestinal</label>
                                <div class="d-flex flex-wrap gap-2">
                                    <div class="form-check form-check-inline">
                                        <input  type="checkbox" class="form-check-input" name="intestinal" value="DIARREA">
                                        <label class="form-check-label small">DIARREA</label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input  type="checkbox" class="form-check-input" name="intestinal" value="INCONTINENCIA">
                                        <label class="form-check-label small">INCONTINENCIA</label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input  type="checkbox" class="form-check-input" name="intestinal" value="RECTORRAGIA">
                                        <label class="form-check-label small">RECTORRAGIA</label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input  type="checkbox" class="form-check-input" name="intestinal" value="MELENA">
                                        <label class="form-check-label small">MELENA</label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input  type="checkbox" class="form-check-input" name="intestinal" value="ESTREÑIMIENTO">
                                        <label class="form-check-label small">ESTREÑIMIENTO</label>
                                    </div>

                                    <div class="form-check form-check-inline">
                                        <input  type="checkbox" class="form-check-input" name="intestinal" value="ACOLIA">
                                        <label class="form-check-label small">ACOLIA</label>
                                    </div>

                                     <div class="form-check form-check-inline">
                                        <input  type="checkbox" class="form-check-input" name="intestinal" value="PAÑALES">
                                        <label class="form-check-label small">PAÑALES</label>
                                    </div>

                                     <div class="form-check form-check-inline">
                                        <input  type="checkbox" class="form-check-input" name="intestinal" value="OSTOMIA">
                                        <label class="form-check-label small">OSTOMIA</label>
                                    </div>
                                   
                                </div>
                            </div> 

                             <div class="col-md-4">
                                <label class="form-label">Urinaria</label>
                                <div class="d-flex flex-wrap gap-2">
                                    <div class="form-check form-check-inline">
                                        <input type="checkbox" class="form-check-input" name="urinaria" value="INCONTINENCIA">
                                        <label class="form-check-label small">INCONTINENCIA</label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input type="checkbox" class="form-check-input" name="urinaria" value="RETENCION">
                                        <label class="form-check-label small">RETENCION</label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input type="checkbox" class="form-check-input" name="urinaria" value="DISURIA">
                                        <label class="form-check-label small">DISURIA</label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input type="checkbox" class="form-check-input" name="urinaria" value="TENESMO">
                                        <label class="form-check-label small">TENESMO</label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input type="checkbox" class="form-check-input" name="urinaria" value="PAÑALES">
                                        <label class="form-check-label small">PAÑALES</label>
                                    </div>

                                    <div class="form-check form-check-inline">
                                        <input type="checkbox" class="form-check-input" name="urinaria" value="SONDA FOLEY">
                                        <label class="form-check-label small">SONDA FOLEY</label>
                                    </div>
    
                                </div>
                            </div> 

                            <div class="col-md-4">
                                <label class="form-label">Patrón de Sueño</label>
                                <select class="form-select mb-2" name="patron_sueno" required> 
                                    <option value="">Seleccione...</option> 
                                    <option value="NORMAL">NORMAL</option>
                                    <option value="DISCONTINUO">DISCONTINUO</option> 
                                    <option value="INSOMNIO">INSOMNIO</option> 
                                    <option value="MEDICACION">MEDICACION</option> 
                                </select>
                            </div>

                            <div class="col-md-3">
                                <label class="form-label">Vestirse/Desvestirse</label>
                                <select class="form-select mb-2" name="vestrise_desvestrise" required>
                                    <option value="">Seleccione...</option>
                                    <option value="AUTONOMO">AUTONOMO</option>
                                    <option value="AYUDA PARCIAL">AYUDA PARCIAL</option>
                                    <option value="AYUDA TOTAL">AYUDA TOTAL</option>
                                </select>
                            </div>

                            <div class="col-md-3">
                                <label class="form-label">Aprendizaje</label>
                                <select class="form-select mb-2" name="aprendizaje" required>
                                    <option value="">Seleccione...</option> 
                                    <option value="LECTURA">LECTURA</option> 
                                    <option value="TELEVISION">TELEVISION</option> 
                                    <option value="MANUALIDADES">MANUALIDADES</option> 
                                    <option value="DEPORTE">DEPORTE</option> 
                                </select>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Observación </label>
                                <textarea class="form-control" name="observaciones_eliminacion" id="observaciones_eliminacion"
                                placeholder="Información relevante para la entrega de turno..." rows="2" ></textarea>
                            </div>
                        </div>
                    </div>
                    <hr class="my-3 opacity-10" />
                    <div class="mb-4">
                        <h6 class="sub-section-title">Creencias y Valores</h6>
                        <div class="row g-3">
                            <div class="col-md-3">
                                <label class="form-label"></label>
                                <div class="d-flex flex-wrap gap-2">
                                    <div class="form-check form-check-inline">
                                        <input type="checkbox" class="form-check-input" name="solicita_servicios_religiosos" >
                                        <label class="form-check-label small">SOLICITA SERVICIOS RELIGIOSOS</label>
                                    </div>
                                </div>
                            </div> 

                        </div>
                    </div>
                    <hr class="my-3 opacity-10" />
                    <div class="mb-4">
                        <h6 class="sub-section-title">Movilización</h6>
                        <div class="row g-3">
                            

                            <div class="col-md-4">
                                <label class="form-label">Actividad/Movilidad</label>
                                <select class="form-select mb-2" name="actividad" required> 
                                    <option value="">Seleccione...</option> 
                                    <option value="MOVILIZA SOLO">MOVILIZA SOLO</option>
                                    <option value="MOVILIZA CON AYUDA">MOVILIZA CON AYUDA</option> 
                                    <option value="NO SE MOVILIZA">NO SE MOVILIZA</option>
                                </select>
                            </div> 

                            <div class="col-md-4">
                                <label class="form-label">Inmovilización</label>
                                <div class="d-flex flex-wrap gap-2">
                                    <div class="form-check form-check-inline">
                                        <input type="checkbox" class="form-check-input" name="inmovilizacion" value="TABLA ESPINAL">
                                        <label class="form-check-label small">TABLA ESPINAL</label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input type="checkbox" class="form-check-input" name="inmovilizacion" value="COLLAR">
                                        <label class="form-check-label small">COLLAR</label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input type="checkbox" class="form-check-input" name="inmovilizacion" value="FERULA">
                                        <label class="form-check-label small">FERULA</label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input type="checkbox" class="form-check-input" name="inmovilizacion" value="VALVA YESO">
                                        <label class="form-check-label small">VALVA YESO</label>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="col-md-4">
                                <label class="form-label">Fuerza</label>
                                <select class="form-select mb-2" name="fuerza_muscular" required> 
                                    <option value="">Seleccione...</option> 
                                    <option value="NORMAL">NORMAL</option> 
                                    <option value="DISMINUIDA">DISMINUIDA</option> 
                                </select>
                            </div> 

                            <div class="col-md-4">
                                <label class="form-label">Sensibilidad</label>
                                <select class="form-select mb-2" name="sensibilidad" required> 
                                    <option value="">Seleccione...</option> 
                                    <option value="NORMAL">NORMAL</option> 
                                    <option value="DISMINUIDA">DISMINUIDA</option>
                                    <option value="AUMENTADA">AUMENTADA</option> 
                                </select>
                            </div> 

                            <div class="col-md-4">
                                <label class="form-label">Observación </label>
                                <textarea class="form-control" name="observaciones_movilizacion" id="observaciones_movilizacion"
                                placeholder="Información relevante para la entrega de turno..." rows="2" ></textarea>
                            </div>
                       

                        </div>
                    </div>
                    <hr class="my-3 opacity-10" />
                       <div class="mb-4">
                        <h6 class="sub-section-title">Higiene</h6>
                        <div class="row g-3">

                            <div class="col-md-4">
                                <label class="form-label">Higiene</label>
                                <select class="form-select mb-2" name="higiene" required> 
                                    <option value="">Seleccione...</option> 
                                    <option value="ASEADO">ASEADO</option>
                                    <option value="DESASEADO">DESASEADO</option>
                                    <option value="AUTONOMO">AUTONOMO</option>
                                    <option value="AYUDA PARCIAL">AYUDA PARCIAL</option>
                                    <option value="AYUDA TOTAL">AYUDA TOTAL</option>
                                </select>
                            </div>

                            <div class="col-md-4">
                                <label class="form-label">Estado de la piel</label>
                                <select class="form-select mb-2" name="estado_piel" required> 
                                    <option value="">Seleccione...</option> 
                                    <option value="INTEGRA/HIDRATADA">INTEGRA/HIDRATADA</option>
                                    <option value="DESHIDRATADA">DESHIDRATADA</option>
                                    <option value="SUDOROSA">SUDOROSA</option>
                                </select>
                            </div>

                            <div class="col-md-4">
                                <label class="form-label">Heridas</label>
                                <div class="d-flex flex-wrap gap-2">
                                    <div class="form-check form-check-inline">
                                        <input  type="checkbox" class="form-check-input" name="heridas" value="OPERATORIA">
                                        <label class="form-check-label small">OPERATORIA</label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input  type="checkbox" class="form-check-input" name="heridas" value="CORTANTE">
                                        <label class="form-check-label small">CORTANTE</label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input  type="checkbox" class="form-check-input" name="heridas" value="ULCERA">
                                        <label class="form-check-label small">ULCERA</label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input   type="checkbox" class="form-check-input" name="heridas" value="QUEMADURA">
                                        <label class="form-check-label small">QUEMADURA</label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input   type="checkbox" class="form-check-input" name="heridas" value="CONTUSA">
                                        <label class="form-check-label small">CONTUSA</label>
                                    </div>
                                </div>
                            </div>



                            <div class="col-md-4">
                                <label class="form-label">Caracteristicas Heridas</label>
                                <div class="d-flex flex-wrap gap-2">
                                    <div class="form-check form-check-inline">
                                        <input  type="checkbox" class="form-check-input" name="caracteristicas_heridas" value="LIMPIA">
                                        <label class="form-check-label small">LIMPIA</label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input  type="checkbox" class="form-check-input" name="caracteristicas_heridas" value="SUCIA">
                                        <label class="form-check-label small">SUCIA</label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input  type="checkbox" class="form-check-input" name="caracteristicas_heridas" value="CONTAMINADA">
                                        <label class="form-check-label small">CONTAMINADA</label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input   type="checkbox" class="form-check-input" name="caracteristicas_heridas" value="INFECTADA">
                                        <label class="form-check-label small">INFECTADA</label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input   type="checkbox" class="form-check-input" name="caracteristicas_heridas" value="ABRASIVA">
                                        <label class="form-check-label small">ABRASIVA</label>
                                    </div>
                                </div>
                            </div>

                            <div class="col-md-4">
                                <label class="form-label">Vendajes Heridas</label>
                                <div class="d-flex flex-wrap gap-2">
                                    <div class="form-check form-check-inline">
                                        <input  type="checkbox" class="form-check-input" name="vendaje_heridas" value="LIMPIO">
                                        <label class="form-check-label small">LIMPIO</label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input  type="checkbox" class="form-check-input" name="vendaje_heridas" value="SUCIOS">
                                        <label class="form-check-label small">SUCIOS</label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input  type="checkbox" class="form-check-input" name="vendaje_heridas" value="FIJOS">
                                        <label class="form-check-label small">FIJOS</label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input   type="checkbox" class="form-check-input" name="vendaje_heridas" value="SIN VENDAJE">
                                        <label class="form-check-label small">SIN VENDAJE</label>
                                    </div>
                                    
                                </div>
                            </div>

                            <div class="col-md-4">
                                <label class="form-label">Observación </label>
                                <textarea class="form-control" name="observaciones_higiene" id="observaciones_higiene"
                                placeholder="Información relevante para la entrega de turno..." rows="2" ></textarea>
                            </div>
                       
                        </div>
                    </div>
                    <hr class="my-3 opacity-10" />
                    <div>
                        <h6 class="sub-section-title">Seguridad</h6>
                        <div class="row g-3">

                            <div class="col-md-3">
                                <label class="form-label">Habitos</label>
                                <div class="d-flex flex-wrap gap-2">
                                    <div class="form-check form-check-inline">
                                        <input  type="checkbox" class="form-check-input" name="habitos" value="ALCOHOL">
                                        <label class="form-check-label small">ALCOHOL</label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input  type="checkbox" class="form-check-input" name="habitos" value="TABACO">
                                        <label class="form-check-label small">TABACO</label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input  type="checkbox" class="form-check-input" name="habitos" value="DROGAS">
                                        <label class="form-check-label small">DROGAS</label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input   type="checkbox" class="form-check-input" name="habitos" value="VIF">
                                        <label class="form-check-label small">VIF</label>
                                    </div>

                                    <div class="form-check form-check-inline">
                                        <input   type="checkbox" class="form-check-input" name="habitos" value="MALTRATO">
                                        <label class="form-check-label small">MALTRATO</label>
                                    </div>
                                    
                                </div>
                            </div>

                            <div class="col-md-3">
                                <label class="form-label">Frecuencia Habitos</label>
                                <div class="d-flex flex-wrap gap-2">
                                    <div class="form-check form-check-inline">
                                        <input  type="checkbox" class="form-check-input" name="frecuencia_habitos" value="AISLADO">
                                        <label class="form-check-label small">AISLADO</label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input  type="checkbox" class="form-check-input" name="frecuencia_habitos" value="OCASIONAL">
                                        <label class="form-check-label small">OCASIONAL</label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input  type="checkbox" class="form-check-input" name="frecuencia_habitos" value="FRECUENTE">
                                        <label class="form-check-label small">FRECUENTE</label>
                                    </div>  
                                </div>
                            </div>

                            <div class="col-md-3">
                                <label class="form-label">Alergias</label>
                                <div class="d-flex flex-wrap gap-2">
                                    <div class="form-check form-check-inline">
                                        <input  type="checkbox" class="form-check-input" name="alergias" value="MEDICAMENTOS">
                                        <label class="form-check-label small">MEDICAMENTOS</label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input  type="checkbox" class="form-check-input" name="alergias" value="ANESTESIA">
                                        <label class="form-check-label small">ANESTESIA</label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input  type="checkbox" class="form-check-input" name="alergias" value="ALIMENTOS">
                                        <label class="form-check-label small">ALIMENTOS</label>
                                    </div>  
                                     <div class="form-check form-check-inline">
                                        <input  type="checkbox" class="form-check-input" name="alergias" value="INSECTOS">
                                        <label class="form-check-label small">INSECTOS</label>
                                    </div>  
                                </div>
                            </div>


                            <div class="col-md-3">
                                <label class="form-label">Estado Temperancia</label>
                                <select class="form-select mb-2" name="estado_temperancia" required> 
                                    <option value="">Seleccione...</option> 
                                    <option value="SOBRIO">SOBRIO</option> 
                                    <option value="ALIENTO ETILICO">ALIENTO ETILICO</option>
                                    <option value="EBRIO">EBRIO</option> 
                                    <option value="COMA ETILICO">COMA ETILICO</option> 
                                </select>
                            </div>

                           <div class="col-md-3">
                                <label class="form-label">Vacunas</label>
                                <div class="d-flex flex-wrap gap-2">
                                    <div class="form-check form-check-inline">
                                        <input  type="checkbox" class="form-check-input" name="vacunas" value="ANTIRRABICA">
                                        <label class="form-check-label small">ANTIRRABICA</label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input  type="checkbox" class="form-check-input" name="vacunas" value="TETANOS">
                                        <label class="form-check-label small">TETANOS</label>
                                    </div>
                                   
                                </div>
                            </div>

                            <div class="col-md-3">
                                <label class="form-label">Antecedentes Morbidos</label>
                                <div class="d-flex flex-wrap gap-2">
                                    <div class="form-check form-check-inline">
                                        <input  type="checkbox" class="form-check-input" name="ant_morbidos" value="HTA">
                                        <label class="form-check-label small">HTA</label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input  type="checkbox" class="form-check-input" name="ant_morbidos" value="DM">
                                        <label class="form-check-label small">DM</label>
                                    </div>

                                    <div class="form-check form-check-inline">
                                        <input  type="checkbox" class="form-check-input" name="ant_morbidos" value="EPI">
                                        <label class="form-check-label small">EPI</label>
                                    </div>

                                    <div class="form-check form-check-inline">
                                        <input type="checkbox" class="form-check-input" name="ant_morbidos" value="ERC">
                                        <label class="form-check-label small">ERC</label>
                                    </div>

                                    <div class="form-check form-check-inline">
                                        <input  type="checkbox" class="form-check-input" name="ant_morbidos" value="EPOC">
                                        <label class="form-check-label small">EPOC</label>
                                    </div>
                                   
                                </div>
                            </div>

                            <div class="col-md-6">
                                <label class="form-label">Observación </label>
                                <textarea class="form-control" name="observaciones_seguridad" id="observaciones_seguridad"
                                placeholder="Información relevante para la entrega de turno..." rows="2" ></textarea>
                            </div>

                        </div>
                    </div>

                    <hr class="my-3 opacity-10" />
                    <div>
                        <h6 class="sub-section-title">Termoregulación</h6>
                        <div class="row g-3">
                            <div class="col-md-4">
                                <label class="form-label">Temperatura</label>
                                <select class="form-select mb-2" name="estado_termorregulacion" required> 
                                    <option value="">Seleccione...</option> 
                                    <option value="NORMAL">NORMAL</option> 
                                    <option value="HIPOTERMICO">HIPOTERMICO</option> 
                                    <option value="HIPERTERMICO">HIPERTERMICO</option> 
                                </select>
                            </div>

                            <div class="col-md-8">
                                <label class="form-label">Observación </label>
                                <textarea class="form-control" name="observaciones_termorregulacion" id="observaciones_termorregulacion"
                                placeholder="Información relevante para la entrega de turno..." rows="2" ></textarea>
                            </div>

                        </div>
                    </div>
                    
                    <hr class="my-3 opacity-10" />
                    <div>
                        <h6 class="sub-section-title">Realización Personal</h6>
                        <div class="row g-3">
                            <div class="col-md-4">
                                <label class="form-label">Situacion Laboral</label>
                                <select class="form-select mb-2" name="situacion_laboral" required> 
                                    <option value="">Seleccione...</option> 
                                    <option value="CESANTE">CESANTE</option> 
                                    <option value="TRABAJA">TRABAJA</option> 
                                    <option value="JUBILADO">JUBILADO</option> 
                                    <option value="INVALIDEZ">INVALIDEZ</option> 
                                </select>
                            </div>

                            <div class="col-md-4">
                                <label class="form-label">Estado Animico</label>
                                <select class="form-select mb-2" name="estado_animico" required> 
                                    <option value="">Seleccione...</option> 
                                    <option value="TRANQUILO">TRANQUILO</option> 
                                    <option value="TRISTE/DEPRESION">TRISTE/DEPRESION</option> 
                                    <option value="EUFORICO">EUFORICO</option> 
                                    <option value="ANSIOSO">ANSIOSO</option> 
                                    <option value="AGRESIVO">AGRESIVO</option> 
                                </select>
                            </div>

                            <div class="col-md-4">
                                <label class="form-label">Red de Apoyo</label>
                                <select class="form-select mb-2" name="red_apoyo" required> 
                                    <option value="">Seleccione...</option> 
                                    <option value="VIVE SOLO">VIVE SOLO</option> 
                                    <option value="VIVE CON FAMILIA">VIVE CON FAMILIA</option> 
                                    <option value="HOGAR">HOGAR</option> 
                                    <option value="ABANDONO">ABANDONO</option> 
                                </select>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Acompañado</label>
                                <select class="form-select mb-2" name="acompanamiento" required> 
                                    <option value="">Seleccione...</option> 
                                    <option value="FAMILIAR">FAMILIAR</option> 
                                    <option value="AMIGO">AMIGO</option> 
                                    <option value="CUIDADOR">CUIDADOR</option> 
                                    <option value="FUNCIONARIO">FUNCIONARIO</option> 
                                    <option value="SOLO">SOLO</option> col-md-offset-3
                                </select>
                            </div>

                            <div class="col-md-8">
                                <label class="form-label">Observación </label>
                                <textarea class="form-control" name="observaciones_realizacion_personal" id="observaciones_realizacion_personal"
                                placeholder="Información relevante para la entrega de turno..." rows="2" ></textarea>
                            </div>

                        </div>
                    </div>

                    <hr class="my-3 opacity-10" />
                    <div>
                        <h6 class="sub-section-title">Procedimentos Administrados</h6>
                        <div class="row g-3">
                             <!-- TET -->
                        <div class="col-md-12">
                            <div class="procedure-item">
                                <div class="row align-items-center">
                                    <div class="col-md-2">
                                        <div class="form-check">
                                            <input class="form-check-input" type="checkbox" id="tet" name="tet" value="SI">
                                            <label class="form-check-label procedure-label" for="tet">
                                                TET
                                            </label>
                                        </div>
                                    </div>
                                    <div class="col-md-3">
                                        <div class="input-group input-group-sm">
                                            <span class="input-group-text">Altura:</span>
                                            <input type="number" class="form-control" name="tet_altura" id="tet_altura" placeholder="cm" step="0.1">
                                            <span class="input-group-text">cm</span>
                                        </div>
                                    </div>
                                    <div class="col-md-7">
                                        <div class="input-group input-group-sm">
                                            <span class="input-group-text">Fecha Instalación:</span>
                                            <input type="datetime-local" class="form-control" name="tet_fecha" id="tet_fecha">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- S. FOLEY -->
                        <div class="col-md-12">
                            <div class="procedure-item">
                                <div class="row align-items-center">
                                    <div class="col-md-2">
                                        <div class="form-check">
                                            <input class="form-check-input" type="checkbox" id="s_foley" name="s_foley" value="SI">
                                            <label class="form-check-label procedure-label" for="s_foley">
                                                S. FOLEY
                                            </label>
                                        </div>
                                    </div>
                                    <div class="offset-md-3 col-md-7">
                                        <div class="input-group input-group-sm">
                                            <span class="input-group-text">Fecha Instalación:</span>
                                            <input type="datetime-local" class="form-control" name="s_foley_fecha" id="s_foley_fecha">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- SNG/SNY -->
                        <div class="col-md-12">
                            <div class="procedure-item">
                                <div class="row align-items-center">
                                    <div class="col-md-2">
                                        <div class="form-check">
                                            <input class="form-check-input" type="checkbox" id="sng_sny" name="sng_sny" value="SI">
                                            <label class="form-check-label procedure-label" for="sng_sny">
                                                SNG/SNY
                                            </label>
                                        </div>
                                    </div>
                                    <div class="offset-md-3 col-md-7">
                                        <div class="input-group input-group-sm">
                                            <span class="input-group-text">Fecha Instalación:</span>
                                            <input type="datetime-local" class="form-control" name="sng_sny_fecha" id="sng_sny_fecha">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- CVC -->
                        <div class="col-md-12">
                            <div class="procedure-item">
                                <div class="row align-items-center">
                                    <div class="col-md-2">
                                        <div class="form-check">
                                            <input class="form-check-input" type="checkbox" id="cvc" name="cvc" value="SI">
                                            <label class="form-check-label procedure-label" for="cvc">
                                                CVC
                                            </label>
                                        </div>
                                    </div>
                                    <div class="offset-md-3 col-md-7">
                                        <div class="input-group input-group-sm">
                                            <span class="input-group-text">Fecha Instalación:</span>
                                            <input type="datetime-local" class="form-control" name="cvc_fecha" id="cvc_fecha">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- VVP -->
                        <div class="col-md-12">
                            <div class="procedure-item">
                                <div class="row align-items-center">
                                    <div class="col-md-2">
                                        <div class="form-check">
                                            <input class="form-check-input" type="checkbox" id="vvp_adm" name="vvp_adm" value="SI">
                                            <label class="form-check-label procedure-label" for="vvp_adm">
                                                VVP
                                            </label>
                                        </div>
                                    </div>
                                    <div class="offset-md-3 col-md-7">
                                        <div class="input-group input-group-sm">
                                            <span class="input-group-text">Fecha Instalación:</span>
                                            <input type="datetime-local" class="form-control" name="vvp_adm_fecha" id="vvp_adm_fecha">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>    
                            <div class="col-md-8">
                                <label class="form-label">Soluciones Administradas</label>
                                <textarea class="form-control" name="descripcion_soluciones_administradas" id="descripcion_soluciones_administradas"
                                placeholder="Información relevante para la entrega de turno..." rows="2" ></textarea>
                            </div>

                        </div>
                    </div>

                    <hr class="my-3 opacity-10" />
                    <div>
                        <h6 class="sub-section-title">Pertemencias</h6>
                        <div class="row g-3">
                            <div class="col-md-8">
                                <label class="form-label"> </label>
                                <textarea class="form-control" name="pertenencias" id="pertenencias"
                                placeholder="Información relevante para la entrega de turno..." rows="2" ></textarea>
                            </div>

                        </div>
                    </div>
                    <hr class="my-3 opacity-10" />
                    <div>
                        <h6 class="sub-section-title">Procedimientos al ingreso</h6>
                        <div class="row g-3">
                            <div class="col-md-12">
                              <table class="procedures-table">
                                <tbody>
                                    <!-- FILA 1 -->
                                    <tr>
                                        <td class="procedure-cell" onclick="toggleCheckbox('monitor_cardiaco')">
                                            <div class="form-check">
                                                <input class="form-check-input" type="checkbox" id="monitor_cardiaco" name="monitor_cardiaco" value="1">
                                                <label class="form-check-label" for="monitor_cardiaco">Monitor Cardíaco</label>
                                            </div>
                                        </td>
                                        <td class="procedure-cell" onclick="toggleCheckbox('smpt')">
                                            <div class="form-check">
                                                <input class="form-check-input" type="checkbox" id="smpt" name="smpt" value="1">
                                                <label class="form-check-label" for="smpt">SMPT</label>
                                            </div>
                                        </td>
                                        <td class="procedure-cell" onclick="toggleCheckbox('hemograma')">
                                            <div class="form-check">
                                                <input class="form-check-input" type="checkbox" id="hemograma" name="hemograma" value="1">
                                                <label class="form-check-label" for="hemograma">Hemograma</label>
                                            </div>
                                        </td>
                                        <td class="procedure-cell" onclick="toggleCheckbox('ecg')">
                                            <div class="form-check">
                                                <input class="form-check-input" type="checkbox" id="ecg" name="ecg" value="1">
                                                <label class="form-check-label" for="ecg">ECG</label>
                                            </div>
                                        </td>
                                        <td class="procedure-cell" onclick="toggleCheckbox('tt')">
                                            <div class="form-check">
                                                <input class="form-check-input" type="checkbox" id="tt" name="tt" value="1">
                                                <label class="form-check-label" for="tt">TT</label>
                                            </div>
                                        </td>
                                    </tr>

                                    <!-- FILA 2 -->
                                    <tr>
                                        <td class="procedure-cell" onclick="toggleCheckbox('csv')">
                                            <div class="form-check">
                                                <input class="form-check-input" type="checkbox" id="csv" name="csv" value="1">
                                                <label class="form-check-label" for="csv">CSV</label>
                                            </div>
                                        </td>
                                        <td class="procedure-cell" onclick="toggleCheckbox('sonda_foley')">
                                            <div class="form-check">
                                                <input class="form-check-input" type="checkbox" id="sonda_foley" name="sonda_foley" value="1">
                                                <label class="form-check-label" for="sonda_foley">Sonda Foley</label>
                                            </div>
                                        </td>
                                        <td class="procedure-cell" onclick="toggleCheckbox('pbq_ck')">
                                            <div class="form-check">
                                                <input class="form-check-input" type="checkbox" id="pbq_ck" name="pbq_ck" value="1">
                                                <label class="form-check-label" for="pbq_ck">PBQ/CK</label>
                                            </div>
                                        </td>
                                        <td class="procedure-cell" onclick="toggleCheckbox('rx_torax')">
                                            <div class="form-check">
                                                <input class="form-check-input" type="checkbox" id="rx_torax" name="rx_torax" value="1">
                                                <label class="form-check-label" for="rx_torax">Rx Tórax</label>
                                            </div>
                                        </td>
                                        <td class="procedure-cell" onclick="toggleCheckbox('mmv')">
                                            <div class="form-check">
                                                <input class="form-check-input" type="checkbox" id="mmv" name="mmv" value="1">
                                                <label class="form-check-label" for="mmv">MMV</label>
                                            </div>
                                        </td>
                                    </tr>

                                    <!-- FILA 3 -->
                                    <tr>
                                        <td class="procedure-cell" onclick="toggleCheckbox('examen_fisico')">
                                            <div class="form-check">
                                                <input class="form-check-input" type="checkbox" id="examen_fisico" name="examen_fisico" value="1">
                                                <label class="form-check-label" for="examen_fisico">Examen Físico</label>
                                            </div>
                                        </td>
                                        <td class="procedure-cell" onclick="toggleCheckbox('sng')">
                                            <div class="form-check">
                                                <input class="form-check-input" type="checkbox" id="sng" name="sng" value="1">
                                                <label class="form-check-label" for="sng">SNG</label>
                                            </div>
                                        </td>
                                        <td class="procedure-cell" onclick="toggleCheckbox('ttpa')">
                                            <div class="form-check">
                                                <input class="form-check-input" type="checkbox" id="ttpa" name="ttpa" value="1">
                                                <label class="form-check-label" for="ttpa">TTPA</label>
                                            </div>
                                        </td>
                                        <td class="procedure-cell" onclick="toggleCheckbox('linea_arterial')">
                                            <div class="form-check">
                                                <input class="form-check-input" type="checkbox" id="linea_arterial" name="linea_arterial" value="1">
                                                <label class="form-check-label" for="linea_arterial">Línea Arterial</label>
                                            </div>
                                        </td>
                                        <td class="procedure-cell" onclick="toggleCheckbox('naricera')">
                                            <div class="form-check">
                                                <input class="form-check-input" type="checkbox" id="naricera" name="naricera" value="1">
                                                <label class="form-check-label" for="naricera">Naricera</label>
                                            </div>
                                        </td>
                                    </tr>

                                    <!-- FILA 4 -->
                                    <tr>
                                        <td class="procedure-cell" onclick="toggleCheckbox('vvp_ingreso')">
                                            <div class="form-check">
                                                <input class="form-check-input" type="checkbox" id="vvp_ingreso" name="vvp_ingreso" value="1">
                                                <label class="form-check-label" for="vvp_ingreso">VVP</label>
                                            </div>
                                        </td>
                                        <td class="procedure-cell" onclick="toggleCheckbox('intubacion')">
                                            <div class="form-check">
                                                <input class="form-check-input" type="checkbox" id="intubacion" name="intubacion" value="1">
                                                <label class="form-check-label" for="intubacion">Intubación</label>
                                            </div>
                                        </td>
                                        <td class="procedure-cell" onclick="toggleCheckbox('gsa_gsv')">
                                            <div class="form-check">
                                                <input class="form-check-input" type="checkbox" id="gsa_gsv" name="gsa_gsv" value="1">
                                                <label class="form-check-label" for="gsa_gsv">GSA/GSV</label>
                                            </div>
                                        </td>
                                        <td class="procedure-cell" onclick="toggleCheckbox('eco')">
                                            <div class="form-check">
                                                <input class="form-check-input" type="checkbox" id="eco" name="eco" value="1">
                                                <label class="form-check-label" for="eco">ECO</label>
                                            </div>
                                        </td>Procedi
                                        <td class="procedure-cell" onclick="toggleCheckbox('hgt')">
                                            <div class="form-check">
                                                <input class="form-check-input" type="checkbox" id="hgt" name="hgt" value="1">
                                                <label class="form-check-label" for="hgt">HGT</label>
                                            </div>
                                        </td>
                                    </tr>

                                    <!-- FILA 5 -->
                                    <tr>
                                        <td class="procedure-cell" onclick="toggleCheckbox('vvc')">
                                            <div class="form-check">
                                                <input class="form-check-input" type="checkbox" id="vvc" name="vvc" value="1">
                                                <label class="form-check-label" for="vvc">VVC</label>
                                            </div>
                                        </td>
                                        <td class="procedure-cell" onclick="toggleCheckbox('vmi_vmni')">
                                            <div class="form-check">
                                                <input class="form-check-input" type="checkbox" id="vmi_vmni" name="vmi_vmni" value="1">
                                                <label class="form-check-label" for="vmi_vmni">VMI/VMNI</label>
                                            </div>
                                        </td>
                                        <td class="procedure-cell" onclick="toggleCheckbox('hemocultivo')">
                                            <div class="form-check">
                                                <input class="form-check-input" type="checkbox" id="hemocultivo" name="hemocultivo" value="1">
                                                <label class="form-check-label" for="hemocultivo">Hemocultivo</label>
                                            </div>
                                        </td>
                                        <td class="procedure-cell" onclick="toggleCheckbox('tac')">
                                            <div class="form-check">
                                                <input class="form-check-input" type="checkbox" id="tac" name="tac" value="1">
                                                <label class="form-check-label" for="tac">TAC</label>
                                            </div>
                                        </td>
                                        <td class="procedure-cell">
                                            <!-- Celda vacía -->
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                                
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
                        <div class="col-md-4">
                            <label class="form-label">Nombre del Enfermero(a) que recibe</label>
                            <input class="form-control" placeholder="Nombre completo" type="text" name="nombre_enfermero"  required />
                        </div>
                        <div class="col-md-3">
                            <label class="form-label">RUT</label>
                            <input class="form-control" type="text" mane="run_enfermero"  required />
                        </div>
                        <div class="col-md-3">
                            <label class="form-label">Código</label>
                            <input class="form-control" type="text"  name="codigo_enfermero" required />
                        </div>
                        <div class="col-md-2">
                            <label class="form-label">Fecha Término</label>
                            <input class="form-control" type="date" name="fecha_termino" required/>
                        </div>
                        <div class="col-md-2">
                            <label class="form-label">Hora Término</label>
                            <input class="form-control" type="time" name="hora_termino" required />
                        </div>
                        <div class="col-12">
                            <label class="form-label">Observaciones Finales / Pendientes</label>
                            <textarea class="form-control" name="observaciones_finales"
                                placeholder="Información relevante para la entrega de turno..." rows="2"></textarea>
                        </div>
                    </div>
                </div>
            </div>
            
        </form>
    `;

    // Establecer el contenido en el modal
    document.getElementById('ingresoModalBody').innerHTML = html;

    // Mostrar el modal
    let modal = new bootstrap.Modal(document.getElementById('ingresoModal'));
    modal.show();

    // Inicializar los checkboxes   
    initializeProcedureAdminCheckboxes();
}

const initializeProcedureAdminCheckboxes = () => {
    // Auto-habilitar/deshabilitar campos de fecha según checkbox
    const procedures = ['tet', 's_foley', 'sng_sny', 'cvc', 'vvp_adm'];

    procedures.forEach(proc => {
        const checkbox = document.getElementById(proc);
        const dateInput = document.getElementById(proc + '_fecha');

        // Deshabilitar fecha inicialmente
        dateInput.disabled = true;

        // Para TET, también manejar el campo de altura
        if (proc === 'tet') {
            const alturaInput = document.getElementById('tet_altura');
            alturaInput.disabled = true;

            checkbox.addEventListener('change', function () {
                if (this.checked) {
                    dateInput.disabled = false;
                    alturaInput.disabled = false;
                    // Establecer fecha/hora actual por defecto
                    const now = new Date();
                    const year = now.getFullYear();
                    const month = String(now.getMonth() + 1).padStart(2, '0');
                    const day = String(now.getDate()).padStart(2, '0');
                    const hours = String(now.getHours()).padStart(2, '0');
                    const minutes = String(now.getMinutes()).padStart(2, '0');
                    dateInput.value = `${year}-${month}-${day}T${hours}:${minutes}`;
                } else {
                    dateInput.disabled = true;
                    alturaInput.disabled = true;
                    dateInput.value = '';
                    alturaInput.value = '';
                }
            });
        } else {
            checkbox.addEventListener('change', function () {
                if (this.checked) {
                    dateInput.disabled = false;
                    // Establecer fecha/hora actual por defecto
                    const now = new Date();
                    const year = now.getFullYear();
                    const month = String(now.getMonth() + 1).padStart(2, '0');
                    const day = String(now.getDate()).padStart(2, '0');
                    const hours = String(now.getHours()).padStart(2, '0');
                    const minutes = String(now.getMinutes()).padStart(2, '0');
                    dateInput.value = `${year}-${month}-${day}T${hours}:${minutes}`;
                } else {
                    dateInput.disabled = true;
                    dateInput.value = '';
                }
            });
        }
    });

};



const guardarIngreso = () => {
    // Aquí puedes agregar la lógica para guardar el ingreso
    const idFormulario = document.querySelector('form');
    const schema = formToJson(idFormulario);
    const payload = normalizeIngresoPayload(schema);

    let completado = validarRequired(idFormulario)

    if (!completado.estado) {
        let msgConfig = {
            msg: 'Debes completar los siguientes campos:<br>' + completado.faltantes.join('<br>'),
            clase: 'danger'
        }
        mostrarMensaje(msgConfig)
        return
    }

    let response = tx.request({
        url: '/ingresos',
        headers: {
            "Content-Type": "application/json"
        },
        method: 'POST',
        body: JSON.stringify(payload)
    })


    if (response.success == false) {
        let msgConfig = {
            msg: `Problemas para crear el ingreso.`,
            clase: 'danger'
        }
        mostrarMensaje(msgConfig)
        return
    } else {

        let msgConfig = {
            msg: `Ingreso guardado exitosamente.`,
            clase: 'success',
            fn: 'cargarIngresos'
        }
        mostrarMensaje(msgConfig)
        // Cerrar el modal después de guardar
        let modalElement = document.getElementById('ingresoModal');
        let modal = bootstrap.Modal.getInstance(modalElement);
        modal.hide();
    }
}


const formToJson = (form) => {
    const data = {};
    const fields = form.querySelectorAll('[name]');

    fields.forEach(field => {
        let name = field.name;
        const type = field.type;
        const tag = field.tagName.toLowerCase();

        // Detectar arrays por convención name[]
        const isArray = name.endsWith('[]');
        if (isArray) {
            name = name.slice(0, -2);
            data[name] ??= [];
        }

        // CHECKBOX
        if (type === 'checkbox') {
            if (isArray) {
                if (field.checked) {
                    data[name].push(field.value);
                } ingresos
            } else {
                data[name] = field.checked;
            }
            return;
        }

        // RADIO
        if (type === 'radio') {
            if (field.checked) {
                data[name] = field.value;
            } else if (!(name in data)) {
                data[name] = null;
            }
            return;
        }

        // SELECT
        if (tag === 'select') {
            if (field.multiple) {
                data[name] = [...field.selectedOptions].map(o => o.value);
            } else {
                data[name] = field.value || null;
            }
            return;
        }

        // FILE
        if (type === 'file') {
            data[name] = field.files.length ? field.files : null;
            return;
        }

        // DEFAULT (text, number, date, etc.)
        data[name] = field.value !== '' ? field.value : null;
    });

    return data;
};

const normalizeIngresoPayload = (payload) => {

    const schemaMap = {
        // INT
        int: [
            'fc', 'er', 'pvc', 'sato2', 'gcs', 'eva', 'fio2', 'hgt_sv', 'edad'
        ],

        // DECIMAL
        decimal: [
            'peso', 'talla', 'tax', 'ttr', 'tet_altura'
        ],

        // BOOLEAN
        boolean: [
            'tet', 's_foley', 'sng_sny', 'cvc', 'vvp_adm',
            'monitor_cardiaco', 'csv', 'examen_fisico', 'vvp_ingreso',
            'vvc', 'smpt', 'sonda_foley', 'sng', 'intubacion', 'vmi_vmni',
            'hemograma', 'pbq_ck', 'gsa_gsv', 'hemocultivo', 'ecg',
            'rx_torax', 'linea_arterial', 'eco', 'tac', 'tt', 'ttpa',
            'naricera', 'mmv', 'hgt', 'solicita_servicios_religiosos'
        ],

        // SET (array → CSV string)
        set: [
            'inmovilizacion', 'heridas', 'caracteristicas_heridas',
            'vendaje_heridas', 'habitos', 'frecuencia_habitos',
            'alergias', 'vacunas', 'ant_morbidos', 'alt_sensorial',
            'pupilas', 'via_aerea', 'oxigenoterapia', 'color_piel',
            'secrecion', 'abdomen', 'otra', 'intestinal', 'urinaria'
        ]
    }
    const out = {}

    for (const [key, value] of Object.entries(payload)) {

        // NULL explícito
        if (value === '' || value === undefined) {
            out[key] = null;
            continue;
        }

        // INT
        if (schemaMap.int.includes(key)) {
            out[key] = value === null ? null : parseInt(value, 10);
            if (Number.isNaN(out[key])) out[key] = null;
            continue;
        }

        // DECIMAL
        if (schemaMap.decimal.includes(key)) {
            out[key] = value === null ? null : parseFloat(value);
            if (Number.isNaN(out[key])) out[key] = null;
            continue;
        }

        // BOOLEAN
        if (schemaMap.boolean.includes(key)) {
            out[key] = (value === true || value === 'true' || value === 1) ? 1 : 0;
            continue;
        }

        // SET (array → string CSV)
        if (schemaMap.set.includes(key)) {
            if (Array.isArray(value)) {
                out[key] = value.join(',');
            } else if (value === false || value === null) {
                out[key] = '';
            } else {
                out[key] = value;
            }
            continue;
        }

        // Default: string / date / time
        out[key] = value;
    }
    //console.log(out)

    return out;
}


const mostrarMensaje = (config) => {
    let { msg, clase, noClose, fn } = config

    if (typeof noClose === 'undefined') {
        noClose = false
    }
    if (typeof clase === "undefined") {
        clase = 'success';
    }

    if (clase == "success") {
        var icono = "fa fa-check-square ";
    } else {
        var icono = "fa fa-exclamation-triangle ";
    }

    if (clase == 'success' || clase == 'warning') {
        var timeout = 5000;
    } else if (clase == 'danger') {
        var timeout = 120000;
    }

    timeout = noClose ? null : timeout;
    clase = clase == 'danger' ? 'error' : clase;

    if (fn === 'undefined') {
        Swal.fire({
            'html': msg,
            'type': clase,
            'timer': timeout,
            'confirmButtonText': 'Ok'
        });

    } else {
        Swal.fire({
            html: msg,
            type: clase,
            timer: timeout,
            confirmButtonText: 'OK'
        }).then((result) => {
            if (result.isConfirmed) {
                // Ejecuta la función por nombre
                if (typeof window[fn] === 'function') {
                    window[fn]();
                } else {
                    console.error('La función no existe:', fn);
                }
            }
        });

    }

}


const validarRequired = (form) => {
    const requiredElements = form.querySelectorAll('[required]');
    const faltantes = [];

    requiredElements.forEach(el => {
        // si el elemento no existe en el DOM
        if (!document.body.contains(el)) {
            faltantes.push(el.name || el.id || '(sin id ni name)');
            return;
        }

        // si el elemento existe pero está vacío
        if (el.type === 'checkbox' || el.type === 'radio') {
            // para checkbox o radio, al menos uno debe estar marcado
            const grupo = form.querySelectorAll(`[name="${el.name}"]`);
            const algunoMarcado = Array.from(grupo).some(e => e.checked);
            if (!algunoMarcado) faltantes.push(el.name || el.id);
        } else if (!el.value || el.value.trim() === '') {
            faltantes.push(el.name || el.id);
        }
    });

    return {
        estado: faltantes.length === 0,
        faltantes
    };
}
