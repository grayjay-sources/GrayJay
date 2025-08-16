# GrayJay Sources Update Script
# Reads sources.json and clones/updates all repositories into sources directory
# 
# Parameters:
#   -Force: Force overwrite existing directories
#   -SkipExisting: Skip repositories that already exist
#   -UpdateExisting: Update existing repositories by stashing and pulling (default: true)
# 
# Features:
#   - Clones repositories with all submodules (--recursive --recurse-submodules)
#   - Updates existing repositories by stashing local changes and pulling latest
#   - Updates submodules for existing repositories
#   - Handles different repository URL formats (GitHub, GitLab, SourceHut)

param(
    [switch]$Force = $false,
    [switch]$SkipExisting = $false,
    [switch]$UpdateExisting = $true
)

# Set error action preference
$ErrorActionPreference = "Stop"

# Get the script directory
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$RootDir = Split-Path -Parent $ScriptDir
$SourcesJsonPath = Join-Path $RootDir "repo\grayjay-sources.github.io\sources.json"
$SourcesDir = Join-Path $RootDir "sources"

Write-Host "GrayJay Sources Update Script" -ForegroundColor Green
Write-Host "=============================" -ForegroundColor Green
Write-Host "Sources JSON: $SourcesJsonPath" -ForegroundColor Yellow
Write-Host "Sources Directory: $SourcesDir" -ForegroundColor Yellow
Write-Host ""

# Check if sources.json exists
if (-not (Test-Path $SourcesJsonPath)) {
    Write-Error "Sources JSON file not found: $SourcesJsonPath"
    exit 1
}

# Create sources directory if it doesn't exist
if (-not (Test-Path $SourcesDir)) {
    Write-Host "Creating sources directory..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $SourcesDir -Force | Out-Null
}

# Read and parse the sources.json file
Write-Host "Reading sources.json..." -ForegroundColor Yellow
try {
    $SourcesJson = Get-Content $SourcesJsonPath -Raw | ConvertFrom-Json
    Write-Host "Found $($SourcesJson.Count) sources" -ForegroundColor Green
}
catch {
    Write-Error "Failed to parse sources.json: $($_.Exception.Message)"
    exit 1
}

# Function to extract organization, repository name, and branch from URL
function Get-RepoInfo {
    param([string]$RepositoryUrl)
    
    # Extract branch from URL if present (e.g., /tree/branch-name)
    $branch = $null
    if ($RepositoryUrl -match "/tree/([^/]+)") {
        $branch = $matches[1]
        # Remove the /tree/branch part from URL to get clonable URL
        $RepositoryUrl = $RepositoryUrl -replace "/tree/[^/]+", ""
    }
    
    # Handle different URL formats
    if ($RepositoryUrl -match "github\.com/([^/]+)/([^/]+)") {
        $org = $matches[1]
        $repo = $matches[2]
        # Remove .git suffix if present
        $repo = $repo -replace "\.git$", ""
        return @{ Org = $org; Repo = $repo; Branch = $branch; CloneUrl = $RepositoryUrl }
    }
    elseif ($RepositoryUrl -match "gitlab\.futo\.org/videostreaming/plugins/([^/]+)") {
        $org = "futo"
        $repo = $matches[1]
        return @{ Org = $org; Repo = $repo; Branch = $branch; CloneUrl = $RepositoryUrl }
    }
    elseif ($RepositoryUrl -match "gitlab\.com/([^/]+)/([^/]+)") {
        $org = $matches[1]
        $repo = $matches[2]
        $repo = $repo -replace "\.git$", ""
        return @{ Org = $org; Repo = $repo; Branch = $branch; CloneUrl = $RepositoryUrl }
    }
    elseif ($RepositoryUrl -match "git\.sr\.ht/~([^/]+)/([^/]+)") {
        $org = $matches[1]
        $repo = $matches[2]
        $repo = $repo -replace "\.git$", ""
        return @{ Org = $org; Repo = $repo; Branch = $branch; CloneUrl = $RepositoryUrl }
    }
    else {
        Write-Warning "Unknown repository URL format: $RepositoryUrl"
        return $null
    }
}

# Function to create directory name
function Get-DirectoryName {
    param([hashtable]$RepoInfo)
    
    if (-not $RepoInfo) { return $null }
    
    $orgLower = $RepoInfo.Org.ToLower()
    $repoLower = $RepoInfo.Repo.ToLower()
    
    return "$orgLower-$repoLower"
}

# Process each source
$SuccessCount = 0
$SkippedCount = 0
$ErrorCount = 0

foreach ($Source in $SourcesJson) {
    if (-not $Source.repositoryUrl) {
        Write-Warning "Source '$($Source.name)' has no repositoryUrl, skipping..."
        $SkippedCount++
        continue
    }
    
    $RepoInfo = Get-RepoInfo -RepositoryUrl $Source.repositoryUrl
    if (-not $RepoInfo) {
        Write-Warning "Could not parse repository URL for '$($Source.name)': $($Source.repositoryUrl)"
        $SkippedCount++
        continue
    }
    
    $DirName = Get-DirectoryName -RepoInfo $RepoInfo
    $TargetPath = Join-Path $SourcesDir $DirName
    
    Write-Host "Processing: $($Source.name)" -ForegroundColor Cyan
    Write-Host "  URL: $($Source.repositoryUrl)" -ForegroundColor Gray
    Write-Host "  Directory: $DirName" -ForegroundColor Gray
    if ($RepoInfo.Branch) {
        Write-Host "  Branch: $($RepoInfo.Branch)" -ForegroundColor Gray
    }
    
    # Check if directory already exists
    if (Test-Path $TargetPath) {
        if ($SkipExisting) {
            Write-Host "  Skipping (already exists)" -ForegroundColor Yellow
            $SkippedCount++
            continue
        }
        elseif ($Force) {
            Write-Host "  Removing existing directory..." -ForegroundColor Yellow
            Remove-Item -Path $TargetPath -Recurse -Force
        }
        elseif (-not $UpdateExisting) {
            Write-Host "  Directory already exists. Use -Force to overwrite, -SkipExisting to skip, or -UpdateExisting to update" -ForegroundColor Yellow
            $SkippedCount++
            continue
        }
        # If not skipping, not forcing, and UpdateExisting is true, we'll update the existing repository
    }
    
    # Clone or update the repository
    try {
        if (Test-Path $TargetPath) {
            # Repository exists, update it
            Write-Host "  Updating existing repository..." -ForegroundColor Yellow
            
            # Check if it's a git repository
            if (-not (Test-Path (Join-Path $TargetPath ".git"))) {
                Write-Host "  ✗ Directory exists but is not a git repository. Use -Force to remove and re-clone" -ForegroundColor Red
                $ErrorCount++
                continue
            }
            
            # Change to the repository directory
            Push-Location $TargetPath
            
            # Check if we need to switch to a specific branch
            if ($RepoInfo.Branch) {
                $CurrentBranch = & git branch --show-current 2>&1
                if ($CurrentBranch -ne $RepoInfo.Branch) {
                    Write-Host "    Switching to branch: $($RepoInfo.Branch)" -ForegroundColor Gray
                    $SwitchResult = & git checkout $RepoInfo.Branch 2>&1
                    if ($LASTEXITCODE -ne 0) {
                        Write-Host "    ⚠ Failed to switch to branch, trying to create it..." -ForegroundColor Yellow
                        $SwitchResult = & git checkout -b $RepoInfo.Branch origin/$RepoInfo.Branch 2>&1
                    }
                }
            }
            
            # Stash any local changes (ignore if no changes to stash)
            Write-Host "    Stashing local changes..." -ForegroundColor Gray
            $StashResult = & git stash push -m "Auto-stash before update" 2>&1
            # Don't fail if there's nothing to stash
            
            # Pull latest changes (use specific branch if specified)
            Write-Host "    Pulling latest changes..." -ForegroundColor Gray
            if ($RepoInfo.Branch) {
                # Fetch all branches and pull from the specific branch
                $FetchResult = & git fetch origin 2>&1
                $PullResult = & git pull origin $RepoInfo.Branch 2>&1
            }
            else {
                $PullResult = & git pull 2>&1
            }
            
            # Update submodules if they exist
            if (Test-Path ".gitmodules") {
                Write-Host "    Updating submodules..." -ForegroundColor Gray
                $SubmoduleResult = & git submodule update --init --recursive 2>&1
            }
            
            # Pop location
            Pop-Location
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host "  ✓ Successfully updated" -ForegroundColor Green
                $SuccessCount++
            }
            else {
                Write-Host "  ✗ Failed to update: $($PullResult -join "`n")" -ForegroundColor Red
                $ErrorCount++
            }
        }
        else {
            # Repository doesn't exist, clone it
            Write-Host "  Cloning..." -ForegroundColor Yellow
            
            # Clone with submodules using the clean URL
            $GitArgs = @("clone", "--recursive", "--recurse-submodules", $RepoInfo.CloneUrl, $TargetPath)
            $Result = & git $GitArgs 2>&1
            
            if ($LASTEXITCODE -eq 0) {
                # If a specific branch was requested, checkout that branch
                if ($RepoInfo.Branch) {
                    Write-Host "    Checking out branch: $($RepoInfo.Branch)" -ForegroundColor Gray
                    Push-Location $TargetPath
                    $CheckoutResult = & git checkout $RepoInfo.Branch 2>&1
                    Pop-Location
                    
                    if ($LASTEXITCODE -eq 0) {
                        Write-Host "  ✓ Successfully cloned with submodules and checked out branch" -ForegroundColor Green
                    }
                    else {
                        Write-Host "  ⚠ Cloned successfully but failed to checkout branch: $($CheckoutResult -join "`n")" -ForegroundColor Yellow
                    }
                }
                else {
                    Write-Host "  ✓ Successfully cloned with submodules" -ForegroundColor Green
                }
                $SuccessCount++
            }
            else {
                Write-Host "  ✗ Failed to clone: $($Result -join "`n")" -ForegroundColor Red
                $ErrorCount++
            }
        }
    }
    catch {
        Write-Host "  ✗ Error cloning/updating: $($_.Exception.Message)" -ForegroundColor Red
        $ErrorCount++
    }
    
    Write-Host ""
}

# Summary
Write-Host "Update Complete!" -ForegroundColor Green
Write-Host "================" -ForegroundColor Green
Write-Host "Successfully cloned: $SuccessCount" -ForegroundColor Green
Write-Host "Skipped: $SkippedCount" -ForegroundColor Yellow
Write-Host "Errors: $ErrorCount" -ForegroundColor Red
Write-Host "Total processed: $($SuccessCount + $SkippedCount + $ErrorCount)" -ForegroundColor Cyan

if ($ErrorCount -gt 0) {
    Write-Host "`nSome repositories failed to clone. Check the errors above." -ForegroundColor Red
    exit 1
}
else {
    Write-Host "`nAll repositories processed successfully!" -ForegroundColor Green
}
