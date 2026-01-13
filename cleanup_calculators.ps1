$path = "src/config/calculators.ts"
$content = Get-Content $path
if ($content.Length -ge 1923) {
    $newContent = $content[0..2] + $content[1922..($content.Length - 1)]
    $newContent | Set-Content $path -Encoding UTF8
    Write-Output "Successfully removed lines 4 to 1922."
} else {
    Write-Error "File is shorter than expected."
}
