# Script para correr GestorGastos en modo desarrollo
# Configura el entorno MSVC y lanza Tauri dev

Write-Host "🚀 Iniciando GestorGastos en modo desarrollo..." -ForegroundColor Cyan

# Agregar cargo al PATH
$env:Path += ";$env:USERPROFILE\.cargo\bin"

# Configurar entorno MSVC usando vcvars64
$vcvars = "C:\Program Files\Microsoft Visual Studio\2022\Community\VC\Auxiliary\Build\vcvars64.bat"

if (!(Test-Path $vcvars)) {
    Write-Host "❌ No se encontró Visual Studio 2022. Asegurate de tener instalado el workload 'Desktop development with C++'" -ForegroundColor Red
    exit 1
}

# Leer las variables de entorno que genera vcvars64 y aplicarlas
$envVars = cmd /c "`"$vcvars`" && set" 2>&1 | ForEach-Object {
    if ($_ -match "^([^=]+)=(.*)$") {
        [System.Environment]::SetEnvironmentVariable($matches[1], $matches[2], "Process")
    }
}

Write-Host "✅ Entorno MSVC configurado" -ForegroundColor Green
Write-Host "⚙️  Compilando Rust (primera vez tarda ~5 minutos)..." -ForegroundColor Yellow

npm run tauri dev
