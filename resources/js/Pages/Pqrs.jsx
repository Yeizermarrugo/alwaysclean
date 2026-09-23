import { useEffect, useRef } from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';
import SiteLayout from '@/Layouts/SiteLayout';

export default function Pqrs({ tipos, inicio, turnstileSiteKey }) {
    const { flash } = usePage().props;
    const { data, setData, post, processing, errors, reset } = useForm({
        tipo: 'queja',
        nombre: '',
        documento: '',
        email: '',
        telefono: '',
        servicio_relacionado: '',
        numero_orden: '',
        descripcion: '',
        acepta_datos: false,
        sitio_web: '',
        inicio,
        'cf-turnstile-response': '',
    });

    const turnstileRef = useRef(null);
    const widgetId = useRef(null);

    useEffect(() => {
        if (!turnstileSiteKey) return;

        const render = () => {
            if (!turnstileRef.current || widgetId.current !== null) return;
            widgetId.current = window.turnstile.render(turnstileRef.current, {
                sitekey: turnstileSiteKey,
                language: 'es',
                theme: 'light',
                callback: (token) => setData('cf-turnstile-response', token),
                'expired-callback': () => setData('cf-turnstile-response', ''),
            });
        };

        if (window.turnstile) {
            render();
        } else {
            const script = document.createElement('script');
            script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
            script.async = true;
            script.onload = render;
            document.head.appendChild(script);
        }

        return () => {
            if (widgetId.current !== null) window.turnstile?.remove(widgetId.current);
            widgetId.current = null;
        };
    }, [turnstileSiteKey]);

    const submit = (e) => {
        e.preventDefault();
        post(route('pqrs.store'), {
            onSuccess: () => reset(),
            // El token de Turnstile es de un solo uso.
            onFinish: () => {
                if (widgetId.current !== null) window.turnstile?.reset(widgetId.current);
                setData('cf-turnstile-response', '');
            },
        });
    };

    return (
        <SiteLayout title="PQRS" compact showActions={false}>
            <div className="mx-auto max-w-3xl px-5 py-9 lg:px-0">
                <div className="mb-2 text-[12.5px] text-ink-500">Inicio / PQRS</div>
                <h1 className="mb-1.5 font-display text-[28px] font-extrabold tracking-tight text-navy lg:text-[32px]">
                    Peticiones, quejas, reclamos y sugerencias
                </h1>
                <p className="max-w-[560px] text-[14.5px] text-navy-500">
                    Radicamos su caso con número de seguimiento y respondemos en un plazo máximo de 15 días hábiles.
                </p>

                {flash?.caso && (
                    <div className="mt-5 rounded-[10px] border border-green bg-green-light px-4 py-3.5 text-[14px] font-medium text-green-dark">
                        Caso radicado con éxito. Su número de seguimiento es <strong>{flash.caso}</strong>.
                    </div>
                )}

                {errors.form && (
                    <div className="mt-5 rounded-[10px] border border-alert/40 bg-alert/5 px-4 py-3.5 text-[14px] font-medium text-alert">
                        {errors.form}
                    </div>
                )}

                <form onSubmit={submit} className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {/* Honeypot: invisible para personas, los bots lo llenan. */}
                    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
                        <label>
                            Sitio web
                            <input
                                type="text"
                                name="sitio_web"
                                tabIndex={-1}
                                autoComplete="off"
                                value={data.sitio_web}
                                onChange={(e) => setData('sitio_web', e.target.value)}
                            />
                        </label>
                    </div>

                    <div className="sm:col-span-2">
                        <div className="mb-1.5 text-xs font-medium text-navy-500">Tipo de solicitud</div>
                        <div className="inline-flex flex-wrap overflow-hidden rounded-lg border border-mist-300 font-display text-[12.5px] font-semibold">
                            {Object.entries(tipos).map(([value, label]) => (
                                <button
                                    type="button"
                                    key={value}
                                    onClick={() => setData('tipo', value)}
                                    className={`border-l border-mist-300 px-4 py-2.5 first:border-l-0 ${data.tipo === value ? 'bg-navy text-white' : 'text-navy-700'}`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <Field label="Nombre completo" error={errors.nombre}>
                        <input value={data.nombre} onChange={(e) => setData('nombre', e.target.value)} placeholder="Nombre y apellido" className={inputClass} />
                    </Field>
                    <Field label="Documento" error={errors.documento}>
                        <input value={data.documento} onChange={(e) => setData('documento', e.target.value)} placeholder="CC / NIT" className={inputClass} />
                    </Field>
                    <Field label="Correo electrónico" error={errors.email}>
                        <input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} placeholder="correo@empresa.com" className={inputClass} />
                    </Field>
                    <Field label="Teléfono / WhatsApp" error={errors.telefono}>
                        <input value={data.telefono} onChange={(e) => setData('telefono', e.target.value)} placeholder="300 000 0000" className={inputClass} />
                    </Field>
                    <Field label="Servicio relacionado">
                        <input value={data.servicio_relacionado} onChange={(e) => setData('servicio_relacionado', e.target.value)} placeholder="Lavado de tanques de agua" className={inputClass} />
                    </Field>
                    <Field label="Número de orden o factura">
                        <input value={data.numero_orden} onChange={(e) => setData('numero_orden', e.target.value)} placeholder="Opcional" className={inputClass} />
                    </Field>
                    <div className="sm:col-span-2">
                        <Field label="Descripción del caso" error={errors.descripcion}>
                            <textarea
                                value={data.descripcion}
                                onChange={(e) => setData('descripcion', e.target.value)}
                                placeholder="Describa fecha, sede y lo ocurrido…"
                                className={`${inputClass} min-h-[90px] resize-y`}
                            />
                        </Field>
                    </div>

                    <div className="sm:col-span-2">
                        <label className="flex items-start gap-2.5 text-[13px] leading-relaxed text-navy-600">
                            <input
                                type="checkbox"
                                checked={data.acepta_datos}
                                onChange={(e) => setData('acepta_datos', e.target.checked)}
                                className="mt-[3px] h-4 w-4 shrink-0 rounded border-mist-border text-green focus:ring-green"
                            />
                            <span>
                                Autorizo a Always Clean Colombia S.A.S. el tratamiento de mis datos personales para gestionar
                                este caso, conforme a la Ley 1581 de 2012 y la{' '}
                                <Link href={route('politicas.index')} className="font-semibold text-green-dark underline">
                                    política de la empresa
                                </Link>
                                .
                            </span>
                        </label>
                        {errors.acepta_datos && <p className="mt-1.5 text-xs text-alert">{errors.acepta_datos}</p>}
                    </div>

                    {turnstileSiteKey && (
                        <div className="sm:col-span-2">
                            <div ref={turnstileRef} />
                            {errors['cf-turnstile-response'] && (
                                <p className="mt-1.5 text-xs text-alert">{errors['cf-turnstile-response']}</p>
                            )}
                        </div>
                    )}

                    <div className="sm:col-span-2">
                        <button
                            type="submit"
                            disabled={processing || !data.acepta_datos}
                            className="rounded-[9px] bg-navy px-[22px] py-3 font-display text-[15px] font-semibold text-white disabled:opacity-40"
                        >
                            Radicar caso
                        </button>
                    </div>
                </form>
            </div>
        </SiteLayout>
    );
}

const inputClass = 'w-full rounded-lg border border-mist-400 px-3.5 py-2.5 text-[13.5px] text-navy placeholder:text-ink-400 focus:border-green focus:ring-green';

function Field({ label, error, children }) {
    return (
        <div>
            <div className="mb-1.5 text-xs font-medium text-navy-500">{label}</div>
            {children}
            {error && <p className="mt-1.5 text-xs text-alert">{error}</p>}
        </div>
    );
}
