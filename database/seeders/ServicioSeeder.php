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
            // Limpieza (5)
            [
                'categoria' => 'limpieza',
                'nombre' => 'Limpieza locativa y aseo general',
                'resumen' => 'Cuadrilla especializada para limpieza doméstica o empresarial.',
                'descripcion' => 'Grupo de trabajadores especializado a su disposición para labores de limpieza doméstica o empresarial, con capacitación en aseo general, cocina, ropa y cuidado del hogar.',
                'meta' => 'Personal capacitado',
                'imagen_hint' => 'foto: cuadrilla de aseo general',
                'imagen' => 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=75',
                'incluye' => ['Aseo general y desinfección manual', 'Limpieza interior de ventanas', 'Lavado de baños y cocina', 'Preparación de alimentos', 'Limpieza de apartamentos, oficinas y bodegas', 'Lavado y planchado de ropa'],
                'sectores' => ['Hogares', 'Oficinas', 'Comercios'],
                'destacado' => true,
            ],
            [
                'categoria' => 'limpieza',
                'nombre' => 'Limpieza de ventanas y fachadas',
                'resumen' => 'Cristales y fachadas relucientes, con equipo de alta presión y trabajo en altura.',
                'descripcion' => 'Removemos la suciedad difícil de quitar en cristales y fachadas expuestas a alta contaminación, con productos especializados biodegradables y equipos de alta presión y seguridad para trabajos en altura.',
                'meta' => 'Equipo de seguridad para alturas',
                'imagen_hint' => 'foto: fachada en altura',
                'imagen' => 'https://images.unsplash.com/photo-1635445818409-64a0ff92eb39?auto=format&fit=crop&w=900&q=75',
                'incluye' => ['Limpieza de cristales y ventanales', 'Lavado de fachadas expuestas a contaminación', 'Productos especializados biodegradables', 'Equipos de alta presión', 'Equipo de seguridad para trabajo en altura'],
                'sectores' => ['Hoteles', 'Centros comerciales', 'Edificios corporativos'],
                'destacado' => false,
            ],
            [
                'categoria' => 'limpieza',
                'nombre' => 'Lavado en seco de muebles, colchones y alfombras',
                'resumen' => 'Hidroinyección y vapor para muebles, colchones, alfombras y cortinas.',
                'descripcion' => 'Lavado en seco con equipos de hidroinyección que eliminan ácaros de forma inmediata y equipos de vapor a más de 120°C, con sistema de filtrado que deja el aire libre de partículas.',
                'meta' => 'Secado rápido, sin humedad residual',
                'imagen_hint' => 'foto: lavado en seco de mueble',
                'imagen' => 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=75',
                'incluye' => ['Muebles, colchones y alfombras', 'Cortinas y blackout', 'Equipos aptos para telas y cuero', 'No deteriora fibras ni rellenos', 'Secado rápido para uso inmediato', 'Productos amigables con el medio ambiente'],
                'sectores' => ['Hoteles', 'Oficinas', 'Condominios'],
                'destacado' => false,
            ],
            [
                'categoria' => 'limpieza',
                'nombre' => 'Lavado interior y exterior de vehículos',
                'resumen' => 'Lavado de vehículos con desinfección de cabina y aire acondicionado.',
                'descripcion' => 'Lavado de vehículos respetuoso con el medio ambiente, con desmonte interior en caso de derrames o inundación y desinfección de cabina y ductos de aire acondicionado.',
                'meta' => 'Productos de alta calidad',
                'imagen_hint' => 'foto: lavado de vehículo',
                'imagen' => null,
                'incluye' => ['Lavado exterior detallado', 'Desmonte y limpieza interior', 'Eliminación de malos olores', 'Desinfección de cabina', 'Desinfección de ductos de aire acondicionado'],
                'sectores' => ['Particulares', 'Flotas', 'Concesionarios'],
                'destacado' => false,
            ],
            [
                'categoria' => 'limpieza',
                'nombre' => 'Limpieza de embarcaciones, yates, lanchas y botes',
                'resumen' => 'Lavado y desinfección de yates, lanchas y botes.',
                'descripcion' => 'Lavado de embarcaciones respetuoso con el medio ambiente, con desmonte interior en caso de derrames o inundación y desinfección de cabina y aire acondicionado.',
                'meta' => 'Productos de alta calidad',
                'imagen_hint' => 'foto: limpieza de embarcaciones',
                'imagen' => null,
                'incluye' => ['Lavado exterior detallado', 'Desmonte y limpieza interior', 'Eliminación de malos olores', 'Desinfección de cabina', 'Desinfección de aire acondicionado'],
                'sectores' => ['Marinas', 'Particulares'],
                'destacado' => false,
            ],

            // Sanitarios y ambientales (5)
            [
                'categoria' => 'sanitarios',
                'nombre' => 'Lavado y desinfección de tanques de agua',
                'resumen' => 'Limpieza, desinfección y certificado sanitario avalado por el DADIS.',
                'descripcion' => 'Programa de mantenimiento preventivo de limpieza y desinfección de tanques y reservas de agua, según la Ley 9 de 1979 y el Decreto 1575 de 2007, con personal certificado en trabajo en altura y espacio confinado.',
                'meta' => 'Certificado sanitario DADIS',
                'imagen_hint' => 'foto: tanque · antes / después',
                'imagen' => 'https://images.unsplash.com/photo-1560320652-6acbefacb0fd?auto=format&fit=crop&w=900&q=75',
                'incluye' => ['Vaciado y retiro de sedimentos', 'Cepillado de paredes y fondo', 'Desinfección con producto no tóxico ni corrosivo', 'Control de hongos, virus, bacterias, algas y levaduras', 'Informe técnico de condiciones y mejoras', 'Certificado sanitario avalado por el DADIS'],
                'sectores' => ['Hoteles', 'Clínicas', 'Condominios', 'Industria'],
                'destacado' => true,
            ],
            [
                'categoria' => 'sanitarios',
                'nombre' => 'Desinfección y sanitización de espacios',
                'resumen' => 'Brigadas de desinfección biológica, aspersión, termonebulización y vapor sin químicos.',
                'descripcion' => 'Servicios de desinfección para espacios con riesgo de agentes infecciosos: limpieza manual, aspersión de productos químicos y termonebulización con biocida de amplio espectro, dirigidos a empresas, edificios, vehículos y hospitales.',
                'meta' => 'Productos biodegradables certificados',
                'imagen_hint' => 'foto: nebulización de espacio',
                'imagen' => 'https://images.unsplash.com/photo-1584744982491-665216d95f8b?auto=format&fit=crop&w=900&q=75',
                'incluye' => ['Brigadas de limpieza y desinfección biológica', 'Aspersión de productos químicos', 'Termonebulización con biocida de amplio espectro', 'Vapor sin químicos a 150°C', 'Tratamientos rápidos y eficientes', 'Desinfectantes certificados y biodegradables'],
                'sectores' => ['Empresas', 'Edificios', 'Vehículos', 'Hospitales'],
                'destacado' => false,
            ],
            [
                'categoria' => 'sanitarios',
                'nombre' => 'Control y exterminación de plagas',
                'resumen' => 'Control integrado de insectos, roedores y ofidios con personal certificado.',
                'descripcion' => 'Control y manejo integrado de plagas (insectos, roedores, ofidios) con equipos especializados, avalado por la entidad de Salud Pública, sin afectar la naturaleza ni la salud pública.',
                'meta' => 'Personal certificado en fumigación',
                'imagen_hint' => 'foto: técnico en fumigación',
                'imagen' => 'https://images.unsplash.com/photo-1670989292166-8b20b9530438?auto=format&fit=crop&w=900&q=75',
                'incluye' => ['Bomba aspersora a motor para áreas exteriores', 'Bomba aspersora manual para áreas interiores', 'Control de hormigas, cucarachas y moscas en gel', 'Nebulizador eléctrico', 'Cajas porta-cebo para roedores', 'Dron aspersor'],
                'sectores' => ['Industria', 'Restaurantes', 'Marinas'],
                'destacado' => true,
            ],
            [
                'categoria' => 'sanitarios',
                'nombre' => 'Asesoría e implementación de saneamiento básico',
                'resumen' => 'Diagnóstico, diseño e implementación de su plan de saneamiento básico.',
                'descripcion' => 'Diseño e implementación de un plan de saneamiento básico a la medida de su empresa: diagnóstico inicial, recopilación de datos, diseño del plan y capacitación del personal para su cumplimiento.',
                'meta' => 'Cumple requisito legal vigente',
                'imagen_hint' => 'foto: diagnóstico de saneamiento básico',
                'imagen' => null,
                'incluye' => ['Visita de diagnóstico inicial', 'Estudio de instalaciones, maquinaria y utensilios', 'Diseño del plan de saneamiento por actividad', 'Definición de procedimientos y métodos de limpieza', 'Entrega en medio físico y magnético', 'Capacitación del personal y visita de seguimiento'],
                'sectores' => ['Restaurantes', 'Industria', 'Comercios'],
                'destacado' => false,
            ],
            [
                'categoria' => 'sanitarios',
                'nombre' => 'Asesoría, mantenimiento y limpieza de PTAP-PTAR',
                'resumen' => 'Mantenimiento de plantas de tratamiento de agua potable y residual.',
                'descripcion' => 'Asesoría y mantenimiento de plantas de tratamiento de agua (PTAP) y aguas residuales (PTAR), garantizando que el agua mantenga las propiedades y el tiempo de retención necesarios en cada etapa del tratamiento.',
                'meta' => 'Operación continua garantizada',
                'imagen_hint' => 'foto: mantenimiento PTAP-PTAR',
                'imagen' => null,
                'incluye' => ['Mantenimiento de tanques de homogenización', 'Verificación de condiciones para tratamiento', 'Control del tiempo de retención de diseño', 'Regulación de cargas orgánicas', 'Verificación de propiedades para descarga ambiental'],
                'sectores' => ['Industria', 'Condominios', 'Constructoras'],
                'destacado' => false,
            ],

            // Obras civiles y mantenimiento (4)
            [
                'categoria' => 'obras',
                'nombre' => 'Plomería y fontanería',
                'resumen' => 'Daños en tuberías hidráulicas, instalaciones y mantenimiento, 24 horas.',
                'descripcion' => 'Cubrimos todo tipo de daños en tuberías hidráulicas, instalaciones y mantenimiento, con personal calificado disponible las 24 horas del día.',
                'meta' => 'Atención las 24 horas',
                'imagen_hint' => 'foto: reparación de tuberías',
                'imagen' => null,
                'incluye' => ['Instalación de redes de acueducto y alcantarillado', 'Diseño de redes de acueducto', 'Instalación de tanques plásticos y válvulas', 'Instalación de hidrantes, medidores y macromedidores', 'Destape, sondeo y limpieza de tuberías', 'Instalación, reparación y mantenimiento de grifería'],
                'sectores' => ['Industria', 'Condominios', 'Comercios'],
                'destacado' => false,
            ],
            [
                'categoria' => 'obras',
                'nombre' => 'Paisajismo, jardinería, tala, poda y reforestación',
                'resumen' => 'Diseño, mantenimiento y remodelación de jardines, parques y zonas verdes.',
                'descripcion' => 'Consultoría en diseño, construcción y mantenimiento de jardines, zonas verdes y parques, incluyendo tala, poda, forestación y reforestación, cumpliendo los requisitos legales de las autoridades ambientales.',
                'meta' => 'Cumple normativa ambiental vigente',
                'imagen_hint' => 'foto: jardinería y poda',
                'imagen' => null,
                'incluye' => ['Paisajismo y diseño de espacios verdes', 'Jardinería y siembra', 'Tala con concepto técnico ambiental', 'Poda de reducción de riesgo', 'Forestación de nuevas especies', 'Reforestación de zonas existentes'],
                'sectores' => ['Constructoras', 'Condominios', 'Fincas y complejos residenciales'],
                'destacado' => false,
            ],
            [
                'categoria' => 'obras',
                'nombre' => 'Limpieza y mantenimiento de aires acondicionados',
                'resumen' => 'Mantenimiento preventivo y correctivo con técnicos capacitados en alturas.',
                'descripcion' => 'Mantenimiento preventivo y correctivo de aires acondicionados que evita la acumulación de ácaros y previene averías y sobrecostos por consumo de energía, con técnicos capacitados en trabajo en alturas.',
                'meta' => 'Técnicos con entrenamiento en alturas',
                'imagen_hint' => 'foto: mantenimiento de aire acondicionado',
                'imagen' => null,
                'incluye' => ['Mantenimiento preventivo', 'Mantenimiento correctivo', 'Reducción de consumo de energía', 'Control de acumulación de ácaros', 'Técnicos con entrenamiento en alturas'],
                'sectores' => ['Hogares', 'Oficinas', 'Comercios'],
                'destacado' => false,
            ],
            [
                'categoria' => 'obras',
                'nombre' => 'Mantenimiento preventivo y correctivo de infraestructuras',
                'resumen' => 'Reparación de edificaciones, piscinas y tanques con equipo especializado.',
                'descripcion' => 'Mantenimiento y reparación de edificaciones, piscinas, tanques de concreto y de fibra, reduciendo el riesgo de fallos y daños humanos y materiales.',
                'meta' => 'Equipo especializado y experiencia',
                'imagen_hint' => 'foto: mantenimiento de infraestructura',
                'imagen' => 'https://images.unsplash.com/photo-1632759145351-1d592919f522?auto=format&fit=crop&w=900&q=75',
                'incluye' => ['Impermeabilización con manto edil frío o caliente', 'Impermeabilización con recubrimiento elástico', 'Aplicación de pintura de poliuretano', 'Aplicación de membranas PVC y estuco plástico', 'Soldadura y mantenimiento de estructuras metálicas', 'Carpintería y remodelación de espacios'],
                'sectores' => ['Condominios', 'Industria', 'Constructoras'],
                'destacado' => true,
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
