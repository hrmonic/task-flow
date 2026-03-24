<?php

declare(strict_types=1);

namespace App\Services;

final class InvitationMailerService
{
    public function sendInvitation(string $toEmail, string $toName, string $inviterName, string $boardName): bool
    {
        $enabled = ($_ENV['MAIL_ENABLED'] ?? '1') === '1';
        if (!$enabled) {
            return false;
        }

        $subject = 'Invitation TaskFlow : ' . $boardName;
        $safeToName = trim($toName) !== '' ? $toName : 'utilisateur';
        $body = "Bonjour {$safeToName},\n\n"
            . "{$inviterName} vous a invité à collaborer sur le tableau \"{$boardName}\" dans TaskFlow.\n"
            . "Connectez-vous à l'application pour accepter ou refuser l'invitation.\n\n"
            . "— TaskFlow";

        $from = trim((string) ($_ENV['MAIL_FROM'] ?? 'no-reply@taskflow.local'));
        $headers = [
            'MIME-Version: 1.0',
            'Content-Type: text/plain; charset=UTF-8',
            'From: ' . $from,
        ];

        return @mail($toEmail, $subject, $body, implode("\r\n", $headers));
    }
}
