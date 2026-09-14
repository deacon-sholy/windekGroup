$photos = @(
  @{ id = 10407692; name = 'hero-oil' },
  @{ id = 9893729;  name = 'hero-energy' },
  @{ id = 36652836; name = 'hero-logistics' },
  @{ id = 36703526; name = 'hero-fisheries' },
  @{ id = 27500075; name = 'div-oilgas' },
  @{ id = 31389380; name = 'div-energy' },
  @{ id = 36398150; name = 'div-logistics' },
  @{ id = 37648666; name = 'div-food' },
  @{ id = 17229385; name = 'proj-coldchain' },
  @{ id = 11087830; name = 'proj-freight' },
  @{ id = 9229394;  name = 'proj-solar' },
  @{ id = 26728028; name = 'proj-fish' },
  @{ id = 33463115; name = 'about' }
)

$srcDir = 'img/_src'
New-Item -ItemType Directory -Force -Path $srcDir | Out-Null

foreach ($p in $photos) {
  $url = "https://images.pexels.com/photos/$($p.id)/pexels-photo-$($p.id).jpeg?auto=compress&cs=tinysrgb&w=1920"
  $out = Join-Path $srcDir "$($p.name).jpg"
  if (Test-Path $out) { Write-Output "skip  $($p.name).jpg"; continue }
  try {
    Invoke-WebRequest -Uri $url -OutFile $out -TimeoutSec 60 -Headers @{ 'User-Agent' = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    Write-Output "ok    $($p.name).jpg"
  } catch {
    Write-Output "FAIL  $($p.name).jpg :: $($_.Exception.Message)"
  }
  Start-Sleep -Milliseconds 300
}