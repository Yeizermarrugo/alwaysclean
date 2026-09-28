import { useForm } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import UbicacionPicker from '@/Components/Site/UbicacionPicker';

const CANALES = [
    ['whatsapp', 'WhatsApp'],
    ['telefono', 'Llamada'],
    ['web', 'Otro'],
];

const FRECUENCIAS = [
    ['una_vez', 'Una vez'],
    ['mensual', 'Mensual'],
    ['trimestral', 'Trimestral'],
    ['anual', 'Contrato anual'],
];

const vacio = {
    canal: 'whatsapp',
    servicios: [],
    empresa: '',
    nit: '',
    whatsapp: '',
    ciudad: 'Cartagena de Indias',
    direccion: '',
    referencia: '',
    latitud: '',
    longitud: '',
    place_id: '',
    area_m2: '',
    fecha_deseada: '',
    detalle: '',
    frecuencia: 'una_vez',
    estado: 'nueva',
    cuadrilla: '',
    nota: '',
};

/** Registro manual de una cotización recibida por llamada, WhatsApp directo u otro medio. */
export default function NuevaCotizacionModal({ open, onClose, servicios, estados, mapsKey, mapId }) {
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm(vacio);

    const cerrar = () => {
        reset();
        clearErrors();
        onClose();
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('interno.cotizaciones.store'), {
            preserveScroll: true,
            onSuccess: cerrar,
        });
    };

    const disponibles = servicios.filter((s) => !data.servicios.includes(s));
    const errorServicios = errors.servicios ?? Object.entries(errors).find(([k]) => k.startsWith('servicios.'))?.[1];

    return (
        <Modal open={open} onClose={cerrar} title="Nueva cotización" size="lg">
            <form onSubmit={submit} className="flex flex-col gap-6">
                <Seccion titulo="Origen">
                    <div className="inline-flex overflow-hidden rounded-lg border border-mist-300 font-display text-[12.5px] font-semibold">
                        {CANALES.map(([value, label]) => (
                            <button
                                type="button"
                                key={value}
                                onClick={() => setData('canal', value)}
                                className={`border-l border-mist-300 px-4 py-2 first:border-l-0 ${data.canal === value ? 'bg-navy text-white' : 'text-navy-700 hover:bg-mist-50'}`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </Seccion>

                <Seccion titulo="Servicios">
                    <div className="mb-2 flex flex-wrap gap-1.5">
                        {data.servicios.map((nombre) => (
                            <button
                                type="button"
                                key={nombre}
                                onClick={() => setData('servicios', data.servicios.filter((s) => s !== nombre))}
                                className="rounded-full bg-green-light px-3 py-1.5 text-xs font-semibold text-green-dark hover:bg-green/20"
                            >
                                {nombre} ✕
                            </button>
                        ))}
                        {data.servicios.length === 0 && <span className="text-[13px] text-ink-500">Ningún servicio agregado.</span>}
                    </div>
                    <select
                        value=""
                        onChange={(e) => e.target.value && setData('servicios', [...data.servicios, e.target.value])}
                        className={inputClass}
                    >
                        <option value="" disabled>+ Agregar servicio</option>
                        {disponibles.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {errorServicios && <p className="mt-1.5 text-xs text-alert">{errorServicios}</p>}
                </Seccion>

                <Seccion titulo="Cliente">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Field label="Empresa o cliente" error={errors.empresa}>
                            <input value={data.empresa} onChange={(e) => setData('empresa', e.target.value)} placeholder="Hotel Caribe S.A.S." className={inputClass} />
                        </Field>
                        <Field label="NIT (opcional)" error={errors.nit}>
                            <input value={data.nit} onChange={(e) => setData('nit', e.target.value)} placeholder="900.000.000-0" className={inputClass} />
                        </Field>
                        <Field label={data.canal === 'telefono' ? 'Teléfono de contacto' : 'WhatsApp de contacto'} error={errors.whatsapp ?? errors.telefono_normalizado}>
                            <input
                                type="tel"
                                inputMode="tel"
                                value={data.whatsapp}
                                onChange={(e) => setData('whatsapp', e.target.value)}
                                placeholder="300 000 0000"
                                className={inputClass}
                            />
                        </Field>
                    </div>
                </Seccion>

                <Seccion titulo="Sede" ayuda="Si el cliente aún no la dio, puede dejarla vacía y completarla luego por WhatsApp.">
                    <div className="flex flex-col gap-4">
                        <UbicacionPicker
                            mapsKey={mapsKey}
                            mapId={mapId}
                            direccion={data.direccion}
                            latitud={data.latitud}
                            longitud={data.longitud}
                            onChange={(cambios) => setData((d) => ({ ...d, ...cambios }))}
                            onCiudad={(ciudad) => setData((d) => ({ ...d, ciudad }))}
                            error={errors.direccion ?? errors.latitud ?? errors.longitud}
                            inputClass={inputClass}
                        />
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <Field label="Ciudad" error={errors.ciudad}>
                                <input value={data.ciudad} onChange={(e) => setData('ciudad', e.target.value)} className={inputClass} />
                            </Field>
                            <Field label="Punto de referencia" error={errors.referencia}>
                                <input value={data.referencia} onChange={(e) => setData('referencia', e.target.value)} placeholder="Ej. Torre B, portería norte" className={inputClass} />
                            </Field>
                        </div>
                    </div>
                </Seccion>

                <Seccion titulo="Requerimiento">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Field label="Área aproximada (m²)" error={errors.area_m2}>
                            <input type="number" min="1" value={data.area_m2} onChange={(e) => setData('area_m2', e.target.value)} placeholder="Ej. 3500" className={inputClass} />
                        </Field>
                        <Field label="Fecha deseada" error={errors.fecha_deseada}>
                            <input type="date" value={data.fecha_deseada} onChange={(e) => setData('fecha_deseada', e.target.value)} className={inputClass} />
                        </Field>
                        <div className="sm:col-span-2">
                            <div className="mb-1.5 text-xs font-medium text-navy-500">Frecuencia</div>
                            <div className="inline-flex flex-wrap overflow-hidden rounded-lg border border-mist-300 font-display text-[12.5px] font-semibold">
                                {FRECUENCIAS.map(([value, label]) => (
                                    <button
                                        type="button"
                                        key={value}
                                        onClick={() => setData('frecuencia', value)}
                                        className={`border-l border-mist-300 px-4 py-2 first:border-l-0 ${data.frecuencia === value ? 'bg-navy text-white' : 'text-navy-700 hover:bg-mist-50'}`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="sm:col-span-2">
                            <Field label="Detalle" error={errors.detalle}>
                                <textarea
                                    value={data.detalle}
                                    onChange={(e) => setData('detalle', e.target.value)}
                                    placeholder="Horarios, restricciones de acceso, número de tanques o pisos…"
                                    className={`${inputClass} min-h-[80px] resize-y`}
                                />
                            </Field>
                        </div>
                    </div>
                </Seccion>

                <Seccion titulo="Gestión">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Field label="Estado inicial" error={errors.estado}>
                            <select value={data.estado} onChange={(e) => setData('estado', e.target.value)} className={inputClass}>
                                {Object.entries(estados)
                                    .filter(([value]) => value !== 'cerrada_perdida')
                                    .map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                            </select>
                        </Field>
                        <Field label="Cuadrilla asignada (opcional)" error={errors.cuadrilla}>
                            <input value={data.cuadrilla} onChange={(e) => setData('cuadrilla', e.target.value)} placeholder="Ej. Cuadrilla 2 · Andrés R." className={inputClass} />
                        </Field>
                        <div className="sm:col-span-2">
                            <Field label="Nota interna (queda en la bitácora)" error={errors.nota}>
                                <input value={data.nota} onChange={(e) => setData('nota', e.target.value)} placeholder="Ej. Llamó la administradora, pide visita técnica" className={inputClass} />
                            </Field>
                        </div>
                    </div>
                </Seccion>

                <div className="sticky bottom-0 -mx-6 -mb-6 flex items-center justify-end gap-3 border-t border-mist-300 bg-white px-6 py-4">
                    <button type="button" onClick={cerrar} className="px-3 py-2.5 font-display text-[13.5px] font-semibold text-navy-600 hover:text-navy">
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={processing}
                        className="rounded-lg bg-navy px-5 py-2.5 font-display text-[13.5px] font-semibold text-white hover:bg-navy-deep disabled:opacity-40"
                    >
                        {processing ? 'Creando…' : 'Crear cotización'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}

const inputClass = 'w-full rounded-lg border border-mist-400 px-3.5 py-2.5 text-[13.5px] text-navy placeholder:text-ink-400 focus:border-green focus:ring-green';

function Seccion({ titulo, ayuda, children }) {
    return (
        <section>
            <div className="mb-2.5 flex items-baseline justify-between gap-3 border-b border-mist-200 pb-1.5">
                <h3 className="font-sans text-[10.5px] font-semibold tracking-[0.12em] text-ink-500">{titulo.toUpperCase()}</h3>
                {ayuda && <span className="text-right text-[11.5px] text-ink-500">{ayuda}</span>}
            </div>
            {children}
        </section>
    );
}

function Field({ label, error, children }) {
    return (
        <div>
            <div className="mb-1.5 text-xs font-medium text-navy-500">{label}</div>
            {children}
            {error && <p className="mt-1.5 text-xs text-alert">{error}</p>}
        </div>
    );
}
