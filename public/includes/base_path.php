<?php

declare(strict_types=1);

function taskflow_public_base_path(): string
{
    $docRoot = realpath($_SERVER['DOCUMENT_ROOT'] ?? '');
    $scriptFile = realpath($_SERVER['SCRIPT_FILENAME'] ?? '');

    if ($docRoot !== false && $scriptFile !== false) {
        $d = str_replace('\\', '/', $docRoot);
        $s = str_replace('\\', '/', $scriptFile);
        $dLower = strtolower($d);
        $sLower = strtolower($s);
        if (str_starts_with($sLower, $dLower)) {
            $rel = substr($s, strlen($d));
            $rel = str_replace('\\', '/', $rel);
            $dir = dirname($rel);
            if ($dir === '/' || $dir === '\\' || $dir === '.') {
                return '';
            }

            return rtrim($dir, '/');
        }
    }

    $scriptName = str_replace('\\', '/', $_SERVER['SCRIPT_NAME'] ?? '/index.php');
    $base = rtrim(dirname($scriptName), '/');
    if ($base === '' || $base === '.' || $base === '/') {
        return '';
    }

    return $base;
}
