# TODO — Always Clean Colombia

Última actualización: 2026-09-28. Guía de despliegue paso a paso: `docs/DESPLIEGUE.md`. Decisión de despliegue: **Laravel Cloud, plan Starter** (misma organización que `dilodepartededios.com`).

## 1. Seguridad — formulario PQRS (público, `POST /pqrs`)

Hoy no tiene throttle, captcha ni honeypot, y envía un correo desde el dominio a la dirección que escribe quien lo llena (riesgo de relé de spam/phishing y de llenar la BD de basura).

- [x] **Rate limit** en `POST /pqrs`: por IP (~5/hora) y por email (~3/día). `RateLimiter::for()` + `->middleware('throttle:...')`.
- [x] **Cloudflare Turnstile** (gratis) — código listo, se activa solo al poner las llaves: crear el sitio en Cloudflare, guardar `TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY` en `.env`, verificar el token en servidor. *Necesita las llaves del usuario.*
- [x] **Honeypot + tiempo mínimo de llenado** (o `spatie/laravel-honeypot`).
- [x] **Correo sin texto libre del usuario**: en `resources/views/emails/pqrs/recibido.blade.php` quitar `descripcion` y `nombre`; dejar solo número de caso, tipo y mensaje fijo (evita enlaces de phishing con la marca).
- [x] **Validar email más estricto** en `PqrsController@store`: `email:rfc,dns`.
- [x] **Deduplicar** (se devuelve el caso existente, sin fila ni correo nuevos): mismo email + misma descripción en 24 h → guardar pero no reenviar correo.
- [x] **Checkbox de consentimiento** de tratamiento de datos (Ley 1581 / Habeas Data), enlazado a `/politicas`. Guardar fecha/aceptación.
- [x] **Botón del correo** (quitado; el seguimiento es por correo): dice "Ver estado de PQRS" pero enlaza a `/pqrs`, que no muestra estados. Cambiar o quitar.
- [ ] **Texto legal de datos personales**: el checkbox enlaza a `/politicas`, que es la política integral (PO-SGI-001), no una política de tratamiento de datos (Ley 1581). Falta redactarla/publicarla y apuntar el enlace ahí.
- [~] **Correo real en producción**: código listo con Resend (`MAIL_MAILER=resend`). Falta crear la cuenta, verificar el dominio (DKIM/SPF/DMARC) y poner `RESEND_KEY` — pasos en `docs/DESPLIEGUE.md`.

## 2. Seguridad — BD y panel interno

- [x] **Conexión `pqrs_publico`** para el formulario: el guardado público solo hace INSERT (duplicados en caché, número de caso sin consultar, correo en cola sin el modelo). Código listo.
- [ ] **Crear el usuario MySQL** con `database/sql/pqrs_publico_usuario.sql` (local y en Laravel Cloud) y poner `DB_PQRS_USERNAME` / `DB_PQRS_PASSWORD`. Confirmar que Laravel Cloud deja crear usuarios con permisos por tabla.

- [x] **Rate limit al login** del panel: 5 fallos por correo+IP → bloqueo 15 min (`SessionController`) + `throttle:login` 20/min por IP.
- [x] **Encabezados de seguridad** (`EncabezadosSeguridad`): X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy, HSTS en producción, `noindex` en `/interno`.
- [x] **Rutas del panel ocultas** a visitantes (Ziggy grupo `publico`).
- [ ] **Content-Security-Policy**: empezar en modo `Report-Only` (Maps, Turnstile, Fonts, Unsplash, estilos en línea).
- [ ] **Paginar el panel de PQRS**: `Interno\PqrsController@index` hace `PqrsCaso::orderByDesc('created_at')->get()` de todo.
- [~] **Cifrar `documento` y `telefono`** con cast `'encrypted'` en `PqrsCaso` + migración/comando que cifre las filas existentes. Ojo: no se podrá buscar por esos campos; **guardar `APP_KEY` en un gestor de contraseñas** (perderla = perder esos datos). — *Descartado por ahora (decisión 2026-09-23).*
- [~] **Política de retención**: borrar/anonimizar casos cerrados tras un plazo (definir cuánto) — Ley 1581. — *Descartado por ahora (decisión 2026-09-23).*
- [ ] **Backups de BD**: confirmar qué ofrece MySQL de Laravel Cloud y **probar una restauración**.
- [~] **Contraseñas fuertes** hechas (10+, letras y números, filtradas rechazadas en producción; recuperación y cambio por correo). Falta 2FA.
- [x] **Usuarios en producción**: `php artisan panel:usuario correo --nombre=…` (no correr `DatabaseSeeder`: trae contraseña conocida y datos de ejemplo).
- [ ] **`APP_DEBUG=false`** y `APP_ENV=production` en Cloud.
- [ ] **MySQL local solo en loopback** (dev, WSL): `echo 'bind-address = 127.0.0.1' | sudo tee -a /etc/mysql/conf.d/alwaysclean.cnf && sudo systemctl restart mysql`. Verificar con `ss -ltn | grep 3307` (debe decir `127.0.0.1:3307`, no `*:3307`).
- [ ] Opcional: `'serializable_classes' => false` en `config/cache.php` (no se cachean objetos) y `serialization => json` en `config/session.php` (cierra sesiones activas una vez).

## 3. Despliegue en Laravel Cloud

- [ ] Crear app y entorno desde GitHub; plan **Starter** (primer mes gratis). Poner **límite de gasto** con alertas al 50 % y 80 % (es a nivel de organización, compartido con `dilodepartededios.com`; el compute NO se comparte, solo la facturación).
- [ ] Región **US East (Virginia)**.
- [ ] Crear **MySQL** y adjuntarlo al entorno (Cloud inyecta `DB_*`); migrar y sembrar (`ServicioSeeder`, `ProductoSeeder`).
- [ ] Crear **bucket** (Object Storage), adjuntarlo, dejarlo público (lectura) y poner `UPLOADS_DISK=s3` (usar el nombre real del disk que asigne Cloud).
- [ ] Cola: reemplazar `queue:listen` por cola/worker administrado de Cloud (los correos PQRS van por cola).
- [ ] Caché/sesión: `database` alcanza en Starter; valorar Valkey si hace falta.
- [ ] Desactivar **scale-to-zero** si no se quiere la espera de ~500 ms en la primera visita.
- [ ] Dominio propio + Cloudflare delante (CDN, DDoS, Turnstile). Revisar en la doc de Laravel Cloud si el dominio en Cloudflare debe ir con proxy (nube naranja) o "DNS only" — Cloud ya pasa por la red de Cloudflare.
- [ ] **IP real del visitante** (los límites del PQRS van por IP): tras desplegar, entrar logueado a `/interno/diagnostico-ip` desde el celular con datos móviles.
  - Si `cf_connecting_ip` = la IP pública del celular (comparar con https://ifconfig.me) → poner `IP_DESDE_CLOUDFLARE=true` y volver a abrir: `ip_para_limites` debe ser esa IP.
  - Si `cf_connecting_ip` viene vacío → dejar `false` y revisar qué trae `request_ip` / `x_forwarded_for`. Ojo: en Cloud Laravel confía en todos los proxies, así que `request_ip` sale de X-Forwarded-For y un bot podría falsearlo.
- [ ] Producción: `APP_DEBUG=false`, `APP_ENV=production`. Llaves reales de Turnstile y `DB_PQRS_*` en las variables del entorno.
- [ ] Verificar que `npm run build` corre limpio en el build de Cloud.
- [ ] Alternativa evaluada y descartada por ahora: Hostinger VPS KVM 2 (~COP 51.000/mes tras promo) + Forge/Ploi + Cloudflare R2. Más barato, pero un solo servidor y más mantenimiento.

## 4. Código / calidad

- [~] **Tests**: 71 (PQRS, cotizaciones, login, correos, SEO, servicios). Falta subida de imagen.
- [ ] Probar a mano tras el upgrade a L13 (no se hizo): login real, subir imagen desde el panel, enviar un PQRS completo.
- [x] Servicios del PDF creados **ocultos** sin textos (la empresa los completa en el panel).
- [ ] Confirmar autorización para mostrar logos de clientes en el carrusel.
- [x] `PqrsCaso::creating`: número de caso ahora aleatorio (`PQRS-XXXXXX`); antes usaba `max('id') + 3101` (posible colisión con envíos simultáneos; `caso` es `unique` y fallaría). Valorar secuencia segura.

## 5. Pendientes con el cliente (revisión tras el despliegue)

- [ ] Textos (resumen, descripción, qué incluye, sectores) de los 9 servicios ocultos del portafolio; confirmar fotos asignadas a impermeabilización y pozos sépticos.
- [ ] ¿Categoría propia "Renta de equipos"? Hoy el alquiler quedó en "obras".
- [ ] Catálogo real de productos: el sitio muestra Biograsa Plus / Drenex Bio / Sanitred; en Drive hay flyers NCH (DC Super Drain, DA Urinal Power).
- [ ] Fotos de embarcaciones y aires acondicionados (no están en Drive).
- [ ] Política de tratamiento de datos (Ley 1581) para enlazar desde PQRS.
- [ ] Google Business Profile: dejar una sola dirección (hoy Bosque y Alpes pegadas); categoría "Servicio de limpieza". ¿Bosque es segunda sede? Código postal de Los Alpes.
- [ ] Proveedor de medición (Plausible o GA4). ¿Distintivo "5,0 ★ en Google · 12 reseñas"?
- [ ] Correos para `NOTIFICAR_COTIZACIONES` y `MAIL_FROM_ADDRESS`.
