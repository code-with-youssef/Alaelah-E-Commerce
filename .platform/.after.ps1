# 1. Crash early if any command fails
$ErrorActionPreference = "Stop"
Write-Host "Building in directory: $env:DEPLOY_BUILD_DIR"
Write-Host "Target platform: $env:DEPLOY_PLATFORM_DIR"
Write-Host "Using tool: $env:DEPLOY_TOOL"