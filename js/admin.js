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

// Login Logic (DEMO MODE)
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Simple client-side check for demo purposes
    if (username === 'admin' && password === 'admin') {
        localStorage.setItem('adminToken', 'demo-token');
        showDashboard();
    } else {
        alert('Invalid credentials! Try admin/admin');
    }
});

// Logout Logic
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('adminToken');
    showLogin();
});

// Load Projects (DEMO MODE: Load from JSON)
async function loadAdminProjects() {
    try {
        // Fetch from static JSON file instead of API
        const response = await fetch('/projects.json');
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
        adminProjectsList.innerHTML = '<tr><td colspan="4" class="text-center py-4 text-red-500">Error loading projects. Make sure projects.json exists.</td></tr>';
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

// Create Project (DEMO MODE)
projectForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    alert('This is a static demo. Adding projects is disabled because there is no backend database.');
    projectModal.classList.add('hidden');
});

// Delete Project (DEMO MODE)
window.deleteProject = async (id) => {
    alert('This is a static demo. Deleting projects is disabled because there is no backend database.');
};
