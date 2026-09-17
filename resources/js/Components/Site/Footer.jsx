import { Link, usePage } from '@inertiajs/react';

export default function Footer() {
    const { empresa } = usePage().props;

    return (
        <footer className="grid grid-cols-2 gap-8 bg-navy-deep px-6 py-10 text-[13.5px] leading-[1.7] text-white/60 lg:grid-cols-[1.3fr_1fr_1fr_1fr] lg:px-10 lg:py-10">
            <div>
                <div className="mb-2 font-display text-[15px] font-extrabold text-white">
                    {empresa.nombre.toUpperCase()}
                </div>
                {empresa.razon_social}. NIT {empresa.nit}.
                <div className="mt-3 flex flex-col gap-1">
                    <Link href={route('nosotros.index')} className="hover:text-white">Nosotros</Link>
                    <Link href={route('politicas.index')} className="hover:text-white">Política integral</Link>
                </div>
            </div>
            <div>
                <div className="mb-2 font-display text-[12.5px] font-semibold text-white">Servicios</div>
                Limpieza<br />Sanitarios y ambientales<br />Obras civiles
            </div>
            <div>
                <div className="mb-2 font-display text-[12.5px] font-semibold text-white">Contacto</div>
                {empresa.telefonos.map((tel) => (
                    <span key={tel}>{tel}<br /></span>
                ))}
            </div>
            <div>
                <div className="mb-2 font-display text-[12.5px] font-semibold text-white">Sede</div>
                {empresa.ciudad.split(',')[0] ?? empresa.ciudad}<br />Bolívar, Colombia
            </div>
        </footer>
    );
}
