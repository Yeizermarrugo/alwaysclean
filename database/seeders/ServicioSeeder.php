<?php

namespace Database\Seeders;

use App\Models\Servicio;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ServicioSeeder extends Seeder
{
    public function run(): void
    {
        $servicios = [
            // Limpieza (7)
            [
                'categoria' => 'limpieza',
                'nombre' => 'Aseo general de oficinas y locales',
                'resumen' => 'Rutinas diarias o por cronograma para áreas administrativas y comerciales.',
                'descripcion' => 'Aseo integral de puestos de trabajo, zonas comunes, baños y áreas de atención al público, con cuadrilla fija asignada a su sede.',
                'meta' => 'Diario o por cronograma',
                'imagen_hint' => 'foto: cuadrilla en oficina',
                'incluye' => ['Barrido y trapeado de pisos', 'Limpieza de puestos de trabajo', 'Desinfección de baños', 'Vaciado de canecas y reciclaje', 'Limpieza de vidrios interiores', 'Reporte de novedades por visita'],
                'sectores' => ['Comercios', 'Oficinas', 'Centros comerciales'],
                'destacado' => true,
            ],
            [
                'categoria' => 'limpieza',
                'nombre' => 'Limpieza profunda post-obra',
                'resumen' => 'Retiro de residuos de construcción y limpieza fina antes de la entrega.',
                'descripcion' => 'Limpieza de obra gris a obra blanca: retiro de escombros menores, polvo, residuos de pintura y sellantes, dejando el espacio listo para operar.',
                'meta' => '1-3 días según área',
                'imagen_hint' => 'foto: limpieza post-obra',
                'incluye' => ['Retiro de residuos y polvo fino', 'Limpieza de pisos y zócalos', 'Limpieza de vidrios y marcos', 'Desmanche de superficies', 'Limpieza de baños y cocina', 'Acta de entrega'],
                'sectores' => ['Constructoras', 'Inmobiliarias'],
                'destacado' => true,
            ],
            [
                'categoria' => 'limpieza',
                'nombre' => 'Limpieza y mantenimiento de fachadas',
                'resumen' => 'Lavado de fachadas en altura con equipo certificado.',
                'descripcion' => 'Lavado de fachadas, ventanales y superficies exteriores en altura, con personal certificado y equipo de protección homologado.',
                'meta' => 'Personal certificado en altura',
                'imagen_hint' => 'foto: fachada en altura',
                'incluye' => ['Inspección de anclajes y accesos', 'Lavado a presión de fachada', 'Limpieza de ventanales exteriores', 'Retiro de manchas y hongos', 'Registro fotográfico antes/después', 'Certificado de trabajo seguro en altura'],
                'sectores' => ['Hoteles', 'Centros comerciales', 'Edificios corporativos'],
                'destacado' => false,
            ],
            [
                'categoria' => 'limpieza',
                'nombre' => 'Lavado de alfombras y tapetes',
                'resumen' => 'Lavado en seco o inyección-extracción según tipo de fibra.',
                'descripcion' => 'Lavado profesional de alfombras, tapetes y pasillos de alto tráfico, con secado rápido y sin dejar residuo de jabón.',
                'meta' => 'Secado en 4-6 horas',
                'imagen_hint' => 'foto: lavado de alfombra',
                'incluye' => ['Aspirado profundo previo', 'Tratamiento de manchas', 'Lavado por inyección-extracción', 'Desodorización', 'Secado acelerado', 'Revisión de resultado con el cliente'],
                'sectores' => ['Hoteles', 'Oficinas', 'Condominios'],
                'destacado' => false,
            ],
            [
                'categoria' => 'limpieza',
                'nombre' => 'Limpieza de vidrios en altura',
                'resumen' => 'Ventanales y fachadas de vidrio en edificios de varios pisos.',
                'descripcion' => 'Limpieza de ventanales exteriores en altura con técnica de rapel industrial, ideal para torres y edificios de fachada de vidrio.',
                'meta' => 'Resolución 1409 de 2012',
                'imagen_hint' => 'foto: rapel en fachada de vidrio',
                'incluye' => ['Plan de trabajo en altura', 'Aislamiento del área en tierra', 'Limpieza de vidrio exterior e interior', 'Secado sin vetas', 'Retiro de sellante y silicona sobrante', 'Reporte de estado de estructura'],
                'sectores' => ['Edificios corporativos', 'Hoteles'],
                'destacado' => false,
            ],
            [
                'categoria' => 'limpieza',
                'nombre' => 'Aseo para eventos y entrega de inmuebles',
                'resumen' => 'Cuadrillas de refuerzo antes y después de eventos o entregas.',
                'descripcion' => 'Servicio puntual de aseo antes, durante y después de eventos, ferias o entregas de inmuebles, con cuadrilla dimensionada al aforo.',
                'meta' => 'Cuadrilla dimensionada al evento',
                'imagen_hint' => 'foto: montaje de evento',
                'incluye' => ['Aseo previo al montaje', 'Cuadrilla de turno durante el evento', 'Aseo de baños y zonas comunes', 'Recolección y disposición de residuos', 'Aseo final de desmontaje', 'Coordinador en sitio'],
                'sectores' => ['Centros de convenciones', 'Inmobiliarias'],
                'destacado' => false,
            ],
            [
                'categoria' => 'limpieza',
                'nombre' => 'Programas de aseo con cronograma fijo',
                'resumen' => 'Plan mensual de aseo con supervisión y reporte para su sede.',
                'descripcion' => 'Programa de aseo recurrente con cronograma, cuadrilla fija, supervisión periódica y reporte mensual de cumplimiento.',
                'meta' => 'Supervisión y reporte mensual',
                'imagen_hint' => 'foto: supervisor en visita',
                'incluye' => ['Cronograma de actividades por área', 'Cuadrilla fija asignada', 'Visitas de supervisión', 'Reporte mensual de cumplimiento', 'Insumos y dotación incluidos', 'Punto de contacto directo'],
                'sectores' => ['Condominios', 'Clínicas', 'Colegios'],
                'destacado' => false,
            ],

            // Sanitarios y ambientales (5)
            [
                'categoria' => 'sanitarios',
                'nombre' => 'Lavado y desinfección de tanques de agua',
                'resumen' => 'Limpieza, desinfección e impermeabilización con acta y prueba de potabilidad.',
                'descripcion' => 'Limpieza, desinfección e impermeabilización de tanques de almacenamiento, con acta de cumplimiento, prueba de potabilidad y registro fotográfico del antes y después.',
                'meta' => 'Acta y prueba de potabilidad',
                'imagen_hint' => 'foto: tanque · antes / después',
                'incluye' => ['Vaciado y retiro de sedimentos', 'Cepillado de paredes y fondo', 'Desinfección con producto avalado', 'Prueba de potabilidad', 'Acta y registro fotográfico', 'Personal certificado en altura'],
                'sectores' => ['Hoteles', 'Clínicas', 'Condominios', 'Industria'],
                'destacado' => true,
            ],
            [
                'categoria' => 'sanitarios',
                'nombre' => 'Limpieza de trampas de grasa',
                'resumen' => 'Vaciado, lavado y disposición de grasa en cocinas industriales.',
                'descripcion' => 'Vaciado, lavado y desinfección de trampas de grasa en cocinas de hoteles y restaurantes, con disposición final certificada de residuos.',
                'meta' => 'Disposición final certificada',
                'imagen_hint' => 'foto: trampa de grasa',
                'incluye' => ['Vaciado de la trampa', 'Retiro y disposición de grasa', 'Lavado de paredes y rejillas', 'Aplicación de biodegradante', 'Verificación de flujo de drenaje', 'Certificado de disposición'],
                'sectores' => ['Hoteles', 'Restaurantes'],
                'destacado' => true,
            ],
            [
                'categoria' => 'sanitarios',
                'nombre' => 'Desinfección de áreas comunes',
                'resumen' => 'Nebulización y desinfección de superficies de alto contacto.',
                'descripcion' => 'Desinfección por nebulización y superficie de áreas comunes, ascensores, pasillos y zonas de alto tráfico, con producto biodegradable.',
                'meta' => 'Producto biodegradable',
                'imagen_hint' => 'foto: nebulización de área común',
                'incluye' => ['Diagnóstico de áreas críticas', 'Nebulización de espacios cerrados', 'Desinfección de superficies de contacto', 'Ventilación controlada post-aplicación', 'Ficha técnica del producto', 'Certificado de servicio'],
                'sectores' => ['Condominios', 'Clínicas', 'Colegios'],
                'destacado' => false,
            ],
            [
                'categoria' => 'sanitarios',
                'nombre' => 'Control de plagas y fumigación',
                'resumen' => 'Control de roedores, insectos y plagas urbanas con productos registrados.',
                'descripcion' => 'Control integrado de plagas urbanas (roedores, insectos rastreros y voladores) con productos de registro sanitario vigente.',
                'meta' => 'Producto con registro ICA/INVIMA',
                'imagen_hint' => 'foto: técnico en fumigación',
                'incluye' => ['Inspección y diagnóstico de plagas', 'Aplicación de cebos y barreras', 'Fumigación de áreas críticas', 'Sellado de puntos de acceso', 'Ficha técnica y hoja de seguridad', 'Visita de seguimiento'],
                'sectores' => ['Industria', 'Restaurantes', 'Marinas'],
                'destacado' => false,
            ],
            [
                'categoria' => 'sanitarios',
                'nombre' => 'Lavado en seco de tapicería',
                'resumen' => 'Limpieza de sillas, sofás y tapicería vehicular sin humedad residual.',
                'descripcion' => 'Limpieza en seco de tapicería de muebles, sillas y vehículos, ideal para hoteles y flotas, sin dejar humedad ni olor residual.',
                'meta' => 'Sin humedad residual',
                'imagen_hint' => 'foto: lavado de tapicería',
                'incluye' => ['Aspirado previo de la superficie', 'Tratamiento de manchas puntuales', 'Lavado en seco con espuma activa', 'Cepillado y extracción', 'Desodorización final', 'Secado en menos de 2 horas'],
                'sectores' => ['Hoteles', 'Marinas'],
                'destacado' => false,
            ],

            // Obras civiles y mantenimiento (3)
            [
                'categoria' => 'obras',
                'nombre' => 'Impermeabilización de cubiertas y tanques',
                'resumen' => 'Sellado e impermeabilización con manto asfáltico o membrana líquida.',
                'descripcion' => 'Impermeabilización de cubiertas, terrazas y tanques con manto asfáltico o membrana líquida, con garantía sobre el trabajo realizado.',
                'meta' => 'Garantía sobre el trabajo',
                'imagen_hint' => 'foto: impermeabilización de cubierta',
                'incluye' => ['Diagnóstico de filtraciones', 'Limpieza y preparación de superficie', 'Aplicación de imprimante', 'Instalación de manto o membrana', 'Prueba de estanqueidad', 'Garantía escrita'],
                'sectores' => ['Condominios', 'Industria'],
                'destacado' => false,
            ],
            [
                'categoria' => 'obras',
                'nombre' => 'Mantenimiento locativo y pintura',
                'resumen' => 'Pintura, resane y mantenimiento general de interiores y exteriores.',
                'descripcion' => 'Mantenimiento locativo integral: resane, pintura, plomería y electricidad menor para mantener sus instalaciones en óptimas condiciones.',
                'meta' => 'Cuadrilla multioficio',
                'imagen_hint' => 'foto: pintura de fachada interior',
                'incluye' => ['Diagnóstico locativo', 'Resane de muros y techos', 'Pintura interior y exterior', 'Mantenimiento de plomería menor', 'Mantenimiento eléctrico menor', 'Acta de trabajos realizados'],
                'sectores' => ['Condominios', 'Comercios'],
                'destacado' => false,
            ],
            [
                'categoria' => 'obras',
                'nombre' => 'Obras civiles menores y reparaciones',
                'resumen' => 'Reparaciones estructurales menores, drenajes y pisos.',
                'descripcion' => 'Ejecución de obras civiles menores: reparación de pisos, andenes, drenajes y estructuras menores, con supervisión técnica.',
                'meta' => 'Supervisión técnica incluida',
                'imagen_hint' => 'foto: reparación civil menor',
                'incluye' => ['Diagnóstico técnico en sitio', 'Presupuesto detallado de obra', 'Ejecución con supervisión', 'Control de calidad de materiales', 'Aseo posterior a la obra', 'Acta de entrega final'],
                'sectores' => ['Industria', 'Marinas'],
                'destacado' => false,
            ],
        ];

        foreach ($servicios as $i => $servicio) {
            Servicio::create(array_merge($servicio, [
                'codigo' => str_pad((string) ($i + 1), 2, '0', STR_PAD_LEFT),
                'slug' => Str::slug($servicio['nombre']),
                'orden' => $i + 1,
            ]));
        }
    }
}
