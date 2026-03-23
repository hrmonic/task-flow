<?php

declare(strict_types=1);

use App\Services\JwtService;
use PHPUnit\Framework\TestCase;

final class JwtServiceSecretTest extends TestCase
{
    protected function tearDown(): void
    {
        unset($_ENV['APP_ENV'], $_ENV['JWT_SECRET']);
        parent::tearDown();
    }

    public function testRejectsDefaultSecretWhenProd(): void
    {
        $_ENV['APP_ENV'] = 'prod';
        $_ENV['JWT_SECRET'] = 'change-me';

        $this->expectException(RuntimeException::class);
        $this->expectExceptionMessage('JWT_SECRET must be set');

        (new JwtService())->createAccessToken('00000000-0000-4000-8000-000000000001');
    }

    public function testAllowsDefaultSecretInDev(): void
    {
        $_ENV['APP_ENV'] = 'dev';
        $_ENV['JWT_SECRET'] = 'change-me';

        $token = (new JwtService())->createAccessToken('00000000-0000-4000-8000-000000000001');
        self::assertNotSame('', $token);
        self::assertStringContainsString('.', $token);
    }
}
