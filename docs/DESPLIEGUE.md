# Despliegue en Laravel Cloud

Guía para publicar el sitio. Orden recomendado: **primero en la URL de prueba de Laravel Cloud (`*.laravel.cloud`) para que el cliente revise**, y solo cuando lo apruebe, conectar el dominio `alwaysclean.com.co`.

> No cambie los registros A/CNAME del dominio antes de la aprobación: hoy el dominio apunta al sitio anterior y dejaría de verse.

## 1. Resend (correo)

Se puede hacer antes que el despliegue; no afecta el sitio ni el correo actuales.

1. Crear cuenta en <https://resend.com>.
2. **Domains → Add domain** → `alwaysclean.com.co`. Región: la más cercana disponible (EE. UU. Este).
3. Resend muestra 3–4 registros DNS (un TXT de DKIM `resend._domainkey`, y un MX y un TXT de SPF en el subdominio `send`). Agregarlos **tal cual** en el administrador de DNS del dominio (donde esté alojado hoy: cPanel → *Zone Editor* o el proveedor del dominio).
   - Son registros nuevos en subdominios propios de Resend: **no tocan** el MX principal, así que el correo actual de la empresa sigue funcionando.
   - Recomendado además: un TXT `_dmarc` con `v=DMARC1; p=none;` si el dominio no tiene uno.
4. Esperar a que Resend marque el dominio como **Verified** (minutos a pocas horas).
5. **API Keys → Create API key** con permiso *Sending access* y solo para ese dominio → copiar en `RESEND_KEY`.
6. Definir quién recibe los avisos de cotizaciones nuevas (`NOTIFICAR_COTIZACIONES`) y desde qué dirección salen (`MAIL_FROM_ADDRESS`, debe ser del dominio verificado).

## 2. Crear la aplicación en Laravel Cloud

1. Nueva aplicación desde el repositorio de GitHub, rama `main`. Región **US East (Virginia)**, plan **Starter**.
2. Adjuntar al entorno:
   - **Base de datos MySQL** (Cloud inyecta las variables `DB_*`).
   - **Bucket** (Object Storage) con lectura pública, para las fotos que se suban desde el panel. Anotar el nombre del disco que asigna Cloud.
3. **Build** (normalmente ya viene así): `composer install --no-dev --optimize-autoloader` y `npm ci && npm run build`.
4. **Deploy**: `php artisan migrate --force`.
5. No hace falta worker de colas ni scheduler (ver `QUEUE_CONNECTION=deferred`).
6. Límite de gasto con alertas al 50 % y 80 %.

## 3. Variables de entorno

| Variable | Valor |
| --- | --- |
| `APP_NAME` | `"Always Clean Colombia"` |
| `APP_ENV` | `production` |
| `APP_DEBUG` | `false` |
| `APP_KEY` | la genera Cloud (o `php artisan key:generate --show`) |
| `APP_URL` | la URL `https://….laravel.cloud` mientras se revisa; luego `https://alwaysclean.com.co`. Los correos y el SEO usan este valor. |
| `APP_LOCALE` / `APP_FAKER_LOCALE` | `es` / `es_CO` |
| `QUEUE_CONNECTION` | `deferred` |
| `MAIL_MAILER` | `resend` |
| `RESEND_KEY` | la API key de Resend |
| `MAIL_FROM_ADDRESS` | p. ej. `notificaciones@alwaysclean.com.co` |
| `MAIL_FROM_NAME` | `"Always Clean Colombia"` |
| `NOTIFICAR_COTIZACIONES` | correos separados por coma, p. ej. `comercial@alwaysclean.com.co` |
| `UPLOADS_DISK` | nombre del disco del bucket de Cloud |
| `TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY` | las reales (no las de prueba `1x000…`) |
| `IP_DESDE_CLOUDFLARE` | `false` (ver paso 5) |
| `GOOGLE_MAPS_BROWSER_KEY` | opcional; sin ella la dirección del formulario es texto libre |
| `ANALITICA_PLAUSIBLE_DOMINIO` o `ANALITICA_GA4_ID` | opcional, uno solo |
| `DB_PQRS_USERNAME` / `DB_PQRS_PASSWORD` | vacías salvo que Cloud permita usuarios por tabla |

## 4. Primer despliegue: datos iniciales

Desde la consola de comandos de Cloud, **una sola vez**:

```bash
php artisan db:seed --class=ServicioSeeder --force
php artisan db:seed --class=ProductoSeeder --force
php artisan panel:usuario comercial@alwaysclean.com.co --nombre="Nombre Apellido"
```

- **No** correr `php artisan db:seed` a secas: `DatabaseSeeder` crea un usuario con contraseña conocida y cotizaciones de ejemplo.
- `panel:usuario` envía por correo el enlace para crear la contraseña (requiere Resend listo). Si el correo aún no funciona: agregar `--mostrar` y cambiar la contraseña temporal en *Mi cuenta*.
- Los 9 servicios del portafolio sin textos quedan **ocultos** hasta que se completen en el panel.

## 5. Verificación en la URL de prueba

- [ ] Inicio, servicios (fichas con fotos), productos (pedido → WhatsApp), nosotros, políticas, contacto (mapa), PQRS.
- [ ] Enviar una cotización de prueba: llega el aviso a `NOTIFICAR_COTIZACIONES` y aparece en el panel.
- [ ] Radicar un PQRS de prueba: llega el correo de confirmación.
- [ ] Panel: login, "¿Olvidó su contraseña?" (llega el correo), Mi cuenta, crear cotización, subir una foto de servicio (queda en el bucket).
- [ ] `/interno/diagnostico-ip` desde el celular con datos móviles: `ip_para_limites` debe ser la IP pública del celular (comparar con <https://ifconfig.me>). Si coincide `cf_connecting_ip`, poner `IP_DESDE_CLOUDFLARE=true`.
- [ ] `/robots.txt` en la URL de prueba dice `Disallow: /` (el dominio `*.laravel.cloud` nunca se indexa).
- [ ] Borrar las cotizaciones y PQRS de prueba desde el panel o la base de datos.

## 6. Conectar el dominio (después de la aprobación)

1. Cloud → *Domains* → agregar `alwaysclean.com.co` y `www`, seguir los registros DNS que indique.
2. Cambiar `APP_URL=https://alwaysclean.com.co` y redesplegar.
3. Turnstile: agregar el dominio en los hostnames del widget. Google Maps: agregarlo en las restricciones de la clave.
4. Revisar `/robots.txt` (ya debe listar el `Sitemap`) y enviar `https://alwaysclean.com.co/sitemap.xml` en Google Search Console.
5. Google Business Profile: dejar una sola dirección (hoy tiene dos pegadas) y poner el sitio web.
