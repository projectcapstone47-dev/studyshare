// Profile JavaScript

document.addEventListener('DOMContentLoaded', async () => {
    // Check authentication
    const token = localStorage.getItem('token');
    
    if (!token) {
        window.location.href = '/login.html';
        return;
    }
    
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
        
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login.html';
    });
    
    // Load profile data
    await loadProfile();
    
    // Profile form handler
    document.getElementById('profileForm').addEventListener('submit', handleProfileUpdate);
    
    // Password form handler
    document.getElementById('passwordForm').addEventListener('submit', handlePasswordChange);
});

async function loadProfile() {
    const token = localStorage.getItem('token');
    
    try {
        const response = await fetch('/api/users/profile', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            const user = data.data;
            
            // Update display
            document.getElementById('userName').textContent = user.name;
            document.getElementById('profileName').textContent = user.name;
            document.getElementById('profileEmail').textContent = user.email;
            
            const roleBadge = document.getElementById('profileRole');
            roleBadge.textContent = user.role;
            roleBadge.className = `role-badge ${user.role}`;
            
            // Set initials
            const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();
            document.getElementById('userInitials').textContent = initials;
            
            // Fill form
            document.getElementById('name').value = user.name || '';
            document.getElementById('email').value = user.email || '';
            document.getElementById('department').value = user.department || '';
            document.getElementById('semester').value = user.semester || '';
            document.getElementById('phone').value = user.phone || '';
            
            // Account info
            document.getElementById('memberSince').textContent = formatDate(user.created_at);
            document.getElementById('lastLogin').textContent = user.last_login ? formatDate(user.last_login) : 'Never';
            document.getElementById('accountStatus').textContent = user.is_active ? 'Active' : 'Inactive';
        }
    } catch (error) {
        console.error('Error loading profile:', error);
    }
}

async function handleProfileUpdate(e) {
    e.preventDefault();
    
    const token = localStorage.getItem('token');
    const messageBox = document.getElementById('profileMessage');
    
    const formData = {
        name: document.getElementById('name').value,
        department: document.getElementById('department').value,
        semester: document.getElementById('semester').value,
        phone: document.getElementById('phone').value
    };
    
    try {
        const response = await fetch('/api/users/profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            messageBox.textContent = 'Profile updated successfully!';
            messageBox.className = 'message-box success';
            messageBox.classList.remove('hidden');
            
            // Update local storage
            const user = JSON.parse(localStorage.getItem('user'));
            user.name = formData.name;
            localStorage.setItem('user', JSON.stringify(user));
            
            setTimeout(() => {
                messageBox.classList.add('hidden');
            }, 3000);
        } else {
            throw new Error(data.error);
        }
    } catch (error) {
        messageBox.textContent = error.message;
        messageBox.className = 'message-box error';
        messageBox.classList.remove('hidden');
    }
}

async function handlePasswordChange(e) {
    e.preventDefault();
    
    const token = localStorage.getItem('token');
    const messageBox = document.getElementById('passwordMessage');
    
    const oldPassword = document.getElementById('oldPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (newPassword !== confirmPassword) {
        messageBox.textContent = 'New passwords do not match';
        messageBox.className = 'message-box error';
        messageBox.classList.remove('hidden');
        return;
    }
    
    try {
        const response = await fetch('/api/auth/change-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ oldPassword, newPassword, confirmPassword })
        });
        
        const data = await response.json();
        
        if (data.success) {
            messageBox.textContent = 'Password changed successfully!';
            messageBox.className = 'message-box success';
            messageBox.classList.remove('hidden');
            
            // Reset form
            document.getElementById('passwordForm').reset();
            
            setTimeout(() => {
                messageBox.classList.add('hidden');
            }, 3000);
        } else {
            throw new Error(data.error);
        }
    } catch (error) {
        messageBox.textContent = error.message;
        messageBox.className = 'message-box error';
        messageBox.classList.remove('hidden');
    }
}
