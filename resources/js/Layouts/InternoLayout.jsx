import { Head, Link, router, usePage } from '@inertiajs/react';

const NAV = [
    { label: 'Cotizaciones', route: 'interno.bandeja' },
    { label: 'Servicios', route: 'interno.servicios.index' },
    { label: 'Productos', route: 'interno.productos.index' },
    { label: 'PQRS', route: 'interno.pqrs.index' },
];

export default function InternoLayout({ title, pantallaCompleta = false, children }) {
    const { auth, pqrsPendientes } = usePage().props;
    const currentRoute = route().current();

    const logout = () => router.post(route('interno.logout'));

    return (
        // pantallaCompleta: en escritorio la página ocupa justo la ventana y cada panel hace su propio scroll.
        <div className={`bg-white ${pantallaCompleta ? 'min-h-screen lg:flex lg:h-pantalla lg:min-h-0 lg:flex-col lg:overflow-hidden' : 'min-h-screen'}`}>
            <Head title={`Panel interno · ${title}`} />

            <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 bg-navy px-5 py-2.5 lg:px-7">
                <Link href={route('interno.bandeja')} className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-white shadow-sm">
                        <img src="/images/logo-gota.png" alt="" className="h-7 w-auto" />
                    </span>
                    <span className="flex flex-col leading-tight">
                        <span className="font-display text-[15px] font-extrabold tracking-wide text-white">ALWAYS CLEAN</span>
                        <span className="text-[11px] font-medium text-white/55">Panel interno</span>
                    </span>
                </Link>
                <nav className="flex flex-wrap gap-4 font-display text-[13px] font-semibold sm:gap-5">
                    {NAV.map((item) => (
                        <Link
                            key={item.label}
                            href={route(item.route)}
                            className={`relative inline-flex items-center gap-1.5 ${currentRoute === item.route ? 'text-green-bright' : 'text-white/70 hover:text-white'}`}
                        >
                            {item.label}
                            {item.route === 'interno.pqrs.index' && pqrsPendientes > 0 && (
                                <span className="grid h-[18px] min-w-[18px] place-items-center rounded-full bg-alert px-1 font-sans text-[10.5px] font-bold text-white">
                                    {pqrsPendientes}
                                </span>
                            )}
                        </Link>
                    ))}
                </nav>
                <div className="flex items-center gap-2.5">
                    <span className="rounded-full bg-white/[.14] px-3 py-1.5 font-display text-xs font-semibold text-white">
                        {auth.user?.name}
                    </span>
                    <button onClick={logout} className="font-display text-xs font-semibold text-white/70 hover:text-white">
                        Salir
                    </button>
                </div>
            </div>

            {pantallaCompleta ? <div className="lg:flex lg:min-h-0 lg:flex-1 lg:flex-col">{children}</div> : children}
        </div>
    );
}
