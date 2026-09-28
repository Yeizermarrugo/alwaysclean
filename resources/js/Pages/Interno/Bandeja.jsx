import { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import InternoLayout from '@/Layouts/InternoLayout';
import UbicacionCard from '@/Components/Interno/UbicacionCard';

const CANALES = [
    [null, 'Todas'],
    ['whatsapp', 'WhatsApp'],
    ['web', 'Web'],
    ['telefono', 'Teléfono'],
];

const ESTADO_TONE = {
    nueva: 'bg-green-light text-green-dark',
    contactada: 'bg-mist-100 text-navy',
    cotizada: 'bg-mist-100 text-navy',
    agendada: 'bg-mist-100 text-navy',
    en_ejecucion: 'bg-mist-100 text-navy',
    cerrada_ganada: 'bg-green-light text-green-dark',
    cerrada_perdida: 'bg-red-50 text-alert',
};

export default function Bandeja({ inbox, stats, canalActivo, rango, totalCotizaciones, estados, seleccionada, mapsKey }) {
    const [estado, setEstado] = useState(seleccionada?.estado ?? 'nueva');
    const [cuadrilla, setCuadrilla] = useState(seleccionada?.cuadrilla ?? '');
    const [motivoPerdida, setMotivoPerdida] = useState(seleccionada?.motivo_perdida ?? '');
    const [nota, setNota] = useState('');
    const [busqueda, setBusqueda] = useState('');

    const inboxFiltrado = inbox.filter((r) => {
        const q = busqueda.trim().toLowerCase();
        if (!q) return true;
        return r.cliente.toLowerCase().includes(q) || r.servicio.toLowerCase().includes(q);
    });

    // Filtros activos en la URL (sin valores vacíos).
    const filtros = (cambios = {}) => Object.fromEntries(
        Object.entries({ canal: canalActivo, desde: rango.desde, hasta: rango.hasta, ...cambios }).filter(([, v]) => v),
    );

    const filtrar = (cambios) => {
        router.get(route('interno.bandeja', filtros(cambios)), {}, { preserveState: true, preserveScroll: true, replace: true });
    };

    const hayFechas = Boolean(rango.desde || rango.hasta);

    const seleccionar = (caso) => {
        setNota('');
        router.get(route('interno.bandeja', { ...filtros(), caso }), {}, {
            // preserveState: la lista no se remonta y conserva su scroll y la búsqueda.
            preserveState: true,
            preserveScroll: true,
            onSuccess: (page) => {
                const s = page.props.seleccionada;
                setEstado(s?.estado ?? 'nueva');
                setCuadrilla(s?.cuadrilla ?? '');
                setMotivoPerdida(s?.motivo_perdida ?? '');
            },
        });
    };

    const guardar = () => {
        router.patch(route('interno.actualizar', seleccionada.id), {
            estado, cuadrilla, motivo_perdida: motivoPerdida, nota,
        }, { preserveScroll: true, onSuccess: () => setNota('') });
    };

    return (
        <InternoLayout title="Cotizaciones" pantallaCompleta>
            <div className="grid shrink-0 grid-cols-2 divide-x divide-mist-300 border-b border-mist-300 lg:grid-cols-4">
                <Stat label="NUEVAS HOY" value={stats.nuevasHoy} />
                <Stat label="SIN RESPONDER >24 H" value={stats.sinResponder} tone="text-alert" />
                <Stat label="EN CURSO" value={stats.enviadasSemana} />
                <Stat label="TASA DE CIERRE" value={`${stats.tasaCierre}%`} tone="text-green-dark" />
            </div>

            <div className="grid lg:min-h-0 lg:flex-1 lg:grid-cols-[1fr_380px]">
                <div className="flex flex-col border-b border-mist-300 px-5 pt-5 lg:min-h-0 lg:border-b-0 lg:border-r lg:px-7">
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                        <div className="inline-flex overflow-hidden rounded-lg border border-mist-300 font-display text-[12.5px] font-semibold">
                            {CANALES.map(([value, label]) => (
                                <Link
                                    key={label}
                                    href={route('interno.bandeja', filtros({ canal: value }))}
                                    preserveState
                                    preserveScroll
                                    className={`border-l border-mist-300 px-3.5 py-2.5 first:border-l-0 ${(canalActivo ?? null) === value ? 'bg-navy text-white' : 'text-navy-700'}`}
                                >
                                    {label}
                                </Link>
                            ))}
                        </div>
                        <input
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            placeholder="Buscar cliente o servicio…"
                            className="w-full rounded-lg border border-mist-400 px-3 py-2.5 text-[13px] text-navy placeholder:text-ink-400 focus:border-green focus:ring-green sm:w-56"
                        />
                    </div>

                    <div className="mb-4 flex flex-wrap items-center gap-2 text-[12.5px]">
                        <span className="font-sans text-[10.5px] font-semibold tracking-[0.1em] text-ink-500">RECIBIDAS</span>
                        <label className="flex items-center gap-1.5 text-navy-500">
                            Desde
                            <input
                                type="date"
                                value={rango.desde ?? ''}
                                max={rango.hasta ?? undefined}
                                onChange={(e) => filtrar({ desde: e.target.value })}
                                className="rounded-lg border border-mist-400 px-2.5 py-1.5 text-[12.5px] text-navy focus:border-green focus:ring-green"
                            />
                        </label>
                        <label className="flex items-center gap-1.5 text-navy-500">
                            Hasta
                            <input
                                type="date"
                                value={rango.hasta ?? ''}
                                min={rango.desde ?? undefined}
                                onChange={(e) => filtrar({ hasta: e.target.value })}
                                className="rounded-lg border border-mist-400 px-2.5 py-1.5 text-[12.5px] text-navy focus:border-green focus:ring-green"
                            />
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                            {ATAJOS.map(([label, dias]) => {
                                const r = rangoUltimos(dias);
                                const activo = rango.desde === r.desde && rango.hasta === r.hasta;
                                return (
                                    <button
                                        key={label}
                                        type="button"
                                        onClick={() => filtrar(r)}
                                        className={`rounded-full border px-2.5 py-1 font-display text-[12px] font-semibold ${
                                            activo ? 'border-navy bg-navy text-white' : 'border-mist-border text-navy-600 hover:border-navy'
                                        }`}
                                    >
                                        {label}
                                    </button>
                                );
                            })}
                            {hayFechas && (
                                <button
                                    type="button"
                                    onClick={() => filtrar({ desde: null, hasta: null })}
                                    className="px-1.5 font-display text-[12px] font-semibold text-ink-500 hover:text-alert"
                                >
                                    Quitar fechas ✕
                                </button>
                            )}
                        </div>
                        <span className="ml-auto text-ink-500">
                            {inboxFiltrado.length === totalCotizaciones
                                ? `${totalCotizaciones} cotizaciones`
                                : `${inboxFiltrado.length} de ${totalCotizaciones} cotizaciones`}
                        </span>
                    </div>

                    <div className="hidden shrink-0 grid-cols-[90px_1.2fr_1.4fr_.8fr_.8fr_1fr_.8fr] border-b border-mist-300 pb-2.5 font-sans text-[10.5px] font-semibold tracking-[0.1em] text-ink-500 lg:grid">
                        <span>CASO</span><span>CLIENTE</span><span>SERVICIO</span><span>SEDE</span><span>CANAL</span><span>ESTADO</span><span>RECIBIDA</span>
                    </div>

                    <div className="flex flex-col pb-5 lg:-mr-3 lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:overscroll-contain lg:pr-3">
                        {inboxFiltrado.map((r) => (
                            <button
                                key={r.caso}
                                onClick={() => seleccionar(r.caso)}
                                className={`grid grid-cols-2 gap-x-2 gap-y-1 border-b border-mist-200 py-3 text-left text-[13px] text-navy-600 lg:grid-cols-[90px_1.2fr_1.4fr_.8fr_.8fr_1fr_.8fr] lg:items-center lg:gap-0 ${
                                    seleccionada?.caso === r.caso ? 'bg-mist-50' : ''
                                }`}
                            >
                                <span className="font-mono text-[11.5px] font-medium text-green-dark">{r.caso}</span>
                                <span className="font-display text-[13.5px] font-semibold text-navy">{r.cliente}</span>
                                <span>{r.servicio}</span>
                                <span className="flex items-center gap-1.5 text-ink-500">
                                    {r.ubicada && (
                                        <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5 shrink-0 text-green" aria-label="Ubicación exacta">
                                            <path fillRule="evenodd" d="M10 1.5a6.5 6.5 0 0 0-6.5 6.5c0 4.6 5.3 9.6 5.9 10.1a.9.9 0 0 0 1.2 0c.6-.5 5.9-5.5 5.9-10.1A6.5 6.5 0 0 0 10 1.5Zm0 9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                    {r.sede}
                                </span>
                                <span className="text-ink-500">{r.canal}</span>
                                <span>
                                    <span className={`rounded-full px-2.5 py-1 font-sans text-[11px] font-semibold ${ESTADO_TONE[r.estado] ?? 'bg-mist-100 text-navy'}`}>
                                        {r.estadoLabel}
                                    </span>
                                </span>
                                <span className="text-ink-500">{r.recibida}</span>
                            </button>
                        ))}
                        {inboxFiltrado.length === 0 && (
                            <p className="py-8 text-center text-navy-500">
                                {busqueda
                                    ? `Sin resultados para "${busqueda}".`
                                    : hayFechas ? 'Sin cotizaciones en este rango de fechas.' : 'Sin cotizaciones en este canal.'}
                            </p>
                        )}
                    </div>
                </div>

                <div key={seleccionada?.id ?? 'vacio'} className="flex flex-col gap-3.5 bg-mist-50 px-5 py-5 lg:min-h-0 [&>*]:shrink-0 lg:overflow-y-auto lg:overscroll-contain lg:px-6">
                    {seleccionada ? (
                        <>
                            <div className="flex items-center justify-between">
                                <span className="font-sans text-[11px] font-semibold tracking-[0.12em] text-ink-500">CASO {seleccionada.caso}</span>
                                <span className={`rounded-full px-2.5 py-1 font-sans text-[11px] font-semibold ${ESTADO_TONE[seleccionada.estado] ?? 'bg-mist-100 text-navy'}`}>
                                    {estados[seleccionada.estado]}
                                </span>
                            </div>
                            <div>
                                <div className="font-display text-[22px] font-extrabold text-navy">{seleccionada.empresa}</div>
                                <div className="text-[13px] text-ink-500">{seleccionada.ciudad}{seleccionada.nit ? ` · NIT ${seleccionada.nit}` : ''}</div>
                            </div>
                            <div className="flex flex-col gap-2 rounded-[10px] border border-mist-300 bg-white p-3.5 text-[13.5px] text-navy-600">
                                <Row label="Servicio" value={seleccionada.servicios.join(', ')} />
                                {seleccionada.area_m2 && <Row label="Área" value={`${seleccionada.area_m2} m²`} />}
                                <Row label="Frecuencia" value={ucfirst(seleccionada.frecuencia.replace('_', ' '))} />
                                <Row label="Canal" value={`${ucfirst(seleccionada.canal)} · ${seleccionada.whatsapp}`} />
                            </div>
                            {seleccionada.detalle && (
                                <div className="rounded-[10px] border border-mist-300 bg-white p-3.5 text-[13px] leading-relaxed text-navy-600">
                                    {seleccionada.detalle}
                                </div>
                            )}

                            <UbicacionCard key={seleccionada.id} cotizacion={seleccionada} mapsKey={mapsKey} />

                            <div className="rounded-[10px] border border-mist-300 bg-white p-3.5">
                                <div className="mb-2 font-sans text-[10.5px] font-semibold tracking-[0.1em] text-ink-500">GESTIONAR CASO</div>
                                <div className="mb-2.5">
                                    <div className="mb-1 text-xs font-medium text-navy-500">Estado</div>
                                    <select
                                        value={estado}
                                        onChange={(e) => setEstado(e.target.value)}
                                        className="w-full rounded-lg border border-mist-400 px-3 py-2 text-[13px] text-navy focus:border-green focus:ring-green"
                                    >
                                        {Object.entries(estados).map(([value, label]) => (
                                            <option key={value} value={value}>{label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-2.5">
                                    <div className="mb-1 text-xs font-medium text-navy-500">Cuadrilla asignada</div>
                                    <input
                                        value={cuadrilla}
                                        onChange={(e) => setCuadrilla(e.target.value)}
                                        placeholder="Ej. Cuadrilla 2 · Andrés R."
                                        className="w-full rounded-lg border border-mist-400 px-3 py-2 text-[13px] text-navy placeholder:text-ink-400 focus:border-green focus:ring-green"
                                    />
                                </div>
                                {estado === 'cerrada_perdida' && (
                                    <div className="mb-2.5">
                                        <div className="mb-1 text-xs font-medium text-navy-500">Motivo de pérdida</div>
                                        <input
                                            value={motivoPerdida}
                                            onChange={(e) => setMotivoPerdida(e.target.value)}
                                            placeholder="Ej. Escogió otro proveedor"
                                            className="w-full rounded-lg border border-mist-400 px-3 py-2 text-[13px] text-navy placeholder:text-ink-400 focus:border-green focus:ring-green"
                                        />
                                    </div>
                                )}
                                <div className="mb-3">
                                    <div className="mb-1 text-xs font-medium text-navy-500">Nota (queda en la bitácora)</div>
                                    <textarea
                                        value={nota}
                                        onChange={(e) => setNota(e.target.value)}
                                        placeholder="Ej. Cliente confirmó visita para el 20/08"
                                        className="w-full rounded-lg border border-mist-400 px-3 py-2 text-[13px] text-navy placeholder:text-ink-400 focus:border-green focus:ring-green"
                                    />
                                </div>
                                <button
                                    onClick={guardar}
                                    className="w-full rounded-lg bg-navy py-2.5 font-display text-[13px] font-semibold text-white"
                                >
                                    Guardar cambio
                                </button>
                            </div>

                            {seleccionada.eventos?.length > 0 && (
                                <div className="rounded-[10px] border border-mist-300 bg-white p-3.5">
                                    <div className="mb-2.5 font-sans text-[10.5px] font-semibold tracking-[0.1em] text-ink-500">BITÁCORA</div>
                                    <div className="flex flex-col gap-3">
                                        {seleccionada.eventos.map((ev) => (
                                            <div key={ev.id} className="border-l-2 border-mist-300 pl-3 text-[12.5px]">
                                                <div className="font-semibold text-navy">
                                                    {ev.estado_nuevo
                                                        ? <>{ev.estado_anterior ? `${estados[ev.estado_anterior] ?? ev.estado_anterior} → ` : ''}{estados[ev.estado_nuevo] ?? ev.estado_nuevo}</>
                                                        : (ev.cuadrilla ? `Cuadrilla: ${ev.cuadrilla}` : 'Nota')}
                                                </div>
                                                {ev.nota && <div className="text-navy-600">{ev.nota}</div>}
                                                <div className="text-ink-500">{ev.usuario} · {ev.created_at_human}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <a
                                href={`https://wa.me/57${seleccionada.whatsapp.replace(/\D/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-[9px] bg-green py-3.5 text-center font-display text-[14px] font-semibold text-white"
                            >
                                Escribir por WhatsApp
                            </a>
                        </>
                    ) : (
                        <p className="text-navy-500">Seleccione un caso de la lista.</p>
                    )}
                </div>
            </div>
        </InternoLayout>
    );
}

const ATAJOS = [
    ['Hoy', 0],
    ['7 días', 6],
    ['30 días', 29],
];

function fechaLocal(d) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** Rango de los últimos `dias` días más hoy, en hora local. */
function rangoUltimos(dias) {
    const hasta = new Date();
    const desde = new Date();
    desde.setDate(desde.getDate() - dias);
    return { desde: fechaLocal(desde), hasta: fechaLocal(hasta) };
}

function Stat({ label, value, tone = 'text-navy' }) {
    return (
        <div className="px-5 py-4 lg:px-7">
            <div className="font-sans text-[11px] font-semibold tracking-[0.1em] text-ink-500">{label}</div>
            <div className={`font-display text-3xl font-extrabold ${tone}`}>{value}</div>
        </div>
    );
}

function Row({ label, value }) {
    return (
        <div className="flex justify-between gap-3">
            <span className="text-ink-500">{label}</span>
            <span className="text-right">{value}</span>
        </div>
    );
}

function ucfirst(s) {
    return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}
