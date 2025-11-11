// Browse page functionality - UPDATED WITH ROLE FILTERING

document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in (optional for browse)
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    // Update navigation based on auth status
    updateNavigation();

    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const subjectFilter = document.getElementById('subjectFilter');
    const semesterFilter = document.getElementById('semesterFilter');
    const roleFilter = document.getElementById('roleFilter'); // NEW
    const verifiedFilter = document.getElementById('verifiedFilter'); // NEW
    const clearFiltersBtn = document.getElementById('clearFilters');
    const materialsGrid = document.getElementById('materialsGrid');
    const resultsInfo = document.getElementById('resultsInfo');
    const noResults = document.getElementById('noResults');

    let allMaterials = [];

    // Load initial materials
    loadMaterials();

    // Load subjects for filter
    loadSubjectsFilter();

    // Search button click
    searchBtn.addEventListener('click', () => {
        loadMaterials();
    });

    // Enter key in search
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            loadMaterials();
        }
    });

    // Debounced search on input
    const debouncedSearch = debounce(() => {
        loadMaterials();
    }, 500);

    searchInput.addEventListener('input', debouncedSearch);

    // Filter changes
    subjectFilter.addEventListener('change', () => loadMaterials());
    semesterFilter.addEventListener('change', () => loadMaterials());
    roleFilter.addEventListener('change', () => loadMaterials()); // NEW
    verifiedFilter.addEventListener('change', () => loadMaterials()); // NEW

    // Clear filters
    clearFiltersBtn.addEventListener('click', () => {
        searchInput.value = '';
        subjectFilter.value = '';
        semesterFilter.value = '';
        roleFilter.value = ''; // NEW
        verifiedFilter.value = ''; // NEW
        loadMaterials();
    });

    // Update navigation
    function updateNavigation() {
        const nav = document.getElementById('mainNav');
        
        if (token && user.id) {
            nav.innerHTML = `
                <a href="/dashboard.html">Dashboard</a>
                <a href="/upload.html">Upload</a>
                <a href="/browse.html" class="active">Browse</a>
                <a href="/groups.html">Groups</a>
                <div class="user-menu">
                    <span>${escapeHtml(user.name || 'User')}</span>
                    <div class="dropdown">
                        <a href="/profile.html">Profile</a>
                        <a href="#" id="logoutBtn">Logout</a>
                    </div>
                </div>
            `;
            
            document.getElementById('logoutBtn')?.addEventListener('click', async (e) => {
                e.preventDefault();
                try {
                    await fetch('/api/auth/logout', {
                        method: 'POST',
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                } catch (error) {
                    console.error('Logout error:', error);
                }
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login.html';
            });
        } else {
            nav.innerHTML = `
                <a href="/">Home</a>
                <a href="/browse.html" class="active">Browse</a>
                <a href="/about.html">About</a>
                <a href="/login.html" class="btn btn-small btn-primary">Login</a>
                <a href="/register.html" class="btn btn-small btn-secondary">Register</a>
            `;
        }
    }

    // Load materials with filters - UPDATED WITH NEW FILTERS
    async function loadMaterials() {
        try {
            // Build query string
            const params = new URLSearchParams();
            
            if (searchInput.value.trim()) {
                params.append('search', searchInput.value.trim());
            }
            if (subjectFilter.value) {
                params.append('subject', subjectFilter.value);
            }
            if (semesterFilter.value) {
                params.append('semester', semesterFilter.value);
            }
            if (roleFilter.value) { // NEW
                params.append('uploaderRole', roleFilter.value);
            }
            if (verifiedFilter.value) { // NEW
                params.append('isVerified', verifiedFilter.value);
            }

            const url = `/api/materials?${params.toString()}`;
            const response = await fetch(url);
            const data = await response.json();

            if (data.success) {
                allMaterials = data.data;
                displayMaterials(data.data);
                updateResultsInfo(data.count);
            } else {
                throw new Error(data.error);
            }
        } catch (error) {
            console.error('Error loading materials:', error);
            resultsInfo.textContent = 'Error loading materials. Please try again.';
            materialsGrid.innerHTML = '';
        }
    }

    // Display materials in grid - UPDATED WITH VERIFIED BADGES
    function displayMaterials(materials) {
        if (materials.length === 0) {
            materialsGrid.innerHTML = '';
            noResults.classList.remove('hidden');
            return;
        }

        noResults.classList.add('hidden');

        materialsGrid.innerHTML = materials.map(material => `
            <div class="material-card">
                <div class="material-icon">${getFileIcon(material.file_type)}</div>
                ${material.is_verified ? '<span class="verified-badge">✓ Verified</span>' : ''}
                <h4>${escapeHtml(material.title)}</h4>
                <p class="material-meta">
                    ${escapeHtml(material.subject)} • Semester ${material.semester}
                </p>
                <p class="material-uploader">
                    <span class="role-indicator ${material.uploader_role}">
                        ${material.uploader_role === 'teacher' ? '👨‍🏫 Teacher' : '👨‍🎓 Student'}
                    </span><br>
                    ${escapeHtml(material.uploaded_by)}
                </p>
                <div class="material-footer">
                    <span class="material-downloads">
                        📥 ${material.downloads_count} downloads
                    </span>
                    <span class="material-date">
                        ${formatDate(material.upload_timestamp)}
                    </span>
                </div>
                <a href="/api/materials/${material.id}/download" 
                   class="btn btn-primary btn-small" 
                   onclick="trackDownload(${material.id})">
                    Download
                </a>
            </div>
        `).join('');
    }

    // Update results info
    function updateResultsInfo(count) {
        const filters = [];
        if (searchInput.value.trim()) filters.push(`"${searchInput.value.trim()}"`);
        if (subjectFilter.value) filters.push(subjectFilter.options[subjectFilter.selectedIndex].text);
        if (semesterFilter.value) filters.push(semesterFilter.options[semesterFilter.selectedIndex].text);
        if (roleFilter.value) filters.push(roleFilter.options[roleFilter.selectedIndex].text); // NEW
        if (verifiedFilter.value) filters.push(verifiedFilter.options[verifiedFilter.selectedIndex].text); // NEW

        if (filters.length > 0) {
            resultsInfo.textContent = `Found ${count} material${count !== 1 ? 's' : ''} for: ${filters.join(', ')}`;
        } else {
            resultsInfo.textContent = `Showing all ${count} material${count !== 1 ? 's' : ''}`;
        }
    }

    // Load subjects for filter dropdown
    async function loadSubjectsFilter() {
        try {
            const response = await fetch('/api/materials');
            const data = await response.json();
            
            if (data.success) {
                // Extract unique subjects
                const subjects = [...new Set(data.data.map(m => m.subject))].sort();
                
                subjectFilter.innerHTML = '<option value="">All Subjects</option>' +
                    subjects.map(subject => 
                        `<option value="${escapeHtml(subject)}">${escapeHtml(subject)}</option>`
                    ).join('');
            }
        } catch (error) {
            console.error('Error loading subjects:', error);
        }
    }

    // Track download (optional analytics)
    window.trackDownload = function(materialId) {
        console.log(`Downloading material ${materialId}`);
        // Analytics could be sent to server here
    };
});
