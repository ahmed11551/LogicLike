# LogicLike Voting System - GitHub Upload Script
# PowerShell script to upload project to GitHub

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    LogicLike Voting System Upload" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Git is installed
Write-Host "Checking Git installation..." -ForegroundColor Yellow
try {
    $gitVersion = git --version
    Write-Host "Git found: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Git is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Git from https://git-scm.com/downloads" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "Initializing Git repository..." -ForegroundColor Yellow
git init

Write-Host ""
Write-Host "Adding all files..." -ForegroundColor Yellow
git add .

Write-Host ""
Write-Host "Making initial commit..." -ForegroundColor Yellow
git commit -m "Initial commit: LogicLike voting system with IP-based voting limits"

Write-Host ""
Write-Host "Adding remote repository..." -ForegroundColor Yellow
git remote add origin https://github.com/ahmed11551/LogicLike.git

Write-Host ""
Write-Host "Setting main branch..." -ForegroundColor Yellow
git branch -M main

Write-Host ""
Write-Host "Uploading to GitHub..." -ForegroundColor Yellow
$uploadResult = git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "    SUCCESS! Project uploaded to GitHub" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Repository URL: https://github.com/ahmed11551/LogicLike" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Check the repository on GitHub" -ForegroundColor White
    Write-Host "2. Update repository description" -ForegroundColor White
    Write-Host "3. Add topics/tags if needed" -ForegroundColor White
    Write-Host "4. Set up GitHub Pages if required" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "    ERROR! Upload failed" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Possible solutions:" -ForegroundColor Yellow
    Write-Host "1. Check your GitHub credentials" -ForegroundColor White
    Write-Host "2. Make sure the repository exists and is empty" -ForegroundColor White
    Write-Host "3. Try using Personal Access Token instead of password" -ForegroundColor White
    Write-Host "4. Check your internet connection" -ForegroundColor White
}

Write-Host ""
Read-Host "Press Enter to exit"
