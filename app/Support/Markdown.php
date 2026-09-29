<?php

namespace App\Support;

/**
 * Texto escrito por visitantes dentro de correos Markdown.
 *
 * `{{ }}` escapa HTML pero no Markdown: "[Pague aquí](https://…)" en el nombre
 * de la empresa se convertiría en un enlace real dentro de un correo con
 * nuestra marca. Aquí se escapan los caracteres con significado en Markdown.
 */
class Markdown
{
    public static function texto(?string $valor): string
    {
        $valor = str_replace(["\r\n", "\r"], "\n", (string) $valor);

        return addcslashes($valor, '\\`*_{}[]()<>#+-.!|~');
    }
}
