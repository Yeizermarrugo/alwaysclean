import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import SiteLayout from '@/Layouts/SiteLayout';
import PlaceholderPhoto from '@/Components/Site/PlaceholderPhoto';
import Lightbox from '@/Components/Site/Lightbox';
import { waLink } from '@/lib/whatsapp';

const CATEGORIA_LABEL = {
    limpieza: 'Limpieza',
    sanitarios: 'Sanitarios y ambientales',
    obras: 'Obras civiles y mantenimiento',
};

const TABS = ['Qué incluye', 'Proceso', 'Normativa', 'Preguntas'];

const PROCESO = ['Contacto y diagnóstico inicial', 'Cotización y programación de visita', 'Ejecución del servicio en sitio', 'Entrega de acta y registro fotográfico'];
const NORMATIVA = ['Resolución 0491 de 2020 (trabajo en espacios confinados)', 'Resolución 1409 de 2012 (trabajo en alturas)', 'Productos con ficha técnica y hoja de seguridad'];
const PREGUNTAS = [
    ['¿La cotización tiene costo?', 'No, la visita de diagnóstico y la cotización son gratuitas.'],
    ['¿En cuánto tiempo responden?', 'En menos de 24 horas hábiles después de recibir su solicitud.'],
    ['¿Cubren fuera de Cartagena?', 'Sí, cubrimos Bolívar y la costa Caribe según el servicio.'],
];

export default function ServicioShow({ servicio }) {
    const { empresa } = usePage().props;
    const [tab, setTab] = useState(0);
    const [frecuencia, setFrecuencia] = useState('una_vez');
    const [lightboxIndex, setLightboxIndex] = useState(null);
    const [sede, setSede] = useState('');
    const [capacidad, setCapacidad] = useState('');
    const [whatsappCliente, setWhatsappCliente] = useState('');

    const galeria = servicio.imagenes ?? [];

    const mensaje = [
        `Hola, quiero cotizar "${servicio.nombre}".`,
        sede && `Empresa/sede: ${sede}.`,
        capacidad && `Capacidad o alcance: ${capacidad}.`,
        `Frecuencia: ${frecuencia.replace('_', ' ')}.`,
        whatsappCliente && `Mi WhatsApp: ${whatsappCliente}.`,
    ].filter(Boolean).join(' ');

    return (
        <SiteLayout title={servicio.nombre}>
            <div className="grid lg:grid-cols-[1.15fr_.85fr]">
                <div className="px-5 py-8 lg:px-10 lg:py-9">
                    <div className="mb-2.5 text-[12.5px] text-ink-500">
                        <Link href={route('home')} className="hover:text-green-dark">Inicio</Link> / <Link href={route('servicios.index')} className="hover:text-green-dark">Servicios</Link> / {CATEGORIA_LABEL[servicio.categoria]}
                    </div>
                    <h1 className="mb-3 font-display text-[28px] font-extrabold leading-tight tracking-tight text-navy lg:text-[32px]">
                        {servicio.nombre}
                    </h1>
                    <p className="mb-5 text-[15.5px] leading-relaxed text-navy-600 text-pretty">{servicio.descripcion}</p>

                    {galeria.length > 0 ? (
                        <button type="button" onClick={() => setLightboxIndex(0)} className="mb-3.5 block h-[250px] w-full">
                            <img src={galeria[0].imagen_url} alt={servicio.nombre} className="h-full w-full rounded-xl object-cover" />
                        </button>
                    ) : servicio.imagen_url ? (
                        <img src={servicio.imagen_url} alt={servicio.nombre} className="mb-3.5 h-[250px] w-full rounded-xl object-cover" />
                    ) : (
                        <PlaceholderPhoto hint={servicio.imagen_hint} className="mb-3.5 h-[250px] rounded-xl p-3.5" />
                    )}

                    {galeria.length > 0 && (
                        <div className="mb-6 flex flex-wrap gap-2.5">
                            {galeria.map((img, i) => (
                                <button
                                    key={img.id}
                                    type="button"
                                    onClick={() => setLightboxIndex(i)}
                                    className="h-[58px] w-[78px] overflow-hidden rounded-[7px] border border-mist-300"
                                >
                                    <img src={img.imagen_url} alt="" className="h-full w-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}

                    <Lightbox imagenes={galeria} index={lightboxIndex} onClose={() => setLightboxIndex(null)} onChange={setLightboxIndex} />

                    <div className="mb-4.5 flex gap-6 border-b border-mist-300 font-display text-[13.5px] font-semibold text-ink-500">
                        {TABS.map((t, i) => (
                            <button
                                key={t}
                                onClick={() => setTab(i)}
                                className={`pb-2.5 ${tab === i ? 'border-b-2 border-green text-navy' : ''}`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>

                    {tab === 0 && (
                        <div className="grid grid-cols-1 gap-x-6 gap-y-2.5 text-[14.5px] leading-relaxed text-navy-600 sm:grid-cols-2">
                            {servicio.incluye.map((item) => (
                                <div key={item} className="flex gap-2.5">
                                    <span className="text-green">✓</span>{item}
                                </div>
                            ))}
                        </div>
                    )}
                    {tab === 1 && (
                        <ol className="flex flex-col gap-3 text-[14.5px] leading-relaxed text-navy-600">
                            {PROCESO.map((p, i) => (
                                <li key={p} className="flex gap-3">
                                    <span className="font-display font-bold text-green-dark">{i + 1}</span>{p}
                                </li>
                            ))}
                        </ol>
                    )}
                    {tab === 2 && (
                        <ul className="flex flex-col gap-2.5 text-[14.5px] leading-relaxed text-navy-600">
                            {NORMATIVA.map((n) => <li key={n} className="flex gap-2.5"><span className="text-green">✓</span>{n}</li>)}
                        </ul>
                    )}
                    {tab === 3 && (
                        <div className="flex flex-col gap-4">
                            {PREGUNTAS.map(([q, a]) => (
                                <div key={q}>
                                    <div className="font-display text-[14.5px] font-semibold text-navy">{q}</div>
                                    <div className="text-[14px] text-navy-600">{a}</div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="mt-7 flex flex-wrap gap-1.5">
                        {servicio.sectores.map((s) => (
                            <span key={s} className="rounded-full bg-mist-100 px-2.5 py-1.5 text-xs font-medium text-navy-700">{s}</span>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-3.5 border-t border-mist-300 bg-mist-50 px-5 py-8 lg:border-l lg:border-t-0 lg:px-7 lg:py-9">
                    <div className="font-sans text-[11px] font-semibold tracking-[0.14em] text-green-dark">COTIZACIÓN SIN COSTO</div>
                    <div className="font-display text-[22px] font-extrabold leading-tight tracking-tight text-navy">
                        Responda 3 datos y le enviamos el precio hoy.
                    </div>
                    <div className="flex flex-col gap-2.5">
                        <input
                            value={sede}
                            onChange={(e) => setSede(e.target.value)}
                            placeholder="Empresa · sede (ej. Hotel Caribe, Bocagrande)"
                            className="rounded-lg border border-mist-400 bg-white px-3.5 py-2.5 text-[13.5px] text-navy placeholder:text-ink-400 focus:border-green focus:ring-green"
                        />
                        <input
                            value={capacidad}
                            onChange={(e) => setCapacidad(e.target.value)}
                            placeholder="Capacidad o alcance aproximado"
                            className="rounded-lg border border-mist-400 bg-white px-3.5 py-2.5 text-[13.5px] text-navy placeholder:text-ink-400 focus:border-green focus:ring-green"
                        />
                        <div className="flex gap-2">
                            {['una_vez', 'semestral', 'anual'].map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFrecuencia(f)}
                                    className={`flex-1 rounded-lg py-2.5 font-display text-[12.5px] font-semibold ${frecuencia === f ? 'bg-navy text-white' : 'border border-mist-400 bg-white text-navy-700'}`}
                                >
                                    {f === 'una_vez' ? 'Una vez' : f === 'semestral' ? 'Semestral' : 'Anual'}
                                </button>
                            ))}
                        </div>
                        <input
                            value={whatsappCliente}
                            onChange={(e) => setWhatsappCliente(e.target.value)}
                            placeholder="Su WhatsApp"
                            className="rounded-lg border border-mist-400 bg-white px-3.5 py-2.5 text-[13.5px] text-navy placeholder:text-ink-400 focus:border-green focus:ring-green"
                        />
                    </div>
                    <a
                        href={waLink(empresa.whatsapp, mensaje)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-[9px] bg-green py-3.5 text-center font-display text-[14.5px] font-semibold text-white"
                    >
                        Enviar por WhatsApp
                    </a>
                    <div className="text-center text-xs text-ink-500">Respuesta en menos de 24 h hábiles</div>
                    <div className="flex flex-col gap-2.5 border-t border-mist-300 pt-4 text-[13.5px] text-navy-600">
                        <div className="flex justify-between"><span>Crédito fácil</span><span className="font-semibold text-navy">3 cuotas</span></div>
                        <div className="flex justify-between"><span>Cobertura</span><span className="font-semibold text-navy">Bolívar y costa</span></div>
                        <div className="flex justify-between"><span>Bono primer servicio</span><span className="font-semibold text-green-dark">−10%</span></div>
                    </div>
                </div>
            </div>
        </SiteLayout>
    );
}
