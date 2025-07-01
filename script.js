// Accordion functionality
function toggleAccordion(header) {
    const item = header.parentElement;
    const content = item.querySelector('.accordion-content');
    const icon = header.querySelector('i');
    
    // Close all other accordion items
    const allItems = document.querySelectorAll('.accordion-item');
    allItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
            otherItem.classList.remove('active');
            const otherIcon = otherItem.querySelector('.accordion-header i');
            otherIcon.style.transform = 'rotate(0deg)';
        }
    });
    
    // Toggle current item
    item.classList.toggle('active');
    
    if (item.classList.contains('active')) {
        icon.style.transform = 'rotate(180deg)';
    } else {
        icon.style.transform = 'rotate(0deg)';
    }
}

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Mobile menu toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
    
    // Header scroll effect
    const header = document.querySelector('.header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.style.background = 'rgba(11, 20, 38, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(11, 20, 38, 0.95)';
            header.style.boxShadow = 'none';
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.overview-card, .accordion-item, .recommendation-card, .advantage-card, .impact-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
    
    // Create and render chart
    createTarifasChart();
    
    // Copy images to site directory
    copyImages();
});

// Chart creation function
function createTarifasChart() {
    const canvas = document.getElementById('tarifasChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Chart data
    const data = {
        labels: ['Valores Originais', 'Outubro 2024', 'Nov/Dez/Jan/Fev', 'Março 2025', 'Abr/Mai/Jun 2025'],
        datasets: [
            {
                label: '318-634cm',
                data: [3.90, 5.41, 7.79, 7.91, 7.05],
                borderColor: '#4A9B9B',
                backgroundColor: 'rgba(74, 155, 155, 0.1)',
                borderWidth: 3,
                fill: true
            },
            {
                label: '635-951cm',
                data: [4.06, 5.41, 7.79, 7.91, 7.05],
                borderColor: '#FFD700',
                backgroundColor: 'rgba(255, 215, 0, 0.1)',
                borderWidth: 3,
                fill: true
            },
            {
                label: '952-1268cm',
                data: [3.91, 5.46, 7.84, 7.91, 7.05],
                borderColor: '#6366F1',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                borderWidth: 3,
                fill: true
            }
        ]
    };
    
    // Simple chart drawing (without Chart.js dependency)
    drawSimpleChart(ctx, data);
}

function drawSimpleChart(ctx, data) {
    const canvas = ctx.canvas;
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Chart dimensions
    const padding = 60;
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;
    
    // Find max value
    const maxValue = Math.max(...data.datasets.flatMap(d => d.data));
    const minValue = Math.min(...data.datasets.flatMap(d => d.data));
    const valueRange = maxValue - minValue;
    
    // Draw background
    ctx.fillStyle = '#f9fafb';
    ctx.fillRect(0, 0, width, height);
    
    // Draw grid lines
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    
    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
        const y = padding + (chartHeight / 5) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
        
        // Y-axis labels
        const value = maxValue - (valueRange / 5) * i;
        ctx.fillStyle = '#6b7280';
        ctx.font = '12px Inter';
        ctx.textAlign = 'right';
        ctx.fillText(`€${value.toFixed(2)}`, padding - 10, y + 4);
    }
    
    // Vertical grid lines
    for (let i = 0; i < data.labels.length; i++) {
        const x = padding + (chartWidth / (data.labels.length - 1)) * i;
        ctx.beginPath();
        ctx.moveTo(x, padding);
        ctx.lineTo(x, height - padding);
        ctx.stroke();
        
        // X-axis labels
        ctx.fillStyle = '#6b7280';
        ctx.font = '11px Inter';
        ctx.textAlign = 'center';
        ctx.save();
        ctx.translate(x, height - padding + 20);
        ctx.rotate(-Math.PI / 6);
        ctx.fillText(data.labels[i], 0, 0);
        ctx.restore();
    }
    
    // Draw lines
    data.datasets.forEach((dataset, datasetIndex) => {
        ctx.strokeStyle = dataset.borderColor;
        ctx.lineWidth = dataset.borderWidth;
        ctx.beginPath();
        
        dataset.data.forEach((value, index) => {
            const x = padding + (chartWidth / (data.labels.length - 1)) * index;
            const y = padding + chartHeight - ((value - minValue) / valueRange) * chartHeight;
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.stroke();
        
        // Draw points
        ctx.fillStyle = dataset.borderColor;
        dataset.data.forEach((value, index) => {
            const x = padding + (chartWidth / (data.labels.length - 1)) * index;
            const y = padding + chartHeight - ((value - minValue) / valueRange) * chartHeight;
            
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, 2 * Math.PI);
            ctx.fill();
        });
    });
    
    // Draw legend
    const legendY = 20;
    data.datasets.forEach((dataset, index) => {
        const legendX = padding + index * 120;
        
        // Legend color box
        ctx.fillStyle = dataset.borderColor;
        ctx.fillRect(legendX, legendY, 15, 15);
        
        // Legend text
        ctx.fillStyle = '#374151';
        ctx.font = '12px Inter';
        ctx.textAlign = 'left';
        ctx.fillText(dataset.label, legendX + 20, legendY + 12);
    });
    
    // Chart title
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 16px Inter';
    ctx.textAlign = 'center';
    ctx.fillText('Evolução das Tarifas por Período', width / 2, 20);
}

// Copy images function
function copyImages() {
    // This would normally copy images from the upload directory
    // For now, we'll create placeholder functionality
    console.log('Images would be copied to site directory');
}

// Utility functions
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'EUR'
    }).format(value);
}

function formatPercentage(value) {
    return `${value.toFixed(1)}%`;
}

// Add loading states
function showLoading(element) {
    element.classList.add('loading');
}

function hideLoading(element) {
    element.classList.remove('loading');
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
});

// Performance monitoring
window.addEventListener('load', function() {
    const loadTime = performance.now();
    console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
});

// Mobile menu styles
const mobileMenuStyles = `
@media (max-width: 768px) {
    .nav-menu {
        position: fixed;
        top: 100%;
        left: 0;
        width: 100%;
        background: rgba(11, 20, 38, 0.98);
        backdrop-filter: blur(10px);
        flex-direction: column;
        padding: var(--space-6);
        transform: translateY(-100%);
        transition: transform 0.3s ease-in-out;
        z-index: 999;
    }
    
    .nav-menu.active {
        transform: translateY(0);
    }
    
    .nav-link {
        padding: var(--space-3) 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
}
`;

// Inject mobile menu styles
const styleSheet = document.createElement('style');
styleSheet.textContent = mobileMenuStyles;
document.head.appendChild(styleSheet);

