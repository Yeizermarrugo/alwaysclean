import { useState } from 'react';
import { usePage } from '@inertiajs/react';
import SiteLayout from '@/Layouts/SiteLayout';
import ProductCard from '@/Components/Site/ProductCard';
import Revelar from '@/Components/Site/Revelar';
import Modal from '@/Components/Modal';
import { waLink } from '@/lib/whatsapp';
import { carrito, presentaciones, useCarrito } from '@/lib/carrito';
import { IconoPedido } from '@/Components/Site/PedidoDrawer';

export default function ProductosIndex({ productos }) {
    const { empresa } = usePage().props;
    const [abierto, setAbierto] = useState(null);
    const { items, unidades, cantidadDe } = useCarrito();

    return (
        <SiteLayout title="Productos">
            <div className="flex flex-col items-start justify-between gap-3 border-b border-mist-300 px-5 py-8 md:flex-row md:items-end lg:px-10 lg:py-9">
                <Revelar>
                    <span className="raya-titulo mb-3" aria-hidden="true" />
                    <h1 className="mb-1.5 font-display text-[28px] font-extrabold tracking-tight text-navy lg:text-[34px]">
                        Productos especializados
                    </h1>
                    <p className="max-w-[520px] text-[15px] text-navy-500">
                        Solventes biodegradables formulados para redes sanitarias de alto tráfico. Despacho en Cartagena en 48 horas.
                    </p>
                    <p className="mt-2 max-w-[520px] text-[13px] text-ink-500">
                        Agregue los productos y cantidades que necesita y cotice todo el pedido en un solo mensaje de WhatsApp.
                    </p>
                </Revelar>
                <Revelar as="span" efecto="zoom" retraso={200} className="rounded-full bg-green-light px-3 py-1.5 text-xs font-semibold text-green-dark">
                    {productos.length} referencias
                </Revelar>
            </div>

            <div className="grid grid-cols-1 gap-5 px-5 py-7 sm:grid-cols-2 lg:grid-cols-3 lg:px-10 lg:py-8">
                {productos.map((p, i) => (
                    <Revelar key={p.id} retraso={(i % 3) * 120} className="flex">
                        <ProductCard producto={p} onVerFicha={() => setAbierto(p)} />
                    </Revelar>
                ))}
            </div>

            <Revelar efecto="zoom" className="mx-5 mb-8 flex flex-col items-start gap-5 overflow-hidden rounded-xl bg-navy p-7 text-white sm:flex-row sm:items-center sm:justify-between sm:py-0 sm:pl-0 lg:mx-10">
                {/* Dosificador "Control biológico" instalado en una cocina (foto real de la empresa). */}
                <img
                    src="/images/productos/programa-dosificacion.jpg"
                    alt="Dosificador de control biológico instalado en una cocina"
                    className="-mx-7 -mt-7 h-48 w-[calc(100%+3.5rem)] max-w-none object-cover object-[center_20%] sm:m-0 sm:h-40 sm:w-44 sm:shrink-0"
                    loading="lazy"
                />
                <div className="sm:flex-1">
                    <div className="mb-1 font-display text-[22px] font-bold">Programa de dosificación mensual</div>
                    <div className="text-sm text-white/66">
                        Entrega programada más visita técnica de control. Ideal para cocinas de hotel y centros comerciales.
                    </div>
                </div>
                <a
                    href={waLink(empresa.whatsapp, 'Hola, quiero información del programa de dosificación mensual.')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="whitespace-nowrap rounded-[9px] bg-green px-5 py-3 font-display text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-green-dark"
                >
                    Solicitar programa
                </a>
            </Revelar>

            {items.length > 0 && (
                <div className="pointer-events-none sticky bottom-4 z-30 mx-5 -mt-2 mb-6 flex justify-center lg:mx-10">
                    <button
                        type="button"
                        onClick={carrito.abrir}
                        className="pointer-events-auto flex items-center gap-3 rounded-full bg-navy py-2.5 pl-4 pr-2.5 font-display text-[13.5px] font-semibold text-white shadow-[0_14px_34px_-12px_rgba(13,13,91,0.7)] hover:bg-navy-deep"
                    >
                        <IconoPedido className="h-[18px] w-[18px]" />
                        {items.length} producto{items.length > 1 ? 's' : ''} · {unidades} unidad{unidades > 1 ? 'es' : ''}
                        <span className="rounded-full bg-green px-3 py-1.5 text-[12.5px]">Cotizar pedido →</span>
                    </button>
                </div>
            )}

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
                        <div className={`grid gap-2 ${presentaciones(abierto).length > 1 ? 'sm:grid-cols-2' : ''}`}>
                            {(presentaciones(abierto).length ? presentaciones(abierto) : ['']).map((op) => (
                                <button
                                    key={op}
                                    type="button"
                                    onClick={() => {
                                        carrito.agregar(abierto, op);
                                        setAbierto(null);
                                        carrito.abrir();
                                    }}
                                    className="rounded-[9px] bg-green px-3 py-3.5 text-center font-display text-[14px] font-semibold text-white hover:bg-green-dark"
                                >
                                    Agregar {presentaciones(abierto).length > 1 ? op : 'al pedido'}
                                    {cantidadDe(abierto.id, op) > 0 && ` (lleva ${cantidadDe(abierto.id, op)})`}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </Modal>
        </SiteLayout>
    );
}
