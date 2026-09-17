# Always Clean Colombia — sitio web

Laravel + Inertia (React/JSX) + Tailwind. Sitio público (home, servicios, productos, nosotros, políticas, contacto, PQRS) + panel interno (`/interno/*`, auth) para gestión de cotizaciones, servicios, productos y PQRS.

## Stack y arranque

- `npm run dev` levanta todo vía concurrently: `php artisan serve` + `queue:listen` + `pail` + `vite`.
- Vite en modo dev escribe `public/hot` — si desaparece con el proceso vivo (pasa al tocar `tailwind.config.js` o crear varios archivos de golpe), recrear a mano: `echo -n "http://127.0.0.1:5173" > public/hot`. Sin eso, Laravel sirve el build viejo de `public/build` y las páginas nuevas tiran 500 "Unable to locate file in Vite manifest".
- Tailwind: cambios en `theme.extend` de `tailwind.config.js` no siempre se recogen en caliente (keyframes custom no se generaron ni tocando el archivo). Para animaciones custom, mejor `<style>` inline en el componente en vez de depender de `theme.extend.keyframes/animation`.

## Modelos clave

- `Servicio` / `Producto`: campo `imagen` acepta URL absoluta (http/https) o path de `/storage/...` — accessor `imagen_url` detecta cuál es.
- `PqrsCaso`: `estado` (radicado/en_proceso/cerrado) + `leido_at` (nullable, marca lectura al abrir el caso en el panel).
- `Cotizacion` + `CotizacionEvento`: bitácora de cambios de estado en el panel de cotizaciones.

## Convenciones

- Layout site: `SiteLayout` (`flex flex-col min-h-screen`, `main` con `flex-1`) — footer siempre pegado abajo aunque el contenido sea corto.
- Layout interno: `InternoLayout`, nav con badges opcionales (ver `pqrsPendientes`).
- Shared props Inertia van en `HandleInertiaRequests::share()` — ahí vive `pqrsPendientes` (conteo global de PQRS sin leer, para el badge del nav).

## Sesión 2026-09-04 — cambios hechos

- **Imágenes reales** en servicios (15), productos (3) y hero del home: fotos de Unsplash elegidas y verificadas una por una (no genéricas al azar), vía `imagen_url` accessor.
- **Carrusel de clientes** (`ClientesCarousel.jsx`, home, antes del footer): 11 logos reales extraídos del PDF `Portafolio Always Clean SAS.pdf` (recortados de un render en alta resolución + fondo removido a transparente), animación marquee infinita en CSS puro (no Tailwind theme).
- **`/nosotros`**: quiénes somos, misión/visión, valores institucionales, creencias, principios de acción, sectores — contenido sacado del PDF de portafolio.
- **`/politicas`**: política integral completa (PO-SGI-001) con firma del representante legal.
- **Footer sticky**: fix en `SiteLayout` (antes se colapsaba en páginas cortas como Contacto).
- **PQRS — panel interno completo**: antes solo guardaba en BD (`pqrs_casos`) sin gestión visible.
  - Nueva `leido_at` en `pqrs_casos` (migración).
  - `Interno\PqrsController` (index con bandeja + marcar leído automático al abrir, update de estado).
  - `Interno/Pqrs/Index.jsx` — mismo patrón que `Bandeja.jsx` de cotizaciones.
  - Badge rojo en el nav del panel ("PQRS") con cantidad de casos sin leer, vía shared prop `pqrsPendientes`.

## Pendiente / no tocado

- El PDF de portafolio trae una lista de servicios más completa que la sembrada en `ServicioSeeder` (paneles solares, PTAP/PTAR, pozos sépticos, alquiler de equipos). No sincronizado — pendiente si se pide.
- Logos de clientes reales en el carrusel: asumido que hay autorización de esas empresas para mostrarlos públicamente (Aguas de Cartagena, Petromil, OIM/ONU Migración, Syngenta, etc.) — confirmar si no.
