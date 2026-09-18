import { Link } from '@inertiajs/react';
import PlaceholderPhoto from '@/Components/Site/PlaceholderPhoto';

export default function ServiceCard({ servicio, categoriaLabel }) {
    return (
        <Link
            href={route('servicios.show', servicio.slug)}
            className="flex flex-col overflow-hidden rounded-[10px] border border-mist-300 transition hover:border-green"
        >
            {servicio.imagen_url ? (
                <img src={servicio.imagen_url} alt={servicio.nombre} className="aspect-[4/3] w-full object-cover object-top" />
            ) : (
                <PlaceholderPhoto hint={servicio.imagen_hint} className="aspect-[4/3]" />
            )}
            <div className="flex flex-1 flex-col gap-1.5 px-4 py-3.5">
                <span className="font-sans text-[10px] font-semibold tracking-[0.12em] text-green-dark">
                    {(categoriaLabel ?? servicio.categoria_label ?? '').toUpperCase()}
                </span>
                <div className="flex-1 font-display text-[15px] font-semibold leading-tight text-navy text-balance">
                    {servicio.nombre}
                </div>
                <span className="border-t border-mist-200 pt-2.5 font-display text-[12.5px] font-semibold text-navy-700">
                    Ver detalle y cotizar →
                </span>
            </div>
        </Link>
    );
}
