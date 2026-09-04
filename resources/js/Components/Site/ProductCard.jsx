import { waLink } from '@/lib/whatsapp';
import { usePage } from '@inertiajs/react';

export default function ProductCard({ producto, onVerFicha }) {
    const { empresa } = usePage().props;

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
                    <div className="flex justify-between">
                        <span className="text-ink-500">Presentación</span>
                        <span>{producto.presentacion}</span>
                    </div>
                </div>
                <div className="mt-1.5 flex gap-2">
                    <a
                        href={waLink(empresa.whatsapp, `Hola, quiero precio de ${producto.nombre}.`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 rounded-lg bg-green py-2.5 text-center font-display text-[13px] font-semibold text-white"
                    >
                        Pedir precio
                    </a>
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
