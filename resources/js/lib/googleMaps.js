// Carga única de la Maps JavaScript API. Devuelve `google.maps` listo para `importLibrary`.
let cargando = null;

export function cargarGoogleMaps(key) {
    if (!key) return Promise.reject(new Error('Sin GOOGLE_MAPS_BROWSER_KEY'));
    if (window.google?.maps?.importLibrary) return Promise.resolve(window.google.maps);
    if (cargando) return cargando;

    cargando = new Promise((resolve, reject) => {
        const callback = '__alwaysCleanMapsListo';
        window[callback] = () => {
            delete window[callback];
            resolve(window.google.maps);
        };
        // Clave inválida o dominio no autorizado: Google llama a esta función global.
        window.gm_authFailure = () => reject(new Error('Google Maps rechazó la clave'));

        const params = new URLSearchParams({ key, v: 'weekly', loading: 'async', language: 'es', region: 'CO', callback });
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?${params}`;
        script.async = true;
        script.onerror = () => {
            cargando = null;
            reject(new Error('No se pudo cargar Google Maps'));
        };
        document.head.appendChild(script);
    });

    return cargando;
}

// Centro por defecto: Cartagena de Indias.
export const CENTRO_DEFECTO = { lat: 10.3997, lng: -75.5144 };

export function latLng(pos) {
    return typeof pos.lat === 'function' ? { lat: pos.lat(), lng: pos.lng() } : { lat: pos.lat, lng: pos.lng };
}

export function redondear(n) {
    return Math.round(n * 1e7) / 1e7;
}
