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

- Lista completa de pendientes (seguridad PQRS, BD, despliegue, tests): ver `TODO.md`.
- El PDF de portafolio trae una lista de servicios más completa que la sembrada en `ServicioSeeder` (paneles solares, PTAP/PTAR, pozos sépticos, alquiler de equipos). No sincronizado — pendiente si se pide.
- Logos de clientes reales en el carrusel: asumido que hay autorización de esas empresas para mostrarlos públicamente (Aguas de Cartagena, Petromil, OIM/ONU Migración, Syngenta, etc.) — confirmar si no.

## Sesión 2026-09-18 — decisiones y cambios

- **BD local (WSL)**: MySQL corre en el puerto **3307**, no 3306. Con `networkingMode=mirrored` en `.wslconfig`, un `mysqld` de Windows ocupa el 3306 y el de WSL no arranca. Config en `/etc/mysql/conf.d/alwaysclean.cnf` (`/etc/mysql/my.cnf` apunta a MariaDB y **no lee** `mysql.conf.d/`). `.env` tiene `DB_PORT=3307`; `.env.example` queda en 3306. DBeaver: host `127.0.0.1`, puerto 3307.
- **Uploads configurables**: `config('filesystems.uploads_disk')` (`UPLOADS_DISK`, por defecto `public`). Todo acceso a imágenes subidas pasa por `App\Support\Uploads` (`url()`, `delete()`, `diskName()`); no usar `Storage::disk('public')` ni `'/storage/'.` directos. En producción `UPLOADS_DISK=s3`.
- **Laravel 13.32** (antes 11.55.1, que tenía avisos de seguridad sin parche: CRLF en la regla `email`, URLs firmadas). Actualizados también `tinker ^3`, `phpunit ^12`, `collision ^8.6`, `sanctum ^4.3`. Sin cambios de código necesarios; el CSRF ahora es `PreventRequestForgery` (no hay referencias directas en el proyecto).
- **Despliegue decidido**: Laravel Cloud, plan Starter, misma organización que `dilodepartededios.com`.
- **Seguridad pendiente (ver `TODO.md`)**: login del panel sin rate limit. (PQRS resuelto el 2026-09-23, ver abajo.)

## Sesión 2026-09-23 — PQRS blindado + UI

### UI
- Botón WhatsApp del header → flotante (`Components/Site/WhatsAppFloat.jsx`, montado en `SiteLayout`). Header deja solo "Cotizar".
- Home: quitado el testimonio de cliente (no se usará); productos en grid de tarjetas; bono 10 % como franja.
- `/nosotros` rediseñada. Contenido fiel al PDF de portafolio (pág. 03 tiene Valores institucionales + Creencias; se mantienen por decisión del usuario). No inventar títulos/textos: usar los del PDF (`C:\Users\yemav\Downloads\Portafolio Always Clean SAS.pdf`, es imagen — `pdftoppm` para leerlo).

### PQRS — cómo está protegido (`POST /pqrs`)
- **Capa 1 (abuso):** `throttle:pqrs` (20 intentos/h por IP, en `AppServiceProvider`) + en `PqrsController@store`: 5 casos/h por IP y 3/día por email (solo cuentan casos creados); honeypot `sitio_web` (finge éxito, no guarda); token `inicio` cifrado con tiempo mínimo de 3 s; Turnstile (`App\Rules\Turnstile`, activo solo si hay `TURNSTILE_*`); `email:rfc,dns`; duplicado email+descripción en 24 h → devuelve el mismo caso (vía caché); casilla `acepta_datos` → `consentimiento_at`.
- **Correo** (`PqrsCasoRecibido`): recibe solo número y tipo (strings, no el modelo). Nunca meter texto del usuario en la plantilla Markdown: `{{ }}` no escapa `[texto](url)` → phishing con nuestra marca.
- **Número de caso:** aleatorio `PQRS-XXXXXX` (`PqrsCaso::nuevoNumeroCaso()`), reintento ante choque del índice unique en `PqrsCaso::radicar()`.
- **Capa 2 (BD):** el formulario guarda por la conexión `pqrs_publico` (usuario MySQL con **solo INSERT** en `pqrs_casos`, script `database/sql/pqrs_publico_usuario.sql`). Por eso el camino público no puede leer la tabla: nada de consultas a `pqrs_casos` en `PqrsController@store` ni en el Mailable. Sin `DB_PQRS_USERNAME` usa la conexión normal. En local ya existe `alwaysclean_pqrs` (credenciales en `.env`).
- **Capa 3 (cifrar documento/teléfono, plazo de borrado): descartada por ahora** por decisión del usuario.
- **IP para límites:** `App\Support\IpVisitante::de($request)`, no `$request->ip()`. En Laravel Cloud, Laravel confía en todos los proxies (`TrustProxies` + `laravel_cloud()`), así que `$request->ip()` sale de la parte de `X-Forwarded-For` que escribe el visitante → falseable. **No usar `trustProxies(at: '*')`**: mismo problema (un test lo demostró). Con `IP_DESDE_CLOUDFLARE=true` se usa `CF-Connecting-IP`.
- **Tests:** `tests/Feature/PqrsTest.php`, `ProxyIpTest.php` (20 en total). `phpunit.xml` fuerza sqlite en memoria y `DB_PQRS_USERNAME=""` — sin eso los tests escriben en la MySQL de desarrollo.

### Checklist al desplegar (Laravel Cloud)
1. Variables: `APP_ENV=production`, `APP_DEBUG=false`, `TURNSTILE_SITE_KEY`/`TURNSTILE_SECRET_KEY` reales (las reales están comentadas en `.env` local; las `1x000…` son de prueba), `IP_DESDE_CLOUDFLARE=false` al inicio. `MAIL_FROM_ADDRESS` = buzón real que alguien lea (el correo pide "responda a este correo").
2. Turnstile: agregar el dominio de producción (y el `*.laravel.cloud` si se prueba ahí) en los hostnames del widget "Always Clean - PQRS".
3. Usuario solo-INSERT: correr `database/sql/pqrs_publico_usuario.sql` en la MySQL de Cloud (cambiar nombre de BD y contraseña) y poner `DB_PQRS_USERNAME`/`DB_PQRS_PASSWORD`. Confirmar antes que Cloud permita crear usuarios con permisos por tabla; si no, dejar vacías (funciona con la conexión normal).
4. IP real: logueado, desde el celular con datos móviles, abrir `/interno/diagnostico-ip` y comparar con https://ifconfig.me. Si `cf_connecting_ip` coincide → `IP_DESDE_CLOUDFLARE=true` y verificar que `ip_para_limites` muestre esa IP. Si viene vacío → dejar `false` y revisar `request_ip`/`x_forwarded_for` antes de decidir.
5. Dominio en Cloudflare: confirmar en la doc de Laravel Cloud si va con proxy (nube naranja) o "DNS only" (Cloud ya corre sobre la red de Cloudflare).
6. Pendientes legales: la casilla de datos enlaza a `/politicas` (política integral PO-SGI-001), no a una política de tratamiento de datos Ley 1581 — falta que la empresa la tenga.

### Dev
- `public/hot` sigue desapareciendo con `npm run dev` vivo; síntoma: cambios en JSX no se ven. Recrear con `echo -n "http://127.0.0.1:5173" > public/hot`.
