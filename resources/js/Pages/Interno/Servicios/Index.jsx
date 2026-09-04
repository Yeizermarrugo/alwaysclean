import { useState } from 'react';
import { router, useForm } from '@inertiajs/react';
import InternoLayout from '@/Layouts/InternoLayout';
import Modal from '@/Components/Modal';
import ImageField from '@/Components/Interno/ImageField';

const vacio = {
    codigo: '', categoria: 'limpieza', nombre: '', resumen: '', descripcion: '',
    meta: '', imagen_hint: '', imagen: null, quitar_imagen: false, imagenes: [],
    incluye: '', sectores: '', destacado: false, orden: 1, _method: '',
};

export default function ServiciosIndex({ servicios, categorias }) {
    const [editando, setEditando] = useState(null); // null = cerrado, {} = nuevo, {...} = editar
    const [galeria, setGaleria] = useState([]);
    const { data, setData, post, processing, errors, reset } = useForm(vacio);

    const abrirNuevo = () => {
        reset();
        setData(vacio);
        setGaleria([]);
        setEditando({});
    };

    const abrirEditar = (s) => {
        setData({
            codigo: s.codigo, categoria: s.categoria, nombre: s.nombre, resumen: s.resumen,
            descripcion: s.descripcion, meta: s.meta, imagen_hint: s.imagen_hint,
            imagen: null, quitar_imagen: false, imagenes: [],
            incluye: s.incluye.join('\n'), sectores: s.sectores.join(', '),
            destacado: s.destacado, orden: s.orden, _method: 'patch',
        });
        setGaleria(s.imagenes ?? []);
        setEditando(s);
    };

    const guardar = (e) => {
        e.preventDefault();
        const url = editando?.id ? route('interno.servicios.update', editando.id) : route('interno.servicios.store');
        post(url, { forceFormData: true, onSuccess: () => setEditando(null) });
    };

    const borrarFotoGaleria = (imagen) => {
        if (!confirm('¿Eliminar esta foto de la galería?')) return;
        router.delete(route('interno.servicios.imagenes.destroy', [editando.id, imagen.id]), {
            preserveScroll: true,
            onSuccess: () => setGaleria((g) => g.filter((i) => i.id !== imagen.id)),
        });
    };

    return (
        <InternoLayout title="Servicios">
            <div className="flex items-center justify-between px-5 py-5 lg:px-7">
                <h1 className="font-display text-xl font-bold text-navy">Servicios ({servicios.length})</h1>
                <button onClick={abrirNuevo} className="rounded-lg bg-green px-4 py-2.5 font-display text-[13px] font-semibold text-white">
                    + Nuevo servicio
                </button>
            </div>

            <div className="px-5 pb-10 lg:px-7">
                <div className="hidden grid-cols-[46px_50px_1.4fr_1fr_.7fr_.5fr_auto] gap-3 border-b border-mist-300 pb-2.5 font-sans text-[10.5px] font-semibold tracking-[0.1em] text-ink-500 lg:grid">
                    <span></span><span>COD</span><span>NOMBRE</span><span>CATEGORÍA</span><span>DESTACADO</span><span>ORDEN</span><span></span>
                </div>
                {servicios.map((s) => (
                    <div key={s.id} className="grid grid-cols-2 items-center gap-x-3 gap-y-1 border-b border-mist-200 py-3 text-[13px] text-navy-600 lg:grid-cols-[46px_50px_1.4fr_1fr_.7fr_.5fr_auto]">
                        <div className="hidden lg:block">
                            {s.imagen_url ? (
                                <img src={s.imagen_url} alt="" className="h-9 w-9 rounded object-cover" />
                            ) : (
                                <div className="h-9 w-9 rounded bg-mist-100" />
                            )}
                        </div>
                        <span className="font-mono text-[11.5px] text-green-dark">{s.codigo}</span>
                        <span className="font-display font-semibold text-navy">
                            {s.nombre}
                            {s.imagenes?.length > 0 && (
                                <span className="ml-1.5 rounded-full bg-mist-100 px-1.5 py-0.5 font-sans text-[10px] font-semibold text-navy-500">
                                    {s.imagenes.length} {s.imagenes.length === 1 ? 'foto' : 'fotos'}
                                </span>
                            )}
                        </span>
                        <span>{categorias[s.categoria]}</span>
                        <span>{s.destacado ? 'Sí' : '—'}</span>
                        <span>{s.orden}</span>
                        <div className="flex gap-3 justify-self-end font-display text-[12.5px] font-semibold">
                            <button onClick={() => abrirEditar(s)} className="text-navy-700 hover:text-green-dark">Editar</button>
                            <DeleteButton servicio={s} />
                        </div>
                    </div>
                ))}
            </div>

            <Modal open={!!editando} onClose={() => setEditando(null)} title={editando?.id ? `Editar: ${editando.nombre}` : 'Nuevo servicio'}>
                <form onSubmit={guardar} className="flex flex-col gap-4">
                    <ImageField
                        label="Foto de portada (tarjetas y listado)"
                        currentUrl={editando?.imagen_url}
                        file={data.imagen}
                        onFile={(f) => setData('imagen', f)}
                        quitar={data.quitar_imagen}
                        onQuitar={(v) => setData('quitar_imagen', v)}
                    />

                    <div>
                        <div className="mb-1.5 text-xs font-medium text-navy-500">
                            Galería de trabajos realizados (varias fotos, se muestran como carrusel en la ficha)
                        </div>
                        {galeria.length > 0 && (
                            <div className="mb-2 flex flex-wrap gap-2">
                                {galeria.map((img) => (
                                    <div key={img.id} className="relative h-16 w-16">
                                        <img src={img.imagen_url} alt="" className="h-16 w-16 rounded-lg object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => borrarFotoGaleria(img)}
                                            className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full bg-alert text-[11px] font-bold text-white"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => setData('imagenes', Array.from(e.target.files))}
                            className="text-[12.5px] text-navy-600"
                        />
                        {data.imagenes.length > 0 && (
                            <p className="mt-1 text-[11.5px] text-ink-500">{data.imagenes.length} foto(s) nueva(s) se agregarán al guardar.</p>
                        )}
                        {errors['imagenes.0'] && <p className="mt-1.5 text-xs text-alert">{errors['imagenes.0']}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Código" error={errors.codigo}>
                            <input value={data.codigo} onChange={(e) => setData('codigo', e.target.value)} className={inputClass} />
                        </Field>
                        <Field label="Categoría" error={errors.categoria}>
                            <select value={data.categoria} onChange={(e) => setData('categoria', e.target.value)} className={inputClass}>
                                {Object.entries(categorias).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                            </select>
                        </Field>
                    </div>
                    <Field label="Nombre" error={errors.nombre}>
                        <input value={data.nombre} onChange={(e) => setData('nombre', e.target.value)} className={inputClass} />
                    </Field>
                    <Field label="Resumen (listado)" error={errors.resumen}>
                        <input value={data.resumen} onChange={(e) => setData('resumen', e.target.value)} className={inputClass} />
                    </Field>
                    <Field label="Descripción (detalle)" error={errors.descripcion}>
                        <textarea value={data.descripcion} onChange={(e) => setData('descripcion', e.target.value)} className={`${inputClass} min-h-[70px]`} />
                    </Field>
                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Meta (chip corto)" error={errors.meta}>
                            <input value={data.meta} onChange={(e) => setData('meta', e.target.value)} className={inputClass} />
                        </Field>
                        <Field label="Descripción de foto (si no hay imagen)" error={errors.imagen_hint}>
                            <input value={data.imagen_hint} onChange={(e) => setData('imagen_hint', e.target.value)} className={inputClass} />
                        </Field>
                    </div>
                    <Field label="Qué incluye (una línea por ítem)" error={errors.incluye}>
                        <textarea value={data.incluye} onChange={(e) => setData('incluye', e.target.value)} className={`${inputClass} min-h-[100px]`} />
                    </Field>
                    <Field label="Sectores (separados por coma)" error={errors.sectores}>
                        <input value={data.sectores} onChange={(e) => setData('sectores', e.target.value)} className={inputClass} />
                    </Field>
                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Orden" error={errors.orden}>
                            <input type="number" value={data.orden} onChange={(e) => setData('orden', e.target.value)} className={inputClass} />
                        </Field>
                        <label className="flex items-center gap-2 self-end pb-2.5 text-[13.5px] text-navy">
                            <input type="checkbox" checked={data.destacado} onChange={(e) => setData('destacado', e.target.checked)} />
                            Destacado en Inicio
                        </label>
                    </div>
                    <button type="submit" disabled={processing} className="rounded-lg bg-navy py-3 font-display text-[14px] font-semibold text-white disabled:opacity-40">
                        Guardar
                    </button>
                </form>
            </Modal>
        </InternoLayout>
    );
}

function DeleteButton({ servicio }) {
    const { delete: destroy } = useForm();
    return (
        <button
            onClick={() => confirm(`¿Eliminar "${servicio.nombre}"? Esto no se puede deshacer.`) && destroy(route('interno.servicios.destroy', servicio.id))}
            className="text-alert hover:underline"
        >
            Eliminar
        </button>
    );
}

const inputClass = 'w-full rounded-lg border border-mist-400 px-3.5 py-2.5 text-[13.5px] text-navy focus:border-green focus:ring-green';

function Field({ label, error, children }) {
    return (
        <div>
            <div className="mb-1.5 text-xs font-medium text-navy-500">{label}</div>
            {children}
            {error && <p className="mt-1.5 text-xs text-alert">{error}</p>}
        </div>
    );
}
