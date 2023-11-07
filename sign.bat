@echo off
REM Example usage:
REM type script.js | sign-script.bat
REM sign-script.bat script.js

REM Set your key paths here
set PRIVATE_KEY_PATH=%USERPROFILE%\.ssh\id_rsa
set PUBLIC_KEY_PATH=%USERPROFILE%\.ssh\id_rsa.pub

REM Get the public key in PKCS8 format
for /f "skip=1 delims=" %%i in ('ssh-keygen -f "%PUBLIC_KEY_PATH%" -e -m pkcs8') do (
  set "PUBLIC_KEY_PKCS8=%%i"
)
echo This is your public key: '%PUBLIC_KEY_PKCS8%'

REM Check if a parameter was provided
if "%~1"=="" (
  REM No parameter provided, read from stdin
  set /p DATA=
) else (
  REM Parameter provided, read from file
  set /p DATA=<"%~1"
)

REM Generate the signature
for /f "delims=" %%i in ('echo | set /p="%DATA%" | openssl dgst -sha512 -sign "%PRIVATE_KEY_PATH%" | openssl base64') do (
  set "SIGNATURE=%%i"
)
echo This is your signature: '%SIGNATURE%'