<?php

use App\Http\Controllers\Auth\SessionController;
use App\Http\Controllers\ContactoController;
use App\Http\Controllers\Interno\ProductoController as InternoProductoController;
use App\Http\Controllers\Interno\ServicioController as InternoServicioController;
use App\Http\Controllers\InternoController;
use App\Http\Controllers\PqrsController;
use App\Http\Controllers\ProductoController;
use App\Http\Controllers\ServicioController;
use Illuminate\Support\Facades\Route;

Route::get('/', [ServicioController::class, 'home'])->name('home');

Route::get('/servicios', [ServicioController::class, 'index'])->name('servicios.index');
Route::get('/servicios/{servicio:slug}', [ServicioController::class, 'show'])->name('servicios.show');

Route::get('/productos', [ProductoController::class, 'index'])->name('productos.index');

Route::get('/contacto', [ContactoController::class, 'create'])->name('contacto.create');
Route::post('/contacto', [ContactoController::class, 'store'])->name('contacto.store');

Route::get('/pqrs', [PqrsController::class, 'create'])->name('pqrs.create');
Route::post('/pqrs', [PqrsController::class, 'store'])->name('pqrs.store');

Route::middleware('guest')->group(function () {
    Route::get('/interno/login', [SessionController::class, 'create'])->name('login');
    Route::post('/interno/login', [SessionController::class, 'store'])->name('interno.login.store');
});

Route::middleware('auth')->group(function () {
    Route::post('/interno/logout', [SessionController::class, 'destroy'])->name('interno.logout');
    Route::get('/interno/cotizaciones', [InternoController::class, 'bandeja'])->name('interno.bandeja');
    Route::patch('/interno/cotizaciones/{cotizacion}', [InternoController::class, 'actualizar'])->name('interno.actualizar');

    Route::get('/interno/servicios', [InternoServicioController::class, 'index'])->name('interno.servicios.index');
    Route::post('/interno/servicios', [InternoServicioController::class, 'store'])->name('interno.servicios.store');
    Route::patch('/interno/servicios/{servicio:id}', [InternoServicioController::class, 'update'])->name('interno.servicios.update');
    Route::delete('/interno/servicios/{servicio:id}', [InternoServicioController::class, 'destroy'])->name('interno.servicios.destroy');
    Route::delete('/interno/servicios/{servicio:id}/imagenes/{imagen}', [InternoServicioController::class, 'destroyImagen'])->name('interno.servicios.imagenes.destroy');

    Route::get('/interno/productos', [InternoProductoController::class, 'index'])->name('interno.productos.index');
    Route::post('/interno/productos', [InternoProductoController::class, 'store'])->name('interno.productos.store');
    Route::patch('/interno/productos/{producto:id}', [InternoProductoController::class, 'update'])->name('interno.productos.update');
    Route::delete('/interno/productos/{producto:id}', [InternoProductoController::class, 'destroy'])->name('interno.productos.destroy');
});
