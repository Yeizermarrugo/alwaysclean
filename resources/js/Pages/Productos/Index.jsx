import { useState } from 'react';
import { usePage } from '@inertiajs/react';
import SiteLayout from '@/Layouts/SiteLayout';
import ProductCard from '@/Components/Site/ProductCard';
import Modal from '@/Components/Modal';
import { waLink } from '@/lib/whatsapp';

export default function ProductosIndex({ productos }) {
    const { empresa } = usePage().props;
    const [abierto, setAbierto] = useState(null);

    return (
        <SiteLayout title="Productos">
            <div className="flex flex-col items-start justify-between gap-3 border-b border-mist-300 px-5 py-8 md:flex-row md:items-end lg:px-10 lg:py-9">
                <div>
                    <h1 className="mb-1.5 font-display text-[28px] font-extrabold tracking-tight text-navy lg:text-[34px]">
                        Productos especializados
                    </h1>
                    <p className="max-w-[520px] text-[15px] text-navy-500">
                        Solventes biodegradables formulados para redes sanitarias de alto tráfico. Despacho en Cartagena en 48 horas.
                    </p>
                </div>
                <span className="rounded-full bg-green-light px-3 py-1.5 text-xs font-semibold text-green-dark">
                    {productos.length} referencias
                </span>
            </div>

            <div className="grid grid-cols-1 gap-5 px-5 py-7 sm:grid-cols-2 lg:grid-cols-3 lg:px-10 lg:py-8">
                {productos.map((p) => (
                    <ProductCard key={p.id} producto={p} onVerFicha={() => setAbierto(p)} />
                ))}
            </div>

            <div className="mx-5 mb-8 flex flex-col items-start gap-5 rounded-xl bg-navy p-7 text-white sm:flex-row sm:items-center sm:justify-between lg:mx-10">
                <div>
                    <div className="mb-1 font-display text-[22px] font-bold">Programa de dosificación mensual</div>
                    <div className="text-sm text-white/66">
                        Entrega programada más visita técnica de control. Ideal para cocinas de hotel y centros comerciales.
                    </div>
                </div>
                <a
                    href={waLink(empresa.whatsapp, 'Hola, quiero información del programa de dosificación mensual.')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="whitespace-nowrap rounded-[9px] bg-green px-5 py-3 font-display text-sm font-semibold text-white"
                >
                    Solicitar programa
                </a>
            </div>

            <Modal open={!!abierto} onClose={() => setAbierto(null)} size="lg" title={abierto?.nombre}>
                {abierto && (
                    <div className="flex flex-col gap-6">
                        <div className="grid grid-cols-[120px_1fr] gap-6">
                            {abierto.imagen_url ? (
                                <img src={abierto.imagen_url} alt={abierto.nombre} className="h-[120px] w-[120px] rounded-xl object-cover" />
                            ) : (
                                <div className="grid h-[120px] w-[120px] place-items-center rounded-xl bg-green-light font-display text-4xl font-extrabold text-green-dark">
                                    {abierto.codigo}
                                </div>
                            )}
                            <div className="flex flex-col justify-center gap-1">
                                <span className="font-sans text-[10px] font-semibold tracking-[0.12em] text-green-dark">PRODUCTO ESPECIALIZADO</span>
                                <div className="font-display text-2xl font-extrabold text-navy">{abierto.nombre}</div>
                            </div>
                        </div>
                        <p className="text-[14.5px] leading-relaxed text-navy-600">{abierto.descripcion}</p>
                        <div className="grid grid-cols-2 gap-4 rounded-xl border border-mist-300 p-4 text-[13.5px]">
                            <div>
                                <div className="text-ink-500">Aplicación</div>
                                <div className="font-semibold text-navy">{abierto.aplicacion}</div>
                            </div>
                            <div>
                                <div className="text-ink-500">Presentación</div>
                                <div className="font-semibold text-navy">{abierto.presentacion}</div>
                            </div>
                        </div>
                        <a
                            href={waLink(empresa.whatsapp, `Hola, quiero precio de ${abierto.nombre}.`)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-[9px] bg-green py-3.5 text-center font-display text-[14.5px] font-semibold text-white"
                        >
                            Pedir precio por WhatsApp
                        </a>
                    </div>
                )}
            </Modal>
        </SiteLayout>
    );
}
