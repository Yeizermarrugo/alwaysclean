import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import InternoLayout from '@/Layouts/InternoLayout';
import Modal from '@/Components/Modal';
import ImageField from '@/Components/Interno/ImageField';

const vacio = {
    codigo: '', nombre: '', descripcion: '', aplicacion: '', presentacion: '',
    imagen: null, quitar_imagen: false, orden: 1, _method: '',
};

export default function ProductosIndex({ productos }) {
    const [abierto, setAbierto] = useState(null); // producto en el modal de detalle, o {} para nuevo
    const [editando, setEditando] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm(vacio);

    const verDetalle = (p) => {
        setAbierto(p);
        setEditando(false);
    };

    const nuevoProducto = () => {
        reset();
        setData(vacio);
        setAbierto({});
        setEditando(true);
    };

    const empezarEdicion = () => {
        setData({
            codigo: abierto.codigo, nombre: abierto.nombre, descripcion: abierto.descripcion,
            aplicacion: abierto.aplicacion, presentacion: abierto.presentacion,
            imagen: null, quitar_imagen: false, orden: abierto.orden, _method: 'patch',
        });
        setEditando(true);
    };

    const guardar = (e) => {
        e.preventDefault();
        const url = abierto?.id ? route('interno.productos.update', abierto.id) : route('interno.productos.store');
        post(url, { forceFormData: true, onSuccess: () => setAbierto(null) });
    };

    return (
        <InternoLayout title="Productos">
            <div className="flex items-center justify-between px-5 py-5 lg:px-7">
                <h1 className="font-display text-xl font-bold text-navy">Productos ({productos.length})</h1>
                <button onClick={nuevoProducto} className="rounded-lg bg-green px-4 py-2.5 font-display text-[13px] font-semibold text-white">
                    + Nuevo producto
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4 px-5 pb-10 sm:grid-cols-2 lg:grid-cols-3 lg:px-7">
                {productos.map((p) => (
                    <button
                        key={p.id}
                        onClick={() => verDetalle(p)}
                        className="flex flex-col gap-2 rounded-xl border border-mist-300 p-4 text-left hover:border-green"
                    >
                        <div className="flex items-center justify-between">
                            {p.imagen_url ? (
                                <img src={p.imagen_url} alt="" className="h-10 w-10 rounded-lg object-cover" />
                            ) : (
                                <span className="grid h-10 w-10 place-items-center rounded-lg bg-green-light font-display text-sm font-extrabold text-green-dark">{p.codigo}</span>
                            )}
                            <span className="font-mono text-[11px] text-ink-500">#{p.orden}</span>
                        </div>
                        <div className="font-display text-[15px] font-bold text-navy">{p.nombre}</div>
                        <p className="line-clamp-2 text-[12.5px] text-navy-600">{p.descripcion}</p>
                        <span className="mt-1 font-display text-[12.5px] font-semibold text-green-dark">Ver detalle →</span>
                    </button>
                ))}
            </div>

            <Modal
                open={!!abierto}
                onClose={() => setAbierto(null)}
                size="lg"
                title={editando ? (abierto?.id ? `Editar: ${abierto.nombre}` : 'Nuevo producto') : abierto?.nombre}
            >
                {editando ? (
                    <form onSubmit={guardar} className="flex flex-col gap-4">
                        <ImageField
                            label="Foto del producto"
                            currentUrl={abierto?.imagen_url}
                            file={data.imagen}
                            onFile={(f) => setData('imagen', f)}
                            quitar={data.quitar_imagen}
                            onQuitar={(v) => setData('quitar_imagen', v)}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <Field label="Código" error={errors.codigo}>
                                <input value={data.codigo} onChange={(e) => setData('codigo', e.target.value)} className={inputClass} />
                            </Field>
                            <Field label="Orden" error={errors.orden}>
                                <input type="number" value={data.orden} onChange={(e) => setData('orden', e.target.value)} className={inputClass} />
                            </Field>
                        </div>
                        <Field label="Nombre" error={errors.nombre}>
                            <input value={data.nombre} onChange={(e) => setData('nombre', e.target.value)} className={inputClass} />
                        </Field>
                        <Field label="Descripción" error={errors.descripcion}>
                            <textarea value={data.descripcion} onChange={(e) => setData('descripcion', e.target.value)} className={`${inputClass} min-h-[90px]`} />
                        </Field>
                        <div className="grid grid-cols-2 gap-4">
                            <Field label="Aplicación" error={errors.aplicacion}>
                                <input value={data.aplicacion} onChange={(e) => setData('aplicacion', e.target.value)} className={inputClass} />
                            </Field>
                            <Field label="Presentación" error={errors.presentacion}>
                                <input value={data.presentacion} onChange={(e) => setData('presentacion', e.target.value)} className={inputClass} />
                            </Field>
                        </div>
                        <div className="flex gap-3">
                            <button type="submit" disabled={processing} className="flex-1 rounded-lg bg-navy py-3 font-display text-[14px] font-semibold text-white disabled:opacity-40">
                                Guardar
                            </button>
                            {abierto?.id && (
                                <button type="button" onClick={() => setEditando(false)} className="rounded-lg border border-mist-300 px-5 font-display text-[14px] font-semibold text-navy">
                                    Cancelar
                                </button>
                            )}
                        </div>
                    </form>
                ) : abierto ? (
                    <div className="flex flex-col gap-6">
                        <div className="grid grid-cols-[120px_1fr] gap-6">
                            {abierto.imagen_url ? (
                                <img src={abierto.imagen_url} alt="" className="h-[120px] w-[120px] rounded-xl object-cover" />
                            ) : (
                                <div className="grid h-[120px] w-[120px] place-items-center rounded-xl bg-green-light font-display text-4xl font-extrabold text-green-dark">
                                    {abierto.codigo}
                                </div>
                            )}
                            <div className="flex flex-col justify-center gap-1">
                                <span className="font-sans text-[10px] font-semibold tracking-[0.12em] text-green-dark">PRODUCTO ESPECIALIZADO</span>
                                <div className="font-display text-2xl font-extrabold text-navy">{abierto.nombre}</div>
                                <span className="font-mono text-xs text-ink-500">Orden #{abierto.orden}</span>
                            </div>
                        </div>
                        <p className="text-[14.5px] leading-relaxed text-navy-600">{abierto.descripcion}</p>
                        <div className="grid grid-cols-2 gap-4 rounded-xl border border-mist-300 p-4 text-[13.5px]">
                            <div>
                                <div className="text-ink-500">Aplicación</div>
                                <div className="font-semibold text-navy">{abierto.aplicacion}</div>
                            </div>
                            <div>
                                <div className="text-ink-500">Presentación</div>
                                <div className="font-semibold text-navy">{abierto.presentacion}</div>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={empezarEdicion} className="flex-1 rounded-lg bg-navy py-3 font-display text-[14px] font-semibold text-white">
                                Editar
                            </button>
                            <DeleteButton producto={abierto} onDeleted={() => setAbierto(null)} />
                        </div>
                    </div>
                ) : null}
            </Modal>
        </InternoLayout>
    );
}

function DeleteButton({ producto, onDeleted }) {
    const { delete: destroy } = useForm();
    return (
        <button
            onClick={() => {
                if (confirm(`¿Eliminar "${producto.nombre}"? Esto no se puede deshacer.`)) {
                    destroy(route('interno.productos.destroy', producto.id), { onSuccess: onDeleted });
                }
            }}
            className="rounded-lg border border-mist-300 px-5 font-display text-[14px] font-semibold text-alert"
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
