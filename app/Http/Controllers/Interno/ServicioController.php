<?php

namespace App\Http\Controllers\Interno;

use App\Http\Controllers\Controller;
use App\Models\Servicio;
use App\Models\ServicioImagen;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ServicioController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Interno/Servicios/Index', [
            'servicios' => Servicio::with('imagenes')->orderBy('categoria')->orderBy('orden')->get(),
            'categorias' => Servicio::CATEGORIAS,
        ]);
    }

    public function store(Request $request)
    {
        $data = $this->validated($request);
        $data['slug'] = $this->slugUnico($data['nombre']);

        if ($request->hasFile('imagen')) {
            $data['imagen'] = $request->file('imagen')->store('servicios', 'public');
        }

        $servicio = Servicio::create($data);

        $this->guardarGaleria($request, $servicio);

        return back();
    }

    public function update(Request $request, Servicio $servicio)
    {
        $data = $this->validated($request);

        if ($request->hasFile('imagen')) {
            if ($servicio->imagen) {
                Storage::disk('public')->delete($servicio->imagen);
            }
            $data['imagen'] = $request->file('imagen')->store('servicios', 'public');
        } elseif ($request->boolean('quitar_imagen') && $servicio->imagen) {
            Storage::disk('public')->delete($servicio->imagen);
            $data['imagen'] = null;
        }

        $servicio->update($data);

        $this->guardarGaleria($request, $servicio);

        return back();
    }

    public function toggleActivo(Servicio $servicio)
    {
        $servicio->update(['activo' => ! $servicio->activo]);

        return back();
    }

    public function destroy(Servicio $servicio)
    {
        if ($servicio->imagen) {
            Storage::disk('public')->delete($servicio->imagen);
        }
        foreach ($servicio->imagenes as $imagen) {
            Storage::disk('public')->delete($imagen->imagen);
        }

        $servicio->delete();

        return back();
    }

    public function destroyImagen(Servicio $servicio, ServicioImagen $imagen)
    {
        abort_unless($imagen->servicio_id === $servicio->id, 404);

        Storage::disk('public')->delete($imagen->imagen);
        $imagen->delete();

        return back();
    }

    private function guardarGaleria(Request $request, Servicio $servicio): void
    {
        if (! $request->hasFile('imagenes')) {
            return;
        }

        $orden = $servicio->imagenes()->max('orden') + 1;

        foreach ($request->file('imagenes') as $archivo) {
            $servicio->imagenes()->create([
                'imagen' => $archivo->store('servicios/galeria', 'public'),
                'orden' => $orden++,
            ]);
        }
    }

    private function validated(Request $request): array
    {
        $data = $request->validate([
            'codigo' => ['required', 'string', 'max:4'],
            'categoria' => ['required', 'in:'.implode(',', array_keys(Servicio::CATEGORIAS))],
            'nombre' => ['required', 'string', 'max:150'],
            'resumen' => ['required', 'string', 'max:200'],
            'descripcion' => ['required', 'string'],
            'meta' => ['required', 'string', 'max:100'],
            'imagen_hint' => ['nullable', 'string', 'max:100'],
            'imagen' => ['nullable', 'image', 'max:4096'],
            'imagenes' => ['nullable', 'array'],
            'imagenes.*' => ['image', 'max:4096'],
            'incluye' => ['required', 'string'],
            'sectores' => ['required', 'string'],
            'destacado' => ['boolean'],
            'activo' => ['boolean'],
            'orden' => ['required', 'integer', 'min:0'],
        ]);

        unset($data['imagen'], $data['imagenes']);

        $data['incluye'] = array_values(array_filter(array_map('trim', explode("\n", $data['incluye']))));
        $data['sectores'] = array_values(array_filter(array_map('trim', explode(',', $data['sectores']))));
        $data['destacado'] = $request->boolean('destacado');
        $data['activo'] = $request->boolean('activo', true);
        $data['imagen_hint'] = $data['imagen_hint'] ?? '';

        return $data;
    }

    private function slugUnico(string $nombre): string
    {
        $base = Str::slug($nombre);
        $slug = $base;
        $i = 2;

        while (Servicio::where('slug', $slug)->exists()) {
            $slug = "{$base}-{$i}";
            $i++;
        }

        return $slug;
    }
}
