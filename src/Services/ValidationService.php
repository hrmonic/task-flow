<?php

declare(strict_types=1);

namespace App\Services;

use App\Exceptions\ValidationException;

final class ValidationService
{
    public static function requiredString(array $input, string $field, int $min = 1, int $max = 255): string
    {
        $value = trim((string) ($input[$field] ?? ''));
        $length = mb_strlen($value);
        if ($length < $min || $length > $max) {
            throw new ValidationException(sprintf('Invalid %s length', $field));
        }
        return $value;
    }

    public static function email(array $input, string $field): string
    {
        $value = trim((string) ($input[$field] ?? ''));
        if (!filter_var($value, FILTER_VALIDATE_EMAIL)) {
            throw new ValidationException('Invalid email');
        }
        return $value;
    }
}
