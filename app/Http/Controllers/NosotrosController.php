<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class NosotrosController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Nosotros');
    }
}
