#!/usr/bin/env pwsh

$ErrorActionPreference = "Stop"

$NodeVersion=(Get-Content .node-version | Select-String -Pattern '\d+\.\d+\.\d+' | ForEach-Object {$_.Matches.Value})

$NodeenvVersion="1.3.3"

$NodeenvDir=(Join-Path $(Get-Location) "nodeenv")
$ScriptsDir = (Join-Path $NodeenvDir Scripts)
$NodeExecutable = (Join-Path $ScriptsDir "node.exe")

if (Test-Path -Path $NodeExecutable) {
  $CurrentNodeVersion = (& $NodeExecutable --version)
  Write-Host $CurrentNodeVersion
  if (-not ($CurrentNodeVersion -eq "v$NodeVersion")) {
    Remove-Item $NodeenvDir -Recurse -Force
  }
}

if (-NOT (Test-Path -Path $NodeenvDir -PathType Container)) {
  $NodeenvTmpdir = New-TemporaryFile
  rm $NodeenvTmpdir
  mkdir $NodeenvTmpdir

  $NodeenvPackageDir=$(Join-Path "$NodeenvTmpdir" nodeenv-$NodeenvVersion)
  $NodeenvArchive="${NodeenvPackageDir}.zip"
  $NodeenvUrl = "https://github.com/ekalinin/nodeenv/archive/$NodeenvVersion.zip"
  Invoke-WebRequest -Uri $NodeenvUrl -OutFile $NodeenvArchive
  Expand-Archive -Path $NodeenvArchive -DestinationPath $NodeenvTmpdir


  python $(Join-Path "$NodeenvPackageDir" nodeenv.py) "--node=$NodeVersion" "$NodeenvDir"
}


if (-NOT (Test-Path -Path $ScriptsDir -PathType Container)) {
  Write-Error "nodeenv did not create the directory $ScriptsDir, so setup cannot continue. This script is only intended to be run on Windows; to setup on Mac OS X or Linux, use tools/setup"
  exit 1
}

& $(Join-Path $ScriptsDir Activate.ps1)

$YarnVersion=$(node -e 'console.log(JSON.parse(fs.readFileSync(\"package.json\")).engines.yarn)' | Select-String -Pattern '\d+\.\d+\.\d+' | ForEach-Object {$_.Matches.Value})

npm install --global yarn@$YarnVersion

yarn install --frozen-lockfile
