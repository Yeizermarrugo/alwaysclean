import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { waLink } from '@/lib/whatsapp';

const NAV = [
    { label: 'Inicio', route: 'home' },
    { label: 'Nosotros', route: 'nosotros.index' },
    { label: 'Servicios', route: 'servicios.index' },
    { label: 'Productos', route: 'productos.index' },
    { label: 'Contacto', route: 'contacto.create' },
    { label: 'PQRS', route: 'pqrs.create' },
];

export default function Header({ showTopbar = false, showActions = true, compact = false }) {
    const { empresa } = usePage().props;
    const currentRoute = route().current();
    const [menuAbierto, setMenuAbierto] = useState(false);

    return (
        <div>
            {showTopbar && (
                <div className="hidden items-center justify-between bg-navy px-6 py-2 text-xs font-medium text-white/70 md:flex lg:px-10">
                    <span>NIT {empresa.nit} · {empresa.ciudad}</span>
                    <div className="flex gap-5">
                        {empresa.telefonos.map((tel) => (
                            <span key={tel}>{tel}</span>
                        ))}
                        <span>{empresa.correos[0]}</span>
                    </div>
                </div>
            )}
            <div className={`flex items-center justify-between border-b border-mist-300 bg-white px-4 py-2.5 lg:px-10 ${compact ? '' : 'md:py-3'}`}>
                <Link href={route('home')}>
                    <img src="/images/logo.png" alt="Always Clean Colombia" className={compact ? 'h-12' : 'h-12 md:h-14'} />
                </Link>

                <nav className="hidden items-center gap-6 font-display text-[13.5px] font-semibold md:flex">
                    {NAV.map((item) => (
                        <Link
                            key={item.route}
                            href={route(item.route)}
                            className={currentRoute === item.route || currentRoute?.startsWith(item.route.split('.')[0]) ? 'text-green' : 'text-navy-700 hover:text-green'}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-2.5">
                    {showActions && (
                        <>
                            <Link
                                href={route('contacto.create')}
                                className="hidden rounded-lg border-[1.5px] border-mist-border px-3.5 py-2 font-display text-[13px] font-semibold text-navy sm:inline-block"
                            >
                                Cotizar
                            </Link>
                            <a
                                href={waLink(empresa.whatsapp, 'Hola, quiero información sobre sus servicios de limpieza.')}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-lg bg-green px-3.5 py-2 font-display text-[13px] font-semibold text-white"
                            >
                                WhatsApp
                            </a>
                        </>
                    )}
                    <button
                        type="button"
                        onClick={() => setMenuAbierto((v) => !v)}
                        aria-label="Abrir menú"
                        className="grid h-9 w-9 place-items-center rounded-lg border border-mist-border text-navy md:hidden"
                    >
                        {menuAbierto ? '✕' : '☰'}
                    </button>
                </div>
            </div>

            {menuAbierto && (
                <nav className="flex flex-col border-b border-mist-300 bg-white px-4 py-2 font-display text-[14px] font-semibold md:hidden">
                    {NAV.map((item) => (
                        <Link
                            key={item.route}
                            href={route(item.route)}
                            onClick={() => setMenuAbierto(false)}
                            className={`border-b border-mist-200 py-3 last:border-b-0 ${currentRoute === item.route ? 'text-green' : 'text-navy-700'}`}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>
            )}
        </div>
    );
}
