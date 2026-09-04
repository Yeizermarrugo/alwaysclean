import { Link, usePage } from '@inertiajs/react';
import SiteLayout from '@/Layouts/SiteLayout';
import PlaceholderPhoto from '@/Components/Site/PlaceholderPhoto';
import ServiceCard from '@/Components/Site/ServiceCard';
import ServiceRow from '@/Components/Site/ServiceRow';
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

export default function Home({ destacados, todos, conteos, productos }) {
    const { empresa } = usePage().props;
    const totalServicios = todos.length;

    return (
        <SiteLayout title="Inicio" showTopbar>
            {/* Hero */}
            <div className="grid gap-8 bg-mist-50 lg:grid-cols-[1.05fr_.95fr]">
                <div className="flex flex-col gap-5 self-center px-5 py-12 lg:px-10 lg:py-16">
                    <div className="self-start rounded-full bg-green-light px-3 py-1.5 text-[11px] font-semibold tracking-[0.12em] text-green-dark">
                        LIMPIEZA Y DESINFECCIÓN DE ALTA CALIDAD
                    </div>
                    <h1 className="font-display text-4xl font-extrabold leading-[1.02] tracking-tight text-navy text-balance lg:text-[54px]">
                        Servicios integrales de limpieza para empresas de la costa.
                    </h1>
                    <p className="max-w-[480px] text-[17px] leading-relaxed text-navy-600 text-pretty">
                        Limpieza, desinfección, saneamiento básico y obras civiles con personal certificado en trabajo en altura y productos biodegradables.
                    </p>
                    <div className="mt-1.5 flex flex-wrap gap-3">
                        <Link
                            href={route('contacto.create')}
                            className="rounded-[9px] bg-green px-[22px] py-3.5 font-display text-[15px] font-semibold text-white"
                        >
                            Solicitar cotización gratis
                        </Link>
                        <Link
                            href={route('servicios.index')}
                            className="rounded-[9px] border-[1.5px] border-mist-border bg-white px-[22px] py-3.5 font-display text-[15px] font-semibold text-navy"
                        >
                            Ver los {totalServicios} servicios
                        </Link>
                    </div>
                    <div className="mt-3.5 flex flex-wrap gap-8 border-t border-mist-300 pt-5">
                        <div>
                            <div className="font-display text-2xl font-extrabold text-navy">{totalServicios}</div>
                            <div className="text-[12.5px] text-navy-500">servicios activos</div>
                        </div>
                        <div>
                            <div className="font-display text-2xl font-extrabold text-navy">&lt;24 h</div>
                            <div className="text-[12.5px] text-navy-500">respuesta a cotización</div>
                        </div>
                        <div>
                            <div className="font-display text-2xl font-extrabold text-navy">0491 / 1409</div>
                            <div className="text-[12.5px] text-navy-500">resoluciones vigentes</div>
                        </div>
                    </div>
                </div>
                <PlaceholderPhoto hint="foto: cuadrilla en operación" className="min-h-[280px] p-4 lg:min-h-[520px]" />
            </div>

            {/* Segmentos */}
            <div className="grid divide-y divide-mist-300 border-b border-mist-300 md:grid-cols-3 md:divide-x md:divide-y-0">
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

            {/* Productos + testimonio */}
            <div className="grid items-center gap-9 bg-mist-50 px-5 py-12 lg:grid-cols-2 lg:px-10 lg:py-14">
                <div>
                    <h2 className="mb-2 font-display text-[26px] font-extrabold tracking-tight text-navy lg:text-[30px]">
                        Productos especializados
                    </h2>
                    <p className="mb-5 max-w-[420px] text-[15px] leading-relaxed text-navy-500">
                        Línea propia de solventes biodegradables para trampas de grasa, drenajes y orinales.
                    </p>
                    <div className="flex flex-col gap-2.5">
                        {productos.map((p) => (
                            <Link
                                key={p.id}
                                href={route('productos.index')}
                                className="flex items-center gap-3.5 rounded-[10px] border border-mist-300 bg-white px-3.5 py-3"
                            >
                                {p.imagen_url ? (
                                    <img src={p.imagen_url} alt={p.nombre} className="h-[46px] w-[46px] shrink-0 rounded-lg object-cover" />
                                ) : (
                                    <div className="grid h-[46px] w-[46px] shrink-0 place-items-center rounded-lg bg-green-light font-display text-[15px] font-extrabold text-green-dark">
                                        {p.codigo}
                                    </div>
                                )}
                                <div>
                                    <div className="font-display text-[14.5px] font-semibold text-navy">{p.nombre}</div>
                                    <div className="text-[12.5px] text-navy-500">{p.aplicacion}</div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
                <div className="flex flex-col gap-4 rounded-xl border border-mist-300 bg-white p-7">
                    <div className="font-sans text-[11px] font-semibold tracking-[0.14em] text-green-dark">CLIENTES</div>
                    <div className="text-[19px] leading-relaxed text-navy text-pretty">
                        &ldquo;Excelente el servicio y la calidad del trabajo de Always Clean. Son muy organizados y cumplidos.&rdquo;
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="h-[38px] w-[38px] rounded-full bg-[repeating-linear-gradient(135deg,#DFE2EE_0_6px,#EDEFF6_6px_12px)]" />
                        <div>
                            <div className="font-display text-[13.5px] font-semibold text-navy">Catalina Santo Domingo</div>
                            <div className="text-xs text-navy-500">Gerente hotelera</div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between border-t border-mist-200 pt-4">
                        <div>
                            <div className="font-display text-base font-bold text-navy">Bono de bienvenida 10%</div>
                            <div className="text-[12.5px] text-navy-500">Oferta limitada · crédito fácil a 3 cuotas</div>
                        </div>
                        <a
                            href={waLink(empresa.whatsapp, 'Hola, quiero reclamar el bono de bienvenida del 10%.')}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-lg bg-green px-4 py-2.5 font-display text-[13px] font-semibold text-white"
                        >
                            Reclamar
                        </a>
                    </div>
                </div>
            </div>
        </SiteLayout>
    );
}
