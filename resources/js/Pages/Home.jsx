import { Link, usePage } from '@inertiajs/react';
import SiteLayout from '@/Layouts/SiteLayout';
import ServiceCard from '@/Components/Site/ServiceCard';
import ServiceRow from '@/Components/Site/ServiceRow';
import ClientesCarousel from '@/Components/Site/ClientesCarousel';
import PreguntasFrecuentes from '@/Components/Site/PreguntasFrecuentes';
import RedesSociales from '@/Components/Site/RedesSociales';
import { waLink } from '@/lib/whatsapp';

const SEGMENTOS = [
    { kicker: 'Comercios y empresas', texto: 'Centros comerciales, recreacionales y plantas, con supervisión y reporte mensual.' },
    { kicker: 'Hoteles y restaurantes', texto: 'Desinfección, trampas de grasa y lavado en seco de tapicería.' },
    { kicker: 'Entidades públicas y privadas', texto: 'Condominios, clínicas, hospitales y colegios, con acta por visita.' },
];

const VALORES = [
    { titulo: 'Trabajo en altura', texto: 'Personal capacitado en altura y espacio confinado. Resoluciones 0491/2020 y 1409/2012.' },
    { titulo: 'Productos biodegradables', texto: 'Formulaciones de bajo impacto ambiental en todos los servicios.' },
    { titulo: 'Alta eficiencia', texto: 'Equipos industriales que reducen el tiempo de intervención en sitio.' },
];

const CATEGORIA_LABEL = {
    limpieza: 'Limpieza',
    sanitarios: 'Sanitarios y ambientales',
    obras: 'Obras civiles y mantenimiento',
};

export default function Home({ destacados, todos, conteos, productos, preguntas }) {
    const { empresa } = usePage().props;
    const totalServicios = todos.length;

    return (
        <SiteLayout title="Limpieza, desinfección y saneamiento en Cartagena" headerTransparente>
            {/* Hero */}
            <style>{`
                @keyframes hero-sube {
                    from { opacity: 0; transform: translateY(18px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes hero-linea {
                    from { transform: scaleY(0); }
                    to { transform: scaleY(1); }
                }
                .hero-sube { animation: hero-sube .8s cubic-bezier(.2,.8,.2,1) both; }
                .hero-linea { animation: hero-linea 1.2s cubic-bezier(.2,.8,.2,1) .9s both; transform-origin: top; }
                @media (prefers-reduced-motion: reduce) {
                    .hero-sube, .hero-linea { animation: none; }
                }
            `}</style>
            <section className="min-h-pantalla relative isolate flex items-center overflow-hidden bg-navy">
                <img
                    src="/images/servicios/lavado-y-desinfeccion-de-tanques-de-agua.jpg"
                    alt=""
                    className="absolute inset-0 -z-20 h-full w-full object-cover"
                />
                <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#04041c]/95 via-[#04041c]/85 to-navy-deep/60" aria-hidden="true" />
                <div className="absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-[#04041c]/80 to-transparent" aria-hidden="true" />

                <div className="mx-auto w-full max-w-6xl px-5 pb-20 pt-32 sm:px-10 md:pt-40 lg:px-16">
                    <h1 className="hero-sube font-display text-[34px] font-extrabold uppercase leading-[1.05] tracking-tight text-white text-balance sm:text-5xl lg:text-[64px]">
                        Bienvenidos a {empresa.nombre}
                    </h1>
                    <p
                        className="hero-sube mt-6 max-w-4xl text-[13px] font-bold uppercase leading-relaxed tracking-[0.18em] text-white/70 sm:text-[15px]"
                        style={{ animationDelay: '.15s' }}
                    >
                        Limpieza, desinfección, saneamiento básico y obras civiles con personal certificado en trabajo en altura y productos biodegradables.
                    </p>
                    <div className="hero-sube mt-12 flex flex-wrap gap-4" style={{ animationDelay: '.3s' }}>
                        <Link
                            href={route('contacto.create')}
                            className="border-2 border-white px-7 py-4 font-display text-[13px] font-bold uppercase tracking-[0.16em] text-white transition-colors duration-200 hover:border-green hover:bg-green"
                        >
                            Solicitar cotización
                        </Link>
                        <Link
                            href={route('nosotros.index')}
                            className="border-2 border-white px-7 py-4 font-display text-[13px] font-bold uppercase tracking-[0.16em] text-white transition-colors duration-200 hover:bg-white hover:text-navy"
                        >
                            Sobre nosotros
                        </Link>
                    </div>
                    <RedesSociales className="hero-sube mt-10 flex gap-3 lg:hidden" />
                </div>

                <RedesSociales className="absolute right-6 top-1/2 hidden -translate-y-1/2 flex-col gap-3 lg:flex xl:right-10" />

                <a
                    href="#segmentos"
                    className="absolute bottom-0 right-28 hidden items-start gap-3 font-display text-[11px] font-bold uppercase tracking-[0.22em] text-white md:flex lg:right-32"
                >
                    <span className="flex items-center gap-2 pt-1">
                        <svg viewBox="0 0 24 24" className="h-4 w-4 text-green" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                            <path d="m6 9 6 6 6-6" />
                        </svg>
                        Sigue navegando
                    </span>
                    <span className="hero-linea block h-24 w-0.5 bg-green" aria-hidden="true" />
                </a>
            </section>

            {/* Segmentos */}
            <div id="segmentos" className="scroll-mt-4 grid divide-y divide-mist-300 border-b border-mist-300 md:grid-cols-3 md:divide-x md:divide-y-0">
                {SEGMENTOS.map((s) => (
                    <div key={s.kicker} className="flex flex-col gap-1.5 px-6 py-6 lg:px-8">
                        <div className="font-sans text-[11px] font-semibold tracking-[0.14em] text-green-dark">{s.kicker.toUpperCase()}</div>
                        <div className="text-[14.5px] leading-relaxed text-navy-600">{s.texto}</div>
                    </div>
                ))}
            </div>

            {/* Servicios más solicitados */}
            <div className="px-5 py-12 lg:px-10 lg:py-14">
                <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-end">
                    <div>
                        <h2 className="mb-1.5 font-display text-[28px] font-extrabold tracking-tight text-navy lg:text-[32px]">
                            Nuestros servicios más solicitados
                        </h2>
                        <p className="text-[15px] text-navy-500">{totalServicios} servicios en tres líneas de trabajo.</p>
                    </div>
                    <Link href={route('servicios.index')} className="font-display text-[13.5px] font-semibold text-green-dark">
                        Ver el portafolio completo →
                    </Link>
                </div>
                <div className="mb-6 flex flex-wrap gap-2">
                    <Link href={route('servicios.index')} className="rounded-full bg-navy px-[15px] py-2 font-display text-[13px] font-semibold text-white">
                        Todos
                    </Link>
                    {Object.entries(CATEGORIA_LABEL).map(([key, label]) => (
                        <Link
                            key={key}
                            href={route('servicios.index', { categoria: key })}
                            className="rounded-full bg-mist-100 px-[15px] py-2 font-display text-[13px] font-semibold text-navy-700"
                        >
                            {label} · {conteos[key] ?? 0}
                        </Link>
                    ))}
                </div>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                    {destacados.map((s) => (
                        <ServiceCard key={s.id} servicio={s} />
                    ))}
                </div>
                <div className="mt-7 grid grid-cols-1 gap-x-10 gap-y-0.5 border-t border-mist-300 pt-6 md:grid-cols-3">
                    {todos.map((s) => (
                        <ServiceRow key={s.id} servicio={s} />
                    ))}
                </div>
            </div>

            {/* Valores */}
            <div className="grid gap-9 bg-navy px-5 py-12 md:grid-cols-3 lg:px-10">
                {VALORES.map((v) => (
                    <div key={v.titulo} className="flex flex-col gap-2.5">
                        <div className="h-[3px] w-[34px] bg-green" />
                        <div className="font-display text-[19px] font-bold text-white">{v.titulo}</div>
                        <div className="text-[14.5px] leading-relaxed text-white/68">{v.texto}</div>
                    </div>
                ))}
            </div>

            {/* Productos */}
            <div className="bg-mist-50 px-5 py-12 lg:px-10 lg:py-14">
                <div className="mb-7 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
                    <div>
                        <div className="mb-1.5 font-sans text-[11px] font-semibold tracking-[0.14em] text-green-dark">LÍNEA PROPIA</div>
                        <h2 className="mb-2 font-display text-[26px] font-extrabold tracking-tight text-navy lg:text-[30px]">
                            Productos especializados
                        </h2>
                        <p className="max-w-[480px] text-[15px] leading-relaxed text-navy-500">
                            Solventes biodegradables para trampas de grasa, drenajes y orinales.
                        </p>
                    </div>
                    <Link
                        href={route('productos.index')}
                        className="whitespace-nowrap font-display text-[13.5px] font-semibold text-green-dark hover:text-green"
                    >
                        Ver catálogo completo →
                    </Link>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {productos.map((p) => (
                        <Link
                            key={p.id}
                            href={route('productos.index')}
                            className="group flex flex-col overflow-hidden rounded-xl border border-mist-300 bg-white transition-shadow hover:shadow-[0_12px_32px_-12px_rgba(15,23,42,0.25)]"
                        >
                            <div className="h-[170px] overflow-hidden">
                                {p.imagen_url ? (
                                    <img
                                        src={p.imagen_url}
                                        alt={p.nombre}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="grid h-full w-full place-items-center bg-green-light font-display text-4xl font-extrabold text-green-dark">
                                        {p.codigo}
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-1 flex-col gap-1 px-[18px] py-4">
                                <div className="font-display text-[17px] font-bold text-navy group-hover:text-green-dark">{p.nombre}</div>
                                <div className="text-[13px] text-navy-500">{p.aplicacion}</div>
                                <div className="mt-2 text-[12px] font-medium text-ink-500">{p.presentacion}</div>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="mt-6 flex flex-col items-start gap-4 overflow-hidden rounded-xl border border-green/30 bg-green-light px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:py-0 sm:pl-3">
                    <div className="flex items-center gap-4">
                        <img
                            src="/images/bono-bienvenida.png"
                            alt=""
                            className="hidden h-[104px] w-auto self-end sm:block"
                            loading="lazy"
                        />
                        <div>
                            <div className="font-display text-base font-bold text-navy">Bono de bienvenida 10%</div>
                            <div className="text-[13px] text-navy-600">Oferta limitada · crédito fácil a 3 cuotas</div>
                        </div>
                    </div>
                    <a
                        href={waLink(empresa.whatsapp, 'Hola, quiero reclamar el bono de bienvenida del 10%.')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="whitespace-nowrap rounded-lg bg-green px-5 py-2.5 font-display text-[13px] font-semibold text-white"
                    >
                        Reclamar bono
                    </a>
                </div>
            </div>

            {/* Preguntas frecuentes y avales */}
            <PreguntasFrecuentes preguntas={preguntas} />

            {/* Clientes que nos respaldan */}
            <div className="border-t border-mist-300 px-5 pt-10 lg:px-10">
                <div className="mb-1 text-center font-sans text-[11px] font-semibold tracking-[0.14em] text-green-dark">
                    CLIENTES QUE NOS RESPALDAN
                </div>
                <p className="mb-2 text-center text-[14.5px] text-navy-500">Empresas y entidades que confían en Always Clean.</p>
            </div>
            <ClientesCarousel />
        </SiteLayout>
    );
}
