import { Head, Link, router, usePage } from '@inertiajs/react';

const NAV = [
    { label: 'Cotizaciones', route: 'interno.bandeja' },
    { label: 'Servicios', route: 'interno.servicios.index' },
    { label: 'Productos', route: 'interno.productos.index' },
    { label: 'PQRS', route: 'interno.pqrs.index' },
    { label: 'Cuadrillas' },
];

export default function InternoLayout({ title, children }) {
    const { auth, pqrsPendientes } = usePage().props;
    const currentRoute = route().current();

    const logout = () => router.post(route('interno.logout'));

    return (
        <div className="min-h-screen bg-white">
            <Head title={`Panel comercial · ${title}`} />

            <div className="flex flex-wrap items-center justify-between gap-3 bg-navy px-5 py-2.5 lg:px-7">
                <div className="flex items-center gap-3">
                    <div className="rounded-md bg-white px-2 py-1">
                        <img src="/images/logo.png" alt="Always Clean Colombia" className="h-9" />
                    </div>
                    <span className="hidden text-[12.5px] text-white/60 sm:inline">Panel comercial</span>
                </div>
                <nav className="flex flex-wrap gap-4 font-display text-[13px] font-semibold sm:gap-5">
                    {NAV.map((item) => (
                        item.route ? (
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
                        ) : (
                            <span key={item.label} className="text-white/40">{item.label}</span>
                        )
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

            {children}
        </div>
    );
}
