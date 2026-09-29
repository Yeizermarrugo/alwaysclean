import { useEffect, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { carrito, mensajePedido, useCarrito } from '@/lib/carrito';
import { waLink } from '@/lib/whatsapp';

/** Panel lateral con el pedido de productos; termina en una cotización por WhatsApp. */
export default function PedidoDrawer() {
    const { empresa } = usePage().props;
    const { items, abierto, unidades } = useCarrito();
    const [datos, setDatos] = useState({ cliente: '', ciudad: '', notas: '' });
    const [enviado, setEnviado] = useState(false);

    // Esc cierra y el fondo no se desplaza mientras el panel está abierto.
    useEffect(() => {
        if (!abierto) return;
        const alTeclado = (e) => e.key === 'Escape' && carrito.cerrar();
        const overflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', alTeclado);
        return () => {
            document.body.style.overflow = overflow;
            window.removeEventListener('keydown', alTeclado);
        };
    }, [abierto]);

    useEffect(() => {
        if (!abierto) setEnviado(false);
    }, [abierto]);

    if (!abierto) return null;

    const cambiarDato = (campo) => (e) => setDatos((d) => ({ ...d, [campo]: e.target.value }));

    const terminar = () => {
        carrito.vaciar();
        setDatos({ cliente: '', ciudad: '', notas: '' });
        carrito.cerrar();
    };

    return (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-labelledby="pedido-titulo">
            <style>{`
                @keyframes pedido-in { from { transform: translateX(100%); } to { transform: translateX(0); } }
                @keyframes pedido-fondo { from { opacity: 0; } to { opacity: 1; } }
                .pedido-panel { animation: pedido-in .28s cubic-bezier(.2,.8,.2,1); }
                .pedido-fondo { animation: pedido-fondo .2s ease-out; }
                @media (prefers-reduced-motion: reduce) { .pedido-panel, .pedido-fondo { animation: none; } }
            `}</style>
            <div className="pedido-fondo absolute inset-0 bg-navy-deep/50" onClick={carrito.cerrar} />

            <aside className="pedido-panel absolute inset-y-0 right-0 flex w-full max-w-[420px] flex-col bg-white shadow-2xl">
                <header className="flex items-center justify-between border-b border-mist-300 px-5 py-4">
                    <div>
                        <h2 id="pedido-titulo" className="font-display text-lg font-bold text-navy">Su pedido</h2>
                        <p className="text-[12.5px] text-ink-500">
                            {items.length === 0 ? 'Sin productos' : `${items.length} producto${items.length > 1 ? 's' : ''} · ${unidades} unidad${unidades > 1 ? 'es' : ''}`}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={carrito.cerrar}
                        aria-label="Cerrar pedido"
                        className="grid h-9 w-9 place-items-center rounded-lg text-navy-500 hover:bg-mist-100"
                    >
                        ✕
                    </button>
                </header>

                {items.length === 0 ? (
                    <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 text-center">
                        <span className="grid h-14 w-14 place-items-center rounded-full bg-mist-100 text-navy-500">
                            <IconoPedido className="h-6 w-6" />
                        </span>
                        <p className="font-display text-[15px] font-semibold text-navy">Aún no ha agregado productos</p>
                        <p className="text-[13px] text-ink-500">Arme su pedido desde el catálogo y cotícelo en un solo mensaje.</p>
                        <Link
                            href={route('productos.index')}
                            onClick={carrito.cerrar}
                            className="mt-2 rounded-lg bg-navy px-4 py-2.5 font-display text-[13px] font-semibold text-white"
                        >
                            Ver productos
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="flex-1 overflow-y-auto overscroll-contain">
                            <ul className="divide-y divide-mist-200 px-5">
                                {items.map((item) => (
                                    <li key={item.clave} className="flex gap-3.5 py-4">
                                        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-green-light">
                                            {item.imagen_url ? (
                                                <img src={item.imagen_url} alt="" className="h-full w-full object-cover" />
                                            ) : (
                                                <span className="grid h-full w-full place-items-center font-display text-lg font-extrabold text-green-dark">
                                                    {item.codigo}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex min-w-0 flex-1 flex-col gap-2">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="min-w-0">
                                                    <div className="font-display text-[14px] font-bold leading-snug text-navy">{item.nombre}</div>
                                                    {item.presentacion && <div className="text-[12px] text-ink-500">{item.presentacion}</div>}
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => carrito.quitar(item.clave)}
                                                    className="shrink-0 text-[12px] font-semibold text-ink-500 hover:text-alert"
                                                >
                                                    Quitar
                                                </button>
                                            </div>
                                            <SelectorCantidad
                                                valor={item.cantidad}
                                                onCambiar={(n) => carrito.cambiar(item.clave, n)}
                                                nombre={item.nombre}
                                            />
                                        </div>
                                    </li>
                                ))}
                            </ul>

                            <div className="flex flex-col gap-3 border-t border-mist-300 bg-mist-50 px-5 py-4">
                                <div className="font-sans text-[10.5px] font-semibold tracking-[0.12em] text-ink-500">
                                    DATOS PARA LA COTIZACIÓN (OPCIONAL)
                                </div>
                                <input value={datos.cliente} onChange={cambiarDato('cliente')} placeholder="Nombre o empresa" maxLength={120} className={inputClass} />
                                <input value={datos.ciudad} onChange={cambiarDato('ciudad')} placeholder="Ciudad o barrio de entrega" maxLength={120} className={inputClass} />
                                <textarea
                                    value={datos.notas}
                                    onChange={cambiarDato('notas')}
                                    placeholder="Observaciones: frecuencia de compra, horario de entrega…"
                                    maxLength={400}
                                    className={`${inputClass} min-h-[70px] resize-y`}
                                />
                            </div>
                        </div>

                        <footer className="border-t border-mist-300 px-5 py-4">
                            {enviado ? (
                                <div className="flex flex-col gap-2.5">
                                    <p className="text-[13px] text-navy-600">
                                        Abrimos WhatsApp con su pedido. Cuando lo envíe, le respondemos con precios y tiempos de entrega.
                                    </p>
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={terminar}
                                            className="flex-1 rounded-lg bg-navy py-3 font-display text-[13.5px] font-semibold text-white"
                                        >
                                            Ya lo envié, vaciar pedido
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setEnviado(false)}
                                            className="rounded-lg border border-mist-border px-3.5 py-3 font-display text-[13px] font-semibold text-navy"
                                        >
                                            Volver
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <a
                                        href={waLink(empresa.whatsapp, mensajePedido(items, datos))}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={() => setEnviado(true)}
                                        data-evento="Pedido de productos"
                                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-green py-3.5 font-display text-[14.5px] font-semibold text-white hover:bg-green-dark"
                                    >
                                        <IconoWhatsApp className="h-5 w-5" />
                                        Cotizar pedido por WhatsApp
                                    </a>
                                    <p className="mt-2 text-center text-[11.5px] text-ink-500">
                                        Sin pago en línea: le enviamos precios y disponibilidad por WhatsApp.
                                    </p>
                                </>
                            )}
                        </footer>
                    </>
                )}
            </aside>
        </div>
    );
}

export function SelectorCantidad({ valor, onCambiar, nombre, compacto = false }) {
    const [texto, setTexto] = useState(String(valor));

    useEffect(() => setTexto(String(valor)), [valor]);

    const alto = compacto ? 'h-9' : 'h-8';

    return (
        <div className={`inline-flex ${alto} items-stretch self-start overflow-hidden rounded-lg border border-mist-border`}>
            <button
                type="button"
                onClick={() => onCambiar(valor - 1)}
                disabled={valor <= 1}
                aria-label={`Quitar una unidad de ${nombre}`}
                className="w-8 font-display text-[16px] font-semibold text-navy hover:bg-mist-100 disabled:text-ink-300 disabled:hover:bg-transparent"
            >
                −
            </button>
            <input
                type="text"
                inputMode="numeric"
                value={texto}
                onChange={(e) => setTexto(e.target.value.replace(/\D/g, '').slice(0, 3))}
                onBlur={() => onCambiar(Number(texto) || 1)}
                onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
                aria-label={`Cantidad de ${nombre}`}
                className="w-11 border-x border-y-0 border-mist-border p-0 text-center font-display text-[13.5px] font-semibold text-navy focus:ring-0"
            />
            <button
                type="button"
                onClick={() => onCambiar(valor + 1)}
                aria-label={`Agregar una unidad de ${nombre}`}
                className="w-8 font-display text-[16px] font-semibold text-navy hover:bg-mist-100"
            >
                +
            </button>
        </div>
    );
}

export function IconoPedido({ className }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
            <path d="M3 4h2l2.4 11.2a1.5 1.5 0 0 0 1.5 1.2h8.4a1.5 1.5 0 0 0 1.5-1.1L21 8H6.2" />
            <circle cx="9.5" cy="20" r="1.3" />
            <circle cx="17" cy="20" r="1.3" />
        </svg>
    );
}

function IconoWhatsApp({ className }) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
            <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.4.8 3.2.6.5-.1 1.5-.6 1.8-1.2.2-.6.2-1.1.1-1.2l-.5-.3Z" />
        </svg>
    );
}

const inputClass = 'w-full rounded-lg border border-mist-400 bg-white px-3 py-2.5 text-[13px] text-navy placeholder:text-ink-400 focus:border-green focus:ring-green';
