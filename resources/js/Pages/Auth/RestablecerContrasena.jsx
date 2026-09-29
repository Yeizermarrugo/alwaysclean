import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import TarjetaAcceso, { BotonAcceso, inputAcceso } from '@/Components/Auth/TarjetaAcceso';

export default function RestablecerContrasena({ token, email }) {
    const [ver, setVer] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        token,
        email,
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('interno.password.update'));
    };

    return (
        <TarjetaAcceso titulo="Crear contraseña nueva" subtitulo="Mínimo 10 caracteres, con letras y números.">
            <form onSubmit={submit} className="flex flex-col gap-5">
                <div>
                    <label htmlFor="email" className="mb-1.5 block text-[13px] font-medium text-navy-600">Correo</label>
                    <input id="email" type="email" autoComplete="username" value={data.email} onChange={(e) => setData('email', e.target.value)} className={inputAcceso(errors.email)} />
                    {errors.email && <p className="mt-1.5 text-xs text-alert">{errors.email}</p>}
                </div>
                <div>
                    <label htmlFor="password" className="mb-1.5 block text-[13px] font-medium text-navy-600">Contraseña nueva</label>
                    <div className="relative">
                        <input
                            id="password"
                            type={ver ? 'text' : 'password'}
                            autoComplete="new-password"
                            autoFocus
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className={`${inputAcceso(errors.password)} pr-20`}
                        />
                        <button type="button" onClick={() => setVer((v) => !v)} className="absolute inset-y-0 right-0 px-3.5 text-[12.5px] font-semibold text-navy-500 hover:text-navy">
                            {ver ? 'Ocultar' : 'Mostrar'}
                        </button>
                    </div>
                    {errors.password && <p className="mt-1.5 text-xs text-alert">{errors.password}</p>}
                </div>
                <div>
                    <label htmlFor="password_confirmation" className="mb-1.5 block text-[13px] font-medium text-navy-600">Repita la contraseña</label>
                    <input
                        id="password_confirmation"
                        type={ver ? 'text' : 'password'}
                        autoComplete="new-password"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        className={inputAcceso(errors.password_confirmation)}
                    />
                </div>
                <BotonAcceso procesando={processing} textoProcesando="Guardando…">Guardar contraseña</BotonAcceso>
            </form>
        </TarjetaAcceso>
    );
}
