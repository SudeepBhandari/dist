const loginSection = document.getElementById('login-section');
const dashboardSection = document.getElementById('dashboard-section');
const loginForm = document.getElementById('login-form');
const logoutBtn = document.getElementById('logout-btn');
const projectModal = document.getElementById('project-modal');
const projectForm = document.getElementById('project-form');
const addProjectBtn = document.getElementById('add-project-btn');
const closeModalBtn = document.getElementById('close-modal');
const adminProjectsList = document.getElementById('admin-projects-list');

// Check Auth on Load
const token = localStorage.getItem('adminToken');
if (token) {
    showDashboard();
} else {
    showLogin();
}

function showLogin() {
    loginSection.classList.remove('hidden');
    dashboardSection.classList.add('hidden');
}

function showDashboard() {
    loginSection.classList.add('hidden');
    dashboardSection.classList.remove('hidden');
    loadAdminProjects();
}

// Login Logic
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('adminToken', data.token);
            showDashboard();
        } else {
            alert(data.error);
        }
    } catch (error) {
        console.error('Login error:', error);
    }
});

// Logout Logic
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('adminToken');
    showLogin();
});

// Load Projects
async function loadAdminProjects() {
    try {
        const response = await fetch('/api/projects/admin', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
        });
        const projects = await response.json();

        adminProjectsList.innerHTML = projects.map(project => {
            const isVideo = project.image_url && (project.image_url.endsWith('.mp4') || project.image_url.endsWith('.webm') || project.image_url.endsWith('.ogg'));
            const mediaPreview = isVideo
                ? `<video src="${project.image_url}" class="h-10 w-10 rounded-full object-cover"></video>`
                : `<img src="${project.image_url || 'https://via.placeholder.com/50'}" class="h-10 w-10 rounded-full object-cover">`;

            return `
            <tr>
                <td class="px-6 py-4 whitespace-nowrap">
                    ${mediaPreview}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">${project.title}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${project.is_published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}">
                        ${project.is_published ? 'Published' : 'Draft'}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button onclick="deleteProject(${project.id})" class="text-red-600 hover:text-red-900 ml-4">Delete</button>
                </td>
            </tr>
        `}).join('');
    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

// Add Project Modal
addProjectBtn.addEventListener('click', () => {
    projectForm.reset();
    document.getElementById('modal-title').innerText = 'Add New Project';
    projectModal.classList.remove('hidden');
});

closeModalBtn.addEventListener('click', () => {
    projectModal.classList.add('hidden');
});

// Create Project
projectForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(projectForm);
    // Handle checkbox manually if needed, but FormData usually handles it.
    // If unchecked, it might not be in formData, so we might need to append it or handle in backend.
    // Backend expects 'is_published' in body.

    // Note: FormData handles file uploads automatically.

    try {
        const response = await fetch('/api/projects', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            },
            body: formData // Don't set Content-Type header for FormData, browser does it with boundary
        });

        if (response.ok) {
            projectModal.classList.add('hidden');
            loadAdminProjects();
        } else {
            const data = await response.json();
            alert(data.error || 'Failed to save project');
        }
    } catch (error) {
        console.error('Error saving project:', error);
    }
});

// Delete Project
window.deleteProject = async (id) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
        const response = await fetch(`/api/projects/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            }
        });

        if (response.ok) {
            loadAdminProjects();
        } else {
            alert('Failed to delete project');
        }
    } catch (error) {
        console.error('Error deleting project:', error);
    }
};
