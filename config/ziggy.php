<?php

return [
    /*
     * Visitantes sin sesión solo reciben los nombres de las rutas públicas en el
     * HTML (@routes en app.blade.php). Las del panel se entregan tras iniciar
     * sesión; por eso login y logout recargan la página completa.
     */
    'groups' => [
        'publico' => [
            'home',
            'servicios.*',
            'productos.*',
            'nosotros.*',
            'politicas.*',
            'contacto.*',
            'pqrs.*',
            'login',
            'interno.login.store',
            'interno.password.*',
        ],
    ],
];
