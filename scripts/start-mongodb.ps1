$ErrorActionPreference = 'Stop'

$mongoVersion = '8.0.34'
$mongoRoot = Join-Path $env:LOCALAPPDATA 'Lumiere\MongoDB'
$mongoVersionRoot = Join-Path $mongoRoot $mongoVersion
$dataDirectory = Join-Path $mongoRoot 'data'
$logFile = Join-Path $mongoRoot 'mongod.log'
$archiveFile = Join-Path $mongoVersionRoot 'mongodb-community.zip'
$downloadUrl = 'https://fastdl.mongodb.org/windows/mongodb-windows-x86_64-8.0.34.zip'

$tcpClient = [System.Net.Sockets.TcpClient]::new()
try {
    $tcpClient.Connect('127.0.0.1', 27017)
    Write-Host 'MongoDB is already accepting local connections at 127.0.0.1:27017.'
    exit 0
}
catch {
    # No local database is listening yet.
}
finally {
    $tcpClient.Dispose()
}

New-Item -ItemType Directory -Force -Path $mongoVersionRoot, $dataDirectory | Out-Null
$serverBinary = Get-ChildItem -Path $mongoVersionRoot -Filter 'mongod.exe' -File -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1

if (-not $serverBinary) {
    Write-Host 'Downloading MongoDB Community Server to your local user profile...'
    Invoke-WebRequest -Uri $downloadUrl -OutFile $archiveFile -UseBasicParsing
    Expand-Archive -LiteralPath $archiveFile -DestinationPath $mongoVersionRoot -Force
    Remove-Item -LiteralPath $archiveFile -Force
    $serverBinary = Get-ChildItem -Path $mongoVersionRoot -Filter 'mongod.exe' -File -Recurse | Select-Object -First 1
}

if (-not $serverBinary) {
    throw 'MongoDB server binary was not found after extraction.'
}

$arguments = @(
    '--dbpath="' + $dataDirectory + '"',
    '--bind_ip=127.0.0.1',
    '--port=27017',
    '--logpath="' + $logFile + '"',
    '--logappend'
)
$mongoProcess = Start-Process -FilePath $serverBinary.FullName -ArgumentList $arguments -WindowStyle Hidden -PassThru

for ($attempt = 0; $attempt -lt 40; $attempt++) {
    Start-Sleep -Milliseconds 500
    if ($mongoProcess.HasExited) {
        throw "MongoDB stopped during startup. Check the log at $logFile."
    }
    $tcpClient = [System.Net.Sockets.TcpClient]::new()
    try {
        $tcpClient.Connect('127.0.0.1', 27017)
        Write-Host 'MongoDB is running locally at 127.0.0.1:27017.'
        Write-Host "Database files: $dataDirectory"
        exit 0
    }
    catch {
        # Wait briefly for MongoDB to finish starting.
    }
    finally {
        $tcpClient.Dispose()
    }
}

throw "MongoDB did not become ready. Check the log at $logFile."