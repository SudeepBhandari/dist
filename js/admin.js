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
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${project.is_published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}">
                        ${project.is_published ? 'Published' : 'Draft'}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button onclick="editProject(${project.id})" class="text-blue-600 hover:text-blue-900 mr-4">Edit</button>
                    <button onclick="deleteProject(${project.id})" class="text-red-600 hover:text-red-900">Delete</button>
                </td>
            </tr>
        `}).join('');
    } catch (error) {
        console.error('Error loading projects:', error);
        adminProjectsList.innerHTML = '<tr><td colspan="4" class="text-center py-4 text-red-500">Error loading projects.</td></tr>';
    }
}

// Add Project Modal
addProjectBtn.addEventListener('click', () => {
    projectForm.reset();
    document.getElementById('project-id').value = ''; // Clear ID for new project
    document.getElementById('modal-title').innerText = 'Add New Project';
    projectModal.classList.remove('hidden');
});

closeModalBtn.addEventListener('click', () => {
    projectModal.classList.add('hidden');
});

// Edit Project (LOCAL STORAGE MODE)
window.editProject = async (id) => {
    const projects = await getProjects();
    const project = projects.find(p => p.id === id);

    if (project) {
        document.getElementById('project-id').value = project.id;
        document.getElementById('project-title').value = project.title;
        document.getElementById('project-description').value = project.description;

        // Handle tags parsing
        let tags = project.tags;
        try {
            if (typeof tags === 'string') tags = JSON.parse(tags);
            if (Array.isArray(tags)) document.getElementById('project-tags').value = tags.join(', ');
        } catch (e) {
            document.getElementById('project-tags').value = project.tags || '';
        }

        document.getElementById('project-published').checked = project.is_published == 1;

        document.getElementById('modal-title').innerText = 'Edit Project';
        projectModal.classList.remove('hidden');
    }
};

// Create/Update Project (LOCAL STORAGE MODE)
projectForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(projectForm);
    let projects = await getProjects();
    const id = document.getElementById('project-id').value;

    if (id) {
        // UPDATE existing project
        const index = projects.findIndex(p => p.id == id);
        if (index !== -1) {
            projects[index] = {
                ...projects[index],
                title: formData.get('title'),
                slug: formData.get('title').toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
                description: formData.get('description'),
                tags: JSON.stringify(formData.get('tags').split(',').map(tag => tag.trim())),
                is_published: formData.get('is_published') ? 1 : 0,
                // Keep existing image if not changed (simulated)
                image_url: projects[index].image_url
            };
        }
    } else {
        // CREATE new project
        const newId = projects.length > 0 ? Math.max(...projects.map(p => p.id)) + 1 : 1;
        const newProject = {
            id: newId,
            title: formData.get('title'),
            slug: formData.get('title').toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
            description: formData.get('description'),
            tags: JSON.stringify(formData.get('tags').split(',').map(tag => tag.trim())),
            image_url: 'https://via.placeholder.com/800x600',
            gallery_urls: null,
            created_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
            is_published: formData.get('is_published') ? 1 : 0,
            external_link: null
        };
        projects.unshift(newProject);
    }

    localStorage.setItem('localProjects', JSON.stringify(projects));

    projectModal.classList.add('hidden');
    loadAdminProjects();
    alert(id ? 'Project updated locally!' : 'Project saved locally! Remember to Export Data to make it permanent.');
});

// Delete Project (LOCAL STORAGE MODE)
window.deleteProject = async (id) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

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
