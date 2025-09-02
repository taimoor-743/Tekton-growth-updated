# Tekton Words Deployment Helper Script
# Run this script to prepare for deployment

Write-Host "🚀 Tekton Words Deployment Helper" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan

# Check if .env.local exists
if (Test-Path ".env.local") {
    Write-Host "✅ .env.local file exists" -ForegroundColor Green
} else {
    Write-Host "⚠️  .env.local file not found" -ForegroundColor Yellow
    Write-Host "   Please run: cp env.example .env.local" -ForegroundColor White
    Write-Host "   Then edit .env.local with your actual values" -ForegroundColor White
}

# Check git status
Write-Host "`n📋 Git Status:" -ForegroundColor Cyan
git status --porcelain

# Check if remote is configured
$remotes = git remote -v
if ($remotes) {
    Write-Host "✅ Git remote configured" -ForegroundColor Green
    Write-Host "   Remote: $remotes" -ForegroundColor White
} else {
    Write-Host "⚠️  No git remote configured" -ForegroundColor Yellow
    Write-Host "   Please add your GitHub repository as remote" -ForegroundColor White
    Write-Host "   Example: git remote add origin https://github.com/username/repo.git" -ForegroundColor White
}

# Check if all required files exist
Write-Host "`n📁 Required Files Check:" -ForegroundColor Cyan
$requiredFiles = @(
    "package.json",
    "next.config.js",
    "tailwind.config.ts",
    "tsconfig.json",
    "app/layout.tsx",
    "app/page.tsx",
    "supabase-migration.sql"
)

foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "✅ $file" -ForegroundColor Green
    } else {
        Write-Host "❌ $file" -ForegroundColor Red
    }
}

Write-Host "`n🎯 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Set up your .env.local file with actual values" -ForegroundColor White
Write-Host "2. Configure your Supabase database" -ForegroundColor White
Write-Host "3. Push to GitHub: git push origin main" -ForegroundColor White
Write-Host "4. Deploy on Netlify" -ForegroundColor White
Write-Host "5. Update environment variables in Netlify" -ForegroundColor White

Write-Host "`n📖 See DEPLOYMENT-CHECKLIST.md for detailed steps" -ForegroundColor Cyan
