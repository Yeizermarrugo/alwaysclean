import { usePage } from '@inertiajs/react';
import { waLink } from '@/lib/whatsapp';

const ICONOS = {
    facebook: (
        <path d="M13.5 21v-7.5h2.5l.4-3h-2.9V8.6c0-.87.25-1.46 1.5-1.46h1.55V4.47A20.7 20.7 0 0 0 14.3 4.3c-2.24 0-3.8 1.37-3.8 3.9v2.3H8v3h2.5V21h3Z" />
    ),
    twitter: (
        <path d="M17.75 3h3.07l-6.7 7.66L22 21h-6.17l-4.83-6.32L5.47 21H2.4l7.17-8.2L2 3h6.33l4.37 5.77L17.75 3Zm-1.08 16.17h1.7L7.4 4.73H5.58l11.09 14.44Z" />
    ),
    instagram: (
        <path d="M12 7.2a4.8 4.8 0 1 0 0 9.6 4.8 4.8 0 0 0 0-9.6Zm0 7.9a3.1 3.1 0 1 1 0-6.2 3.1 3.1 0 0 1 0 6.2Zm5-8.1a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0ZM12 4.6c2.4 0 2.7 0 3.65.05 2.45.11 3.6 1.28 3.7 3.7.05.95.05 1.24.05 3.65s0 2.7-.05 3.65c-.1 2.42-1.25 3.59-3.7 3.7-.95.05-1.23.05-3.65.05s-2.7 0-3.65-.05c-2.46-.11-3.6-1.29-3.7-3.7C4.6 14.7 4.6 14.41 4.6 12s0-2.7.05-3.65c.1-2.42 1.25-3.59 3.7-3.7C9.3 4.6 9.6 4.6 12 4.6ZM12 3c-2.44 0-2.75 0-3.71.05-3.27.15-5.09 1.96-5.24 5.24C3 9.25 3 9.56 3 12s0 2.75.05 3.71c.15 3.27 1.96 5.09 5.24 5.24.96.04 1.27.05 3.71.05s2.75 0 3.71-.05c3.27-.15 5.09-1.96 5.24-5.24.04-.96.05-1.27.05-3.71s0-2.75-.05-3.71c-.15-3.27-1.96-5.09-5.24-5.24C14.75 3 14.44 3 12 3Z" />
    ),
    whatsapp: (
        <path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3Zm0 16.4c-1.4 0-2.77-.37-3.96-1.08l-.28-.17-2.74.72.73-2.67-.18-.28A7.4 7.4 0 1 1 12 19.4Zm4.05-5.52c-.22-.11-1.31-.65-1.51-.72-.2-.07-.35-.11-.5.11-.15.22-.57.72-.7.87-.13.15-.26.17-.48.06-.22-.11-.94-.35-1.78-1.1-.66-.59-1.1-1.31-1.23-1.54-.13-.22 0-.34.1-.45.1-.1.22-.26.33-.39.11-.13.15-.22.22-.37.07-.15.04-.28-.02-.39-.06-.11-.5-1.2-.69-1.64-.18-.43-.36-.37-.5-.38h-.42c-.15 0-.39.06-.59.28-.2.22-.78.76-.78 1.85s.8 2.14.91 2.29c.11.15 1.57 2.39 3.79 3.35.53.23.94.37 1.27.47.53.17 1.02.15 1.4.09.43-.06 1.31-.54 1.5-1.05.18-.52.18-.96.13-1.05-.06-.09-.2-.15-.42-.26Z" />
    ),
};

const NOMBRES = { facebook: 'Facebook', twitter: 'X (Twitter)', instagram: 'Instagram', whatsapp: 'WhatsApp' };

/**
 * Botones redondos con las redes de config('company.redes') + WhatsApp.
 * `className` define la disposición (columna en el hero, fila en móvil);
 * `discreto` = versión más pequeña y tenue para el footer.
 */
export default function RedesSociales({ className = '', conWhatsapp = true, discreto = false }) {
    const { empresa } = usePage().props;

    const enlaces = Object.entries(empresa.redes ?? {}).map(([red, url]) => ({ red, url }));
    if (conWhatsapp && empresa.whatsapp) {
        enlaces.push({ red: 'whatsapp', url: waLink(empresa.whatsapp, 'Hola, quiero información sobre sus servicios de limpieza.') });
    }

    return (
        <ul className={className}>
            {enlaces.map(({ red, url }) => (
                <li key={red}>
                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Always Clean en ${NOMBRES[red]}`}
                        title={NOMBRES[red]}
                        className={`grid place-items-center rounded-full transition-colors duration-200 hover:border-green hover:bg-green focus-visible:border-green focus-visible:bg-green focus-visible:outline-none ${
                            discreto ? 'h-9 w-9 border border-white/25 text-white/80 hover:text-white' : 'h-10 w-10 border-2 border-white/90 text-white'
                        }`}
                    >
                        <svg viewBox="0 0 24 24" className={discreto ? 'h-4 w-4' : 'h-[18px] w-[18px]'} fill="currentColor" aria-hidden="true">
                            {ICONOS[red]}
                        </svg>
                    </a>
                </li>
            ))}
        </ul>
    );
}
