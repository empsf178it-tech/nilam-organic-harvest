// Initialize Lucide Icons
lucide.createIcons();

// Navbar scroll effect
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 15) {
        navbar.classList.add('nav-scrolled');
    } else {
        navbar.classList.remove('nav-scrolled');
    }
});

// Intersection Observer for scroll animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15 // Trigger when 15% of the element is visible
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target); // Unobserve once animated
        }
    });
}, observerOptions);

// Select all elements with the reveal-up class
document.addEventListener('DOMContentLoaded', () => {
    const revealElements = document.querySelectorAll('.reveal-up');
    revealElements.forEach(el => observer.observe(el));
});

// --- Shopping Cart Logic ---
let cart = [];
const cartToggle = document.getElementById('cart-toggle');
const closeCart = document.getElementById('close-cart');
const cartSidebar = document.getElementById('cart-sidebar');
const cartOverlay = document.getElementById('cart-overlay');
const cartCount = document.getElementById('cart-count');
const cartItemsContainer = document.getElementById('cart-items');
const emptyCartMsg = document.getElementById('empty-cart-msg');
const cartTotal = document.getElementById('cart-total');

// Open Cart
function openCart() {
    cartSidebar.classList.remove('translate-x-full');
    cartOverlay.classList.remove('opacity-0', 'pointer-events-none');
}

// Close Cart
function closeCartSidebar() {
    cartSidebar.classList.add('translate-x-full');
    cartOverlay.classList.add('opacity-0', 'pointer-events-none');
}

// Event Listeners for Opening/Closing
cartToggle.addEventListener('click', openCart);
closeCart.addEventListener('click', closeCartSidebar);
cartOverlay.addEventListener('click', closeCartSidebar);

// Add to Cart Function
window.addToCart = function(name, price) {
    // Check if item already exists
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1 });
    }
    
    updateCartUI();
    openCart(); // Show cart when item is added
};

// Remove from cart
window.removeFromCart = function(name) {
    cart = cart.filter(item => item.name !== name);
    updateCartUI();
};

// Update Cart UI
function updateCartUI() {
    // Update Badge Count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.innerText = totalItems;
    if (totalItems > 0) {
        cartCount.classList.remove('opacity-0');
    } else {
        cartCount.classList.add('opacity-0');
    }

    // Update Items Container
    if (cart.length === 0) {
        emptyCartMsg.style.display = 'flex';
        // Remove all added items
        Array.from(cartItemsContainer.children).forEach(child => {
            if (child.id !== 'empty-cart-msg') child.remove();
        });
    } else {
        emptyCartMsg.style.display = 'none';
        
        // Clear old items
        Array.from(cartItemsContainer.children).forEach(child => {
            if (child.id !== 'empty-cart-msg') child.remove();
        });

        // Add new items
        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'flex justify-between items-center py-4 border-b border-stone/50';
            itemElement.innerHTML = `
                <div>
                    <h4 class="font-heading text-lg text-primary">${item.name}</h4>
                    <span class="text-xs text-charcoal/60 font-light tracking-wide">Qty: ${item.quantity} × ₹${item.price}</span>
                </div>
                <div class="flex items-center gap-4">
                    <span class="font-medium text-primary">₹${item.price * item.quantity}</span>
                    <button onclick="removeFromCart('${item.name}')" class="text-charcoal/40 hover:text-red-500 transition-colors">
                        <i data-lucide="trash-2" class="w-4 h-4"></i>
                    </button>
                </div>
            `;
            cartItemsContainer.appendChild(itemElement);
        });
        
        // Reinitialize icons for the new elements
        lucide.createIcons();
    }

    // Update Total
    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.innerText = totalAmount;
}

// Strict 3-second start and infinite 3-second loop lock for footer video
document.addEventListener('DOMContentLoaded', () => {
    const vid = document.getElementById('footer-bg-video');
    if (vid) {
        vid.muted = true;
        vid.currentTime = 3;

        // Loop lock: Ensure video NEVER goes below 3s even when looping
        vid.addEventListener('timeupdate', () => {
            if (vid.currentTime < 3 && !vid.seeking) {
                vid.currentTime = 3;
            }
            if (vid.duration && vid.currentTime >= vid.duration - 0.3) {
                vid.currentTime = 3;
                vid.play();
            }
        });

        vid.addEventListener('ended', () => {
            vid.currentTime = 3;
            vid.play();
        });

        const startPlay = () => {
            vid.currentTime = 3;
            vid.play().catch(() => {});
        };

        startPlay();
        window.addEventListener('scroll', startPlay, { once: true });
    }
});
// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const closeMobileMenu = document.getElementById('close-mobile-menu');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenu.classList.remove('translate-x-full');
        });
    }

    if (closeMobileMenu && mobileMenu) {
        closeMobileMenu.addEventListener('click', () => {
            mobileMenu.classList.add('translate-x-full');
        });
    }

    // Close menu when clicking links
    if (mobileMenu) {
        const links = mobileMenu.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('translate-x-full');
            });
        });
    }
});

// Instant zero-lag playback for Home Hero background video starting from 3s and looping from 3s
document.addEventListener('DOMContentLoaded', () => {
    const heroVid = document.getElementById('hero-bg-video');
    if (heroVid) {
        heroVid.muted = true;

        const setStartTime = () => {
            if (heroVid.currentTime < 3) {
                heroVid.currentTime = 3;
            }
        };

        if (heroVid.readyState >= 1) {
            setStartTime();
        } else {
            heroVid.addEventListener('loadedmetadata', setStartTime, { once: true });
        }

        heroVid.addEventListener('timeupdate', () => {
            if (heroVid.currentTime < 3 && !heroVid.seeking) {
                heroVid.currentTime = 3;
            }
            if (heroVid.duration && heroVid.currentTime >= heroVid.duration - 0.3) {
                heroVid.currentTime = 3;
                heroVid.play();
            }
        });

        heroVid.addEventListener('ended', () => {
            heroVid.currentTime = 3;
            heroVid.play();
        });

        heroVid.play().catch(() => {});
    }
});

// --- OPTIMIZED LAZY VIDEO LOADING ---
document.addEventListener('DOMContentLoaded', () => {
    // Lazy load footer video using IntersectionObserver
    const footerVideo = document.getElementById('footer-bg-video');
    if (footerVideo) {
        const videoObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    footerVideo.preload = "auto";
                    footerVideo.load();
                    const playPromise = footerVideo.play();
                    if (playPromise !== undefined) {
                        playPromise.catch(() => {});
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, { rootMargin: "200px 0px" });

        videoObserver.observe(footerVideo);
    }
});
