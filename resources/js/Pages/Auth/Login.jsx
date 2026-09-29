import { useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

const MODULOS = [
    { titulo: 'Cotizaciones', texto: 'Solicitudes del sitio y WhatsApp con su bitácora de estados.' },
    { titulo: 'PQRS', texto: 'Casos radicados, lectura y seguimiento hasta el cierre.' },
    { titulo: 'Catálogo', texto: 'Servicios y productos publicados en el sitio.' },
];

export default function Login() {
    const { empresa, flash } = usePage().props;
    const [verPassword, setVerPassword] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('interno.login.store'));
    };

    return (
        <div className="grid h-pantalla overflow-hidden bg-white lg:grid-cols-[1.1fr_1fr]">
            <Head title="Panel interno · Ingreso" />

            {/* Panel de marca (escritorio) */}
            <aside className="relative hidden overflow-hidden bg-navy-deep lg:flex lg:flex-col lg:justify-between lg:p-10">
                <img
                    src="https://images.unsplash.com/photo-1627905646269-7f034dcc5738?auto=format&fit=crop&w=1400&q=75"
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover opacity-35"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-navy-deep via-navy-deep/85 to-navy/60" aria-hidden="true" />
                <div
                    className="pointer-events-none absolute -bottom-40 -left-40 h-[460px] w-[460px] rounded-full bg-green/25 blur-3xl"
                    aria-hidden="true"
                />

                <div className="relative flex items-center justify-between">
                    <img src="/images/logo-blanco.png" alt="Always Clean Colombia" className="h-20 w-auto" />
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 font-sans text-[11px] font-semibold tracking-[0.14em] text-green-bright">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-bright" aria-hidden="true" />
                        PANEL INTERNO
                    </span>
                </div>

                <div className="relative max-w-[460px]">
                    <h2 className="font-display text-[38px] font-extrabold leading-[1.1] tracking-tight text-white">
                        Toda la operación comercial en un solo lugar.
                    </h2>
                    <ul className="mt-9 flex flex-col gap-5">
                        {MODULOS.map((m) => (
                            <li key={m.titulo} className="flex gap-4">
                                <span className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-green/20 text-green-bright">
                                    <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
                                        <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-8 8a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.4L8 12.6l7.3-7.3a1 1 0 0 1 1.4 0Z" />
                                    </svg>
                                </span>
                                <div>
                                    <div className="font-display text-[15px] font-bold text-white">{m.titulo}</div>
                                    <div className="text-[13.5px] leading-relaxed text-white/60">{m.texto}</div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="relative text-[12px] text-white/45">
                    Always Clean Colombia S.A.S. · NIT {empresa?.nit} · {empresa?.ciudad}
                </div>
            </aside>

            {/* Formulario */}
            <main className="flex min-h-0 flex-col overflow-y-auto px-5 py-5 sm:px-10 lg:px-16">
                <div className="flex items-center justify-between">
                    <Link href={route('home')} className="text-[13px] font-medium text-navy-500 hover:text-green-dark">
                        ← Volver al sitio
                    </Link>
                </div>

                <div className="mx-auto flex w-full max-w-[380px] flex-1 flex-col justify-center py-2">
                    <img src="/images/logo-color.png" alt="Always Clean Colombia" className="mb-5 h-14 w-auto self-start" />

                    <h1 className="font-display text-[28px] font-extrabold tracking-tight text-navy">Bienvenido</h1>
                    <p className="mb-6 mt-1.5 text-[14.5px] text-navy-500">
                        Ingrese con su cuenta para gestionar cotizaciones, PQRS y el catálogo.
                    </p>

                    {flash?.status && (
                        <div className="mb-5 rounded-[10px] border border-green/40 bg-green-light px-4 py-3 text-[13.5px] font-medium text-green-dark">
                            {flash.status}
                        </div>
                    )}

                    <form onSubmit={submit} className="flex flex-col gap-4">
                        <div>
                            <label htmlFor="email" className="mb-1.5 block text-[13px] font-medium text-navy-600">
                                Correo
                            </label>
                            <input
                                id="email"
                                type="email"
                                autoComplete="username"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="nombre@empresa.com"
                                className={inputClass(errors.email)}
                                autoFocus
                            />
                            {errors.email && <p className="mt-1.5 text-xs text-alert">{errors.email}</p>}
                        </div>

                        <div>
                            <label htmlFor="password" className="mb-1.5 block text-[13px] font-medium text-navy-600">
                                Contraseña
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={verPassword ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className={`${inputClass(errors.password)} pr-20`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setVerPassword((v) => !v)}
                                    className="absolute inset-y-0 right-0 px-3.5 text-[12.5px] font-semibold text-navy-500 hover:text-navy"
                                    aria-label={verPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                >
                                    {verPassword ? 'Ocultar' : 'Mostrar'}
                                </button>
                            </div>
                            {errors.password && <p className="mt-1.5 text-xs text-alert">{errors.password}</p>}
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <label className="flex items-center gap-2.5 text-[13.5px] text-navy-600">
                                <input
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="h-4 w-4 rounded border-mist-border text-green focus:ring-green"
                                />
                                Mantener la sesión iniciada
                            </label>
                            <Link href={route('interno.password.request')} className="text-[13px] font-semibold text-navy-600 hover:text-green-dark">
                                ¿Olvidó su contraseña?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="mt-1 flex w-full items-center justify-center gap-2 rounded-[10px] bg-navy py-3.5 font-display text-[15px] font-semibold text-white shadow-[0_10px_24px_-12px_rgba(13,13,91,0.6)] transition-colors hover:bg-navy-deep disabled:opacity-50"
                        >
                            {processing && (
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" aria-hidden="true" />
                            )}
                            {processing ? 'Ingresando…' : 'Ingresar'}
                        </button>
                    </form>
                </div>

                <p className="text-center text-[12px] text-ink-500">
                    Acceso exclusivo para personal autorizado de Always Clean Colombia.
                </p>
            </main>
        </div>
    );
}

function inputClass(error) {
    return `w-full rounded-[10px] border px-4 py-3 text-[14px] text-navy placeholder:text-ink-400 transition-colors focus:border-green focus:ring-2 focus:ring-green/20 ${
        error ? 'border-alert' : 'border-mist-400'
    }`;
}
