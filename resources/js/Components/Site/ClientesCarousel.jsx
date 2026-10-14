const CLIENTES = [
    { nombre: 'Aguas de Cartagena', archivo: 'aguas_cartagena.png', ancho: 641, alto: 430 },
    { nombre: 'Petromil', archivo: 'petromil.png', ancho: 916, alto: 260 },
    { nombre: 'Corporación Opción Legal', archivo: 'opcion_legal.png', ancho: 859, alto: 327 },
    { nombre: 'OIM · ONU Migración', archivo: 'oim.png', ancho: 706, alto: 300 },
    { nombre: 'Syngenta', archivo: 'syngenta.png', ancho: 1054, alto: 371 },
    { nombre: 'Clínica Medihelp Services', archivo: 'medihelp.png', ancho: 606, alto: 462 },
    { nombre: 'Convel', archivo: 'convel.png', ancho: 809, alto: 281 },
    { nombre: 'Aviatur', archivo: 'aviatur.png', ancho: 1000, alto: 220 },
    { nombre: 'PQP Profesional', archivo: 'pqp.png', ancho: 668, alto: 366 },
    { nombre: 'Zi One Luxury Hotel', archivo: 'zione.png', ancho: 561, alto: 409 },
    { nombre: 'Baird Service S.A.S', archivo: 'baird.png', ancho: 1017, alto: 422 },
    { nombre: 'OINAC · Aeropuerto de Cartagena', archivo: 'oinac.png', ancho: 528, alto: 318, escala: 1.2 },
];

/*
 * Todos los PNG están recortados al contenido con el mismo margen y fondo transparente.
 * El alto sale de la proporción para que cada logo ocupe la misma área visual:
 * uno ancho (Aviatur) queda más bajo y uno cuadrado (Aguas de Cartagena) más alto.
 * `escala` compensa logos de trazo fino que en gris se ven más livianos (OINAC).
 */
const alto = (c) => `calc(var(--logo-base) * ${((c.escala ?? 1) / Math.sqrt(c.ancho / c.alto)).toFixed(3)})`;

export default function ClientesCarousel() {
    const items = [...CLIENTES, ...CLIENTES];

    return (
        <div className="overflow-hidden bg-white py-10 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
            <style>{`
                @keyframes clientes-marquee {
                    from { transform: translateX(0); }
                    to { transform: translateX(-50%); }
                }
                .clientes-marquee-track {
                    animation: clientes-marquee 32s linear infinite;
                }
                .clientes-marquee-track:hover {
                    animation-play-state: paused;
                }
            `}</style>
            <div className="clientes-marquee-track flex w-max items-center gap-16 [--logo-base:64px] md:[--logo-base:88px]">
                {items.map((c, i) => (
                    <img
                        key={`${c.archivo}-${i}`}
                        src={`/images/clientes/${c.archivo}`}
                        alt={c.nombre}
                        title={c.nombre}
                        width={c.ancho}
                        height={c.alto}
                        style={{ height: alto(c) }}
                        className="w-auto shrink-0 object-contain opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0"
                    />
                ))}
            </div>
        </div>
    );
}
