import { usePage } from '@inertiajs/react';
import { waLink } from '@/lib/whatsapp';

export default function WhatsAppFloat({ mensaje = 'Hola, quiero información sobre sus servicios de limpieza.' }) {
    const { empresa } = usePage().props;

    if (!empresa?.whatsapp) return null;

    return (
        <>
            <style>{`
                @keyframes wa-ping {
                    0% { transform: scale(1); opacity: .55; }
                    80%, 100% { transform: scale(1.7); opacity: 0; }
                }
                @keyframes wa-in {
                    from { transform: translateY(16px) scale(.9); opacity: 0; }
                    to { transform: translateY(0) scale(1); opacity: 1; }
                }
                .wa-float { animation: wa-in .45s cubic-bezier(.2,.8,.2,1) .6s both; }
                .wa-ping { animation: wa-ping 2.4s cubic-bezier(0,0,.2,1) infinite; }
                @media (prefers-reduced-motion: reduce) {
                    .wa-float, .wa-ping { animation: none; }
                }
            `}</style>

            <a
                href={waLink(empresa.whatsapp, mensaje)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Escríbanos por WhatsApp"
                className="wa-float group fixed bottom-5 right-5 z-40 flex items-center gap-3 sm:bottom-7 sm:right-7"
                style={{ marginBottom: 'env(safe-area-inset-bottom)' }}
            >
                <span className="pointer-events-none hidden translate-x-2 rounded-full bg-white px-4 py-2 font-display text-[13px] font-semibold text-navy opacity-0 shadow-[0_8px_24px_-6px_rgba(15,23,42,0.25)] ring-1 ring-black/5 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 sm:block">
                    ¿Hablamos? <span className="font-normal text-navy/60">Respondemos rápido</span>
                </span>

                <span className="relative grid h-14 w-14 place-items-center sm:h-[60px] sm:w-[60px]">
                    <span className="wa-ping absolute inset-0 rounded-full bg-[#25D366]" aria-hidden="true" />
                    <span className="relative grid h-full w-full place-items-center rounded-full bg-gradient-to-br from-[#2FE077] to-[#1EBE5A] text-white shadow-[0_10px_30px_-8px_rgba(37,211,102,0.7)] ring-4 ring-white/90 transition-transform duration-300 group-hover:scale-110 group-focus-visible:scale-110 group-active:scale-95">
                        <svg viewBox="0 0 32 32" className="h-7 w-7 sm:h-8 sm:w-8" fill="currentColor" aria-hidden="true">
                            <path d="M16.004 3C8.832 3 3 8.83 3 16c0 2.293.6 4.53 1.74 6.5L3 29l6.67-1.71A12.95 12.95 0 0 0 16.004 29C23.172 29 29 23.17 29 16S23.172 3 16.004 3Zm0 23.64c-2.02 0-4-.54-5.72-1.57l-.41-.24-3.96 1.02 1.06-3.86-.27-.4A10.6 10.6 0 0 1 5.36 16c0-5.87 4.77-10.64 10.644-10.64 5.87 0 10.636 4.77 10.636 10.64 0 5.87-4.766 10.64-10.636 10.64Zm5.84-7.97c-.32-.16-1.89-.93-2.18-1.04-.29-.11-.51-.16-.72.16-.21.32-.83 1.04-1.01 1.25-.19.21-.37.24-.69.08-.32-.16-1.35-.5-2.57-1.59-.95-.85-1.59-1.9-1.78-2.22-.19-.32-.02-.49.14-.65.14-.14.32-.37.48-.56.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.72-1.73-.99-2.37-.26-.62-.52-.54-.72-.55l-.61-.01c-.21 0-.56.08-.85.4-.29.32-1.12 1.09-1.12 2.66s1.15 3.09 1.31 3.3c.16.21 2.26 3.45 5.47 4.84.76.33 1.36.53 1.83.68.77.24 1.47.21 2.02.13.62-.09 1.89-.77 2.16-1.52.27-.75.27-1.39.19-1.52-.08-.13-.29-.21-.61-.37Z" />
                        </svg>
                    </span>
                </span>
            </a>
        </>
    );
}
