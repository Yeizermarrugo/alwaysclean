import { usePage } from '@inertiajs/react';

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
};

const NOMBRES = { facebook: 'Facebook', twitter: 'X (Twitter)', instagram: 'Instagram' };

/**
 * Botones redondos con las redes de config('company.redes'). WhatsApp no va aquí:
 * ya está el botón flotante (WhatsAppFloat).
 * `className` define la disposición (columna en el hero, fila en móvil);
 * `discreto` = versión más pequeña y tenue para el footer.
 */
export default function RedesSociales({ className = '', discreto = false }) {
    const { empresa } = usePage().props;

    const enlaces = Object.entries(empresa.redes ?? {}).map(([red, url]) => ({ red, url }));

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
