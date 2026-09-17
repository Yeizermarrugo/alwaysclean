import { useState } from 'react';
import { router } from '@inertiajs/react';
import InternoLayout from '@/Layouts/InternoLayout';

const ESTADO_TONE = {
    radicado: 'bg-green-light text-green-dark',
    en_proceso: 'bg-mist-100 text-navy',
    cerrado: 'bg-mist-100 text-ink-500',
};

export default function PqrsIndex({ inbox, tipos, estados, seleccionada }) {
    const [estado, setEstado] = useState(seleccionada?.estado ?? 'radicado');
    const [busqueda, setBusqueda] = useState('');

    const inboxFiltrado = inbox.filter((r) => {
        const q = busqueda.trim().toLowerCase();
        if (!q) return true;
        return r.nombre.toLowerCase().includes(q) || r.caso.toLowerCase().includes(q);
    });

    const pendientes = inbox.filter((r) => r.noLeido).length;

    const seleccionar = (caso) => {
        router.get(route('interno.pqrs.index', { caso }), {}, {
            preserveState: false,
            onSuccess: (page) => setEstado(page.props.seleccionada?.estado ?? 'radicado'),
        });
    };

    const guardar = () => {
        router.patch(route('interno.pqrs.update', seleccionada.id), { estado }, { preserveScroll: true });
    };

    return (
        <InternoLayout title="PQRS">
            <div className="grid grid-cols-2 divide-x divide-mist-300 border-b border-mist-300 lg:grid-cols-3">
                <Stat label="TOTAL CASOS" value={inbox.length} />
                <Stat label="SIN LEER" value={pendientes} tone={pendientes > 0 ? 'text-alert' : 'text-navy'} />
                <Stat label="EN PROCESO" value={inbox.filter((r) => r.estado === 'en_proceso').length} />
            </div>

            <div className="grid lg:grid-cols-[1fr_380px]">
                <div className="border-b border-mist-300 px-5 py-5 lg:border-b-0 lg:border-r lg:px-7 lg:py-5">
                    <div className="mb-4">
                        <input
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            placeholder="Buscar nombre o caso…"
                            className="w-full rounded-lg border border-mist-400 px-3 py-2.5 text-[13px] text-navy placeholder:text-ink-400 focus:border-green focus:ring-green sm:w-64"
                        />
                    </div>

                    <div className="hidden grid-cols-[90px_1fr_1fr_.8fr_.8fr] border-b border-mist-300 pb-2.5 font-sans text-[10.5px] font-semibold tracking-[0.1em] text-ink-500 lg:grid">
                        <span>CASO</span><span>NOMBRE</span><span>TIPO</span><span>ESTADO</span><span>RECIBIDO</span>
                    </div>

                    <div className="flex flex-col">
                        {inboxFiltrado.map((r) => (
                            <button
                                key={r.caso}
                                onClick={() => seleccionar(r.caso)}
                                className={`grid grid-cols-2 gap-x-2 gap-y-1 border-b border-mist-200 py-3 text-left text-[13px] text-navy-600 lg:grid-cols-[90px_1fr_1fr_.8fr_.8fr] lg:items-center lg:gap-0 ${
                                    seleccionada?.caso === r.caso ? 'bg-mist-50' : ''
                                }`}
                            >
                                <span className="flex items-center gap-1.5 font-mono text-[11.5px] font-medium text-green-dark">
                                    {r.noLeido && <span className="h-[7px] w-[7px] shrink-0 rounded-full bg-alert" />}
                                    {r.caso}
                                </span>
                                <span className={`font-display text-[13.5px] ${r.noLeido ? 'font-bold text-navy' : 'font-semibold text-navy'}`}>{r.nombre}</span>
                                <span>{r.tipoLabel}</span>
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
                                {busqueda ? `Sin resultados para "${busqueda}".` : 'Sin casos PQRS radicados.'}
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
                                <div className="font-display text-[22px] font-extrabold text-navy">{seleccionada.nombre}</div>
                                <div className="text-[13px] text-ink-500">{tipos[seleccionada.tipo]} · {seleccionada.documento}</div>
                            </div>
                            <div className="flex flex-col gap-2 rounded-[10px] border border-mist-300 bg-white p-3.5 text-[13.5px] text-navy-600">
                                <Row label="Correo" value={seleccionada.email} />
                                <Row label="Teléfono" value={seleccionada.telefono} />
                                {seleccionada.servicio_relacionado && <Row label="Servicio" value={seleccionada.servicio_relacionado} />}
                                {seleccionada.numero_orden && <Row label="Orden / factura" value={seleccionada.numero_orden} />}
                            </div>
                            <div className="rounded-[10px] border border-mist-300 bg-white p-3.5 text-[13px] leading-relaxed text-navy-600">
                                {seleccionada.descripcion}
                            </div>

                            <div className="rounded-[10px] border border-mist-300 bg-white p-3.5">
                                <div className="mb-2 font-sans text-[10.5px] font-semibold tracking-[0.1em] text-ink-500">GESTIONAR CASO</div>
                                <div className="mb-3">
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
                                <button
                                    onClick={guardar}
                                    className="w-full rounded-lg bg-navy py-2.5 font-display text-[13px] font-semibold text-white"
                                >
                                    Guardar cambio
                                </button>
                            </div>

                            <a
                                href={`https://wa.me/57${seleccionada.telefono.replace(/\D/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-[9px] bg-green py-3.5 text-center font-display text-[14px] font-semibold text-white"
                            >
                                Escribir por WhatsApp
                            </a>
                        </>
                    ) : (
                        <p className="text-navy-500">Sin casos radicados todavía.</p>
                    )}
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
