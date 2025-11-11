// Authentication JavaScript

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    // Login Form Handler
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = document.getElementById('loginBtn');
            const errorMsg = document.getElementById('errorMessage');
            
            // Get form data
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Disable button
            submitBtn.disabled = true;
            submitBtn.textContent = 'Logging in...';
            errorMsg.classList.add('hidden');
            
            try {
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    // Store token
                    localStorage.setItem('token', data.data.token);
                    localStorage.setItem('user', JSON.stringify(data.data.user));
                    
                    // Redirect to dashboard
                    window.location.href = '/dashboard.html';
                } else {
                    throw new Error(data.error || 'Login failed');
                }
            } catch (error) {
                errorMsg.textContent = error.message;
                errorMsg.classList.remove('hidden');
                
                submitBtn.disabled = false;
                submitBtn.textContent = 'Login';
            }
        });
    }

    // Register Form Handler
    if (registerForm) {
        const roleSelect = document.getElementById('role');
        const semesterGroup = document.getElementById('semesterGroup');
        
        // Show/hide semester based on role
        roleSelect.addEventListener('change', () => {
            if (roleSelect.value === 'teacher') {
                semesterGroup.classList.add('hidden');
            } else {
                semesterGroup.classList.remove('hidden');
            }
        });
        
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = document.getElementById('registerBtn');
            const errorMsg = document.getElementById('errorMessage');
            const successMsg = document.getElementById('successMessage');
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                role: document.getElementById('role').value,
                department: document.getElementById('department').value,
                semester: document.getElementById('semester').value,
                phone: document.getElementById('phone').value,
                password: document.getElementById('password').value
            };
            
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            // Validate passwords match
            if (formData.password !== confirmPassword) {
                errorMsg.textContent = 'Passwords do not match';
                errorMsg.classList.remove('hidden');
                return;
            }
            
            // Disable button
            submitBtn.disabled = true;
            submitBtn.textContent = 'Creating Account...';
            errorMsg.classList.add('hidden');
            successMsg.classList.add('hidden');
            
            try {
                const response = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
                
                const data = await response.json();
                
                if (data.success) {
                    // Store token
                    localStorage.setItem('token', data.data.token);
                    localStorage.setItem('user', JSON.stringify(data.data.user));
                    
                    // Show success message
                    successMsg.textContent = 'Account created successfully! Redirecting...';
                    successMsg.classList.remove('hidden');
                    
                    // Redirect to dashboard
                    setTimeout(() => {
                        window.location.href = '/dashboard.html';
                    }, 1500);
                } else {
                    throw new Error(data.error || 'Registration failed');
                }
            } catch (error) {
                errorMsg.textContent = error.message;
                errorMsg.classList.remove('hidden');
                
                submitBtn.disabled = false;
                submitBtn.textContent = 'Create Account';
            }
        });
    }
});

// Check if user is already logged in
function checkAuth() {
    const token = localStorage.getItem('token');
    if (token) {
        // If on login/register page, redirect to dashboard
        if (window.location.pathname === '/login.html' || window.location.pathname === '/register.html') {
            window.location.href = '/dashboard.html';
        }
    }
}

// Run auth check on page load
checkAuth();
