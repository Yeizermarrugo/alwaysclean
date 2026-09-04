import { useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import SiteLayout from '@/Layouts/SiteLayout';
import PlaceholderPhoto from '@/Components/Site/PlaceholderPhoto';

const PASOS = ['SERVICIO', 'SU SEDE', 'CONTACTO'];
const FRECUENCIAS = [
    ['una_vez', 'Una vez'],
    ['mensual', 'Mensual'],
    ['trimestral', 'Trimestral'],
    ['anual', 'Contrato anual'],
];

export default function Contacto({ servicios }) {
    const { empresa } = usePage().props;
    const [paso, setPaso] = useState(0);

    const { data, setData, post, processing, errors } = useForm({
        servicios: [],
        empresa: '',
        nit: '',
        ciudad: 'Cartagena de Indias',
        direccion: '',
        area_m2: '',
        fecha_deseada: '',
        detalle: '',
        frecuencia: 'una_vez',
        whatsapp: '',
    });

    const disponibles = servicios.filter((s) => !data.servicios.includes(s.nombre));

    const agregarServicio = (nombre) => {
        if (nombre) setData('servicios', [...data.servicios, nombre]);
    };

    const quitarServicio = (nombre) => {
        setData('servicios', data.servicios.filter((s) => s !== nombre));
    };

    const puedeContinuar = paso === 0 ? data.servicios.length > 0 : true;

    const submit = (e) => {
        e.preventDefault();
        post(route('contacto.store'));
    };

    return (
        <SiteLayout title="Solicite su cotización">
            <div className="grid lg:grid-cols-[1.25fr_.75fr]">
                <div className="border-b border-mist-300 px-5 py-8 lg:border-b-0 lg:border-r lg:px-10 lg:py-9">
                    <h1 className="mb-1.5 font-display text-[28px] font-extrabold tracking-tight text-navy lg:text-[34px]">
                        Solicite su cotización
                    </h1>
                    <p className="mb-6 max-w-[520px] text-[15px] text-navy-500">
                        Entre más detalle, más exacta la propuesta. También puede enviarlo todo por WhatsApp.
                    </p>

                    <div className="mb-6 flex gap-2 font-sans text-[11px] font-semibold tracking-[0.1em]">
                        {PASOS.map((p, i) => (
                            <span
                                key={p}
                                className={`flex-1 rounded-[7px] px-3 py-2.5 text-center ${
                                    i === paso ? 'bg-green text-white' : i < paso ? 'bg-navy text-white' : 'border border-mist-300 text-ink-500'
                                }`}
                            >
                                {String(i + 1).padStart(2, '0')} {p}
                            </span>
                        ))}
                    </div>

                    <form onSubmit={submit}>
                        {paso === 0 && (
                            <div>
                                <div className="mb-1.5 text-xs font-medium text-navy-500">Servicios requeridos</div>
                                <div className="mb-3 flex flex-wrap gap-1.5">
                                    {data.servicios.map((nombre) => (
                                        <button
                                            type="button"
                                            key={nombre}
                                            onClick={() => quitarServicio(nombre)}
                                            className="rounded-full bg-green-light px-3 py-1.5 text-xs font-semibold text-green-dark"
                                        >
                                            {nombre} ✕
                                        </button>
                                    ))}
                                    {data.servicios.length === 0 && (
                                        <span className="text-[13px] text-ink-500">Seleccione al menos un servicio abajo.</span>
                                    )}
                                </div>
                                <select
                                    onChange={(e) => { agregarServicio(e.target.value); e.target.value = ''; }}
                                    className="w-full rounded-lg border border-mist-400 px-3.5 py-2.5 text-[13.5px] text-navy focus:border-green focus:ring-green"
                                    defaultValue=""
                                >
                                    <option value="" disabled>+ Agregar servicio</option>
                                    {disponibles.map((s) => (
                                        <option key={s.id} value={s.nombre}>{s.nombre}</option>
                                    ))}
                                </select>
                                {errors.servicios && <p className="mt-1.5 text-xs text-alert">{errors.servicios}</p>}
                            </div>
                        )}

                        {paso === 1 && (
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <Field label="Empresa" error={errors.empresa}>
                                    <input value={data.empresa} onChange={(e) => setData('empresa', e.target.value)} placeholder="Hotel Caribe S.A.S." className={inputClass} />
                                </Field>
                                <Field label="NIT">
                                    <input value={data.nit} onChange={(e) => setData('nit', e.target.value)} placeholder="900.000.000-0" className={inputClass} />
                                </Field>
                                <Field label="Ciudad" error={errors.ciudad}>
                                    <input value={data.ciudad} onChange={(e) => setData('ciudad', e.target.value)} className={inputClass} />
                                </Field>
                                <Field label="Dirección de la sede">
                                    <input value={data.direccion} onChange={(e) => setData('direccion', e.target.value)} placeholder="Cra. 1 # 2-87, Bocagrande" className={inputClass} />
                                </Field>
                                <Field label="Área aproximada (m²)">
                                    <input type="number" value={data.area_m2} onChange={(e) => setData('area_m2', e.target.value)} placeholder="Ej. 3.500" className={inputClass} />
                                </Field>
                                <Field label="Fecha deseada">
                                    <input type="date" value={data.fecha_deseada} onChange={(e) => setData('fecha_deseada', e.target.value)} className={inputClass} />
                                </Field>
                                <div className="sm:col-span-2">
                                    <Field label="Detalle del requerimiento">
                                        <textarea
                                            value={data.detalle}
                                            onChange={(e) => setData('detalle', e.target.value)}
                                            placeholder="Cuéntenos horarios, restricciones de acceso, número de tanques o pisos…"
                                            className={`${inputClass} min-h-[86px] resize-y`}
                                        />
                                    </Field>
                                </div>
                                <div className="sm:col-span-2">
                                    <div className="mb-1.5 text-xs font-medium text-navy-500">Frecuencia</div>
                                    <div className="inline-flex overflow-hidden rounded-lg border border-mist-300 font-display text-[12.5px] font-semibold">
                                        {FRECUENCIAS.map(([value, label]) => (
                                            <button
                                                type="button"
                                                key={value}
                                                onClick={() => setData('frecuencia', value)}
                                                className={`border-l border-mist-300 px-4 py-2.5 first:border-l-0 ${data.frecuencia === value ? 'bg-navy text-white' : 'text-navy-700'}`}
                                            >
                                                {label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {paso === 2 && (
                            <div className="max-w-sm">
                                <Field label="Su WhatsApp" error={errors.whatsapp}>
                                    <input value={data.whatsapp} onChange={(e) => setData('whatsapp', e.target.value)} placeholder="300 000 0000" className={inputClass} />
                                </Field>
                            </div>
                        )}

                        <div className="mt-6 flex flex-wrap items-center gap-3">
                            {paso > 0 && (
                                <button type="button" onClick={() => setPaso(paso - 1)} className="font-display text-[13.5px] font-semibold text-navy-600">
                                    ← Atrás
                                </button>
                            )}
                            {paso < 2 && (
                                <button
                                    type="button"
                                    disabled={!puedeContinuar}
                                    onClick={() => setPaso(paso + 1)}
                                    className="rounded-[9px] bg-navy px-[22px] py-3 font-display text-[15px] font-semibold text-white disabled:opacity-40"
                                >
                                    Continuar
                                </button>
                            )}
                            {paso === 2 && (
                                <button
                                    type="submit"
                                    disabled={processing || !data.whatsapp}
                                    className="rounded-[9px] bg-green px-[22px] py-3 font-display text-[15px] font-semibold text-white disabled:opacity-40"
                                >
                                    Enviar por WhatsApp
                                </button>
                            )}
                            <span className="text-[12.5px] text-ink-500">Sus datos se usan solo para la cotización.</span>
                        </div>
                    </form>
                </div>

                <div className="flex flex-col gap-5 bg-mist-50 px-5 py-8 lg:px-6 lg:py-8">
                    <div>
                        <div className="mb-2 font-sans text-[11px] font-semibold tracking-[0.14em] text-ink-500">ATENCIÓN DIRECTA</div>
                        <div className="font-display text-2xl font-extrabold leading-relaxed text-navy">
                            {empresa.telefonos.map((t) => <span key={t}>{t}<br /></span>)}
                        </div>
                    </div>
                    <div>
                        <div className="mb-2 font-sans text-[11px] font-semibold tracking-[0.14em] text-ink-500">CORREO</div>
                        <div className="text-sm text-navy-600">{empresa.correos.map((c) => <span key={c}>{c}<br /></span>)}</div>
                    </div>
                    <div>
                        <div className="mb-2 font-sans text-[11px] font-semibold tracking-[0.14em] text-ink-500">SEDE PRINCIPAL</div>
                        <div className="text-sm text-navy-600">{empresa.ciudad}</div>
                    </div>
                    <PlaceholderPhoto hint="mapa: zona de cobertura" className="h-[150px] rounded-[10px] p-2.5" />
                    <div className="text-[12.5px] leading-relaxed text-ink-500">{empresa.horario}</div>
                </div>
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
