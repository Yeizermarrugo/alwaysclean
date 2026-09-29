import { useState } from 'react';

/** Preguntas frecuentes (acordeón) + entidades que avalan a la empresa. */
export default function PreguntasFrecuentes({ preguntas }) {
    const [abierta, setAbierta] = useState(0);

    return (
        <div className="grid gap-8 px-5 py-12 lg:grid-cols-[1.35fr_.65fr] lg:gap-12 lg:px-10 lg:py-14">
            <div>
                <div className="mb-1.5 font-sans text-[11px] font-semibold tracking-[0.14em] text-green-dark">PREGUNTAS FRECUENTES</div>
                <h2 className="mb-6 font-display text-[26px] font-extrabold tracking-tight text-navy lg:text-[30px]">Lo que más nos preguntan</h2>

                <div className="divide-y divide-mist-300 border-y border-mist-300">
                    {preguntas.map((p, i) => {
                        const abiertaAqui = abierta === i;
                        return (
                            <div key={p.pregunta}>
                                <h3>
                                    <button
                                        type="button"
                                        onClick={() => setAbierta(abiertaAqui ? -1 : i)}
                                        aria-expanded={abiertaAqui}
                                        aria-controls={`faq-${i}`}
                                        className="flex w-full items-center justify-between gap-4 py-4 text-left font-display text-[15.5px] font-bold text-navy hover:text-green-dark"
                                    >
                                        {p.pregunta}
                                        <span
                                            className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border border-mist-border text-[15px] transition-transform ${abiertaAqui ? 'rotate-45 border-green bg-green text-white' : 'text-navy-500'}`}
                                            aria-hidden="true"
                                        >
                                            +
                                        </span>
                                    </button>
                                </h3>
                                <div id={`faq-${i}`} hidden={!abiertaAqui} className="pb-5 pr-10 text-[14.5px] leading-relaxed text-navy-600">
                                    {p.respuesta}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <aside className="self-start rounded-2xl border border-mist-300 bg-mist-50 p-6">
                <div className="mb-4 font-sans text-[11px] font-semibold tracking-[0.14em] text-ink-500">AVALADOS POR</div>
                <div className="grid grid-cols-2 gap-3">
                    <Aval src="/images/avales/dadis.svg" alt="DADIS · Departamento Administrativo Distrital de Salud" />
                    <Aval src="/images/avales/epa.png" alt="EPA Cartagena · Establecimiento Público Ambiental" />
                </div>
                <div className="mb-3 mt-6 font-sans text-[11px] font-semibold tracking-[0.14em] text-ink-500">AFILIADOS A</div>
                <img src="/images/avales/fenalco.jpg" alt="Somos parte de FENALCO Bolívar" className="w-full rounded-xl" loading="lazy" />
            </aside>
        </div>
    );
}

function Aval({ src, alt }) {
    return (
        <div className="h-24 rounded-xl border border-mist-300 bg-white p-3" title={alt}>
            <img src={src} alt={alt} className="h-full w-full object-contain" loading="lazy" />
        </div>
    );
}
