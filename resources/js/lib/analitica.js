// Medición de conversiones. Funciona con Plausible o Google Analytics 4 según
// cuál esté cargado en app.blade.php (ANALITICA_PLAUSIBLE_DOMINIO /
// ANALITICA_GA4_ID). Sin ninguno configurado, no hace nada.

export function medir(evento, propiedades = {}) {
    try {
        window.plausible?.(evento, { props: propiedades });
        window.gtag?.('event', evento.toLowerCase().replace(/\s+/g, '_'), propiedades);
    } catch {
        // La medición nunca debe romper la página.
    }
}

// Todo clic a WhatsApp (botón flotante, fichas, pedido, bono…) cuenta como
// conversión. Un enlace puede afinar el nombre con data-evento.
export function iniciarMedicion() {
    document.addEventListener('click', (e) => {
        const enlace = e.target.closest?.('a[href*="wa.me/"]');
        if (!enlace || enlace.closest('[data-sin-medicion]')) return;
        medir(enlace.dataset.evento || 'Clic WhatsApp', { pagina: window.location.pathname });
    }, true);
}
