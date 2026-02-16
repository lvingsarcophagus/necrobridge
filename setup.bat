@echo off
REM NecroBridge Setup Script for Windows
REM Installs dependencies and prepares project

echo 🧟 NecroBridge Setup
echo ===================
echo.

REM Check Rust
where cargo >nul 2>nul
if errorlevel 1 (
    echo 📦 Installing Rust...
    curl --proto =https --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
)

REM Check Solana
where solana >nul 2>nul
if errorlevel 1 (
    echo 📦 Installing Solana...
    powershell -NoProfile -ExecutionPolicy Bypass -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-Expression ((New-Object System.Net.WebClient).DownloadString('https://release.solana.com/stable/install'))"
)

REM Check Anchor
where anchor >nul 2>nul
if errorlevel 1 (
    echo 📦 Installing Anchor...
    cargo install --git https://github.com/coral-xyz/anchor anchor-cli --locked
)

echo.
echo 🔨 Building Anchor program...
call anchor build

echo.
echo 📦 Installing frontend dependencies...
cd frontend
call npm install
cd ..

echo.
echo ✅ Setup complete!
echo.
echo Next steps:
echo   1. Configure Solana: solana config set --url devnet
echo   2. Build: anchor build
echo   3. Deploy: anchor deploy --provider.cluster devnet
echo   4. Test: anchor test
