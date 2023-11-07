# Parameters
$JS_FILE_PATH = $args[0]
$CONFIG_FILE_PATH = $args[1]

# Decode and save the private key to a temporary file
[System.Convert]::FromBase64String($env:SIGNING_PRIVATE_KEY) | Set-Content -Path tmp_private_key.pem -Encoding Byte

# Validate private key
if (!(openssl rsa -check -noout -in tmp_private_key.pem 2>&1 | Out-Null)) {
    Write-Host "Invalid private key."
    Remove-Item tmp_private_key.pem
    exit 1
}

# Generate signature for the provided JS file
$SIGNATURE = Get-Content $JS_FILE_PATH | openssl dgst -sha512 -sign tmp_private_key.pem
$SIGNATURE = [Convert]::ToBase64String($SIGNATURE)

# Extract public key from the temporary private key file
$PUBLIC_KEY = openssl rsa -pubout -outform DER -in tmp_private_key.pem 2>$null | openssl pkey -pubin -inform DER -outform PEM | Select-Object -Skip 1 | Select-Object -SkipLast 1 | Out-String -Stream | ForEach-Object { $_ -replace "`n", "" }

Write-Host "PUBLIC_KEY: $PUBLIC_KEY"

# Remove temporary key files
Remove-Item tmp_private_key.pem

# Read existing Config JSON into variable
$CONFIG_JSON = Get-Content $CONFIG_FILE_PATH

# Update "scriptSignature" and "scriptPublicKey" fields in Config JSON
$UPDATED_CONFIG_JSON = $CONFIG_JSON | ConvertFrom-Json | Add-Member -NotePropertyName scriptSignature -NotePropertyValue $SIGNATURE -PassThru | Add-Member -NotePropertyName scriptPublicKey -NotePropertyValue $PUBLIC_KEY -PassThru | ConvertTo-Json

# Write updated JSON back to Config JSON file
$UPDATED_CONFIG_JSON | Set-Content $CONFIG_FILE_PATH