$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$prepareScript = Join-Path $PSScriptRoot "prepare-standalone.ps1"
$standaloneRoot = Join-Path $projectRoot ".next\standalone"
$serverEntry = Join-Path $standaloneRoot "server.js"
$appLogPath = Join-Path $projectRoot ".lan-app.log"
$appErrorLogPath = Join-Path $projectRoot ".lan-app.err.log"
$lanIpAddress = "192.168.1.12"
$envPath = Join-Path $projectRoot ".env"

# Windows treats environment variable names as case-insensitive, but some
# launch environments provide both Path and PATH and break Start-Process.
$processPath = $env:Path
Remove-Item Env:PATH -ErrorAction SilentlyContinue
$env:Path = $processPath

if (Test-Path -LiteralPath $envPath) {
  foreach ($line in Get-Content -LiteralPath $envPath -Encoding utf8) {
    $trimmed = $line.Trim()
    if (!$trimmed -or $trimmed.StartsWith("#")) {
      continue
    }

    $separator = $trimmed.IndexOf("=")
    if ($separator -le 0) {
      continue
    }

    $name = $trimmed.Substring(0, $separator).Trim()
    $value = $trimmed.Substring($separator + 1)
    if ($name -match "^[A-Za-z_][A-Za-z0-9_]*$") {
      Set-Item -Path "Env:$name" -Value $value
    }
  }
}

if (Test-Path -LiteralPath $serverEntry) {
  & $prepareScript
}

foreach ($port in 3000, 3001) {
  $processIds = @(
    Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue |
      Select-Object -ExpandProperty OwningProcess
  )

  if ($processIds.Count -eq 0) {
    $processIds = @(
      netstat -ano -p TCP |
        Select-String "^\s*TCP\s+\S+:$port\s+\S+\s+LISTENING\s+(\d+)\s*$" |
        ForEach-Object { [int]$_.Matches[0].Groups[1].Value }
    )
  }

  foreach ($processId in $processIds | Select-Object -Unique) {
    Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
  }
}
Start-Sleep -Seconds 1

$env:PORT = "3000"
$env:HOSTNAME = "0.0.0.0"
$env:NEXT_PUBLIC_SITE_URL = "http://${lanIpAddress}:3000"
$env:TRUST_PROXY = "0"

if (Test-Path -LiteralPath $serverEntry) {
  Start-Process `
    -FilePath "D:\nvm4w\nodejs\node.exe" `
    -ArgumentList $serverEntry `
    -WorkingDirectory $projectRoot `
    -WindowStyle Hidden `
    -RedirectStandardOutput $appLogPath `
    -RedirectStandardError $appErrorLogPath
} else {
  $nextCli = Join-Path $projectRoot "node_modules\next\dist\bin\next"
  Start-Process `
    -FilePath "D:\nvm4w\nodejs\node.exe" `
    -ArgumentList $nextCli, "dev", "--hostname", "0.0.0.0", "-p", "3000" `
    -WorkingDirectory $projectRoot `
    -WindowStyle Hidden `
    -RedirectStandardOutput $appLogPath `
    -RedirectStandardError $appErrorLogPath
}

Write-Host "LAN website started at http://${lanIpAddress}:3000/"
