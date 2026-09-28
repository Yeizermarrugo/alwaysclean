import { useSyncExternalStore } from 'react';

// Pedido de productos del visitante. Vive en el navegador (localStorage) para
// sobrevivir a recargas y cambios de página; nunca se envía al servidor.
const CLAVE = 'alwaysclean:pedido:v2';
const MAX_CANTIDAD = 999;

const vacio = { items: [], abierto: false };
let estado = leer();
const suscriptores = new Set();

function leer() {
    try {
        const guardado = JSON.parse(window.localStorage.getItem(CLAVE));
        if (Array.isArray(guardado?.items)) return { ...vacio, items: guardado.items };
    } catch {
        // Sin almacenamiento (modo privado, bloqueado): el pedido vive solo en memoria.
    }
    return vacio;
}

function guardar(nuevo) {
    estado = nuevo;
    try {
        window.localStorage.setItem(CLAVE, JSON.stringify({ items: estado.items }));
    } catch {
        // Ignorar: seguimos en memoria.
    }
    suscriptores.forEach((fn) => fn());
}

// Otra pestaña cambió el pedido.
if (typeof window !== 'undefined') {
    window.addEventListener('storage', (e) => {
        if (e.key !== CLAVE) return;
        estado = { ...leer(), abierto: estado.abierto };
        suscriptores.forEach((fn) => fn());
    });
}

const limitar = (n) => Math.max(1, Math.min(MAX_CANTIDAD, Math.round(Number(n) || 1)));

/** "Bidón 20 L · Galón 4 L" → ['Bidón 20 L', 'Galón 4 L']. */
export function presentaciones(producto) {
    return (producto.presentacion ?? '').split('·').map((s) => s.trim()).filter(Boolean);
}

// Una línea del pedido por producto + presentación.
const claveDe = (id, presentacion) => `${id}|${presentacion ?? ''}`;

export const carrito = {
    agregar(producto, presentacion = presentaciones(producto)[0] ?? '', cantidad = 1) {
        const clave = claveDe(producto.id, presentacion);
        const existe = estado.items.find((i) => i.clave === clave);
        const items = existe
            ? estado.items.map((i) => (i.clave === clave ? { ...i, cantidad: limitar(i.cantidad + cantidad) } : i))
            : [...estado.items, {
                clave,
                id: producto.id,
                codigo: producto.codigo,
                nombre: producto.nombre,
                presentacion,
                imagen_url: producto.imagen_url ?? null,
                cantidad: limitar(cantidad),
            }];
        guardar({ ...estado, items });
    },
    cambiar(clave, cantidad) {
        guardar({ ...estado, items: estado.items.map((i) => (i.clave === clave ? { ...i, cantidad: limitar(cantidad) } : i)) });
    },
    quitar(clave) {
        guardar({ ...estado, items: estado.items.filter((i) => i.clave !== clave) });
    },
    vaciar() {
        guardar({ ...estado, items: [] });
    },
    abrir() {
        guardar({ ...estado, abierto: true });
    },
    cerrar() {
        guardar({ ...estado, abierto: false });
    },
};

export function useCarrito() {
    const snapshot = useSyncExternalStore(
        (fn) => {
            suscriptores.add(fn);
            return () => suscriptores.delete(fn);
        },
        () => estado,
    );

    return {
        ...snapshot,
        unidades: snapshot.items.reduce((total, i) => total + i.cantidad, 0),
        cantidadDe: (id, presentacion) => snapshot.items.find((i) => i.clave === claveDe(id, presentacion))?.cantidad ?? 0,
        claveDe,
    };
}

/** Mensaje de WhatsApp con la lista del pedido. */
export function mensajePedido(items, { cliente, ciudad, notas }) {
    return [
        'Hola, quiero cotizar estos productos:',
        '',
        ...items.map((i) => `• ${i.cantidad} × ${i.nombre}${i.presentacion ? ` (${i.presentacion})` : ''}`),
        '',
        cliente?.trim() ? `Cliente: ${cliente.trim()}` : null,
        ciudad?.trim() ? `Entrega en: ${ciudad.trim()}` : null,
        notas?.trim() ? `Observaciones: ${notas.trim()}` : null,
    ].filter((linea) => linea !== null).join('\n').trim();
}
