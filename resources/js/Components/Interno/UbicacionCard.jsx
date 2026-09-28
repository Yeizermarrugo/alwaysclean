import { useState } from 'react';

/**
 * Ubicación de la sede de una cotización: mapa, cómo llegar y envío a la cuadrilla.
 * El mapa es un iframe: con clave usa Maps Embed API (gratuita); sin clave, el embed público por consulta.
 */
export default function UbicacionCard({ cotizacion, mapsKey }) {
    const [copiado, setCopiado] = useState(false);
    const { direccion, referencia, ciudad, latitud, longitud, maps_url: mapsUrl } = cotizacion;
    const exacta = latitud !== null && longitud !== null;

    if (!direccion && !exacta) {
        return (
            <div className="rounded-[10px] border border-dashed border-mist-border bg-white p-3.5 text-[13px] text-ink-500">
                El cliente no indicó la dirección de la sede. Pídala por WhatsApp antes de programar la visita.
            </div>
        );
    }

    const consulta = exacta ? `${latitud},${longitud}` : `${direccion}, ${ciudad}`;
    const embed = mapsKey
        ? `https://www.google.com/maps/embed/v1/place?${new URLSearchParams({ key: mapsKey, q: consulta, zoom: exacta ? '17' : '15', language: 'es' })}`
        : `https://maps.google.com/maps?${new URLSearchParams({ q: consulta, z: exacta ? '17' : '15', hl: 'es', output: 'embed' })}`;
    const comoLlegar = `https://www.google.com/maps/dir/?${new URLSearchParams({ api: '1', destination: consulta, travelmode: 'driving' })}`;

    const textoCuadrilla = [
        `*${cotizacion.caso} · ${cotizacion.empresa}*`,
        `Servicio: ${cotizacion.servicios.join(', ')}`,
        `Dirección: ${direccion}${ciudad ? `, ${ciudad}` : ''}`,
        referencia ? `Referencia: ${referencia}` : null,
        `Contacto en sitio: ${cotizacion.whatsapp}`,
        `Cómo llegar: ${comoLlegar}`,
    ].filter(Boolean).join('\n');

    const copiar = async () => {
        try {
            await navigator.clipboard.writeText(textoCuadrilla);
            setCopiado(true);
            setTimeout(() => setCopiado(false), 1800);
        } catch {
            // Sin permiso de portapapeles: no hacer nada.
        }
    };

    return (
        <div className="overflow-hidden rounded-[10px] border border-mist-300 bg-white">
            <div className="flex items-center justify-between px-3.5 pb-2.5 pt-3">
                <span className="font-sans text-[10.5px] font-semibold tracking-[0.1em] text-ink-500">UBICACIÓN DE LA SEDE</span>
                <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 font-sans text-[10.5px] font-semibold ${
                        exacta ? 'bg-green-light text-green-dark' : 'bg-amber-50 text-amber-700'
                    }`}
                    title={exacta ? 'El cliente marcó el punto en el mapa' : 'Ubicación estimada a partir del texto de la dirección'}
                >
                    <span className={`h-1.5 w-1.5 rounded-full ${exacta ? 'bg-green' : 'bg-amber-500'}`} aria-hidden="true" />
                    {exacta ? 'Pin exacto' : 'Aproximada'}
                </span>
            </div>

            <div className="relative h-[190px] border-y border-mist-300 bg-mist-100">
                <iframe
                    key={consulta}
                    title={`Mapa de ${direccion || consulta}`}
                    src={embed}
                    className="absolute inset-0 h-full w-full"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                />
            </div>

            <div className="px-3.5 py-3">
                <div className="text-[13.5px] font-semibold leading-snug text-navy">{direccion || 'Punto marcado en el mapa'}</div>
                {ciudad && <div className="text-[12.5px] text-ink-500">{ciudad}</div>}
                {referencia && (
                    <div className="mt-2 rounded-lg bg-mist-50 px-2.5 py-2 text-[12.5px] leading-relaxed text-navy-600">
                        <span className="font-semibold text-navy">Referencia: </span>
                        {referencia}
                    </div>
                )}
                {exacta && (
                    <div className="mt-2 font-mono text-[11px] text-ink-500">
                        {latitud.toFixed(6)}, {longitud.toFixed(6)}
                    </div>
                )}
            </div>

            <div className="grid grid-cols-2 gap-2 px-3.5 pb-3.5">
                <a
                    href={comoLlegar}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="col-span-2 flex items-center justify-center gap-2 rounded-lg bg-navy py-2.5 font-display text-[13px] font-semibold text-white hover:bg-navy-deep"
                >
                    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                        <path d="M10.7 2.3a1 1 0 0 0-1.4 0l-7 7a1 1 0 0 0 0 1.4l7 7a1 1 0 0 0 1.4 0l7-7a1 1 0 0 0 0-1.4l-7-7ZM11 7.5V6l3 3-3 3v-1.5H8.5V13H7V9.5a1 1 0 0 1 1-1h3Z" />
                    </svg>
                    Cómo llegar
                </a>
                <a
                    href={`https://wa.me/?text=${encodeURIComponent(textoCuadrilla)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center rounded-lg border border-mist-border py-2 font-display text-[12.5px] font-semibold text-navy hover:border-navy"
                >
                    Enviar a cuadrilla
                </a>
                <button
                    type="button"
                    onClick={copiar}
                    className="rounded-lg border border-mist-border py-2 font-display text-[12.5px] font-semibold text-navy hover:border-navy"
                >
                    {copiado ? 'Copiado ✓' : 'Copiar datos'}
                </button>
                {mapsUrl && (
                    <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="col-span-2 text-center text-[12px] font-medium text-ink-500 hover:text-navy"
                    >
                        Abrir en Google Maps ↗
                    </a>
                )}
            </div>
        </div>
    );
}
