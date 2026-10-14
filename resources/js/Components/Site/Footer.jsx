import { Link, usePage } from '@inertiajs/react';
import RedesSociales from '@/Components/Site/RedesSociales';

export default function Footer() {
    const { empresa } = usePage().props;

    return (
        <footer className="grid grid-cols-2 gap-8 bg-navy-deep px-6 pb-24 pt-10 text-[13.5px] leading-[1.7] text-white/60 lg:grid-cols-[1.3fr_1fr_1fr_1fr] sm:pb-10 lg:px-10 lg:pt-10">
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
                {empresa.direccion}<br />{empresa.ciudad.split(',')[0] ?? empresa.ciudad}<br />Bolívar, Colombia
            </div>
            {/* Redes a la izquierda: a la derecha quedarían bajo el botón flotante de WhatsApp y su globo de hover. */}
            <div className="col-span-2 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:pr-24 lg:col-span-4">
                <RedesSociales className="flex gap-2.5" discreto />
                <div className="flex flex-col gap-0.5 sm:items-end">
                    <span className="text-[12.5px]">© {new Date().getFullYear()} {empresa.razon_social}</span>
                    <span className="text-[11.5px] text-white/40">
                        Desarrollado por{' '}
                        <a
                            href="https://yeizermarrugo.github.io/mi-portafolio/"
                            target="_blank"
                            rel="noopener"
                            className="font-semibold text-white/60 underline-offset-2 transition-colors hover:text-green-bright hover:underline"
                        >
                            Yeizer Marrugo
                        </a>
                    </span>
                </div>
            </div>
        </footer>
    );
}
