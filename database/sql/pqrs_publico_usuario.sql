-- Usuario MySQL para el formulario público de PQRS: solo puede INSERTAR en pqrs_casos.
-- No puede leer, modificar ni borrar casos, ni tocar ninguna otra tabla.
--
-- Correr como administrador de MySQL (root), reemplazando:
--   alwaysclean        -> nombre real de la BD
--   CAMBIAR_CONTRASENA -> contraseña larga y aleatoria (openssl rand -base64 32)
--   '%'                -> host desde donde conecta la app si se quiere restringir
--
-- Luego en el .env / variables del entorno:
--   DB_PQRS_USERNAME=alwaysclean_pqrs
--   DB_PQRS_PASSWORD=<la misma contraseña>

CREATE USER IF NOT EXISTS 'alwaysclean_pqrs'@'%' IDENTIFIED BY 'CAMBIAR_CONTRASENA';

REVOKE ALL PRIVILEGES, GRANT OPTION FROM 'alwaysclean_pqrs'@'%';
GRANT INSERT ON `alwaysclean`.`pqrs_casos` TO 'alwaysclean_pqrs'@'%';

FLUSH PRIVILEGES;

-- Verificar: debe mostrar solo USAGE global + INSERT en pqrs_casos.
SHOW GRANTS FOR 'alwaysclean_pqrs'@'%';
