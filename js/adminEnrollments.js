/**
 * Admin Enrollments JavaScript
 * Nexus Skill Academy
 * 
 * Handles:
 * - Loading enrollments from backend
 * - Approving/Rejecting enrollments
 * - Filtering enrollments by status
 * - Updating statistics
 * - Error handling and user feedback
 */

const API = "http://localhost:5000/api";

// Global state
let allEnrollments = [];
let currentFilter = 'all';

/**
 * Load all enrollments from backend
 */
async function loadEnrollments() {
    try {
        // Show loading state
        const table = document.getElementById("enrollmentTable");
        if (table) {
            table.innerHTML = `
                <tr>
                    <td colspan="6">
                        <div class="loading">
                            <div class="spinner"></div>
                            <p class="loading-text">Loading enrollments...</p>
                        </div>
                    </td>
                </tr>
            `;
        }

        // Fetch enrollments from backend
        const res = await fetch(`${API}/enrollments`);
        
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        allEnrollments = data;

        // Display enrollments
        displayEnrollments(data);
        
        // Update statistics
        updateStatistics(data);

    } catch (error) {
        console.error('Error loading enrollments:', error);
        displayErrorState(error.message);
    }
}

/**
 * Display enrollments in table
 */
function displayEnrollments(enrollments) {
    const table = document.getElementById("enrollmentTable");
    if (!table) return;

    // Clear table
    table.innerHTML = "";

    // Check if enrollments exist
    if (!enrollments || enrollments.length === 0) {
        table.innerHTML = `
            <tr>
                <td colspan="6">
                    <div class="empty-state">
                        <div class="empty-icon">
                            <i class="fas fa-inbox"></i>
                        </div>
                        <h3 class="empty-title">No Enrollments Found</h3>
                        <p class="empty-description">
                            ${currentFilter === 'pending' ? 'No pending enrollment requests at the moment.' : 
                              currentFilter === 'approved' ? 'No approved enrollments yet.' :
                              'No enrollment requests available.'}
                        </p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    // Display each enrollment
    enrollments.forEach((item, index) => {
        const row = createEnrollmentRow(item, index);
        table.appendChild(row);
    });

    // Animate rows
    animateTableRows();
}

/**
 * Create table row for enrollment
 */
function createEnrollmentRow(item, index) {
    const row = document.createElement('tr');
    row.style.opacity = '0';
    row.style.transform = 'translateY(10px)';
    
    // Get student and course info (handle different response formats)
    const studentName = item.student_name || item.students?.name || 'Unknown Student';
    const studentEmail = item.student_email || item.students?.email || '';
    const courseName = item.course_name || item.courses?.title || 'Unknown Course';
    const enrollmentDate = item.created_at || item.enrollment_date || new Date().toISOString();
    const status = item.payment_status || item.status || 'pending';
    
    // Get initials for avatar
    const initials = studentName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    
    // Format date
    const formattedDate = new Date(enrollmentDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    // Determine status badge class and icon
    let statusClass = 'status-pending';
    let statusIcon = 'fa-clock';
    let statusText = 'Pending';
    
    if (status === 'paid' || status === 'approved') {
        statusClass = 'status-approved';
        statusIcon = 'fa-check-circle';
        statusText = 'Approved';
    } else if (status === 'rejected' || status === 'failed') {
        statusClass = 'status-rejected';
        statusIcon = 'fa-times-circle';
        statusText = 'Rejected';
    }

    row.innerHTML = `
        <td>
            <span class="enrollment-id">#${item.id}</span>
        </td>
        <td>
            <div class="student-info">
                <div class="student-avatar">${initials}</div>
                <div class="student-details">
                    <h4>${studentName}</h4>
                    <p>${studentEmail || `Student ID: ${item.student_id}`}</p>
                </div>
            </div>
        </td>
        <td>
            <span class="course-name">${courseName}</span>
        </td>
        <td>
            <span style="color: var(--text-light);">${formattedDate}</span>
        </td>
        <td>
            <span class="status-badge ${statusClass}">
                <i class="fas ${statusIcon}"></i>
                ${statusText}
            </span>
        </td>
        <td>
            ${status === 'pending' ? `
                <div class="action-group">
                    <button class="approve-btn" onclick="approvePayment(${item.id})">
                        <i class="fas fa-check"></i>
                        Approve
                    </button>
                    <button class="reject-btn" onclick="rejectPayment(${item.id})">
                        <i class="fas fa-times"></i>
                        Reject
                    </button>
                </div>
            ` : `
                <span style="color: var(--text-light); font-size: 13px; font-weight: 600;">
                    ${statusText === 'Approved' ? '✓ Processed' : '✗ Rejected'}
                </span>
            `}
        </td>
    `;

    return row;
}

/**
 * Animate table rows on load
 */
function animateTableRows() {
    const rows = document.querySelectorAll('#enrollmentTable tr');
    rows.forEach((row, index) => {
        setTimeout(() => {
            row.style.transition = 'all 0.5s ease';
            row.style.opacity = '1';
            row.style.transform = 'translateY(0)';
        }, index * 50);
    });
}

/**
 * Approve enrollment payment
 */
async function approvePayment(id) {
    if (!confirm('Are you sure you want to approve this enrollment?')) {
        return;
    }

    try {
        const res = await fetch(`${API}/enrollments/${id}/payment`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                payment_status: "paid"
            })
        });

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        // Show success message
        showNotification('Payment approved successfully!', 'success');

        // Reload enrollments
        await loadEnrollments();

    } catch (error) {
        console.error('Error approving payment:', error);
        showNotification('Failed to approve payment. Please try again.', 'error');
    }
}

/**
 * Reject enrollment payment
 */
async function rejectPayment(id) {
    if (!confirm('Are you sure you want to reject this enrollment?')) {
        return;
    }

    try {
        const res = await fetch(`${API}/enrollments/${id}/payment`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                payment_status: "rejected"
            })
        });

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        // Show success message
        showNotification('Enrollment rejected.', 'warning');

        // Reload enrollments
        await loadEnrollments();

    } catch (error) {
        console.error('Error rejecting payment:', error);
        showNotification('Failed to reject enrollment. Please try again.', 'error');
    }
}

/**
 * Filter enrollments by status
 */
function filterEnrollments(filter) {
    currentFilter = filter;
    
    // Update active filter button
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    // Filter data
    let filteredData = allEnrollments;
    
    if (filter === 'pending') {
        filteredData = allEnrollments.filter(item => {
            const status = item.payment_status || item.status;
            return status === 'pending' || status === 'unpaid';
        });
    } else if (filter === 'approved') {
        filteredData = allEnrollments.filter(item => {
            const status = item.payment_status || item.status;
            return status === 'paid' || status === 'approved';
        });
    }

    // Display filtered data
    displayEnrollments(filteredData);
}

/**
 * Update dashboard statistics
 */
function updateStatistics(enrollments) {
    if (!enrollments) return;

    // Count pending enrollments
    const pendingCount = enrollments.filter(item => {
        const status = item.payment_status || item.status;
        return status === 'pending' || status === 'unpaid';
    }).length;

    // Count approved enrollments today
    const today = new Date().toDateString();
    const approvedToday = enrollments.filter(item => {
        const status = item.payment_status || item.status;
        const date = new Date(item.created_at || item.enrollment_date).toDateString();
        return (status === 'paid' || status === 'approved') && date === today;
    }).length;

    // Update UI
    const pendingEl = document.getElementById('pendingCount');
    const approvedEl = document.getElementById('approvedCount');
    const totalEl = document.getElementById('totalCount');

    if (pendingEl) {
        animateCounter(pendingEl, pendingCount);
    }

    if (approvedEl) {
        animateCounter(approvedEl, approvedToday);
    }

    if (totalEl) {
        animateCounter(totalEl, enrollments.length);
    }
}

/**
 * Animate counter numbers
 */
function animateCounter(element, targetValue) {
    const duration = 1000;
    const steps = 30;
    const stepValue = targetValue / steps;
    let currentValue = 0;
    let currentStep = 0;

    const interval = setInterval(() => {
        currentStep++;
        currentValue += stepValue;

        if (currentStep >= steps) {
            element.textContent = targetValue;
            clearInterval(interval);
        } else {
            element.textContent = Math.floor(currentValue);
        }
    }, duration / steps);
}

/**
 * Show notification message
 */
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #10b981, #059669)' : 
                     type === 'error' ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 
                     type === 'warning' ? 'linear-gradient(135deg, #f59e0b, #d97706)' :
                     'linear-gradient(135deg, #667eea, #764ba2)'};
        color: white;
        border-radius: 12px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        font-weight: 600;
        font-size: 14px;
        animation: slideIn 0.3s ease;
        display: flex;
        align-items: center;
        gap: 10px;
    `;

    const icon = type === 'success' ? 'fa-check-circle' :
                 type === 'error' ? 'fa-exclamation-circle' :
                 type === 'warning' ? 'fa-exclamation-triangle' :
                 'fa-info-circle';

    notification.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
    `;

    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
            style.remove();
        }, 300);
    }, 3000);
}

/**
 * Display error state
 */
function displayErrorState(errorMessage) {
    const table = document.getElementById("enrollmentTable");
    if (!table) return;

    table.innerHTML = `
        <tr>
            <td colspan="6">
                <div class="empty-state">
                    <div class="empty-icon">
                        <i class="fas fa-exclamation-triangle" style="color: #ef4444;"></i>
                    </div>
                    <h3 class="empty-title">Failed to Load Enrollments</h3>
                    <p class="empty-description">
                        ${errorMessage || 'An error occurred while loading enrollments. Please try again.'}
                    </p>
                    <button class="approve-btn" onclick="loadEnrollments()" style="margin-top: 20px;">
                        <i class="fas fa-redo"></i>
                        Retry
                    </button>
                </div>
            </td>
        </tr>
    `;
}

/**
 * Initialize admin dashboard
 */
document.addEventListener('DOMContentLoaded', function() {
    // Load enrollments on page load
    loadEnrollments();

    // Auto-refresh every 30 seconds
    setInterval(() => {
        loadEnrollments();
    }, 30000);
});

/**
 * Export functions for external use
 */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        loadEnrollments,
        approvePayment,
        rejectPayment,
        filterEnrollments
    };
}