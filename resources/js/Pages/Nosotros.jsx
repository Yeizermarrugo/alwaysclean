import { Link } from '@inertiajs/react';
import SiteLayout from '@/Layouts/SiteLayout';

const VALORES_INSTITUCIONALES = ['Afabilidad', 'Calidad', 'Confianza', 'Entusiasmo', 'Innovación', 'Responsabilidad'];
const CREENCIAS = ['Democracia', 'Religión', 'Seguridad', 'Trabajo en equipo'];

const PRINCIPIOS = [
    'Personal capacitado en altura y espacio confinado, Resoluciones 0491/2020 y 1409/2012.',
    'Servicios con productos biodegradables, comprometidos con el ambiente.',
    'Respuesta de trabajo optimizando recursos y tiempo.',
    'Equipos de alta eficiencia para el rendimiento de los trabajos.',
];

const SECTORES = [
    'Condominios', 'Hospitales', 'Centros recreacionales', 'Colegios',
    'Entidades públicas', 'Empresas', 'Restaurantes', 'Centros comerciales',
];

export default function Nosotros() {
    return (
        <SiteLayout title="Nosotros">
            <div className="border-b border-mist-300 bg-mist-50 px-5 py-8 lg:px-10 lg:py-9">
                <div className="mb-2 text-[12.5px] text-ink-500">
                    <Link href={route('home')} className="hover:text-green-dark">Inicio</Link> / Nosotros
                </div>
                <h1 className="mb-2 font-display text-[28px] font-extrabold tracking-tight text-navy lg:text-[34px]">
                    Acerca de Always Clean
                </h1>
                <p className="max-w-[580px] text-[15px] text-navy-500">
                    Ingeniería sanitaria, obra civil y servicios de limpieza, certificados ISO 9001, desde 2020.
                </p>
            </div>

            {/* Acerca de nosotros */}
            <div className="grid gap-9 px-5 py-12 lg:grid-cols-2 lg:px-10 lg:py-14">
                <div>
                    <div className="mb-3 font-sans text-[11px] font-semibold tracking-[0.14em] text-green-dark">ACERCA DE NOSOTROS</div>
                    <p className="text-[15px] leading-relaxed text-navy-600 text-pretty">
                        Always Clean Colombia S.A.S, fundada a principios del año 2020 en el seno de una familia emprendedora
                        para solucionar inicialmente servicios de limpieza y desinfección por la alta demanda provocada por
                        la pandemia, actualmente sigue activa con un crecimiento operacional en los diferentes mercados de
                        ingeniería sanitaria y obra civil, basados en un modelo de negocio versátil comprometido con el
                        medio ambiente y seguridad ocupacional.
                    </p>
                </div>
                <div>
                    <div className="mb-3 font-sans text-[11px] font-semibold tracking-[0.14em] text-green-dark">NUESTROS OBJETIVOS</div>
                    <ul className="flex flex-col gap-3 text-[14.5px] leading-relaxed text-navy-600">
                        <li>Brindar soluciones mostrando como valor representativo la transparencia y más sincera asesoría, enfocada hacia la protección ambiental y producción más limpia.</li>
                        <li>Satisfacer las expectativas de nuestros clientes mediante servicio integral a todos los componentes y necesidades existentes.</li>
                        <li>Promover el uso y aprovechamiento responsable de los recursos naturales, mitigando significativamente los impactos ambientales.</li>
                    </ul>
                </div>
            </div>

            {/* Quiénes somos */}
            <div className="bg-navy-deep px-5 py-12 lg:px-10 lg:py-14">
                <div className="mb-3 font-sans text-[11px] font-semibold tracking-[0.14em] text-green-bright">¿QUIÉNES SOMOS?</div>
                <p className="max-w-[760px] text-[15px] leading-relaxed text-white/75 text-pretty">
                    Somos una empresa especializada en la prestación de servicios de ingeniería sanitaria y construcción
                    de obras civiles, destacada por nuestra trayectoria y compromiso con la sostenibilidad y la innovación
                    en todas nuestras actividades. Comprendemos la importancia de abordar los desafíos actuales desde una
                    perspectiva integral y sostenible, integrando las variables sociales, económicas y ambientales en cada
                    etapa de nuestros proyectos, buscando generar un impacto positivo en la sociedad y mejorar la calidad
                    de vida de las comunidades en las que operamos.
                </p>
            </div>

            {/* Misión / Visión */}
            <div className="grid gap-9 px-5 py-12 lg:grid-cols-2 lg:px-10 lg:py-14">
                <div>
                    <h2 className="mb-2.5 font-display text-2xl font-extrabold text-navy">Misión</h2>
                    <p className="text-[14.5px] leading-relaxed text-navy-600 text-pretty">
                        Convertirnos en líderes en la prestación de servicios de ingeniería sanitaria ambiental y
                        construcción de obras civiles, ofreciendo a nuestros clientes soluciones integrales que garanticen
                        altos estándares de calidad, eficiencia en los tiempos de ejecución y un capital humano altamente
                        calificado, integrando seguridad, calidad y medio ambiente en todas nuestras actividades.
                    </p>
                </div>
                <div>
                    <h2 className="mb-2.5 font-display text-2xl font-extrabold text-navy">Visión</h2>
                    <p className="text-[14.5px] leading-relaxed text-navy-600 text-pretty">
                        Ser una empresa líder a nivel nacional en la prestación de servicios de ingeniería sanitaria y
                        construcción de obras civiles, reconocida por nuestra excelencia en la ejecución de proyectos, la
                        innovación tecnológica y la aplicación de prácticas sostenibles, pioneros en el desarrollo e
                        implementación de soluciones técnicas y ambientales.
                    </p>
                </div>
            </div>

            {/* Valores y creencias */}
            <div className="grid divide-y divide-mist-300 border-y border-mist-300 bg-mist-50 md:grid-cols-2 md:divide-x md:divide-y-0">
                <div className="px-5 py-9 lg:px-10">
                    <div className="mb-3.5 font-sans text-[11px] font-semibold tracking-[0.14em] text-green-dark">VALORES INSTITUCIONALES</div>
                    <div className="flex flex-wrap gap-2">
                        {VALORES_INSTITUCIONALES.map((v) => (
                            <span key={v} className="rounded-full bg-white px-3.5 py-1.5 text-[13px] font-medium text-navy-700 shadow-sm">{v}</span>
                        ))}
                    </div>
                </div>
                <div className="px-5 py-9 lg:px-10">
                    <div className="mb-3.5 font-sans text-[11px] font-semibold tracking-[0.14em] text-green-dark">CREENCIAS</div>
                    <div className="flex flex-wrap gap-2">
                        {CREENCIAS.map((c) => (
                            <span key={c} className="rounded-full bg-white px-3.5 py-1.5 text-[13px] font-medium text-navy-700 shadow-sm">{c}</span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Principios de acción */}
            <div className="grid gap-9 px-5 py-12 lg:grid-cols-[1fr_.8fr] lg:px-10 lg:py-14">
                <div>
                    <h2 className="mb-4 font-display text-2xl font-extrabold text-navy">Principios de acción</h2>
                    <ul className="flex flex-col gap-3.5">
                        {PRINCIPIOS.map((p) => (
                            <li key={p} className="flex gap-3 text-[14.5px] leading-relaxed text-navy-600">
                                <span className="mt-[3px] h-[7px] w-[7px] shrink-0 rounded-full bg-green" />
                                {p}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="rounded-xl bg-mist-50 p-6">
                    <h3 className="mb-3 font-display text-base font-bold text-navy">Formulación para cada tipo de cliente</h3>
                    <div className="flex flex-wrap gap-2">
                        {SECTORES.map((s) => (
                            <span key={s} className="rounded-full bg-white px-3 py-1.5 text-[12.5px] font-medium text-navy-700">{s}</span>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA política */}
            <div className="flex flex-col items-center gap-3 border-t border-mist-300 px-5 py-10 text-center lg:px-10">
                <p className="text-[14.5px] text-navy-500">¿Querés conocer nuestra política integral de gestión?</p>
                <Link
                    href={route('politicas.index')}
                    className="rounded-[9px] border-[1.5px] border-mist-border px-[22px] py-3 font-display text-[14px] font-semibold text-navy"
                >
                    Ver política integral →
                </Link>
            </div>
        </SiteLayout>
    );
}
