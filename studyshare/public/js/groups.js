// Groups page functionality

document.addEventListener('DOMContentLoaded', () => {
    const createGroupBtn = document.getElementById('createGroupBtn');
    const createGroupForm = document.getElementById('createGroupForm');
    const groupForm = document.getElementById('groupForm');
    const cancelGroupBtn = document.getElementById('cancelGroupBtn');
    const groupsList = document.getElementById('groupsList');

    // Load groups on page load
    loadGroups();

    // Show create group form
    createGroupBtn.addEventListener('click', () => {
        createGroupForm.classList.remove('hidden');
        createGroupBtn.classList.add('hidden');
    });

    // Hide create group form
    cancelGroupBtn.addEventListener('click', () => {
        createGroupForm.classList.add('hidden');
        createGroupBtn.classList.remove('hidden');
        groupForm.reset();
    });

    // Submit new group
    groupForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const groupData = {
            name: document.getElementById('groupName').value,
            description: document.getElementById('groupDescription').value
        };

        try {
            const response = await fetch('/api/groups', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(groupData)
            });

            const data = await response.json();

            if (data.success) {
                alert('Group created successfully!');
                groupForm.reset();
                createGroupForm.classList.add('hidden');
                createGroupBtn.classList.remove('hidden');
                loadGroups();
            } else {
                alert(data.error || 'Failed to create group');
            }
        } catch (error) {
            console.error('Error creating group:', error);
            alert('Error creating group. Please try again.');
        }
    });

    // Load all groups
    async function loadGroups() {
        try {
            const response = await fetch('/api/groups');
            const data = await response.json();

            if (data.success) {
                displayGroups(data.data);
            } else {
                throw new Error(data.error);
            }
        } catch (error) {
            console.error('Error loading groups:', error);
            groupsList.innerHTML = '<p>Error loading groups. Please try again.</p>';
        }
    }

    // Display groups
    function displayGroups(groups) {
        if (groups.length === 0) {
            groupsList.innerHTML = '<p>No groups yet. Create the first one!</p>';
            return;
        }

        groupsList.innerHTML = groups.map(group => `
            <div class="group-card">
                <h3>👥 ${escapeHtml(group.name)}</h3>
                <p>${escapeHtml(group.description || 'No description')}</p>
                <p class="group-date">Created: ${formatDate(group.created_at)}</p>
                <div class="group-actions">
                    <button onclick="viewGroupMaterials(${group.id})" class="btn btn-primary btn-small">
                        View Materials
                    </button>
                    <button onclick="joinGroup(${group.id})" class="btn btn-secondary btn-small">
                        Join Group
                    </button>
                </div>
            </div>
        `).join('');
    }

    // View group materials
    window.viewGroupMaterials = async function(groupId) {
        try {
            const response = await fetch(`/api/groups/${groupId}/materials`);
            const data = await response.json();

            if (data.success) {
                if (data.count === 0) {
                    alert('No materials in this group yet.');
                } else {
                    // Display materials in a modal or redirect to browse page with filter
                    window.location.href = `/browse.html?group=${groupId}`;
                }
            }
        } catch (error) {
            console.error('Error loading group materials:', error);
            alert('Error loading materials');
        }
    };

    // Join group
    window.joinGroup = async function(groupId) {
        const memberName = prompt('Enter your name to join this group:');
        
        if (!memberName || memberName.trim() === '') {
            return;
        }

        try {
            const response = await fetch(`/api/groups/${groupId}/join`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ memberName: memberName.trim() })
            });

            const data = await response.json();

            if (data.success) {
                alert('Successfully joined the group!');
            } else {
                alert(data.error || 'Failed to join group');
            }
        } catch (error) {
            console.error('Error joining group:', error);
            alert('Error joining group. Please try again.');
        }
    };
});
