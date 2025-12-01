const loginSection = document.getElementById('login-section');
const dashboardSection = document.getElementById('dashboard-section');
const loginForm = document.getElementById('login-form');
const logoutBtn = document.getElementById('logout-btn');
const projectModal = document.getElementById('project-modal');
const projectForm = document.getElementById('project-form');
const addProjectBtn = document.getElementById('add-project-btn');
const closeModalBtn = document.getElementById('close-modal');
const adminProjectsList = document.getElementById('admin-projects-list');
const exportBtn = document.getElementById('export-btn');

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

// Helper: Get Projects from LocalStorage or Initialize
async function getProjects() {
    let localProjects = localStorage.getItem('localProjects');

    if (!localProjects) {
        try {
            const response = await fetch('/projects.json');
            const projects = await response.json();
            localStorage.setItem('localProjects', JSON.stringify(projects));
            return projects;
        } catch (error) {
            console.error('Error fetching initial projects:', error);
            return [];
        }
    }

    return JSON.parse(localProjects);
}

// Load Projects (LOCAL STORAGE MODE)
async function loadAdminProjects() {
    try {
        const projects = await getProjects();

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
    let projects = await getProjects();
    projects = projects.filter(p => p.id !== id);
    localStorage.setItem('localProjects', JSON.stringify(projects));

    loadAdminProjects();
};

// Export Data
if (exportBtn) {
    exportBtn.addEventListener('click', async () => {
        const projects = await getProjects();
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(projects, null, 4));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "projects.json");
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    });
}
