$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$prepareScript = Join-Path $PSScriptRoot "prepare-standalone.ps1"
$standaloneRoot = Join-Path $projectRoot ".next\standalone"
$serverEntry = Join-Path $standaloneRoot "server.js"
$certificateScript = Join-Path $PSScriptRoot "generate-lan-certificate.ps1"
$proxyScript = Join-Path $PSScriptRoot "https-proxy.mjs"
$certificatePath = Join-Path $projectRoot "certs\lan.pfx"
$appLogPath = Join-Path $projectRoot ".lan-app.log"
$appErrorLogPath = Join-Path $projectRoot ".lan-app.err.log"
$proxyLogPath = Join-Path $projectRoot ".lan-https.log"
$proxyErrorLogPath = Join-Path $projectRoot ".lan-https.err.log"
$lanIpAddress = "192.168.1.44"
$certificatePassword = "zw-lan-https"

# Windows treats environment variable names as case-insensitive, but some
# launch environments provide both Path and PATH and break Start-Process.
$processPath = $env:Path
Remove-Item Env:PATH -ErrorAction SilentlyContinue
$env:Path = $processPath

if (Test-Path -LiteralPath $serverEntry) {
  & $prepareScript
}
& $certificateScript `
  -IpAddress $lanIpAddress `
  -OutputDirectory (Join-Path $projectRoot "certs") `
  -Password $certificatePassword

foreach ($port in 3000, 3001) {
  $existing = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue |
    Select-Object -First 1
  if ($existing) {
    Stop-Process -Id $existing.OwningProcess -Force
  }
}
Start-Sleep -Seconds 1

$env:PORT = "3001"
$env:HOSTNAME = "0.0.0.0"
$env:NEXT_PUBLIC_SITE_URL = "https://${lanIpAddress}:3000"
$env:TRUST_PROXY = "1"

if (Test-Path -LiteralPath $serverEntry) {
  Start-Process `
    -FilePath "D:\nvm4w\nodejs\node.exe" `
    -ArgumentList "server.js" `
    -WorkingDirectory $standaloneRoot `
    -WindowStyle Hidden `
    -RedirectStandardOutput $appLogPath `
    -RedirectStandardError $appErrorLogPath
} else {
  $nextCli = Join-Path $projectRoot "node_modules\next\dist\bin\next"
  Start-Process `
    -FilePath "D:\nvm4w\nodejs\node.exe" `
    -ArgumentList $nextCli, "dev", "--hostname", "0.0.0.0", "-p", "3001" `
    -WorkingDirectory $projectRoot `
    -WindowStyle Hidden `
    -RedirectStandardOutput $appLogPath `
    -RedirectStandardError $appErrorLogPath
}

$env:HTTPS_HOST = "0.0.0.0"
$env:HTTPS_PORT = "3000"
$env:APP_HOST = "127.0.0.1"
$env:APP_PORT = "3001"
$env:HTTPS_PFX_PATH = $certificatePath
$env:HTTPS_PFX_PASSWORD = $certificatePassword

Start-Process `
  -FilePath "D:\nvm4w\nodejs\node.exe" `
  -ArgumentList $proxyScript `
  -WorkingDirectory $projectRoot `
  -WindowStyle Hidden `
  -RedirectStandardOutput $proxyLogPath `
  -RedirectStandardError $proxyErrorLogPath

Write-Host "LAN website started at https://${lanIpAddress}:3000/"
