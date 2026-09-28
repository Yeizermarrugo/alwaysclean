import { useForm, usePage } from '@inertiajs/react';
import TarjetaAcceso, { AvisoExito, BotonAcceso, inputAcceso } from '@/Components/Auth/TarjetaAcceso';

export default function OlvideContrasena() {
    const { flash } = usePage().props;
    const { data, setData, post, processing, errors } = useForm({ email: '' });

    const submit = (e) => {
        e.preventDefault();
        post(route('interno.password.email'), { preserveScroll: true });
    };

    return (
        <TarjetaAcceso titulo="¿Olvidó su contraseña?" subtitulo="Escriba el correo de su cuenta y le enviaremos un enlace para crear una contraseña nueva.">
            {flash?.status && <AvisoExito>{flash.status}</AvisoExito>}
            <form onSubmit={submit} className="flex flex-col gap-5">
                <div>
                    <label htmlFor="email" className="mb-1.5 block text-[13px] font-medium text-navy-600">Correo</label>
                    <input
                        id="email"
                        type="email"
                        autoComplete="username"
                        autoFocus
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder="nombre@empresa.com"
                        className={inputAcceso(errors.email)}
                    />
                    {errors.email && <p className="mt-1.5 text-xs text-alert">{errors.email}</p>}
                </div>
                <BotonAcceso procesando={processing} textoProcesando="Enviando…">Enviar enlace</BotonAcceso>
            </form>
        </TarjetaAcceso>
    );
}
