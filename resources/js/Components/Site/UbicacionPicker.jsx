import { useEffect, useRef, useState } from 'react';
import { cargarGoogleMaps, CENTRO_DEFECTO, latLng, redondear } from '@/lib/googleMaps';

/**
 * Dirección de la sede con autocompletado de Google Places y pin arrastrable.
 * Sin clave (o si Google falla) queda como campo de texto normal.
 */
export default function UbicacionPicker({ mapsKey, mapId, direccion, latitud, longitud, onChange, onCiudad, error, inputClass }) {
    const [estado, setEstado] = useState(mapsKey ? 'cargando' : 'sin_mapa'); // cargando | listo | sin_mapa
    const [sugerencias, setSugerencias] = useState([]);
    const [activa, setActiva] = useState(-1);
    const [abierto, setAbierto] = useState(false);
    const [ubicando, setUbicando] = useState(false);
    const [avisoGps, setAvisoGps] = useState('');

    const mapaEl = useRef(null);
    const mapa = useRef(null);
    const marcador = useRef(null);
    const places = useRef(null);
    const token = useRef(null);
    const consulta = useRef(0);
    const onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;

    const tienePin = latitud !== '' && latitud !== null && longitud !== '' && longitud !== null;

    const ponerPin = (pos, { zoom } = {}) => {
        const p = { lat: redondear(pos.lat), lng: redondear(pos.lng) };
        marcador.current.position = p;
        marcador.current.map = mapa.current;
        mapa.current.panTo(p);
        if (zoom) mapa.current.setZoom(zoom);
        return p;
    };

    // Cargar mapa + librería de Places.
    useEffect(() => {
        if (!mapsKey) return;
        let cancelado = false;

        (async () => {
            try {
                const maps = await cargarGoogleMaps(mapsKey);
                const [{ Map }, { AdvancedMarkerElement }, placesLib] = await Promise.all([
                    maps.importLibrary('maps'),
                    maps.importLibrary('marker'),
                    maps.importLibrary('places'),
                ]);
                if (cancelado) return;

                places.current = placesLib;
                token.current = new placesLib.AutocompleteSessionToken();

                const inicial = tienePin ? { lat: Number(latitud), lng: Number(longitud) } : CENTRO_DEFECTO;
                mapa.current = new Map(mapaEl.current, {
                    center: inicial,
                    zoom: tienePin ? 17 : 12,
                    mapId,
                    disableDefaultUI: true,
                    zoomControl: true,
                    fullscreenControl: true,
                    gestureHandling: 'cooperative',
                    clickableIcons: false,
                });
                marcador.current = new AdvancedMarkerElement({
                    map: tienePin ? mapa.current : null,
                    position: tienePin ? inicial : null,
                    gmpDraggable: true,
                    title: 'Ubicación de la sede',
                });

                marcador.current.addListener('dragend', () => {
                    const p = ponerPin(latLng(marcador.current.position));
                    onChangeRef.current({ latitud: p.lat, longitud: p.lng, place_id: '' });
                });
                mapa.current.addListener('click', (e) => {
                    const p = ponerPin(latLng(e.latLng));
                    onChangeRef.current({ latitud: p.lat, longitud: p.lng, place_id: '' });
                });

                setEstado('listo');
            } catch {
                if (!cancelado) setEstado('sin_mapa');
            }
        })();

        return () => {
            cancelado = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mapsKey, mapId]);

    // Sugerencias mientras escribe (con pausa para no gastar peticiones).
    useEffect(() => {
        if (estado !== 'listo' || !abierto) return;
        const texto = direccion.trim();
        if (texto.length < 4) {
            setSugerencias([]);
            return;
        }

        const id = ++consulta.current;
        const t = setTimeout(async () => {
            try {
                const { suggestions } = await places.current.AutocompleteSuggestion.fetchAutocompleteSuggestions({
                    input: texto,
                    sessionToken: token.current,
                    includedRegionCodes: ['co'],
                    locationBias: { center: CENTRO_DEFECTO, radius: 50000 },
                    language: 'es',
                    region: 'co',
                });
                if (id !== consulta.current) return;
                setSugerencias(suggestions.filter((s) => s.placePrediction).slice(0, 5));
                setActiva(-1);
            } catch {
                setSugerencias([]);
            }
        }, 280);

        return () => clearTimeout(t);
    }, [direccion, abierto, estado]);

    const elegir = async (sugerencia) => {
        setAbierto(false);
        setSugerencias([]);
        const pred = sugerencia.placePrediction;
        onChange({ direccion: pred.text.toString() });

        try {
            const place = pred.toPlace();
            await place.fetchFields({ fields: ['formattedAddress', 'location', 'addressComponents'] });
            // Cierra la sesión de autocompletado (Google la cobra como una sola).
            token.current = new places.current.AutocompleteSessionToken();

            const p = ponerPin(latLng(place.location), { zoom: 17 });
            onChange({
                direccion: place.formattedAddress ?? pred.text.toString(),
                latitud: p.lat,
                longitud: p.lng,
                place_id: place.id,
            });

            const ciudad = place.addressComponents?.find((c) => c.types.includes('locality'))?.longText;
            if (ciudad) onCiudad?.(ciudad);
        } catch {
            // Se queda con el texto; el usuario puede ubicar el pin a mano.
        }
    };

    const usarMiUbicacion = () => {
        if (!navigator.geolocation) {
            setAvisoGps('Su navegador no permite obtener la ubicación.');
            return;
        }
        setUbicando(true);
        setAvisoGps('');
        navigator.geolocation.getCurrentPosition(
            ({ coords }) => {
                setUbicando(false);
                const p = ponerPin({ lat: coords.latitude, lng: coords.longitude }, { zoom: 18 });
                onChange({ latitud: p.lat, longitud: p.lng, place_id: '' });
            },
            () => {
                setUbicando(false);
                setAvisoGps('No pudimos obtener su ubicación. Ubique el pin tocando el mapa.');
            },
            { enableHighAccuracy: true, timeout: 10000 },
        );
    };

    const quitarPin = () => {
        marcador.current.map = null;
        onChange({ latitud: '', longitud: '', place_id: '' });
    };

    const teclado = (e) => {
        if (!abierto || sugerencias.length === 0) return;
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiva((i) => (i + 1) % sugerencias.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiva((i) => (i <= 0 ? sugerencias.length - 1 : i - 1));
        } else if (e.key === 'Enter' && activa >= 0) {
            e.preventDefault();
            elegir(sugerencias[activa]);
        } else if (e.key === 'Escape') {
            setAbierto(false);
        }
    };

    const mostrarLista = abierto && sugerencias.length > 0;

    return (
        <div>
            <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-ink-400">
                    <IconoPin className="h-4 w-4" />
                </span>
                <input
                    value={direccion}
                    onChange={(e) => {
                        onChange({ direccion: e.target.value });
                        setAbierto(true);
                    }}
                    onFocus={() => setAbierto(true)}
                    onBlur={() => setTimeout(() => setAbierto(false), 150)}
                    onKeyDown={teclado}
                    placeholder={estado === 'listo' ? 'Escriba la dirección y elija una sugerencia' : 'Cra. 1 # 2-87, Bocagrande'}
                    autoComplete="off"
                    role="combobox"
                    aria-expanded={mostrarLista}
                    aria-controls="sugerencias-direccion"
                    aria-autocomplete="list"
                    className={`${inputClass} pl-9 ${error ? 'border-alert' : ''}`}
                />

                {mostrarLista && (
                    <ul
                        id="sugerencias-direccion"
                        role="listbox"
                        className="absolute left-0 right-0 top-full z-20 mt-1.5 overflow-hidden rounded-[10px] border border-mist-border bg-white py-1 shadow-[0_18px_40px_-18px_rgba(13,13,91,0.35)]"
                    >
                        {sugerencias.map((s, i) => {
                            const pred = s.placePrediction;
                            return (
                                <li key={pred.placeId} role="option" aria-selected={i === activa}>
                                    <button
                                        type="button"
                                        onMouseDown={(e) => e.preventDefault()}
                                        onClick={() => elegir(s)}
                                        onMouseEnter={() => setActiva(i)}
                                        className={`flex w-full items-start gap-3 px-3.5 py-2.5 text-left ${i === activa ? 'bg-mist-50' : ''}`}
                                    >
                                        <IconoPin className="mt-0.5 h-4 w-4 shrink-0 text-green" />
                                        <span className="min-w-0">
                                            <span className="block truncate text-[13.5px] font-semibold text-navy">
                                                {pred.mainText?.toString() ?? pred.text.toString()}
                                            </span>
                                            {pred.secondaryText && (
                                                <span className="block truncate text-[12px] text-ink-500">{pred.secondaryText.toString()}</span>
                                            )}
                                        </span>
                                    </button>
                                </li>
                            );
                        })}
                        <li className="border-t border-mist-200 px-3.5 pb-1 pt-1.5 text-right text-[10.5px] text-ink-400">Sugerencias de Google</li>
                    </ul>
                )}
            </div>
            {error && <p className="mt-1.5 text-xs text-alert">{error}</p>}

            {estado !== 'sin_mapa' && (
                <div className="mt-3 overflow-hidden rounded-[12px] border border-mist-300">
                    <div className="relative h-[240px] bg-mist-100 sm:h-[260px]">
                        <div ref={mapaEl} className="absolute inset-0" />
                        {estado === 'cargando' && (
                            <div className="absolute inset-0 grid place-items-center text-[12.5px] text-ink-500">Cargando mapa…</div>
                        )}
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-mist-300 bg-white px-3.5 py-2.5">
                        <span className={`flex items-center gap-2 text-[12.5px] ${tienePin ? 'text-green-dark' : 'text-ink-500'}`}>
                            <span className={`h-2 w-2 rounded-full ${tienePin ? 'bg-green' : 'bg-ink-300'}`} aria-hidden="true" />
                            {tienePin ? 'Ubicación marcada. Arrastre el pin si hace falta precisarla.' : 'Elija una sugerencia o toque el mapa para marcar la sede.'}
                        </span>
                        <span className="flex items-center gap-3">
                            {tienePin && (
                                <button type="button" onClick={quitarPin} className="text-[12.5px] font-semibold text-ink-500 hover:text-navy">
                                    Quitar
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={usarMiUbicacion}
                                disabled={estado !== 'listo' || ubicando}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-mist-border px-3 py-1.5 font-display text-[12.5px] font-semibold text-navy hover:border-navy disabled:opacity-50"
                            >
                                <IconoMira className="h-3.5 w-3.5" />
                                {ubicando ? 'Ubicando…' : 'Estoy en la sede'}
                            </button>
                        </span>
                    </div>
                    {avisoGps && <p className="border-t border-mist-300 bg-mist-50 px-3.5 py-2 text-[12px] text-alert">{avisoGps}</p>}
                </div>
            )}
        </div>
    );
}

function IconoPin({ className }) {
    return (
        <svg viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden="true">
            <path fillRule="evenodd" d="M10 1.5a6.5 6.5 0 0 0-6.5 6.5c0 4.6 5.3 9.6 5.9 10.1a.9.9 0 0 0 1.2 0c.6-.5 5.9-5.5 5.9-10.1A6.5 6.5 0 0 0 10 1.5Zm0 9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" clipRule="evenodd" />
        </svg>
    );
}

function IconoMira({ className }) {
    return (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
            <circle cx="10" cy="10" r="6" />
            <circle cx="10" cy="10" r="1.6" fill="currentColor" />
            <path d="M10 1v3M10 16v3M1 10h3M16 10h3" strokeLinecap="round" />
        </svg>
    );
}
