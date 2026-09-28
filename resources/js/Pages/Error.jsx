import { Link, usePage } from '@inertiajs/react';
import SiteLayout from '@/Layouts/SiteLayout';
import { waLink } from '@/lib/whatsapp';

const MENSAJES = {
    403: ['Acceso restringido', 'No tiene permiso para ver esta página.'],
    404: ['Página no encontrada', 'La página que busca no existe o cambió de dirección.'],
    500: ['Algo salió mal', 'Tuvimos un problema al cargar esta página. Inténtelo de nuevo en unos minutos.'],
    503: ['Volvemos en un momento', 'Estamos haciendo mantenimiento al sitio. Inténtelo de nuevo en unos minutos.'],
};

export default function Error({ status }) {
    const { empresa } = usePage().props;
    const [titulo, texto] = MENSAJES[status] ?? MENSAJES[500];

    return (
        <SiteLayout title={titulo}>
            <div className="mx-auto flex max-w-2xl flex-col items-center px-5 py-20 text-center lg:py-28">
                <span className="mb-4 font-display text-[88px] font-extrabold leading-none tracking-tight text-mist-tile lg:text-[120px]">
                    {status}
                </span>
                <h1 className="mb-3 font-display text-[28px] font-extrabold tracking-tight text-navy lg:text-[34px]">{titulo}</h1>
                <p className="mb-8 max-w-md text-[15px] leading-relaxed text-navy-500">{texto}</p>
                <div className="flex flex-wrap justify-center gap-3">
                    <Link href="/" className="rounded-[9px] bg-navy px-5 py-3 font-display text-[14px] font-semibold text-white hover:bg-navy-deep">
                        Ir al inicio
                    </Link>
                    <a href="/servicios" className="rounded-[9px] border-[1.5px] border-mist-border px-5 py-3 font-display text-[14px] font-semibold text-navy hover:border-navy">
                        Ver servicios
                    </a>
                    {empresa?.whatsapp && (
                        <a
                            href={waLink(empresa.whatsapp, 'Hola, necesito ayuda con el sitio web.')}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-[9px] bg-green px-5 py-3 font-display text-[14px] font-semibold text-white hover:bg-green-dark"
                        >
                            Escribir por WhatsApp
                        </a>
                    )}
                </div>
            </div>
        </SiteLayout>
    );
}
