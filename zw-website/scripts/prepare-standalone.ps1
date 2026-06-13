$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$standaloneRoot = Join-Path $projectRoot ".next\standalone"
$serverEntry = Join-Path $standaloneRoot "server.js"

if (-not (Test-Path -LiteralPath $serverEntry)) {
  throw "Standalone build not found. Run 'npm run build' first."
}

$staticSource = Join-Path $projectRoot ".next\static"
$staticDestination = Join-Path $standaloneRoot ".next\static"
$publicSource = Join-Path $projectRoot "public"
$publicDestination = Join-Path $standaloneRoot "public"

New-Item -ItemType Directory -Path $staticDestination -Force | Out-Null
New-Item -ItemType Directory -Path $publicDestination -Force | Out-Null

Copy-Item -Path (Join-Path $staticSource "*") -Destination $staticDestination -Recurse -Force
Copy-Item -Path (Join-Path $publicSource "*") -Destination $publicDestination -Recurse -Force

