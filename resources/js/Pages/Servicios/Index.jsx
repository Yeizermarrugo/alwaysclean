import { useState } from 'react';
import { Link } from '@inertiajs/react';
import SiteLayout from '@/Layouts/SiteLayout';
import ServiceCard from '@/Components/Site/ServiceCard';
import Revelar from '@/Components/Site/Revelar';
import { waLink } from '@/lib/whatsapp';
import { usePage } from '@inertiajs/react';

const SECTORES_A_LA_VISTA = 8;

export default function ServiciosIndex({ servicios, conteos, categoriaActiva, categorias }) {
    const { empresa } = usePage().props;
    const [busqueda, setBusqueda] = useState('');
    const [sector, setSector] = useState(null);
    const [verTodosSectores, setVerTodosSectores] = useState(false);

    const sectoresDisponibles = [...new Set(servicios.flatMap((s) => s.sectores))].sort((a, b) => a.localeCompare(b, 'es'));
    const porSector = Object.fromEntries(sectoresDisponibles.map((x) => [x, servicios.filter((s) => s.sectores.includes(x)).length]));
    // Lista corta por defecto; el sector elegido se muestra aunque esté fuera de los primeros.
    const sectoresVisibles = verTodosSectores
        ? sectoresDisponibles
        : sectoresDisponibles.filter((x, i) => i < SECTORES_A_LA_VISTA || x === sector);

    const filtrados = servicios
        .filter((s) => s.nombre.toLowerCase().includes(busqueda.toLowerCase()))
        .filter((s) => !sector || s.sectores.includes(sector));

    const total = Object.values(conteos).reduce((a, b) => a + b, 0);

    return (
        <SiteLayout title="Servicios">
            <div className="border-b border-mist-300 bg-mist-50 px-5 py-8 lg:px-10 lg:py-9">
                <Revelar>
                <div className="mb-2 text-[12.5px] text-ink-500">
                    <Link href={route('home')} className="hover:text-green-dark">Inicio</Link> / Servicios
                    {categoriaActiva && <> / {categorias[categoriaActiva]}</>}
                </div>
                <h1 className="mb-2 font-display text-[28px] font-extrabold tracking-tight text-navy lg:text-[34px]">
                    Servicios de limpieza
                </h1>
                <p className="max-w-[580px] text-[15px] text-navy-500">
                    Por demanda o con cronograma fijo. Toda cotización incluye alcance, insumos, personal asignado y tiempo estimado en sitio.
                </p>
                <span className="raya-titulo mt-4" aria-hidden="true" />
                </Revelar>
            </div>

            <div className="grid lg:grid-cols-[236px_1fr]">
                <Revelar as="aside" efecto="izq" retraso={100} className="flex flex-col gap-6 border-b border-mist-300 px-5 py-6 lg:border-b-0 lg:border-r lg:px-6 lg:py-7">
                    <div>
                        <div className="mb-2.5 text-[11px] font-semibold tracking-[0.13em] text-ink-500">BUSCAR</div>
                        <input
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            placeholder="Buscar servicio…"
                            className="w-full rounded-lg border border-mist-400 px-3 py-2.5 text-[13.5px] text-navy placeholder:text-ink-400 focus:border-green focus:ring-green"
                        />
                    </div>
                    <div>
                        <div className="mb-2.5 text-[11px] font-semibold tracking-[0.13em] text-ink-500">LÍNEA DE SERVICIO</div>
                        <div className="flex flex-col gap-2.5 text-[13.5px] font-medium text-navy-700">
                            <Link href={route('servicios.index')} className={!categoriaActiva ? 'font-semibold text-green-dark' : ''}>
                                {!categoriaActiva ? '●' : '○'} Todos ({total})
                            </Link>
                            {Object.entries(categorias).map(([key, label]) => (
                                <Link
                                    key={key}
                                    href={route('servicios.index', { categoria: key })}
                                    className={categoriaActiva === key ? 'font-semibold text-green-dark' : ''}
                                >
                                    {categoriaActiva === key ? '●' : '○'} {label} ({conteos[key] ?? 0})
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div>
                        <div className="mb-2.5 text-[11px] font-semibold tracking-[0.13em] text-ink-500">SECTOR</div>
                        <div className="flex flex-col gap-2.5 text-[13.5px] font-medium text-navy-700">
                            <button
                                type="button"
                                onClick={() => setSector(null)}
                                aria-pressed={!sector}
                                className={`text-left hover:text-green-dark ${!sector ? 'font-semibold text-green-dark' : ''}`}
                            >
                                {!sector ? '●' : '○'} Todos ({servicios.length})
                            </button>
                            {sectoresVisibles.map((s) => (
                                <button
                                    key={s}
                                    type="button"
                                    onClick={() => setSector(sector === s ? null : s)}
                                    aria-pressed={sector === s}
                                    className={`text-left hover:text-green-dark ${sector === s ? 'font-semibold text-green-dark' : ''}`}
                                >
                                    {sector === s ? '●' : '○'} {s} ({porSector[s]})
                                </button>
                            ))}
                            {sectoresDisponibles.length > SECTORES_A_LA_VISTA && (
                                <button
                                    type="button"
                                    onClick={() => setVerTodosSectores((v) => !v)}
                                    aria-expanded={verTodosSectores}
                                    className="self-start font-display text-[12.5px] font-semibold text-green-dark hover:text-green"
                                >
                                    {verTodosSectores ? 'Ver menos' : `Ver los ${sectoresDisponibles.length} sectores`}
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="rounded-[10px] bg-mist-50 p-4">
                        <div className="mb-1.5 font-display text-sm font-semibold text-navy">¿No encuentra su necesidad?</div>
                        <div className="mb-3 text-[12.5px] leading-relaxed text-navy-500">Armamos un plan a la medida para su sede.</div>
                        <a
                            href={waLink(empresa.whatsapp, 'Hola, necesito un servicio que no veo en el listado.')}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block rounded-lg bg-green py-2.5 text-center font-display text-[12.5px] font-semibold text-white"
                        >
                            Hablar por WhatsApp
                        </a>
                    </div>
                </Revelar>

                <div className="px-5 py-6 lg:px-8 lg:py-8">
                    <div className="mb-4 flex items-center justify-between">
                        <span className="text-[13px] text-navy-500">Mostrando {filtrados.length} de {total} servicios</span>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {filtrados.map((s, i) => (
                            <Revelar key={s.id} retraso={(i % 3) * 90} className="flex">
                                <ServiceCard servicio={s} categoriaLabel={categorias[s.categoria]} />
                            </Revelar>
                        ))}
                    </div>
                    {filtrados.length === 0 && (
                        <p className="py-10 text-center text-navy-500">Ningún servicio coincide con los filtros.</p>
                    )}
                </div>
            </div>
        </SiteLayout>
    );
}
