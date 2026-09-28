<?php

// Correos internos que reciben avisos. No va en config/company.php porque ese
// archivo se comparte completo con el frontend (prop "empresa").
$lista = fn (?string $valor) => array_values(array_filter(array_map('trim', explode(',', (string) $valor))));

return [
    // Nueva cotización desde el sitio: separadas por coma.
    'cotizaciones' => $lista(env('NOTIFICAR_COTIZACIONES')),
];
