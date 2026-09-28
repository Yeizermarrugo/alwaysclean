<?php

namespace App\Support;

/**
 * Preguntas frecuentes. Texto del documento "PREGUNTAS FRECUENTES.docx" de la
 * carpeta de Drive de la empresa; solo se corrigieron tildes, mayúsculas y
 * puntuación. Se muestran en el inicio y van como FAQPage en los datos
 * estructurados para Google.
 */
class PreguntasFrecuentes
{
    public const LISTA = [
        [
            'pregunta' => '¿Los servicios se prestan a domicilio?',
            'respuesta' => 'Sí, todos nuestros servicios se prestan a domicilio: llegamos a donde usted nos indique con todos los equipos y herramientas. La excepción es el lavado en seco de alfombras y cortinas, para el cual se requieren varios días.',
        ],
        [
            'pregunta' => '¿La empresa está avalada por entidades de control en salud y ambiente?',
            'respuesta' => 'Sí, estamos avalados por el Departamento Administrativo Distrital de Salud (DADIS) y por el Establecimiento Público Ambiental (EPA).',
        ],
        [
            'pregunta' => '¿La empresa expide certificados sanitarios de los servicios prestados?',
            'respuesta' => 'Sí, de todos los servicios que prestamos expedimos certificados sanitarios e informes técnicos.',
        ],
        [
            'pregunta' => '¿Los trabajadores están afiliados al sistema de seguridad social?',
            'respuesta' => 'Sí, todos nuestros trabajadores están afiliados al sistema de seguridad social y cuentan con certificación para trabajo en alturas y espacios confinados.',
        ],
        [
            'pregunta' => '¿Aceptan pagos por transferencia?',
            'respuesta' => 'Sí, aceptamos pagos por transferencia (Bancolombia, Nequi, Mercado Pago, Daviplata) y tarjetas de crédito.',
        ],
    ];

    /** schema.org FAQPage para los resultados de Google. */
    public static function datosEstructurados(): array
    {
        return [
            '@context' => 'https://schema.org',
            '@type' => 'FAQPage',
            'mainEntity' => array_map(fn ($p) => [
                '@type' => 'Question',
                'name' => $p['pregunta'],
                'acceptedAnswer' => ['@type' => 'Answer', 'text' => $p['respuesta']],
            ], self::LISTA),
        ];
    }
}
