// Dashboard JavaScript

document.addEventListener('DOMContentLoaded', async () => {
    // Check authentication
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!token) {
        window.location.href = '/login.html';
        return;
    }
    
    // Display user info
    document.getElementById('userName').textContent = user.name || 'User';
    document.getElementById('userNameDisplay').textContent = user.name || 'User';
    
    const roleBadge = document.getElementById('userRoleBadge');
    roleBadge.textContent = user.role || 'Student';
    roleBadge.className = `role-badge ${user.role}`;
    
    // Logout handler
    document.getElementById('logoutBtn').addEventListener('click', async (e) => {
        e.preventDefault();
        
        try {
            await fetch('/api/auth/logout', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        } catch (error) {
            console.error('Logout error:', error);
        }
        
        // Clear local storage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Redirect to login
        window.location.href = '/login.html';
    });
    
    // Load dashboard data
    await loadDashboardData();
});

async function loadDashboardData() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    try {
        // Load user's materials
        const materialsResponse = await fetch(`/api/materials?uploadedBy=${encodeURIComponent(user.name)}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const materialsData = await materialsResponse.json();
        
        if (materialsData.success) {
            const userMaterials = materialsData.data;
            
            // Update statistics
            document.getElementById('totalUploads').textContent = userMaterials.length;
            
            const totalDownloads = userMaterials.reduce((sum, m) => sum + (m.downloads_count || 0), 0);
            document.getElementById('totalDownloads').textContent = totalDownloads;
            
            // Display recent uploads
            displayRecentUploads(userMaterials.slice(0, 6));
            
            // Find most popular
            const mostPopular = userMaterials.reduce((max, m) => 
                (m.downloads_count > (max?.downloads_count || 0)) ? m : max, null);
            
            if (mostPopular) {
                document.getElementById('popularMaterial').textContent = mostPopular.downloads_count;
            }
        }
        
        // Load groups (placeholder)
        document.getElementById('totalGroups').textContent = '0';
        
        // Show admin section for admin/teacher
        if (user.role === 'admin' || user.role === 'teacher') {
            document.getElementById('adminSection').classList.remove('hidden');
            await loadPlatformStats();
        }
        
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

function displayRecentUploads(materials) {
    const container = document.getElementById('recentUploads');
    
    if (materials.length === 0) {
        container.innerHTML = '<p>No uploads yet. <a href="/upload.html">Upload your first material</a>!</p>';
        return;
    }
    
    container.innerHTML = materials.map(material => `
        <div class="material-card">
            <div class="material-icon">${getFileIcon(material.file_type)}</div>
            <h4>${escapeHtml(material.title)}</h4>
            <p class="material-meta">
                ${escapeHtml(material.subject)} • Sem ${material.semester}
            </p>
            <p class="material-downloads">
                📥 ${material.downloads_count} downloads
            </p>
            <span class="material-date">${formatDate(material.upload_timestamp)}</span>
        </div>
    `).join('');
}

async function loadPlatformStats() {
    const token = localStorage.getItem('token');
    
    try {
        // User stats
        const userStatsResponse = await fetch('/api/users/stats/overview', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const userStats = await userStatsResponse.json();
        
        if (userStats.success) {
            document.getElementById('platformUsers').textContent = userStats.data.total_users || 0;
            document.getElementById('platformTeachers').textContent = userStats.data.total_teachers || 0;
            document.getElementById('platformStudents').textContent = userStats.data.total_students || 0;
        }
        
        // Material stats
        const materialStatsResponse = await fetch('/api/materials/stats/overview', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const materialStats = await materialStatsResponse.json();
        
        if (materialStats.success) {
            document.getElementById('platformMaterials').textContent = materialStats.data.total_materials || 0;
        }
        
    } catch (error) {
        console.error('Error loading platform stats:', error);
    }
}
