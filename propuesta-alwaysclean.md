# Propuesta: alwaysclean.com.co desde cero (Laravel) + Catálogo E-commerce

## Contexto

Sitio actual es informativo (WordPress + Elementor + Astra), con WooCommerce ya instalado pero sin uso real de venta — las "tarjetas de producto" en Servicios y Productos Especializados funcionan como catálogo visual, no como tienda funcional. Cliente pide **construir todo desde cero** (no reusar WordPress) y un apartado nuevo de **Catálogo** con venta online real (checkout + pasarela de pago), catálogo inicial de 20–100 productos.

Decisión del cliente: stack custom en **Laravel**, desplegado en **Laravel Cloud**, siguiendo el mismo modelo que ya usa en dilodepartededios.com (pagar prácticamente solo el consumo de base de datos, gracias al scale-to-zero).

Stack actual (referencia, se reemplaza por completo):
- WordPress + WooCommerce 11.0.0, Elementor 4.2.2, Astra 4.11.12, PHP 7.4.33 (EOL), MySQL, LiteSpeed

Tráfico (ver análisis previo): 100% Colombia, volumen moderado/regional.

## Recomendación de stack: Laravel + Laravel Cloud

**Backend/Frontend: Laravel + Inertia + React (mismo stack que dilodepartededios.com).**

Razones:
- Consistencia con el otro proyecto del cliente → reuso de conocimiento/componentes, menos fricción, menos stacks distintos que mantener
- Inertia evita construir API REST/GraphQL separada — Laravel sirve las páginas React directo, sin duplicar lógica de auth/validación en dos lados
- React da UI rica (carrito, filtros, checkout dinámico) con componentes reusables
- **Filament** (admin panel para Laravel) para el backoffice del catálogo: CRUD de productos, categorías, pedidos, inventario — evita construir un admin desde cero, ahorra semanas de dev
- Control total del código (a diferencia de WooCommerce, sin dependencia de plugins de terceros ni actualizaciones que rompen el sitio)

Se descartó Next.js+Vercel+Supabase (evaluado y rechazado): Vercel Hobby prohíbe uso comercial por ToS (requeriría Pro $20/mes), Supabase free pausa el proyecto tras 1 semana sin actividad (inaceptable para checkout en producción, requeriría Pro $25/mes) → combo terminaría costando más ($45+/mes en 2 servicios separados) que Laravel Cloud Starter ($5+uso, todo integrado), y sumaría un tercer stack distinto a los que ya maneja el cliente.

Catálogo/checkout: modelo de datos custom (productos, variaciones, carrito, pedidos) + integración directa contra la API REST de **Wompi** (pasarela colombiana, checkout widget o link de pago, o integración server-side con webhook de confirmación).

### Infraestructura: Laravel Cloud (confirmado vía laravel.com/cloud/pricing)

- **Plan**: Starter ($5/mes + uso, primer mes gratis, incluye $5 créditos de uso mensuales) es suficiente para arrancar. Si el tráfico crece o se necesita autoscaling/preview environments, subir a Growth ($20/mes + uso).
- **Compute**: Flex, con **scale-to-zero** — la app "duerme" sin tráfico y no cobra compute en ese tiempo, despierta en <500ms. Esto es lo que permite el modelo "pago casi solo por DB" que el cliente ya usa en dilodepartededios.com.
- **Base de datos**: Postgres Serverless administrado por Laravel Cloud (no MySQL) — también con scale-to-zero (sleep configurable, ej. tras 300 min de inactividad). Se paga por uso real de compute+storage, no tarifa fija.
- **Cache/Queue**: Valkey (Redis-compatible) y colas administradas incluidas si se necesitan (ej. procesar pedidos, notificaciones, envío de emails de confirmación) — mismo pool de créditos.
- **CDN/DDoS**: red edge, CDN y protección DDoS incluidos en todos los planes, sin configuración extra.
- **Sin cluster/Kubernetes propio** — Laravel Cloud abstrae eso, no hay servidores que administrar manualmente.
- **Dominios**: hasta 10 dominios custom en Starter.

Esto reemplaza por completo la necesidad de VPS, LiteSpeed, hosting tradicional — todo corre gestionado en Laravel Cloud.

- **Pasarela de pago**: Wompi (API REST directa o checkout widget), fee ~2.65-3%+IVA por transacción — costo variable normal de cualquier pasarela, no depende del stack.
- **Seguridad**: Laravel maneja CSRF, hashing, validación out-of-the-box; checkout tokenizado vía Wompi (no se almacenan datos de tarjeta en el servidor propio, evita alcance PCI-DSS completo); SSL/dominios gestionados por Laravel Cloud.

## Fases de trabajo

### 1. Descubrimiento y requerimientos (~1 semana)
- Reunión con cliente: alcance final catálogo, lista real de 20-100 productos (nombre, precio, fotos, variaciones si aplica — ej. presentaciones/tamaños de químicos)
- Definir método de envío/entrega (¿solo Bogotá/nacional? ¿recogida en punto? ¿tarifa fija o por zona?)
- Definir política de facturación (¿factura electrónica DIAN vía plugin, o manual?)
- Confirmar pasarela de pago a usar y cuenta comercial del cliente ya activa o por crear

### 2. Diseño UX/UI (~1.5-2 semanas)
- Wireframes de página principal, servicios, y nuevo flujo de Catálogo (listado, ficha producto, carrito, checkout)
- Mockups en Figma, identidad visual (reusar/mejorar paleta y logo actual)
- Reestructurar menú: separar claramente "Servicios" (informativo) de "Catálogo" (venta), submenús actuales de Servicios/Productos Especializados pasan a ser categorías reales dentro de sus secciones
- Ronda de aprobación con cliente

### 3. Setup y arquitectura (~3-5 días)
- Proyecto Laravel nuevo, repo, entornos (local + Laravel Cloud staging/producción)
- Modelado de datos: productos, variaciones, categorías, carrito, pedidos, usuarios/clientes
- Instalar y configurar Filament (admin panel) sobre el mismo proyecto

### 4. Desarrollo — sitio informativo (~2-3 semanas)
- Maquetación React (Inertia)+Tailwind de Inicio, Quienes Somos, Servicios (con sus categorías), Contacto, PQRS
- Formularios de contacto/PQRS, integración WhatsApp
- SEO (meta tags, sitemap, OpenGraph — equivalente a lo que hacía Yoast, pero manual/paquete Laravel SEO)

### 5. Desarrollo — Catálogo/E-commerce (~4-6 semanas)
- CRUD productos/categorías/variaciones vía Filament (backoffice cliente)
- Listado de catálogo, ficha de producto, carrito (React+Inertia), checkout
- Integración Wompi: creación de transacción, webhook de confirmación, estados de pedido
- Notificaciones (email confirmación pedido — vía cola/queue de Laravel Cloud)
- Gestión básica de inventario/stock

### 6. QA y pruebas (~1.5 semana)
- Cross-browser/mobile
- Flujo completo de compra (carrito → checkout → pago Wompi sandbox → webhook → confirmación)
- Pruebas de carga básicas, seguridad (CSRF, validación, XSS/SQLi — Laravel lo cubre por defecto pero se verifica)

### 7. Lanzamiento y entrega (~3-5 días)
- Deploy a producción en Laravel Cloud, dominio, SSL
- Capacitación al cliente: cargar productos en Filament, gestionar pedidos
- Documentación básica de administración

**Tiempo total estimado: 10-13 semanas** (más que la opción de reusar WordPress, por ser construcción 100% custom sin plugins pre-armados — a cambio: cero dependencia de terceros, mejor performance, costo de hosting menor a largo plazo)

## Estimado de costo (referencia, ajustar según tarifa/hora propia)

Desglose por fase, en horas de trabajo (dev + diseño), para multiplicar por tarifa/hora del ejecutor:

| Fase | Horas aprox |
|---|---|
| Descubrimiento/requerimientos | 8-12 h |
| Diseño UX/UI | 30-40 h |
| Setup y arquitectura | 12-16 h |
| Desarrollo sitio informativo | 40-60 h |
| Desarrollo catálogo/e-commerce | 90-130 h |
| QA/pruebas | 20-25 h |
| Lanzamiento/capacitación | 8-10 h |
| **Total** | **~210-295 h** |

Costos externos recurrentes a presupuestar aparte (no son horas de desarrollo):
- **Laravel Cloud**: desde $5/mes (Starter, primer mes gratis) + consumo real de compute/DB/storage. Con scale-to-zero, un sitio de este tráfico probablemente se mantiene cerca del plan base la mayoría de meses — mismo modelo que dilodepartededios.com. Si crece el tráfico o se necesita autoscaling, Growth a $20/mes + uso.
- Dominio (si no lo tienen ya): ~USD 12-15/año
- Fee transacción Wompi: ~2.65%-3%+IVA por venta, cobrado por transacción
- Paquetes de pago opcionales (ej. Filament ya es gratis/MIT, no hay licencias que pagar en este stack)

## Verificación antes de presentar propuesta al cliente

- Confirmar con cliente: método de envío/entrega real de productos físicos (afecta modelo de datos de pedidos/checkout)
- Confirmar si necesita facturación electrónica DIAN integrada o factura manual aparte
- Validar que el cliente ya tenga o pueda abrir cuenta comercial en Wompi (requiere aprobación de comercio)
- Revisar catálogo real de productos antes de cerrar horas de "Desarrollo" (20 vs 100 productos con variaciones cambia el estimado)
