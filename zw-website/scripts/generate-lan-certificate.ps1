param(
  [string]$IpAddress = "192.168.1.12",
  [string]$OutputDirectory,
  [string]$Password = "zw-lan-https"
)

$ErrorActionPreference = "Stop"

if (-not $OutputDirectory) {
  $OutputDirectory = Join-Path (Split-Path -Parent $PSScriptRoot) "certs"
}

$pfxPath = Join-Path $OutputDirectory "lan.pfx"
$cerPath = Join-Path $OutputDirectory "lan.cer"

if ((Test-Path -LiteralPath $pfxPath) -and (Test-Path -LiteralPath $cerPath)) {
  return
}

New-Item -ItemType Directory -Path $OutputDirectory -Force | Out-Null

$certificate = New-SelfSignedCertificate `
  -Subject "CN=$IpAddress" `
  -FriendlyName "ZW Website LAN HTTPS" `
  -CertStoreLocation "Cert:\CurrentUser\My" `
  -KeyAlgorithm RSA `
  -KeyLength 2048 `
  -HashAlgorithm SHA256 `
  -KeyExportPolicy Exportable `
  -NotAfter (Get-Date).AddYears(3) `
  -TextExtension @(
    "2.5.29.17={text}IPAddress=$IpAddress&DNS=localhost",
    "2.5.29.19={critical}{text}ca=false",
    "2.5.29.37={text}1.3.6.1.5.5.7.3.1"
  )

$securePassword = ConvertTo-SecureString -String $Password -AsPlainText -Force
Export-PfxCertificate `
  -Cert $certificate `
  -FilePath $pfxPath `
  -Password $securePassword | Out-Null
Export-Certificate `
  -Cert $certificate `
  -FilePath $cerPath | Out-Null
