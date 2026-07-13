document.addEventListener('DOMContentLoaded', () => {
    initHeaderScroll();
    initExplorerTabs();
    initGalleryFilters();
});

// 1. Shrink Header & Glass Effect on Scroll
function initHeaderScroll() {
    const header = document.getElementById('header');
    if (!header) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// 2. Interactive Explorer Tabs Switcher
function initExplorerTabs() {
    const tabButtons = document.querySelectorAll('.explorer-tab-btn');
    const tabPanes = document.querySelectorAll('.explorer-pane');
    if (!tabButtons.length || !tabPanes.length) return;

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-tab');
            
            // Deactivate all buttons
            tabButtons.forEach(b => b.classList.remove('active'));
            // Activate clicked button
            btn.classList.add('active');

            // Show/Hide target panes with smooth transition
            tabPanes.forEach(pane => {
                if (pane.id === targetId) {
                    pane.classList.add('active');
                } else {
                    pane.classList.remove('active');
                }
            });
        });
    });
}

// 3. Lightbox Modal Controller for Gallery Zooming
const lightboxImages = [
    {
        src: "https://i.ibb.co/YBJ2DGpt/IMG-20260215-WA0007.jpg",
        caption: "Living Room"
    },
    {
        src: "https://i.ibb.co/ccbd5fmn/IMG-20260215-WA0006.jpg",
        caption: "Bedroom 1"
    },
    {
        src: "https://i.ibb.co/BHCDDwP3/IMG-20260215-WA0003.jpg",
        caption: "Kitchen"
    },
    {
        src: "https://i.ibb.co/q3M8v0hw/IMG-20260215-WA0004.jpg",
        caption: "Furnishing"
    },
    {
        src: "https://i.ibb.co/236pYXHw/IMG-20260215-WA0008.jpg",
        caption: "Parking"
    },
    {
        src: "https://i.ibb.co/dwcfCs7h/IMG-20260215-WA0009.jpg",
        caption: "Bedroom 2"
    }
];

let visibleImages = [...lightboxImages];
let currentLightboxIndex = 0;

window.openLightbox = function(index) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCap = document.getElementById('lightbox-caption');

    if (!lightbox || !lightboxImg || !lightboxCap) return;

    // Dynamically query all currently visible items in the DOM
    const visibleItems = Array.from(document.querySelectorAll('.gallery-item'))
        .filter(item => item.style.display !== 'none');

    visibleImages = visibleItems.map(item => {
        return {
            src: item.querySelector('img').src,
            caption: item.querySelector('.gallery-overlay h4').textContent.trim()
        };
    });

    // Find index of clicked item in the visible list
    const allItems = document.querySelectorAll('.gallery-item');
    if (!allItems[index]) return;
    const clickedItemSrc = allItems[index].querySelector('img').src;
    
    currentLightboxIndex = visibleImages.findIndex(img => img.src === clickedItemSrc);
    if (currentLightboxIndex === -1) {
        currentLightboxIndex = 0;
    }

    if (visibleImages[currentLightboxIndex]) {
        lightboxImg.src = visibleImages[currentLightboxIndex].src;
        lightboxCap.textContent = visibleImages[currentLightboxIndex].caption;
    }

    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Stop background scrolling
};

window.closeLightbox = function() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Enable background scrolling
    }
};

window.nextLightbox = function() {
    if (visibleImages.length === 0) return;
    currentLightboxIndex = (currentLightboxIndex + 1) % visibleImages.length;
    updateLightboxContent();
};

window.prevLightbox = function() {
    if (visibleImages.length === 0) return;
    currentLightboxIndex = (currentLightboxIndex - 1 + visibleImages.length) % visibleImages.length;
    updateLightboxContent();
};

function updateLightboxContent() {
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCap = document.getElementById('lightbox-caption');

    if (lightboxImg && lightboxCap && visibleImages[currentLightboxIndex]) {
        lightboxImg.style.opacity = '0.3';
        setTimeout(() => {
            lightboxImg.src = visibleImages[currentLightboxIndex].src;
            lightboxCap.textContent = visibleImages[currentLightboxIndex].caption;
            lightboxImg.style.opacity = '1';
        }, 150);
    }
}

// 4. Gallery Category Filtering
function initGalleryFilters() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    const galleryItems = document.querySelectorAll('.gallery-item');
    if (!filterTabs.length || !galleryItems.length) return;

    // Apply the initial filter on load based on the active tab
    const activeTab = document.querySelector('.filter-tab.active');
    if (activeTab) {
        const initialFilter = activeTab.getAttribute('data-filter');
        applyFilter(initialFilter, false);
    }

    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active from other tabs
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const filterValue = tab.getAttribute('data-filter');
            applyFilter(filterValue, true);
        });
    });

    function applyFilter(filterValue, animate) {
        galleryItems.forEach(item => {
            const itemCategory = item.getAttribute('data-category');
            if (filterValue === 'all' || itemCategory === filterValue) {
                item.style.display = 'block';
                if (animate) {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.95)';
                    // Trigger reflow
                    void item.offsetHeight;
                    item.style.transition = 'all 0.3s ease-out';
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                } else {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                    item.style.transition = 'none';
                }
            } else {
                if (animate) {
                    item.style.transition = 'all 0.2s ease-in';
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        const currentActiveFilter = document.querySelector('.filter-tab.active');
                        const activeFilterValue = currentActiveFilter ? currentActiveFilter.getAttribute('data-filter') : '';
                        if (activeFilterValue !== 'all' && itemCategory !== activeFilterValue) {
                            item.style.display = 'none';
                        }
                    }, 200);
                } else {
                    item.style.display = 'none';
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.95)';
                }
            }
        });
    }
}

// Close lightbox on Escape and Arrow keys
document.addEventListener('keydown', (e) => {
    const lightbox = document.getElementById('lightbox');
    if (lightbox && lightbox.classList.contains('active')) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') nextLightbox();
        if (e.key === 'ArrowLeft') prevLightbox();
    }
});
