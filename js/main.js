// Initialize AOS
AOS.init({
    duration: 1000,
    once: true,
});

// Dark Mode Toggle
const themeToggleBtn = document.getElementById('theme-toggle');
const darkIcon = document.getElementById('theme-toggle-dark-icon');
const lightIcon = document.getElementById('theme-toggle-light-icon');

// Change the icons inside the button based on previous settings
if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    lightIcon.classList.remove('hidden');
    darkIcon.classList.add('hidden');
    document.documentElement.classList.add('dark');
} else {
    darkIcon.classList.remove('hidden');
    lightIcon.classList.add('hidden');
    document.documentElement.classList.remove('dark');
}

themeToggleBtn.addEventListener('click', function () {
    // toggle icons inside button
    darkIcon.classList.toggle('hidden');
    lightIcon.classList.toggle('hidden');

    // if set via local storage previously
    if (localStorage.getItem('color-theme')) {
        if (localStorage.getItem('color-theme') === 'light') {
            document.documentElement.classList.add('dark');
            localStorage.setItem('color-theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('color-theme', 'light');
        }

        // if NOT set via local storage previously
    } else {
        if (document.documentElement.classList.contains('dark')) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('color-theme', 'light');
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('color-theme', 'dark');
        }
    }
});

// Typing Animation
const textElement = document.getElementById('typing-text');
const texts = ['Graphic Designer', 'Web Developer', 'Creative Thinker'];
let count = 0;
let index = 0;
let currentText = '';
let letter = '';

(function type() {
    if (count === texts.length) {
        count = 0;
    }
    currentText = texts[count];
    letter = currentText.slice(0, ++index);

    if (textElement) {
        textElement.textContent = letter;
    }

    if (letter.length === currentText.length) {
        count++;
        index = 0;
        setTimeout(type, 2000); // Wait before typing next word
    } else {
        setTimeout(type, 100);
    }
}());

// Navbar Toggle for Mobile
const navbarToggleBtn = document.querySelector('[data-collapse-toggle="navbar-sticky"]');
const navbarMenu = document.getElementById('navbar-sticky');

if (navbarToggleBtn && navbarMenu) {
    navbarToggleBtn.addEventListener('click', () => {
        navbarMenu.classList.toggle('hidden');
    });
}

// Fetch and Display Projects
async function loadProjects() {
    try {
        const response = await fetch('projects.json');
        const projects = await response.json();
        const projectsGrid = document.getElementById('projects-grid');

        if (projectsGrid) {
            projectsGrid.innerHTML = projects.map(project => {
                const isVideo = project.image_url && (project.image_url.endsWith('.mp4') || project.image_url.endsWith('.webm') || project.image_url.endsWith('.ogg'));
                const mediaElement = isVideo
                    ? `<video src="${project.image_url}" class="w-full h-48 object-cover transform group-hover:scale-110 transition-transform duration-500" muted loop playsinline onmouseover="this.play()" onmouseout="this.pause()"></video>`
                    : `<img src="${project.image_url || 'https://via.placeholder.com/400x300'}" alt="${project.title}" class="w-full h-48 object-cover transform group-hover:scale-110 transition-transform duration-500">`;

                return `
                <div class="card group cursor-pointer" data-aos="fade-up">
                    <div class="relative overflow-hidden rounded-lg mb-4">
                        ${mediaElement}
                        <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <button onclick='openModal(${JSON.stringify(project).replace(/'/g, "&#39;")})' class="bg-white text-gray-900 px-6 py-2 rounded-full font-semibold hover:bg-blue-600 hover:text-white transition-colors duration-300 transform translate-y-4 group-hover:translate-y-0">
                                View Project
                            </button>
                        </div>
                    </div>
                    <h3 class="text-xl font-bold mb-2 dark:text-white group-hover:text-blue-600 transition-colors">${project.title}</h3>
                    <p class="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">${project.description}</p>
                    <div class="flex flex-wrap gap-2">
                        ${JSON.parse(project.tags || '[]').map(tag => `
                            <span class="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-sm rounded-full text-gray-600 dark:text-gray-300">${tag}</span>
                        `).join('')}
                    </div>
                </div>
            `}).join('');
        }
    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

// Modal Functions
function openModal(project) {
    const modal = document.getElementById('project-modal');
    const title = document.getElementById('modal-title');
    const image = document.getElementById('modal-image');
    const description = document.getElementById('modal-description');
    const tagsContainer = document.getElementById('modal-tags');
    const linkContainer = document.getElementById('modal-link-container');
    const link = document.getElementById('modal-link');

    if (modal && title && image && description && tagsContainer) {
        title.textContent = project.title;

        // Handle Image or Video in Modal
        const isVideo = project.image_url && (project.image_url.endsWith('.mp4') || project.image_url.endsWith('.webm') || project.image_url.endsWith('.ogg'));

        // Clear previous content
        const mediaContainer = image.parentNode;
        const existingVideo = mediaContainer.querySelector('video');
        if (existingVideo) {
            existingVideo.remove();
        }
        image.classList.remove('hidden');

        if (isVideo) {
            image.classList.add('hidden');
            const video = document.createElement('video');
            video.src = project.image_url;
            video.controls = true;
            video.autoplay = true;
            video.className = 'w-full h-96 object-cover rounded-lg mb-6';
            mediaContainer.insertBefore(video, image);
        } else {
            image.src = project.image_url || 'https://via.placeholder.com/800x600';
        }

        description.textContent = project.description;

        // Clear and add tags
        tagsContainer.innerHTML = JSON.parse(project.tags || '[]').map(tag => `
            <span class="px-3 py-1 bg-gray-200 dark:bg-gray-600 text-sm rounded-full text-gray-700 dark:text-gray-200">${tag}</span>
        `).join('');

        // Handle External Link
        if (project.external_link) {
            link.href = project.external_link;
            linkContainer.classList.remove('hidden');
        } else {
            linkContainer.classList.add('hidden');
        }

        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
}

function closeModal() {
    const modal = document.getElementById('project-modal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto'; // Restore scrolling
    }
}

// Close modal on Escape key
document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});

// Contact Form Submission
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData.entries());

        try {
            // Static mode: Simulate success
            await new Promise(resolve => setTimeout(resolve, 500));
            alert('Message sent successfully! (Note: This is a static demo, no email was sent.)');
            contactForm.reset();
        } catch (error) {
            console.error('Error sending message:', error);
            alert('An error occurred. Please try again.');
        }
    });
}

// Load projects on page load
document.addEventListener('DOMContentLoaded', loadProjects);
