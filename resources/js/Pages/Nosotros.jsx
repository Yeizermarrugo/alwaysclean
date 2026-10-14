import { Link, usePage } from '@inertiajs/react';
import SiteLayout from '@/Layouts/SiteLayout';
import Revelar from '@/Components/Site/Revelar';

const OBJETIVOS = [
    'Brindar soluciones mostrando como valor representativo la transparencia y más sincera asesoría, enfocada hacia la protección ambiental y producción más limpia.',
    'Satisfacer las expectativas de nuestros clientes mediante servicio integral a todos los componentes y necesidades existentes.',
    'Promover el uso y aprovechamiento responsable de los recursos naturales, mitigando significativamente los impactos ambientales.',
];

const VALORES_INSTITUCIONALES = ['Afabilidad', 'Calidad', 'Confianza', 'Entusiasmo', 'Innovación', 'Responsabilidad'];
const CREENCIAS = ['Democracia', 'Religión', 'Seguridad', 'Trabajo en equipo'];

const PRINCIPIOS = [
    {
        titulo: 'Personal certificado',
        texto: 'Capacitado en trabajo en altura y espacios confinados, Resoluciones 0491/2020 y 1409/2012.',
        icono: 'M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5l-8-3Zm-1.2 13.6-3.4-3.4 1.4-1.4 2 2 4.6-4.6 1.4 1.4-6 6Z',
    },
    {
        titulo: 'Compromiso ambiental',
        texto: 'Servicios con productos biodegradables, comprometidos con el ambiente.',
        icono: 'M17 8C8 10 5.9 16.2 3.8 21.4l1.9.7 1-2.3c.5.2 1 .2 1.3.2C19 20 22 3 22 3c-1 2-8 2.3-13 3.3S2 11.5 2 13.5 3.8 17.3 3.8 17.3C7 8 17 8 17 8Z',
    },
    {
        titulo: 'Respuesta eficiente',
        texto: 'Respuesta de trabajo optimizando recursos y tiempo.',
        icono: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 10.4 3.5 2.1-.8 1.3L11 13V7h2v5.4Z',
    },
    {
        titulo: 'Tecnología y equipos',
        texto: 'Equipos de alta eficiencia para el rendimiento de los trabajos.',
        icono: 'M22.7 19 13.6 9.9c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4Z',
    },
];

const SECTORES = [
    'Condominios', 'Hospitales', 'Centros recreacionales', 'Colegios',
    'Entidades públicas', 'Empresas', 'Restaurantes', 'Centros comerciales',
];

function Eyebrow({ children, light = false }) {
    return (
        <div className={`mb-3 font-sans text-[11px] font-semibold tracking-[0.14em] ${light ? 'text-green-bright' : 'text-green-dark'}`}>
            {children}
        </div>
    );
}

function Titulo({ children, light = false }) {
    return (
        <h2 className={`font-display text-[26px] font-extrabold leading-tight tracking-tight lg:text-[32px] ${light ? 'text-white' : 'text-navy'}`}>
            {children}
        </h2>
    );
}

export default function Nosotros() {
    const { empresa } = usePage().props;
    const datos = [
        { valor: '2020', label: 'Año de fundación' },
        { valor: 'ISO 9001', label: 'Gestión de calidad' },
        { valor: SECTORES.length, label: 'Sectores atendidos' },
        { valor: empresa.ciudad, label: 'Sede principal' },
    ];

    return (
        <SiteLayout title="Nosotros">
            {/* Hero */}
            <section className="relative overflow-hidden bg-navy-deep px-5 pb-0 pt-10 lg:px-10 lg:pt-14">
                <div
                    className="pointer-events-none absolute -right-32 -top-32 h-[420px] w-[420px] rounded-full bg-green/20 blur-3xl"
                    aria-hidden="true"
                />
                <Revelar className="relative">
                    <div className="mb-6 text-[12.5px] text-white/50">
                        <Link href={route('home')} className="hover:text-green-bright">Inicio</Link> / Nosotros
                    </div>
                    <Eyebrow light>ACERCA DE ALWAYS CLEAN</Eyebrow>
                    <h1 className="max-w-[760px] font-display text-[32px] font-extrabold leading-[1.1] tracking-tight text-white lg:text-[48px]">
                        Ingeniería sanitaria y obra civil con compromiso ambiental.
                    </h1>
                    <p className="mt-4 max-w-[580px] text-[15.5px] leading-relaxed text-white/70">
                        Servicios de ingeniería sanitaria, obra civil y limpieza especializada, integrando seguridad,
                        calidad y medio ambiente en cada proyecto.
                    </p>
                </Revelar>

                <div className="relative mt-10 grid grid-cols-2 gap-px overflow-hidden border-t border-white/10 bg-white/10 lg:mt-14 lg:grid-cols-4">
                    {datos.map((d, i) => (
                        <Revelar key={d.label} retraso={200 + i * 100} className="group bg-navy-deep py-6 pr-4 lg:px-8 lg:first:pl-0">
                            <div className="font-display text-[24px] font-extrabold text-white transition-colors group-hover:text-green-bright lg:text-[30px]">{d.valor}</div>
                            <div className="mt-0.5 text-[12.5px] text-white/55">{d.label}</div>
                        </Revelar>
                    ))}
                </div>
            </section>

            {/* Historia / Quiénes somos */}
            <section className="grid gap-8 px-5 py-14 lg:grid-cols-[.85fr_1.15fr] lg:gap-16 lg:px-10 lg:py-20">
                <Revelar efecto="izq" className="lg:sticky lg:top-8 lg:self-start">
                    <span className="raya-titulo mb-4" aria-hidden="true" />
                    <Eyebrow>QUIÉNES SOMOS</Eyebrow>
                    <Titulo>Nacimos para resolver, crecimos para construir.</Titulo>
                </Revelar>
                <Revelar retraso={150} className="flex flex-col gap-5 text-[15px] leading-relaxed text-navy-600 text-pretty">
                    <p>
                        Always Clean Colombia S.A.S. fue fundada a principios del año 2020 en el seno de una familia
                        emprendedora para solucionar inicialmente servicios de limpieza y desinfección por la alta demanda
                        provocada por la pandemia. Actualmente sigue activa con un crecimiento operacional en los diferentes
                        mercados de ingeniería sanitaria y obra civil, basados en un modelo de negocio versátil comprometido
                        con el medio ambiente y la seguridad ocupacional.
                    </p>
                    <p>
                        Somos una empresa especializada en la prestación de servicios de ingeniería sanitaria y construcción
                        de obras civiles, destacada por nuestra trayectoria y compromiso con la sostenibilidad y la innovación.
                        Integramos las variables sociales, económicas y ambientales en cada etapa de nuestros proyectos,
                        buscando generar un impacto positivo y mejorar la calidad de vida de las comunidades en las que operamos.
                    </p>
                </Revelar>
            </section>

            {/* Misión / Visión */}
            <section className="grid gap-5 bg-mist-50 px-5 py-14 md:grid-cols-2 lg:px-10 lg:py-20">
                {[
                    {
                        titulo: 'Misión',
                        texto: 'Convertirnos en líderes en la prestación de servicios de ingeniería sanitaria ambiental y construcción de obras civiles, ofreciendo a nuestros clientes soluciones integrales que garanticen altos estándares de calidad, eficiencia en los tiempos de ejecución y un capital humano altamente calificado, integrando seguridad, calidad y medio ambiente en todas nuestras actividades.',
                    },
                    {
                        titulo: 'Visión',
                        texto: 'Ser una empresa líder a nivel nacional en la prestación de servicios de ingeniería sanitaria y construcción de obras civiles, reconocida por nuestra excelencia en la ejecución de proyectos, la innovación tecnológica y la aplicación de prácticas sostenibles, pioneros en el desarrollo e implementación de soluciones técnicas y ambientales.',
                    },
                ].map((b, i) => (
                    <Revelar
                        as="article"
                        key={b.titulo}
                        efecto={i === 0 ? 'izq' : 'der'}
                        className="group relative overflow-hidden rounded-2xl border border-mist-300 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-18px_rgba(15,23,42,0.3)] lg:p-9"
                    >
                        <div className="absolute left-0 top-0 h-full w-1 bg-green transition-all duration-500 group-hover:w-1.5" aria-hidden="true" />
                        <Eyebrow>NUESTRA {b.titulo.toUpperCase()}</Eyebrow>
                        <h3 className="mb-3 font-display text-2xl font-extrabold text-navy">{b.titulo}</h3>
                        <p className="text-[14.5px] leading-relaxed text-navy-600 text-pretty">{b.texto}</p>
                    </Revelar>
                ))}
            </section>

            {/* Objetivos */}
            <section className="px-5 py-14 lg:px-10 lg:py-20">
                <Revelar className="mb-9 max-w-[560px]">
                    <span className="raya-titulo mb-4" aria-hidden="true" />
                    <Eyebrow>NUESTROS OBJETIVOS</Eyebrow>
                    <Titulo>Lo que buscamos en cada proyecto</Titulo>
                </Revelar>
                <ol className="grid gap-5 md:grid-cols-3">
                    {OBJETIVOS.map((o, i) => (
                        <Revelar as="li" key={i} retraso={i * 130} className="group flex flex-col gap-4 border-t-2 border-navy pt-5 transition-colors hover:border-green">
                            <span className="font-display text-[15px] font-extrabold text-green-dark transition-transform duration-300 group-hover:translate-x-1">
                                {String(i + 1).padStart(2, '0')}
                            </span>
                            <p className="text-[14.5px] leading-relaxed text-navy-600 text-pretty">{o}</p>
                        </Revelar>
                    ))}
                </ol>
            </section>

            {/* Principios de acción */}
            <section className="bg-navy px-5 py-14 lg:px-10 lg:py-20">
                <Revelar className="mb-9 max-w-[560px]">
                    <span className="raya-titulo mb-4" aria-hidden="true" />
                    <Eyebrow light>PRINCIPIOS DE ACCIÓN</Eyebrow>
                    <Titulo light>Cómo trabajamos</Titulo>
                </Revelar>
                <div className="grid gap-px overflow-hidden rounded-2xl bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
                    {PRINCIPIOS.map((p, i) => (
                        <Revelar key={p.titulo} retraso={i * 110} className="group flex flex-col gap-3 bg-navy p-6 transition-colors duration-300 hover:bg-[#13136e] lg:p-7">
                            <span className="grid h-11 w-11 place-items-center rounded-xl bg-green/15 text-green-bright transition duration-300 group-hover:-translate-y-0.5 group-hover:scale-110 group-hover:bg-green group-hover:text-white">
                                <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill="currentColor" aria-hidden="true">
                                    <path d={p.icono} />
                                </svg>
                            </span>
                            <h3 className="font-display text-[17px] font-bold text-white">{p.titulo}</h3>
                            <p className="text-[14px] leading-relaxed text-white/65">{p.texto}</p>
                        </Revelar>
                    ))}
                </div>
            </section>

            {/* Valores y creencias */}
            <section className="px-5 py-14 lg:px-10 lg:py-20">
                <Revelar>
                    <span className="raya-titulo mb-4" aria-hidden="true" />
                    <Eyebrow>NUESTRA CULTURA</Eyebrow>
                </Revelar>
                <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
                    <div>
                        <Titulo>Valores institucionales</Titulo>
                        <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3">
                            {VALORES_INSTITUCIONALES.map((v, i) => (
                                <Revelar
                                    key={v}
                                    efecto="zoom"
                                    retraso={i * 70}
                                    className="group flex items-center gap-3 rounded-xl border border-mist-300 px-4 py-4 transition duration-300 hover:-translate-y-0.5 hover:border-green hover:bg-green-light"
                                >
                                    <span className="h-2 w-2 shrink-0 rounded-full bg-green transition-transform duration-300 group-hover:scale-150" aria-hidden="true" />
                                    <span className="font-display text-[14.5px] font-semibold text-navy">{v}</span>
                                </Revelar>
                            ))}
                        </div>
                    </div>
                    <div>
                        <Titulo>Creencias</Titulo>
                        <ul className="mt-7 divide-y divide-mist-300 border-y border-mist-300">
                            {CREENCIAS.map((c, i) => (
                                <Revelar
                                    as="li"
                                    key={c}
                                    efecto="der"
                                    retraso={i * 90}
                                    className="py-3.5 font-display text-[14.5px] font-semibold text-navy transition-colors hover:text-green-dark"
                                >
                                    {c}
                                </Revelar>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* Sectores */}
            <section className="border-t border-mist-300 bg-mist-50 px-5 py-14 lg:px-10 lg:py-20">
                <Revelar className="mb-9 flex flex-col justify-between gap-3 md:flex-row md:items-end">
                    <div className="max-w-[560px]">
                        <span className="raya-titulo mb-4" aria-hidden="true" />
                        <Eyebrow>SECTORES</Eyebrow>
                        <Titulo>Una formulación para cada tipo de cliente</Titulo>
                    </div>
                    <Link href={route('servicios.index')} className="group font-display text-[13.5px] font-semibold text-green-dark hover:text-green">
                        Ver servicios <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                    </Link>
                </Revelar>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    {SECTORES.map((s, i) => (
                        <Revelar
                            key={s}
                            retraso={(i % 4) * 90}
                            className="rounded-xl bg-white px-4 py-5 font-display text-[14px] font-semibold text-navy shadow-[0_1px_0_rgba(13,13,91,0.06)] ring-1 ring-mist-300 transition duration-300 hover:-translate-y-1 hover:text-green-dark hover:shadow-[0_14px_30px_-16px_rgba(15,23,42,0.35)] hover:ring-green/50"
                        >
                            {s}
                        </Revelar>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="px-5 py-12 lg:px-10 lg:py-16">
                <Revelar efecto="zoom" className="flex flex-col items-start gap-6 rounded-2xl bg-navy-deep p-8 lg:flex-row lg:items-center lg:justify-between lg:p-10">
                    <div className="max-w-[560px]">
                        <h2 className="mb-2 font-display text-[22px] font-extrabold text-white lg:text-[26px]">
                            Seguridad, calidad y ambiente en un solo sistema
                        </h2>
                        <p className="text-[14.5px] leading-relaxed text-white/65">
                            Conozca nuestra política integral de gestión o solicite una cotización para su proyecto.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <Link
                            href={route('politicas.index')}
                            className="rounded-[9px] border-[1.5px] border-white/25 px-5 py-3 font-display text-[14px] font-semibold text-white hover:border-white/50"
                        >
                            Política integral
                        </Link>
                        <Link
                            href={route('contacto.create')}
                            className="rounded-[9px] bg-green px-5 py-3 font-display text-[14px] font-semibold text-white transition hover:-translate-y-0.5 hover:bg-green-dark"
                        >
                            Solicitar cotización
                        </Link>
                    </div>
                </Revelar>
            </section>
        </SiteLayout>
    );
}
