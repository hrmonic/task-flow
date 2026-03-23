Set-Location $PSScriptRoot
$port = 8080
Write-Host ""
Write-Host "TaskFlow -> http://127.0.0.1:$port/" -ForegroundColor Cyan
Write-Host "Stop: Ctrl+C" -ForegroundColor DarkGray
Write-Host ""
php -S "127.0.0.1:$port" -t public public/router.php
