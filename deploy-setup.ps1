# Quick Deploy Script for Netlify

Write-Host "🚀 GVG Global Group - Netlify Deployment Setup" -ForegroundColor Green
Write-Host ""

# Check if Git is initialized
if (-not (Test-Path ".git")) {
    Write-Host "📁 Initializing Git repository..." -ForegroundColor Yellow
    git init
    git add .
    git commit -m "Initial commit - GVG Global Group Portal"
    Write-Host "✅ Git initialized" -ForegroundColor Green
} else {
    Write-Host "✅ Git repository already initialized" -ForegroundColor Green
}

Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Create GitHub repository: https://github.com/new" -ForegroundColor White
Write-Host "2. Run: git remote add origin https://github.com/YOUR_USERNAME/gvg-portal.git" -ForegroundColor White
Write-Host "3. Run: git push -u origin main" -ForegroundColor White
Write-Host "4. Go to Netlify: https://app.netlify.com" -ForegroundColor White
Write-Host "5. Click 'Add new site' → 'Import an existing project'" -ForegroundColor White
Write-Host "6. Select your GitHub repository" -ForegroundColor White
Write-Host "7. Add environment variables (see NETLIFY_DEPLOYMENT.md)" -ForegroundColor White
Write-Host "8. Deploy!" -ForegroundColor White
Write-Host ""
Write-Host "📖 Full guide: NETLIFY_DEPLOYMENT.md" -ForegroundColor Yellow
