import { useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import InternoLayout from '@/Layouts/InternoLayout';

export default function Cuenta({ usuario }) {
    const { flash } = usePage().props;
    const [ver, setVer] = useState(false);
    const { data, setData, put, processing, errors, reset } = useForm({
        contrasena_actual: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('interno.cuenta.contrasena'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: () => reset('contrasena_actual'),
        });
    };

    const tipo = ver ? 'text' : 'password';

    return (
        <InternoLayout title="Mi cuenta">
            <div className="mx-auto max-w-2xl px-5 py-8 lg:py-10">
                <h1 className="font-display text-[26px] font-extrabold tracking-tight text-navy">Mi cuenta</h1>
                <p className="mb-7 mt-1 text-[14px] text-navy-500">Datos de acceso al panel interno.</p>

                <div className="mb-6 grid grid-cols-1 gap-4 rounded-xl border border-mist-300 bg-mist-50 p-5 sm:grid-cols-2">
                    <div>
                        <div className="font-sans text-[10.5px] font-semibold tracking-[0.12em] text-ink-500">NOMBRE</div>
                        <div className="mt-1 text-[14.5px] font-semibold text-navy">{usuario.name}</div>
                    </div>
                    <div>
                        <div className="font-sans text-[10.5px] font-semibold tracking-[0.12em] text-ink-500">CORREO</div>
                        <div className="mt-1 text-[14.5px] font-semibold text-navy">{usuario.email}</div>
                    </div>
                </div>

                <form onSubmit={submit} className="rounded-xl border border-mist-300 bg-white p-6">
                    <div className="mb-5 flex items-center justify-between gap-3">
                        <h2 className="font-display text-[17px] font-bold text-navy">Cambiar contraseña</h2>
                        <button type="button" onClick={() => setVer((v) => !v)} className="text-[12.5px] font-semibold text-navy-500 hover:text-navy">
                            {ver ? 'Ocultar' : 'Mostrar'} contraseñas
                        </button>
                    </div>

                    {flash?.status && (
                        <div className="mb-5 rounded-[10px] border border-green/40 bg-green-light px-4 py-3 text-[13.5px] font-medium text-green-dark">
                            {flash.status}
                        </div>
                    )}

                    <div className="flex flex-col gap-4">
                        <Campo label="Contraseña actual" error={errors.contrasena_actual}>
                            <input type={tipo} autoComplete="current-password" value={data.contrasena_actual} onChange={(e) => setData('contrasena_actual', e.target.value)} className={inputClass(errors.contrasena_actual)} />
                        </Campo>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <Campo label="Contraseña nueva" error={errors.password}>
                                <input type={tipo} autoComplete="new-password" value={data.password} onChange={(e) => setData('password', e.target.value)} className={inputClass(errors.password)} />
                            </Campo>
                            <Campo label="Repita la contraseña nueva">
                                <input type={tipo} autoComplete="new-password" value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} className={inputClass()} />
                            </Campo>
                        </div>
                        <p className="text-[12.5px] leading-relaxed text-ink-500">
                            Mínimo 10 caracteres, con letras y números. Al cambiarla se cierran sus demás sesiones y le llega un aviso por correo.
                        </p>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <button type="submit" disabled={processing} className="rounded-lg bg-navy px-5 py-2.5 font-display text-[13.5px] font-semibold text-white hover:bg-navy-deep disabled:opacity-40">
                            {processing ? 'Guardando…' : 'Cambiar contraseña'}
                        </button>
                    </div>
                </form>
            </div>
        </InternoLayout>
    );
}

const inputClass = (error) => `w-full rounded-lg border px-3.5 py-2.5 text-[13.5px] text-navy focus:border-green focus:ring-green ${error ? 'border-alert' : 'border-mist-400'}`;

function Campo({ label, error, children }) {
    return (
        <div>
            <div className="mb-1.5 text-xs font-medium text-navy-500">{label}</div>
            {children}
            {error && <p className="mt-1.5 text-xs text-alert">{error}</p>}
        </div>
    );
}
