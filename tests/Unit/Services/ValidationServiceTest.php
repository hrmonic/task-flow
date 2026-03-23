<?php

declare(strict_types=1);

use App\Services\ValidationService;
use PHPUnit\Framework\TestCase;

final class ValidationServiceTest extends TestCase
{
    public function testRequiredString(): void
    {
        $value = ValidationService::requiredString(['name' => 'TaskFlow'], 'name');
        self::assertSame('TaskFlow', $value);
    }
}
