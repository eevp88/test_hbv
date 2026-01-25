<?php

namespace App\Controllers\Web;
use Core\Response;


/* class HomeController
{
    public function index(): string
    {
        return view('home', [
            'hospital' => 'Hospital Base Valdivia',
            'title'   => 'Sistema de Admisión de Pacientes',
            'message' => 'Bienvenido al sistema de admisión de pacientes.',
        ]);
    }
}
 */

class HomeController
{
    public function index(): string
    {
        return Response::html(
            view('home', [
            'hospital' => 'Hospital Base Valdivia',
            'title'   => 'Sistema de Admisión de Pacientes',
            'message' => 'Bienvenido al sistema de admisión de pacientes.',
        ])
        );
    }
}
