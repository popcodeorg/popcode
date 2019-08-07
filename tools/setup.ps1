#!/usr/bin/env pwsh

$PathSeparator=[IO.Path]::PathSeparator

$NodeVersion=(Get-Content .node-version | Select-String -Pattern '\d+\.\d+\.\d+' | ForEach-Object {$_.Matches.Value})

$NodeenvVersion="1.3.3"

$NodeenvTmpdir = New-TemporaryFile
rm $NodeenvTmpdir
mkdir $NodeenvTmpdir


$NodeenvPackageDir=$(Join-Path "$NodeenvTmpdir" nodeenv-$NodeenvVersion)
$NodeenvArchive="${NodeenvPackageDir}.zip"
$NodeenvUrl = "https://github.com/ekalinin/nodeenv/archive/$NodeenvVersion.zip"
Invoke-WebRequest -Uri $NodeenvUrl -OutFile $NodeenvArchive
Expand-Archive -Path $NodeenvArchive -DestinationPath $NodeenvTmpdir

$NodeenvDir="nodeenv"

python $(Join-Path "$NodeenvPackageDir" nodeenv.py) "--node=$NodeVersion" "$NodeenvDir"

$env:PATH="$(Join-Path "$(Get-Location)" $(Join-Path $NodeenvDir bin))${PathSeparator}$env:PATH"

$YarnVersion=$(node -e 'console.log(JSON.parse(fs.readFileSync(\"package.json\")).engines.yarn)' | Select-String -Pattern '\d+\.\d+\.\d+' | ForEach-Object {$_.Matches.Value})

npm install --global yarn@$YarnVersion

yarn install --frozen-lockfile
