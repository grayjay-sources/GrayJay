#Example usage:
#Get-Content script.js | .\sign-script.ps1
#.\sign-script.ps1 script.js

#Set your key paths here
$PRIVATE_KEY_PATH = "C:/Users/blusc/.ssh/id_rsa"
$PUBLIC_KEY_PATH = "C:/Users/blusc/.ssh/id_rsa.pub"

$PUBLIC_KEY_PKCS8 = ssh-keygen -f $PUBLIC_KEY_PATH -e -m pkcs8 | Select-Object -Skip 1 | Select-Object -SkipLast 1 | Out-String -Stream | ForEach-Object { $_ -replace "`n", "" }
Write-Host "This is your public key: '$PUBLIC_KEY_PKCS8'"

if ($args.Count -eq 0) {
    # No parameter provided, read from stdin
    $DATA = $input | Out-String
} else {
    # Parameter provided, read from file
    $DATA = Get-Content $args[0] | Out-String
}

$SIGNATURE = echo -n $DATA | openssl dgst -sha512 -sign "$PRIVATE_KEY_PATH" | %{[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($_))}
Write-Host "This is your signature: '$SIGNATURE'"