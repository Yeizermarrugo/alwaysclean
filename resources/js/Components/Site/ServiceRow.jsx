import { Link } from '@inertiajs/react';

export default function ServiceRow({ servicio, chevron = false }) {
    return (
        <Link
            href={route('servicios.show', servicio.slug)}
            className="flex items-center gap-3.5 border-b border-mist-200 py-3 text-decoration-none"
        >
            <span className="font-mono text-[11px] font-medium text-green">{servicio.codigo}</span>
            <div className="flex-1">
                <div className="font-display text-[14.5px] font-semibold leading-tight text-navy">{servicio.nombre}</div>
                {servicio.meta && <div className="text-[11.5px] text-ink-500">{servicio.meta}</div>}
            </div>
            {chevron && <span className="text-[15px] text-ink-300">›</span>}
        </Link>
    );
}
