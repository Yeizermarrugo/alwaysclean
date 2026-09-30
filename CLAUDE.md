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
- **Seguridad**: PQRS resuelto el 2026-09-23 y login/encabezados el 2026-09-28 (ver abajo). Pendientes en `TODO.md`.

## Sesión 2026-09-23 — PQRS blindado + UI

### UI
- Botón WhatsApp del header → flotante (`Components/Site/WhatsAppFloat.jsx`, montado en `SiteLayout`). Header deja solo "Cotizar".
- Home: quitado el testimonio de cliente (no se usará); productos en grid de tarjetas; bono 10 % como franja.
- `/nosotros` rediseñada. Contenido fiel al PDF de portafolio (pág. 03 tiene Valores institucionales + Creencias; se mantienen por decisión del usuario). No inventar títulos/textos: usar los del PDF (`C:\Users\yemav\Downloads\Portafolio Always Clean SAS.pdf`, es imagen — `pdftoppm` para leerlo).

### Logo y login del panel
- `public/images/logo.png` (163×90, fondo blanco opaco) es de baja resolución: se ve pixelado/diminuto. Lo siguen usando header y footer del sitio público.
- Versiones nuevas en alta (sacadas del logo vectorial de la portada del PDF, render a 600 DPI + fondo a transparente con PHP GD): `logo-color.png` (fondos claros), `logo-blanco.png` (fondos oscuros), `logo-gota.png` (solo la gota, espacios chicos). Usar estas en UI nueva.
- `/interno/login` (`Pages/Auth/Login.jsx`): pantalla dividida — foto + capa navy con logo blanco y módulos del panel (solo `lg`), formulario con logo a color, mostrar/ocultar contraseña, "Mantener la sesión iniciada" (`remember`).
- `InternoLayout`: barra con gota en recuadro blanco + "ALWAYS CLEAN / Panel interno", enlaza a Cotizaciones. Títulos de pestaña "Panel interno · …".

### PQRS — cómo está protegido (`POST /pqrs`)
- **Capa 1 (abuso):** `throttle:pqrs` (20 intentos/h por IP, en `AppServiceProvider`) + en `PqrsController@store`: 5 casos/h por IP y 3/día por email (solo cuentan casos creados); honeypot `sitio_web` (finge éxito, no guarda); token `inicio` cifrado con tiempo mínimo de 3 s; Turnstile (`App\Rules\Turnstile`, activo solo si hay `TURNSTILE_*`); `email:rfc,dns`; duplicado email+descripción en 24 h → devuelve el mismo caso (vía caché); casilla `acepta_datos` → `consentimiento_at`.
- **Correo** (`PqrsCasoRecibido`): recibe solo número y tipo (strings, no el modelo). Nunca meter texto del usuario en la plantilla Markdown: `{{ }}` no escapa `[texto](url)` → phishing con nuestra marca.
- **Número de caso:** aleatorio `PQRS-XXXXXX` (`PqrsCaso::nuevoNumeroCaso()`), reintento ante choque del índice unique en `PqrsCaso::radicar()`.
- **Capa 2 (BD):** el formulario guarda por la conexión `pqrs_publico` (usuario MySQL con **solo INSERT** en `pqrs_casos`, script `database/sql/pqrs_publico_usuario.sql`). Por eso el camino público no puede leer la tabla: nada de consultas a `pqrs_casos` en `PqrsController@store` ni en el Mailable. Sin `DB_PQRS_USERNAME` usa la conexión normal. En local ya existe `alwaysclean_pqrs` (credenciales en `.env`).
- **Capa 3 (cifrar documento/teléfono, plazo de borrado): descartada por ahora** por decisión del usuario.
- **IP para límites:** `App\Support\IpVisitante::de($request)`, no `$request->ip()`. En Laravel Cloud, Laravel confía en todos los proxies (`TrustProxies` + `laravel_cloud()`), así que `$request->ip()` sale de la parte de `X-Forwarded-For` que escribe el visitante → falseable. **No usar `trustProxies(at: '*')`**: mismo problema (un test lo demostró). Con `IP_DESDE_CLOUDFLARE=true` se usa `CF-Connecting-IP`.
- **Tests:** `tests/Feature/PqrsTest.php`, `ProxyIpTest.php` (20 en total). `phpunit.xml` fuerza sqlite en memoria y `DB_PQRS_USERNAME=""` — sin eso los tests escriben en la MySQL de desarrollo.

### Cotizaciones (`POST /contacto`) — protección y ubicación (2026-09-28)
- Mismo esquema que PQRS capa 1: `throttle:contacto` (20/h por IP), en `ContactoController@store` 5 creadas/h por IP y 3/día por WhatsApp, honeypot `sitio_web` (redirige a wa.me sin guardar), token `inicio` (mín. 5 s), Turnstile (`TurnstileWidget.jsx`, paso 3), duplicado WhatsApp+servicios en 24 h → misma cotización (caché).
- `servicios.*` solo nombres de la tabla `servicios`; `whatsapp` solo celular 3xx o fijo 60x (`Cotizacion::normalizarTelefono`), se guarda como "300 123 4567".
- Número de caso aleatorio `COT-XXXXXX` (`Cotizacion::registrar()` con reintento). Los viejos `COT-24xx` siguen válidos.
- Ubicación: `direccion` obligatoria + `referencia`, `latitud`, `longitud`, `place_id`. Formulario: `UbicacionPicker.jsx` (Places API New + pin arrastrable, solo con `GOOGLE_MAPS_BROWSER_KEY`). Panel: `UbicacionCard.jsx` (mapa, cómo llegar, enviar a cuadrilla).
- Tests: `CotizacionProteccionTest.php`, `CotizacionUbicacionTest.php` (datos compartidos en `tests/Feature/Concerns/DatosCotizacion.php`).

### Seguridad del panel y del sitio (2026-09-28)
- Login: 5 fallos por correo+IP → bloqueo 15 min (`SessionController::MAX_INTENTOS`), más `throttle:login` 20/min por IP. Por correo+IP y no solo correo para que un tercero no pueda bloquearle la cuenta al dueño.
- Ziggy: visitantes sin sesión reciben solo el grupo `publico` (`config/ziggy.php`, `@routes(...)` en `app.blade.php`). **Login y logout responden con `Inertia::location`** (recarga completa) para que el navegador reciba/descarte las rutas del panel; con una visita Inertia normal el panel fallaría con "route not found". Rutas nuevas públicas: agregarlas al grupo.
- `EncabezadosSeguridad` (middleware web): X-Frame-Options DENY, nosniff, Referrer-Policy, Permissions-Policy (solo geolocalización propia), HSTS solo en producción+HTTPS, `X-Robots-Tag: noindex` en `/interno`. Sin CSP todavía.
- Tests: `tests/Feature/SeguridadTest.php`.

### Sitio público: SEO, errores y medición (2026-09-28)
- **Metaetiquetas en el servidor** (`App\Support\Seo` → `app.blade.php`): Inertia sin SSR, así que `<Head>` de React no lo ven WhatsApp/Facebook. Título, descripción, canonical, Open Graph y JSON-LD `LocalBusiness` (solo en home) salen de Blade. Página nueva pública → agregarla a `Seo::PAGINAS` con el mismo título que su `SiteLayout title`. Textos tomados de cada página, no inventados.
- Imagen para compartir: `public/images/og-default.jpg` (1200×630). Fichas de servicio usan su propia foto.
- `/sitemap.xml` y `/robots.txt` son rutas (`SeoController`); `public/robots.txt` se borró. Fuera de producción robots bloquea todo (evita indexar `*.laravel.cloud`).
- Errores 403/404 (y 500/503 sin `APP_DEBUG`) renderizan `Pages/Error.jsx`; 419 vuelve atrás con `errors.form`. Un 404 de ruta inexistente no pasa por el middleware web: las props del layout se comparten a mano en `bootstrap/app.php`.
- Medición: `resources/js/lib/analitica.js` (`medir()`), Plausible o GA4 según `ANALITICA_PLAUSIBLE_DOMINIO` / `ANALITICA_GA4_ID`; no se carga en `/interno`. Eventos: todo clic a `wa.me` ("Clic WhatsApp", o `data-evento`), "Cotización enviada", "PQRS radicado", "Pedido de productos".
- `/contacto`: el recuadro de relleno del mapa se reemplazó por un mapa embebido de la ciudad.

### Correo con Resend (2026-09-28)
- `resend/resend-php` instalado; `MAIL_MAILER=resend` + `RESEND_KEY` en producción (local: `log`, los correos quedan en `storage/logs`). Todos los correos van en cola.
- **Aviso de cotización nueva** (`App\Mail\CotizacionRecibida`) a `config('notificaciones.cotizaciones')` = `NOTIFICAR_COTIZACIONES` (coma). Destinatarios en `config/notificaciones.php`, NO en `company.php` (ese se comparte entero con el frontend). Texto del cliente en correos Markdown siempre por `App\Support\Markdown::texto()`.
- **¿Olvidó su contraseña?**: `/interno/olvide` → correo `RestablecerContrasena` (User::sendPasswordResetNotification) → `/interno/restablecer/{token}`. Misma respuesta exista o no la cuenta. `throttle:olvide` 5/15 min por IP.
- **Mi cuenta** (`/interno/cuenta`, clic en el nombre en la barra): cambio de contraseña con la actual; cierra otras sesiones (`auth.session` + `logoutOtherDevices`) y envía `ContrasenaCambiada`. Reglas: `Password::defaults()` (10+, letras y números; `uncompromised()` solo en producción).
- Hosting compartido sin worker ni cron frecuente: `QUEUE_CONNECTION=deferred` (config/queue.php) envía los correos justo después de responder, sin reintentos. Con worker (Laravel Cloud) o cron cada minuto: `database`.
- Plantilla de correo publicada solo en lo necesario: `resources/views/vendor/mail/html/{header,message}.blade.php` + `themes/default.css` (logo y colores). Textos de la plantilla de Laravel traducidos en `lang/es.json`.

### Fotos reales y preguntas frecuentes (2026-09-28)
- Fuente: carpeta de Drive "FOTOS PAGINA WEB" (descargada en `C:\Users\yemav\Downloads\FOTOS PAGINA WEB-20260917T215913Z-1-001`). Fotos nombradas por servicio + `PREGUNTAS FRECUENTES.docx`, logos DADIS/EPA, banner FENALCO, mascota del bono.
- Servicios: portada `public/images/servicios/{slug}.jpg` y galería `galeria/{slug}-N.jpg` (versionadas, máx. 1600 px, **sin EXIF/GPS**). `ServicioSeeder::fotosReales()` las asigna. `Uploads::url()` deja pasar rutas que empiezan por `/` (estáticas) y `Uploads::delete()` nunca las borra.
- Sin foto en la carpeta: embarcaciones y aires acondicionados. Fotos sin usar aptas para servicios del PDF aún no creados: trípode/espacio confinado, hidrante (redes de acueducto), zanja (obras civiles), termonebulización.
- 9 servicios de la pág. 05 del PDF creados **ocultos y sin textos** (`ServicioSeeder::PENDIENTES_DEL_PORTAFOLIO`, idempotente). La empresa los completa en el panel; `toggleActivo` no deja activar uno incompleto (`Servicio::estaCompleto()`), y la lista muestra "Por completar". Alquiler de equipos quedó en `obras` porque no existe la categoría "Renta de equipos".
- Preguntas frecuentes: `App\Support\PreguntasFrecuentes` (texto del .docx, solo tildes/puntuación) → sección en el inicio + JSON-LD FAQPage. "Avalados por" DADIS/EPA y "Afiliados a" FENALCO en `public/images/avales/`.

### Estado al 2026-09-28 (listo para desplegar)
- **Guía de despliegue completa: `docs/DESPLIEGUE.md`** (Resend, variables, datos iniciales, verificación, dominio). Primero en la URL `*.laravel.cloud` para que el cliente revise; el dominio se conecta después (hoy apunta al WordPress anterior).
- Decisiones: Laravel Cloud Starter (latinoamericahosting descartado: H1 sin SSH, E1 caro). `QUEUE_CONNECTION=deferred` (sin worker = sin costo extra). Resend para correo.
- Solo `alwaysclean.com.co` y `www` se indexan (`config('app.dominios_indexables')` → `Seo::dominioIndexable()`); `*.laravel.cloud` y `revision.alwaysclean.com.co` no.
- Revisión del cliente en `revision.alwaysclean.com.co` (CNAME en el cPanel), no en `*.laravel.cloud`: `laravel.cloud` está en la lista negra de URLs de Invaluement y el correo de la empresa rechaza los correos con esos enlaces (Laravel usa el host de la petición, no `APP_URL`).
- Usuarios del panel en producción: `php artisan panel:usuario correo --nombre="…"` (envía enlace para crear contraseña; `--mostrar` imprime una temporal). **No** `php artisan db:seed` a secas.
- Dirección real: Transversal 71, Calle 31I # 11, Los Alpes (`config/company.php`, con coordenadas, enlace y mapa insertable de la ficha de Google). La ficha de Google tiene dos direcciones pegadas: pendiente que la empresa la corrija.
- Tests: nunca contraseñas literales (GitGuardian las marca en el PR); generar con `Str::random`.
- Pendientes con el cliente: ver `TODO.md` §5.

### Checklist al desplegar (Laravel Cloud)
1. Variables: `APP_ENV=production`, `APP_DEBUG=false`, `TURNSTILE_SITE_KEY`/`TURNSTILE_SECRET_KEY` reales (las reales están comentadas en `.env` local; las `1x000…` son de prueba), `IP_DESDE_CLOUDFLARE=false` al inicio. `MAIL_FROM_ADDRESS` = buzón real que alguien lea (el correo pide "responda a este correo").
2. Turnstile: agregar el dominio de producción (y el `*.laravel.cloud` si se prueba ahí) en los hostnames del widget "Always Clean - PQRS" (el mismo widget se usa en `/contacto`).
3. Usuario solo-INSERT: correr `database/sql/pqrs_publico_usuario.sql` en la MySQL de Cloud (cambiar nombre de BD y contraseña) y poner `DB_PQRS_USERNAME`/`DB_PQRS_PASSWORD`. Confirmar antes que Cloud permita crear usuarios con permisos por tabla; si no, dejar vacías (funciona con la conexión normal).
4. IP real: logueado, desde el celular con datos móviles, abrir `/interno/diagnostico-ip` y comparar con https://ifconfig.me. Si `cf_connecting_ip` coincide → `IP_DESDE_CLOUDFLARE=true` y verificar que `ip_para_limites` muestre esa IP. Si viene vacío → dejar `false` y revisar `request_ip`/`x_forwarded_for` antes de decidir.
5. Dominio en Cloudflare: confirmar en la doc de Laravel Cloud si va con proxy (nube naranja) o "DNS only" (Cloud ya corre sobre la red de Cloudflare).
6. `SESSION_SECURE_COOKIE` queda en `true` solo con `APP_ENV=production` (config/session.php); no hace falta definirla.
7. Pendientes legales: la casilla de datos enlaza a `/politicas` (política integral PO-SGI-001), no a una política de tratamiento de datos Ley 1581 — falta que la empresa la tenga.
8. `APP_URL` = dominio real (https): lo usan canonical, Open Graph y sitemap.
9. Correo: verificar el dominio en Resend (registros SPF/DKIM que da Resend en el DNS), `MAIL_MAILER=resend`, `RESEND_KEY`, `MAIL_FROM_ADDRESS` en ese dominio, `NOTIFICAR_COTIZACIONES`. Probar "¿Olvidó su contraseña?" con una cuenta real.
10. Medición: definir `ANALITICA_PLAUSIBLE_DOMINIO` o `ANALITICA_GA4_ID` (uno solo).
11. Google Maps (cotizaciones): crear clave de navegador con Maps JavaScript API + Places API (New) + Maps Embed API, restringida por *HTTP referrer* al dominio de producción → `GOOGLE_MAPS_BROWSER_KEY`. Opcional `GOOGLE_MAPS_MAP_ID` (sin él usa `DEMO_MAP_ID`). Sin clave, el formulario pide la dirección en texto y el panel usa el embed público de Maps.

### Dev
- Verificar UI con captura: Chromium headless de Playwright en `~/.cache/ms-playwright/chromium_headless_shell-*/*/chrome-headless-shell` (`--no-sandbox --screenshot=… URL`).
- `public/hot` sigue desapareciendo con `npm run dev` vivo; síntoma: cambios en JSX no se ven. Recrear con `echo -n "http://127.0.0.1:5173" > public/hot`.
