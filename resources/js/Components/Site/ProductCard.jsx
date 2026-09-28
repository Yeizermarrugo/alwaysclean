import { useState } from 'react';
import { carrito, presentaciones, useCarrito } from '@/lib/carrito';
import { SelectorCantidad } from '@/Components/Site/PedidoDrawer';

export default function ProductCard({ producto, onVerFicha }) {
    const { cantidadDe, claveDe } = useCarrito();
    const opciones = presentaciones(producto);
    const [presentacion, setPresentacion] = useState(opciones[0] ?? '');
    const cantidad = cantidadDe(producto.id, presentacion);

    return (
        <div className="flex flex-col overflow-hidden rounded-xl border border-mist-300">
            <button type="button" onClick={onVerFicha} className="block h-[190px] w-full">
                {producto.imagen_url ? (
                    <img src={producto.imagen_url} alt={producto.nombre} className="h-full w-full object-cover" />
                ) : (
                    <span className="grid h-full w-full place-items-center bg-[repeating-linear-gradient(135deg,#DFE2EE_0_9px,#EDEFF6_9px_18px)] font-display text-5xl font-extrabold text-navy/35">
                        {producto.codigo}
                    </span>
                )}
            </button>
            <div className="flex flex-1 flex-col gap-2.5 px-[18px] py-4">
                <span className="font-sans text-[10px] font-semibold tracking-[0.12em] text-green-dark">
                    PRODUCTO ESPECIALIZADO
                </span>
                <button type="button" onClick={onVerFicha} className="text-left font-display text-xl font-bold text-navy hover:text-green-dark">
                    {producto.nombre}
                </button>
                <p className="flex-1 text-[13.5px] leading-relaxed text-navy-600">{producto.descripcion}</p>
                <div className="flex flex-col gap-1.5 border-t border-mist-200 pt-2.5 text-[13px] text-navy-600">
                    <div className="flex justify-between">
                        <span className="text-ink-500">Aplicación</span>
                        <span>{producto.aplicacion}</span>
                    </div>
                    {opciones.length <= 1 && (
                        <div className="flex justify-between">
                            <span className="text-ink-500">Presentación</span>
                            <span>{producto.presentacion}</span>
                        </div>
                    )}
                </div>
                {opciones.length > 1 && (
                    <div>
                        <div className="mb-1.5 text-[12px] text-ink-500">Presentación</div>
                        <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label={`Presentación de ${producto.nombre}`}>
                            {opciones.map((op) => (
                                <button
                                    key={op}
                                    type="button"
                                    role="radio"
                                    aria-checked={presentacion === op}
                                    onClick={() => setPresentacion(op)}
                                    className={`rounded-full border px-3 py-1.5 font-display text-[12px] font-semibold ${
                                        presentacion === op ? 'border-navy bg-navy text-white' : 'border-mist-border text-navy-600 hover:border-navy'
                                    }`}
                                >
                                    {op}
                                    {cantidadDe(producto.id, op) > 0 && presentacion !== op && (
                                        <span className="ml-1.5 text-green-dark">· {cantidadDe(producto.id, op)}</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
                <div className="mt-1.5 flex gap-2">
                    {cantidad > 0 ? (
                        <div className="flex flex-1 items-center justify-between gap-2 rounded-lg bg-green-light py-1 pl-1 pr-2.5">
                            <SelectorCantidad
                                valor={cantidad}
                                onCambiar={(n) => carrito.cambiar(claveDe(producto.id, presentacion), n)}
                                nombre={producto.nombre}
                                compacto
                            />
                            <button
                                type="button"
                                onClick={carrito.abrir}
                                className="font-display text-[12.5px] font-semibold text-green-dark hover:text-navy"
                            >
                                En su pedido →
                            </button>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={() => carrito.agregar(producto, presentacion)}
                            className="flex-1 rounded-lg bg-green py-2.5 text-center font-display text-[13px] font-semibold text-white hover:bg-green-dark"
                        >
                            Agregar al pedido
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={onVerFicha}
                        className="rounded-lg border-[1.5px] border-mist-border px-3.5 py-2.5 font-display text-[13px] font-semibold text-navy"
                    >
                        Ficha
                    </button>
                </div>
            </div>
        </div>
    );
}
