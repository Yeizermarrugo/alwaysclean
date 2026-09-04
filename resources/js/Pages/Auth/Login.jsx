import { Head, useForm } from '@inertiajs/react';

export default function Login() {
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
        <div className="grid min-h-screen place-items-center bg-mist-50 px-4">
            <Head title="Panel comercial · Ingreso" />
            <form onSubmit={submit} className="w-full max-w-sm rounded-xl border border-mist-300 bg-white p-8">
                <img src="/images/logo.png" alt="Always Clean Colombia" className="mb-6 h-10" />
                <h1 className="mb-1 font-display text-xl font-extrabold text-navy">Panel comercial</h1>
                <p className="mb-6 text-sm text-navy-500">Ingrese con su cuenta para gestionar cotizaciones.</p>

                <div className="mb-4">
                    <div className="mb-1.5 text-xs font-medium text-navy-500">Correo</div>
                    <input
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        className="w-full rounded-lg border border-mist-400 px-3.5 py-2.5 text-[13.5px] text-navy focus:border-green focus:ring-green"
                        autoFocus
                    />
                    {errors.email && <p className="mt-1.5 text-xs text-alert">{errors.email}</p>}
                </div>

                <div className="mb-5">
                    <div className="mb-1.5 text-xs font-medium text-navy-500">Contraseña</div>
                    <input
                        type="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        className="w-full rounded-lg border border-mist-400 px-3.5 py-2.5 text-[13.5px] text-navy focus:border-green focus:ring-green"
                    />
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="w-full rounded-[9px] bg-navy py-3 font-display text-[14.5px] font-semibold text-white disabled:opacity-40"
                >
                    Ingresar
                </button>
            </form>
        </div>
    );
}
