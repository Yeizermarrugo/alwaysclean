<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class PoliticasController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Politicas');
    }
}
