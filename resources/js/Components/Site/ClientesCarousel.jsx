const CLIENTES = [
    { nombre: 'Aguas de Cartagena', archivo: 'aguas_cartagena.png' },
    { nombre: 'Petromil', archivo: 'petromil.png' },
    { nombre: 'Corporación Opción Legal', archivo: 'opcion_legal.png' },
    { nombre: 'OIM · ONU Migración', archivo: 'oim.png' },
    { nombre: 'Syngenta', archivo: 'syngenta.png' },
    { nombre: 'Clínica Medihelp Services', archivo: 'medihelp.png' },
    { nombre: 'Convel', archivo: 'convel.png' },
    { nombre: 'Aviatur', archivo: 'aviatur.png' },
    { nombre: 'PQP Profesional', archivo: 'pqp.png' },
    { nombre: 'Zi One Luxury Hotel', archivo: 'zione.png' },
    { nombre: 'Baird Service S.A.S', archivo: 'baird.png' },
];

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
            <div className="clientes-marquee-track flex w-max items-center gap-16">
                {items.map((c, i) => (
                    <img
                        key={`${c.archivo}-${i}`}
                        src={`/images/clientes/${c.archivo}`}
                        alt={c.nombre}
                        title={c.nombre}
                        className="h-12 w-auto shrink-0 object-contain opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0 md:h-16"
                    />
                ))}
            </div>
        </div>
    );
}
