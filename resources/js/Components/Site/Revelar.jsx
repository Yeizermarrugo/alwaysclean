import { useEffect, useRef } from 'react';

/*
 * Muestra su contenido con una transición cuando entra en pantalla al bajar.
 * Los estilos viven en app.css ([data-revelar]); aquí solo se marca .revelado.
 *
 * efecto: 'sube' (por defecto) | 'izq' | 'der' | 'zoom'
 * retraso: ms, para escalonar elementos de una misma lista (i * 80).
 */
let observador = null;

function observar(el) {
    if (typeof IntersectionObserver === 'undefined') {
        el.classList.add('revelado');
        return () => {};
    }
    observador ??= new IntersectionObserver(
        (entradas) => {
            entradas.forEach((e) => {
                if (e.isIntersecting) {
                    const el = e.target;
                    el.classList.add('revelado');
                    observador.unobserve(el);
                    // Terminada la entrada suelta sus estilos, para no pisar los hover:translate/transition de Tailwind.
                    const retraso = parseInt(el.style.getPropertyValue('--retraso'), 10) || 0;
                    setTimeout(() => el.setAttribute('data-revelar', 'listo'), 850 + retraso);
                }
            });
        },
        { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    );
    observador.observe(el);
    return () => observador.unobserve(el);
}

export default function Revelar({ as: Etiqueta = 'div', efecto = 'sube', retraso = 0, className = '', style, children, ...props }) {
    const ref = useRef(null);

    useEffect(() => observar(ref.current), []);

    return (
        <Etiqueta
            ref={ref}
            data-revelar={efecto}
            className={className}
            style={retraso ? { ...style, '--retraso': `${retraso}ms` } : style}
            {...props}
        >
            {children}
        </Etiqueta>
    );
}
