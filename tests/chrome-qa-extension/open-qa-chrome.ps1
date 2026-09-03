param(
  [string]$Page = 'index.html'
)

$extensionRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$testsRoot = Split-Path -Parent $extensionRoot
$projectRoot = Split-Path -Parent $testsRoot
$chromePath = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
$profilePath = Join-Path $projectRoot 'tests\artifacts\chrome-qa-profile'
$pagePath = Join-Path $projectRoot $Page

if (-not (Test-Path -LiteralPath $chromePath)) {
  throw 'Google Chrome was not found at the standard path.'
}

if (-not (Test-Path -LiteralPath $pagePath)) {
  throw ('Page was not found: ' + $pagePath)
}

$pageUrl = ([System.Uri]$pagePath).AbsoluteUri
Start-Process -FilePath $chromePath -ArgumentList @(
  ('--user-data-dir=' + $profilePath),
  ('--disable-extensions-except=' + $extensionRoot),
  ('--load-extension=' + $extensionRoot),
  '--new-window',
  $pageUrl
)
