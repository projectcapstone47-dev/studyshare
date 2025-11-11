# ============================
# StudyShare Authentication Upgrade (PowerShell Version)
# ============================

# --- Colors for Output ---
$green = "`e[32m"
$blue  = "`e[34m"
$yellow= "`e[33m"
$nc    = "`e[0m"

Write-Host "${blue}=====================================${nc}"
Write-Host "${blue}  StudyShare Authentication Upgrade  ${nc}"
Write-Host "${blue}=====================================${nc}`n"

# --- Create Directories ---
Write-Host "${yellow}📁 Creating directory structure...${nc}`n"

$dirs = @(
    "src/config",
    "src/middleware",
    "src/controllers",
    "src/models",
    "src/services",
    "src/routes",
    "public/views",
    "public/css",
    "public/js",
    "database/migrations",
    "scripts",
    "uploads/materials"
)

foreach ($dir in $dirs) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Force -Path $dir | Out-Null
        Write-Host "${green}  📂 Created: $dir${nc}"
    } else {
        Write-Host "${green}  ✅ Exists: $dir${nc}"
    }
}

# --- Backend Files ---
Write-Host "`n${green}📄 Creating backend files...${nc}"

$backendFiles = @(
    "src/config/auth.js",
    "src/config/roles.js",
    "src/middleware/auth.middleware.js",
    "src/middleware/roleCheck.middleware.js",
    "src/middleware/uploadPermission.js",
    "src/controllers/auth.controller.js",
    "src/controllers/user.controller.js",
    "src/models/user.model.js",
    "src/services/auth.service.js",
    "src/services/user.service.js",
    "src/routes/auth.routes.js",
    "src/routes/user.routes.js",
    "database/migrations/001-add-users-table.sql",
    "database/migrations/002-update-materials-table.sql",
    "database/migrations/003-add-notifications-table.sql",
    "database/migrations/004-add-departments-table.sql",
    "scripts/run-migrations.js"
)

foreach ($file in $backendFiles) {
    if (-not (Test-Path $file)) {
        New-Item -ItemType File -Force -Path $file | Out-Null
        Write-Host "${green}  ├─ Created: $file${nc}"
    } else {
        Write-Host "${green}  ├─ Exists: $file${nc}"
    }
}

# --- Frontend Files ---
Write-Host "`n${green}🎨 Creating frontend files...${nc}"

$frontendFiles = @(
    "public/views/login.html",
    "public/views/register.html",
    "public/views/dashboard.html",
    "public/views/profile.html",
    "public/views/admin.html",
    "public/css/auth.css",
    "public/css/dashboard.css",
    "public/js/auth.js",
    "public/js/dashboard.js",
    "public/js/profile.js"
)

foreach ($file in $frontendFiles) {
    if (-not (Test-Path $file)) {
        New-Item -ItemType File -Force -Path $file | Out-Null
        Write-Host "${green}  ├─ Created: $file${nc}"
    } else {
        Write-Host "${green}  ├─ Exists: $file${nc}"
    }
}

# --- Uploads placeholder ---
if (-not (Test-Path "uploads/materials/.gitkeep")) {
    New-Item -ItemType File -Force -Path "uploads/materials/.gitkeep" | Out-Null
    Write-Host "${green}  ├─ Created: uploads/materials/.gitkeep${nc}"
} else {
    Write-Host "${green}  ├─ Exists: uploads/materials/.gitkeep${nc}"
}

# --- Summary ---
$backendCount = $backendFiles.Count
$frontendCount = $frontendFiles.Count
$total = $backendCount + $frontendCount

Write-Host "`n${blue}=====================================${nc}"
Write-Host "${green}✅ Successfully created or verified $total files ($backendCount backend + $frontendCount frontend)!${nc}"
Write-Host "${blue}=====================================${nc}`n"

# --- Directory Snapshot (simple)
Write-Host "${yellow}📂 Directory Structure (root level):${nc}"
Get-ChildItem -Directory | ForEach-Object { Write-Host "  📁 $($_.Name)" }

Write-Host "`n${blue}=====================================${nc}"
Write-Host "${green}🎉 Setup Complete!${nc}"
Write-Host "${blue}=====================================${nc}`n"

# --- Next Steps ---
Write-Host "${yellow}Next Steps:${nc}"
Write-Host "  1️⃣ Install dependencies:"
Write-Host "     ${blue}npm install bcryptjs jsonwebtoken express-session cookie-parser express-validator connect-sqlite3${nc}"
Write-Host "`n  2️⃣ Run migrations:"
Write-Host "     ${blue}node scripts/run-migrations.js${nc}"
Write-Host "`n  3️⃣ Begin coding your authentication logic!"
Write-Host "`n"
