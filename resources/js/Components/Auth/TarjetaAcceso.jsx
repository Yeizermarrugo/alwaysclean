import { Head, Link } from '@inertiajs/react';

/** Marco de las pantallas de acceso secundarias (recuperar y restablecer contraseña). */
export default function TarjetaAcceso({ titulo, subtitulo, children }) {
    return (
        <div className="flex h-pantalla flex-col overflow-y-auto bg-mist-50 px-5 py-8">
            <Head title={`Panel interno · ${titulo}`} />
            <div className="m-auto w-full max-w-[420px]">
                <div className="rounded-2xl border border-mist-300 bg-white p-7 shadow-[0_24px_60px_-30px_rgba(13,13,91,0.35)] sm:p-9">
                    <img src="/images/logo-color.png" alt="Always Clean Colombia" className="mb-7 h-14 w-auto" />
                    <h1 className="font-display text-[24px] font-extrabold tracking-tight text-navy">{titulo}</h1>
                    {subtitulo && <p className="mb-6 mt-1.5 text-[14px] leading-relaxed text-navy-500">{subtitulo}</p>}
                    {children}
                </div>
                <div className="mt-5 text-center">
                    <Link href={route('login')} className="text-[13px] font-medium text-navy-500 hover:text-green-dark">
                        ← Volver al ingreso
                    </Link>
                </div>
            </div>
        </div>
    );
}

export const inputAcceso = (error) => `w-full rounded-[10px] border px-4 py-3 text-[14px] text-navy placeholder:text-ink-400 transition-colors focus:border-green focus:ring-2 focus:ring-green/20 ${
    error ? 'border-alert' : 'border-mist-400'
}`;

export function BotonAcceso({ procesando, children, textoProcesando }) {
    return (
        <button
            type="submit"
            disabled={procesando}
            className="mt-1 flex w-full items-center justify-center gap-2 rounded-[10px] bg-navy py-3.5 font-display text-[15px] font-semibold text-white shadow-[0_10px_24px_-12px_rgba(13,13,91,0.6)] transition-colors hover:bg-navy-deep disabled:opacity-50"
        >
            {procesando && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" aria-hidden="true" />}
            {procesando ? textoProcesando : children}
        </button>
    );
}

export function AvisoExito({ children }) {
    return (
        <div className="mb-5 rounded-[10px] border border-green/40 bg-green-light px-4 py-3 text-[13.5px] font-medium leading-relaxed text-green-dark">
            {children}
        </div>
    );
}
