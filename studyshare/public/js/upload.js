// Upload page functionality - UPDATED WITH AUTHENTICATION

document.addEventListener('DOMContentLoaded', () => {
    // CHECK AUTHENTICATION FIRST
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!token || !user.id) {
        alert('Please login to upload materials');
        window.location.href = '/login.html';
        return;
    }

    // Display user info
    document.getElementById('userName').textContent = user.name || 'User';
    document.getElementById('uploaderName').textContent = user.name || 'User';
    
    const roleBadge = document.getElementById('uploaderRole');
    roleBadge.textContent = user.role || 'student';
    roleBadge.className = `role-badge ${user.role}`;

    // Logout handler
    document.getElementById('logoutBtn').addEventListener('click', async (e) => {
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

    const uploadForm = document.getElementById('uploadForm');
    const fileInput = document.getElementById('material');
    const filePreview = document.getElementById('filePreview');
    const progressContainer = document.getElementById('progressContainer');
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    const messageContainer = document.getElementById('messageContainer');
    const submitBtn = document.getElementById('submitBtn');
    const visibilitySelect = document.getElementById('visibility');
    const groupSelectContainer = document.getElementById('groupSelectContainer');
    const groupSelect = document.getElementById('groupId');
    const fileUploadLabel = document.querySelector('.file-upload-label');

    let selectedFile = null;

    // Load subjects for autocomplete
    loadSubjects();

    // Load groups for dropdown
    loadGroups();

    // Handle visibility change
    visibilitySelect.addEventListener('change', (e) => {
        if (e.target.value === 'group') {
            groupSelectContainer.classList.remove('hidden');
            groupSelect.required = true;
        } else {
            groupSelectContainer.classList.add('hidden');
            groupSelect.required = false;
        }
    });

    // File input change handler
    fileInput.addEventListener('change', handleFileSelect);

    // Drag and drop handlers
    fileUploadLabel.addEventListener('dragover', (e) => {
        e.preventDefault();
        fileUploadLabel.classList.add('drag-over');
    });

    fileUploadLabel.addEventListener('dragleave', () => {
        fileUploadLabel.classList.remove('drag-over');
    });

    fileUploadLabel.addEventListener('drop', (e) => {
        e.preventDefault();
        fileUploadLabel.classList.remove('drag-over');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            fileInput.files = files;
            handleFileSelect({ target: { files: files } });
        }
    });

    // Handle file selection
    function handleFileSelect(e) {
        const file = e.target.files[0];
        if (!file) return;

        const validation = validateFile(file);
        
        if (!validation.valid) {
            showMessage(messageContainer, validation.error, 'error');
            fileInput.value = '';
            return;
        }

        selectedFile = file;
        showFilePreview(file);
    }

    // Show file preview
    function showFilePreview(file) {
        filePreview.innerHTML = `
            <div class="file-preview-item">
                <span class="file-preview-icon">${getFileIcon(file.type)}</span>
                <div class="file-preview-info">
                    <div class="file-preview-name">${escapeHtml(file.name)}</div>
                    <div class="file-preview-size">${formatFileSize(file.size)}</div>
                </div>
                <button type="button" class="file-preview-remove" onclick="removeFile()">Remove</button>
            </div>
        `;
        filePreview.classList.add('active');
    }

    // Remove file
    window.removeFile = function() {
        selectedFile = null;
        fileInput.value = '';
        filePreview.classList.remove('active');
        filePreview.innerHTML = '';
    };

    // Form submission with progress tracking - UPDATED WITH AUTH TOKEN
    uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!selectedFile) {
            showMessage(messageContainer, 'Please select a file to upload', 'error');
            return;
        }

        // Prepare form data
        const formData = new FormData();
        formData.append('material', selectedFile);
        formData.append('title', document.getElementById('title').value);
        formData.append('subject', document.getElementById('subject').value);
        formData.append('semester', document.getElementById('semester').value);
        // REMOVED: uploadedBy - now comes from authenticated user
        formData.append('visibility', visibilitySelect.value);
        
        if (visibilitySelect.value === 'group') {
            formData.append('groupId', groupSelect.value);
        }

        // Disable submit button
        submitBtn.disabled = true;
        submitBtn.textContent = 'Uploading...';

        // Show progress bar
        progressContainer.classList.remove('hidden');

        // Upload with XMLHttpRequest for progress tracking
        uploadWithProgress(formData);
    });

    // Upload file with progress tracking - UPDATED WITH AUTH TOKEN
    function uploadWithProgress(formData) {
        const xhr = new XMLHttpRequest();

        // Progress event
        xhr.upload.addEventListener('progress', (e) => {
            if (e.lengthComputable) {
                const percentComplete = Math.round((e.loaded / e.total) * 100);
                progressBar.style.width = percentComplete + '%';
                progressText.textContent = `Uploading... ${percentComplete}%`;
            }
        });

        // Load event
        xhr.addEventListener('load', () => {
            if (xhr.status === 201) {
                const response = JSON.parse(xhr.responseText);
                showMessage(messageContainer, 'Material uploaded successfully!', 'success');
                
                // Reset form after 2 seconds
                setTimeout(() => {
                    uploadForm.reset();
                    removeFile();
                    progressContainer.classList.add('hidden');
                    progressBar.style.width = '0%';
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Upload Material';
                }, 2000);
            } else {
                const response = JSON.parse(xhr.responseText);
                showMessage(messageContainer, response.error || 'Upload failed', 'error');
                resetUploadState();
            }
        });

        // Error event
        xhr.addEventListener('error', () => {
            showMessage(messageContainer, 'Network error occurred. Please try again.', 'error');
            resetUploadState();
        });

        // Abort event
        xhr.addEventListener('abort', () => {
            showMessage(messageContainer, 'Upload cancelled', 'error');
            resetUploadState();
        });

        // CRITICAL: Add authentication header
        xhr.open('POST', '/api/materials/upload');
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        xhr.send(formData);
    }

    // Reset upload state
    function resetUploadState() {
        progressContainer.classList.add('hidden');
        progressBar.style.width = '0%';
        submitBtn.disabled = false;
        submitBtn.textContent = 'Upload Material';
    }

    // Load subjects for autocomplete
    async function loadSubjects() {
        try {
            const response = await fetch('/api/subjects/names');
            const data = await response.json();
            
            if (data.success) {
                const datalist = document.getElementById('subjectsList');
                datalist.innerHTML = data.data.map(subject => 
                    `<option value="${escapeHtml(subject)}">`
                ).join('');
            }
        } catch (error) {
            console.error('Error loading subjects:', error);
        }
    }

    // Load groups
    async function loadGroups() {
        try {
            const response = await fetch('/api/groups');
            const data = await response.json();
            
            if (data.success && data.data.length > 0) {
                groupSelect.innerHTML = '<option value="">Select a group</option>' +
                    data.data.map(group => 
                        `<option value="${group.id}">${escapeHtml(group.name)}</option>`
                    ).join('');
            }
        } catch (error) {
            console.error('Error loading groups:', error);
        }
    }
});
