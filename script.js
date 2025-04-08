// Mobile menu toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navMenu = document.querySelector('.nav-menu');

mobileMenuBtn.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    mobileMenuBtn.innerHTML = navMenu.classList.contains('active') 
        ? '<i class="fas fa-times"></i>' 
        : '<i class="fas fa-bars"></i>';
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 100,
                behavior: 'smooth'
            });
        }
    });
});

// Header scroll effect
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Back to top button
const backToTopBtn = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Animation on scroll
const animateElements = document.querySelectorAll('.animate');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = 1;
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1
});

animateElements.forEach(element => {
    element.style.opacity = 0;
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
    observer.observe(element);
});

// Form validation and EmailJS integration
const form = document.getElementById('estimateForm');
if (form) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        let isValid = true;

        // Validate name
        const name = document.getElementById('name');
        if (!name.value.trim()) {
            name.parentElement.classList.add('error');
            isValid = false;
        } else {
            name.parentElement.classList.remove('error');
        }

        // Validate email
        const email = document.getElementById('email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value)) {
            email.parentElement.classList.add('error');
            isValid = false;
        } else {
            email.parentElement.classList.remove('error');
        }

        // Validate phone
        const phone = document.getElementById('phone');
        if (!phone.value.trim()) {
            phone.parentElement.classList.add('error');
            isValid = false;
        } else {
            phone.parentElement.classList.remove('error');
        }

        // Validate service
        const service = document.getElementById('service');
        if (!service.value) {
            service.parentElement.classList.add('error');
            isValid = false;
        } else {
            service.parentElement.classList.remove('error');
        }

        if (isValid) {
            // Prepare form data for EmailJS
            const formData = {
                name: name.value,
                email: email.value,
                phone: phone.value,
                service: service.value,
                message: document.getElementById('message').value
            };

            // Send email via EmailJS
            emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', formData)
                .then(() => {
                    alert('Thank you for your request! We will contact you shortly.');
                    form.reset();
                }, (error) => {
                    alert('Failed to send your request. Please try again later.');
                    console.error('EmailJS Error:', error);
                });
        }
    });
}

// Set active nav link based on scroll position
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (pageYOffset >= (sectionTop - 150)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Portfolio Modal (See More)
const seeMoreBtn = document.querySelector('.see-more-btn');
const portfolioModal = document.getElementById('portfolioModal');
const closeModal = document.querySelector('.close-modal');

seeMoreBtn.addEventListener('click', () => {
    portfolioModal.classList.add('active');
});

closeModal.addEventListener('click', () => {
    stopGalleryVideos(); // Stop all videos when closing the modal
    portfolioModal.classList.remove('active');
});

portfolioModal.addEventListener('click', (e) => {
    if (e.target === portfolioModal) {
        stopGalleryVideos(); // Stop all videos when clicking outside
        portfolioModal.classList.remove('active');
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && portfolioModal.classList.contains('active')) {
        stopGalleryVideos(); // Stop all videos when closing with Escape
        portfolioModal.classList.remove('active');
    }
});

// Function to stop all videos in the "See More" modal gallery
function stopGalleryVideos() {
    const galleryVideos = document.querySelectorAll('.modal-gallery video');
    galleryVideos.forEach(video => {
        video.pause();
        video.currentTime = 0; // Reset to start (optional)
    });
}

// Full-Screen Media Modal with Section-Specific Navigation
const portfolioItems = document.querySelectorAll('.portfolio-item');
const galleryItems = document.querySelectorAll('.gallery-item');
const mediaModal = document.getElementById('mediaModal');
const closeMediaModal = document.querySelector('.close-media-modal');
const mediaContent = document.querySelector('.media-content');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');

let currentItems = []; // Array of items to navigate (either portfolio or gallery)
let currentIndex = 0;  // Current index within the selected section

// Function to show media at a specific index
function showMedia(index) {
    const item = currentItems[index];
    const mediaSrc = item.getAttribute('data-media');
    const mediaType = item.getAttribute('data-type');
    
    // Clear previous content
    mediaContent.innerHTML = '';

    if (mediaType === 'image') {
        const img = document.createElement('img');
        img.src = mediaSrc;
        img.alt = item.querySelector('img') ? item.querySelector('img').alt : 'Portfolio Image';
        mediaContent.appendChild(img);
    } else if (mediaType === 'video') {
        const video = document.createElement('video');
        video.muted = true;  // Mute the video
        video.autoplay = true;  // Auto-play the video
        // No controls to prevent unmuting or manual control
        const source = document.createElement('source');
        source.src = mediaSrc;
        source.type = 'video/mp4';
        video.appendChild(source);
        mediaContent.appendChild(video);
    }

    // Update navigation button visibility
    updateNavButtons();
}

// Function to update navigation button visibility
function updateNavButtons() {
    prevBtn.classList.toggle('hidden', currentIndex === 0);
    nextBtn.classList.toggle('hidden', currentIndex === currentItems.length - 1);
}

// Function to open media modal for a specific section and index
function openMediaModal(items, index) {
    stopGalleryVideos(); // Stop any playing gallery videos before opening full-screen modal
    currentItems = Array.from(items); // Set the current section's items
    currentIndex = index;
    showMedia(currentIndex);
    mediaModal.classList.add('active');
}

// Function to stop any playing video in the full-screen modal
function stopMediaVideo() {
    const video = mediaContent.querySelector('video');
    if (video) {
        video.pause();  // Stop the video
        video.currentTime = 0;  // Reset to start (optional)
    }
}

// Add click listeners to portfolio items
portfolioItems.forEach((item, index) => {
    item.addEventListener('click', () => openMediaModal(portfolioItems, index));
});

// Add click listeners to gallery items
galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => openMediaModal(galleryItems, index));
});

// Navigation button listeners
prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
        stopMediaVideo();  // Stop current video before switching
        currentIndex--;
        showMedia(currentIndex);
    }
});

nextBtn.addEventListener('click', () => {
    if (currentIndex < currentItems.length - 1) {
        stopMediaVideo();  // Stop current video before switching
        currentIndex++;
        showMedia(currentIndex);
    }
});

// Close media modal
closeMediaModal.addEventListener('click', () => {
    stopMediaVideo();  // Stop video when closing
    mediaModal.classList.remove('active');
    mediaContent.innerHTML = ''; // Clear content
});

mediaModal.addEventListener('click', (e) => {
    if (e.target === mediaModal) {
        stopMediaVideo();  // Stop video when clicking outside
        mediaModal.classList.remove('active');
        mediaContent.innerHTML = '';
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mediaModal.classList.contains('active')) {
        stopMediaVideo();  // Stop video when closing with Escape
        mediaModal.classList.remove('active');
        mediaContent.innerHTML = '';
    } else if (e.key === 'ArrowLeft' && mediaModal.classList.contains('active') && currentIndex > 0) {
        stopMediaVideo();  // Stop current video before switching
        currentIndex--;
        showMedia(currentIndex);
    } else if (e.key === 'ArrowRight' && mediaModal.classList.contains('active') && currentIndex < currentItems.length - 1) {
        stopMediaVideo();  // Stop current video before switching
        currentIndex++;
        showMedia(currentIndex);
    }
});