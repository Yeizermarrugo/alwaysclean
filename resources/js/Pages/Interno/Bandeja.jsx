import { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import InternoLayout from '@/Layouts/InternoLayout';
import PlaceholderPhoto from '@/Components/Site/PlaceholderPhoto';

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

export default function Bandeja({ inbox, stats, canalActivo, estados, seleccionada }) {
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

    const seleccionar = (caso) => {
        setNota('');
        router.get(route('interno.bandeja', { caso, ...(canalActivo ? { canal: canalActivo } : {}) }), {}, {
            preserveState: false,
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
        <InternoLayout title="Cotizaciones">
            <div className="grid grid-cols-2 divide-x divide-mist-300 border-b border-mist-300 lg:grid-cols-4">
                <Stat label="NUEVAS HOY" value={stats.nuevasHoy} />
                <Stat label="SIN RESPONDER >24 H" value={stats.sinResponder} tone="text-alert" />
                <Stat label="EN CURSO" value={stats.enviadasSemana} />
                <Stat label="TASA DE CIERRE" value={`${stats.tasaCierre}%`} tone="text-green-dark" />
            </div>

            <div className="grid lg:grid-cols-[1fr_380px]">
                <div className="border-b border-mist-300 px-5 py-5 lg:border-b-0 lg:border-r lg:px-7 lg:py-5">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                        <div className="inline-flex overflow-hidden rounded-lg border border-mist-300 font-display text-[12.5px] font-semibold">
                            {CANALES.map(([value, label]) => (
                                <Link
                                    key={label}
                                    href={route('interno.bandeja', value ? { canal: value } : {})}
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

                    <div className="hidden grid-cols-[90px_1.2fr_1.4fr_.8fr_.8fr_1fr_.8fr] border-b border-mist-300 pb-2.5 font-sans text-[10.5px] font-semibold tracking-[0.1em] text-ink-500 lg:grid">
                        <span>CASO</span><span>CLIENTE</span><span>SERVICIO</span><span>SEDE</span><span>CANAL</span><span>ESTADO</span><span>RECIBIDA</span>
                    </div>

                    <div className="flex flex-col">
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
                                <span className="text-ink-500">{r.sede}</span>
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
                                {busqueda ? `Sin resultados para "${busqueda}".` : 'Sin cotizaciones en este canal.'}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-3.5 bg-mist-50 px-5 py-5 lg:px-6">
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
                    <PlaceholderPhoto hint="mapa: zona de cobertura" className="mt-1 h-[120px] rounded-[10px] p-2.5" />
                </div>
            </div>
        </InternoLayout>
    );
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
