<?php

namespace Database\Seeders;

use App\Models\Cotizacion;
use App\Models\CotizacionEvento;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class CotizacionSeeder extends Seeder
{
    public function run(): void
    {
        $registros = [
            ['empresa' => 'Hotel Caribe', 'nit' => '890.000.111-2', 'ciudad' => 'Bocagrande', 'servicios' => ['Lavado y desinfección de tanques de agua'], 'frecuencia' => 'una_vez', 'whatsapp' => '312 000 1122', 'canal' => 'whatsapp', 'estado' => 'nueva', 'area_m2' => null, 'detalle' => 'Dos tanques de 20.000 L cada uno, acceso por azotea.', 'horas' => 2],
            ['empresa' => 'Centro Comercial La Plazuela', 'nit' => '900.111.222-3', 'ciudad' => 'Cartagena', 'servicios' => ['Aseo general de oficinas y locales', 'Limpieza de vidrios en altura'], 'frecuencia' => 'mensual', 'whatsapp' => '317 222 3344', 'canal' => 'web', 'estado' => 'contactada', 'area_m2' => 8500, 'detalle' => 'Zonas comunes y fachada de acceso principal.', 'horas' => 5],
            ['empresa' => 'Clínica Madre Bernarda', 'nit' => '806.333.444-5', 'ciudad' => 'Turbaco', 'servicios' => ['Desinfección de áreas comunes'], 'frecuencia' => 'mensual', 'whatsapp' => '300 444 5566', 'canal' => 'telefono', 'estado' => 'cotizada', 'area_m2' => 3200, 'detalle' => 'Salas de espera y pasillos de consulta externa.', 'horas' => 30],
            ['empresa' => 'Condominio Marina Santa Cruz', 'nit' => '900.555.666-7', 'ciudad' => 'Manga', 'servicios' => ['Lavado y desinfección de tanques de agua', 'Control de plagas y fumigación'], 'frecuencia' => 'trimestral', 'whatsapp' => '301 666 7788', 'canal' => 'whatsapp', 'estado' => 'agendada', 'cuadrilla' => 'Cuadrilla 2 · Andrés R.', 'area_m2' => null, 'detalle' => 'Torre de 12 pisos, dos tanques elevados. Visita agendada 20/08.', 'horas' => 27],
            ['empresa' => 'Restaurante El Boliche', 'nit' => '901.777.888-9', 'ciudad' => 'Bocagrande', 'servicios' => ['Limpieza de trampas de grasa'], 'frecuencia' => 'mensual', 'whatsapp' => '312 888 9900', 'canal' => 'whatsapp', 'estado' => 'cerrada_ganada', 'cuadrilla' => 'Cuadrilla 1 · Luis M.', 'area_m2' => null, 'detalle' => 'Cocina principal, trampa de 500 L.', 'horas' => 96],
            ['empresa' => 'Colegio Jorge Washington', 'nit' => '890.999.000-1', 'ciudad' => 'Cartagena', 'servicios' => ['Programas de aseo con cronograma fijo'], 'frecuencia' => 'anual', 'whatsapp' => '317 000 1111', 'canal' => 'web', 'estado' => 'en_ejecucion', 'cuadrilla' => 'Cuadrilla 3 · Kelly P.', 'area_m2' => 12000, 'detalle' => 'Aseo diario de aulas y zonas comunes, año lectivo completo.', 'horas' => 50],
            ['empresa' => 'Naviera del Caribe S.A.S.', 'nit' => '900.222.333-4', 'ciudad' => 'Manga', 'servicios' => ['Lavado en seco de tapicería'], 'frecuencia' => 'una_vez', 'whatsapp' => '301 333 4455', 'canal' => 'telefono', 'estado' => 'cerrada_perdida', 'motivo_perdida' => 'Escogió otro proveedor por precio', 'area_m2' => null, 'detalle' => 'Tapicería de embarcaciones, 6 unidades.', 'horas' => 1],
        ];

        $historiales = [
            3 => [ // Condominio Marina Santa Cruz
                ['estado_anterior' => 'nueva', 'estado_nuevo' => 'contactada', 'nota' => 'Se llamó, piden visita técnica.', 'horas' => 24],
                ['estado_anterior' => 'contactada', 'estado_nuevo' => 'cotizada', 'nota' => 'Cotización enviada por WhatsApp.', 'horas' => 15],
                ['estado_anterior' => 'cotizada', 'estado_nuevo' => 'agendada', 'cuadrilla' => 'Cuadrilla 2 · Andrés R.', 'nota' => 'Cliente aceptó, visita 20/08.', 'horas' => 6],
            ],
            4 => [ // Restaurante El Boliche
                ['estado_anterior' => 'nueva', 'estado_nuevo' => 'cotizada', 'nota' => 'Cotización enviada.', 'horas' => 90],
                ['estado_anterior' => 'cotizada', 'estado_nuevo' => 'agendada', 'cuadrilla' => 'Cuadrilla 1 · Luis M.', 'nota' => 'Servicio agendado.', 'horas' => 80],
                ['estado_anterior' => 'agendada', 'estado_nuevo' => 'en_ejecucion', 'nota' => 'Cuadrilla en sitio.', 'horas' => 20],
                ['estado_anterior' => 'en_ejecucion', 'estado_nuevo' => 'cerrada_ganada', 'nota' => 'Servicio completado y facturado.', 'horas' => 4],
            ],
            6 => [ // Naviera del Caribe
                ['estado_anterior' => 'nueva', 'estado_nuevo' => 'cotizada', 'nota' => 'Cotización enviada.', 'horas' => 40],
                ['estado_anterior' => 'cotizada', 'estado_nuevo' => 'cerrada_perdida', 'nota' => 'Cliente avisó que escogió otro proveedor.', 'horas' => 2],
            ],
        ];

        foreach ($registros as $i => $registro) {
            $horas = $registro['horas'];
            unset($registro['horas']);

            $cotizacion = Cotizacion::create(array_merge($registro, [
                'caso' => 'COT-'.str_pad((string) (2412 + $i), 4, '0', STR_PAD_LEFT),
            ]));

            $cotizacion->timestamps = false;
            $cotizacion->created_at = Carbon::now()->subHours($horas);
            $cotizacion->updated_at = $cotizacion->created_at;
            $cotizacion->save();

            foreach ($historiales[$i] ?? [] as $evento) {
                $eventoHoras = $evento['horas'];
                unset($evento['horas']);

                $registroEvento = CotizacionEvento::create(array_merge($evento, [
                    'cotizacion_id' => $cotizacion->id,
                    'usuario' => 'Marcela C.',
                ]));

                $registroEvento->timestamps = false;
                $registroEvento->created_at = Carbon::now()->subHours($eventoHoras);
                $registroEvento->updated_at = $registroEvento->created_at;
                $registroEvento->save();
            }
        }
    }
}
