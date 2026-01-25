<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8" />
    <meta content="width=device-width, initial-scale=1.0" name="viewport" />
    <title><?= $title ?? 'Ingreso de Pacientes |' ?>  <?= $hospital ?? 'Hospital Base Valdivia' ?></title>

    <link href="/assets/css/plugins/bootstrap.min.css" rel="stylesheet" />
    <link href="/assets/css/fonts/font_inter.css" rel="stylesheet" />
    <link href="/assets/css/fonts/font_material.css" rel="stylesheet" />
    <link href="/assets/css/plugins/dataTables.bootstrap5.min.css" rel="stylesheet">
    <link href="/assets/css/app.css" rel="stylesheet">
</head>



<body>
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
        <div class="container">
            <a class="navbar-brand" href="#">
                <span class="material-symbols-outlined">medical_services</span>
                <?= $hospital ?? 'Hospital Base Valdivia' ?>
            </a>
            <button class="navbar-toggler" data-bs-target="#navbarNav" data-bs-toggle="collapse" type="button">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav me-auto">
                    <li class="nav-item">
                        <a class="nav-link active" href="#">Inicio</a>
                    </li>
                </ul>
                <div class="navbar-nav align-items-center">
                    <div class="nav-item ">
                        <a class="nav-link d-flex align-items-center" href="#"
                            id="profileDropdown" role="button">
                            <span class="me-2 text-white opacity-75 small">Dr. Francisco Soto</span>
                            <div class="bg-white rounded-circle p-1 d-flex align-items-center justify-content-center"
                                style="width: 32px; height: 32px;">
                                <span class="material-symbols-outlined text-primary"
                                    style="font-size: 20px;">person</span>
                            </div>
                        </a>
                        <!-- <ul class="dropdown-menu dropdown-menu-end shadow border-0 mt-2">
                            <li><a class="dropdown-item" href="#">Profile</a></li>
                            <li><a class="dropdown-item" href="#">Settings</a></li>
                            <li>
                                <hr class="dropdown-divider" />
                            </li>
                            <li><a class="dropdown-item" href="#">Sign out</a></li> 
                        </ul> -->
                    </div>
                </div>
            </div>
        </div>
    </nav>

    <main class="container my-4">
        <?= $content ?>
    </main>

     <footer class="container py-5 mt-5 border-top">
        <div class="row align-items-center">
            <div class="col-md-6 text-center text-md-start mb-3 mb-md-0">
                <span class="text-muted small">© 2026 <?= $hospital ?? 'Hospital Base Valdivia'?> | Sistema de admisión y control de pacientes</span>
            </div>
            <div class="col-md-6 text-center text-md-end">
                <div class="d-flex flex-wrap justify-content-center justify-content-md-end gap-3 align-items-center">
                    <a class="text-decoration-none text-muted small" href="#">Manual</a>
                    <a class="text-decoration-none text-muted small" href="#">Support</a>
                    <span
                        class="badge bg-success-subtle text-success border border-success-subtle rounded-pill d-inline-flex align-items-center px-2 py-1">
                        <span class="dot bg-success me-2" style="width: 8px; height: 8px;"></span>
                        SYSTEM ONLINE
                    </span>
                </div>
            </div>
        </div>
    </footer>

    <script src="/assets/js/plugins/bootstrap.bundle.min.js"></script>
     <!-- jQuery -->
    <script src="/assets/js/plugins/jquery-3.7.1.min.js"></script>

    <!-- DataTables JS -->
    <script src="/assets/js/plugins/jquery.dataTables.min.js"></script>
    <script src="/assets/js/plugins/dataTables.bootstrap5.min.js"></script>
    <script src="/assets/js/app.js"></script>

</body>

</html>

