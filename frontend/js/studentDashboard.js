/**
 * Student Dashboard JavaScript
 * Nexus Skill Academy
 * 
 * Handles:
 * - Course loading from backend
 * - Authentication check
 * - Dashboard statistics
 * - Course navigation
 * - Logout functionality
 */

const API = "http://localhost:5000/api";

/**
 * Load student's enrolled courses from backend
 */
async function loadCourses() {
    const studentId = localStorage.getItem("studentId");

    // Check if student is authenticated
    if (!studentId) {
        alert("Please login first");
        window.location.href = "/student/login.html";
        return;
    }

    try {
        // Show loading state
        const container = document.getElementById("myCourses");
        if (container) {
            container.innerHTML = `
                <div class="loading-container" style="grid-column: 1 / -1;">
                    <div class="loader"></div>
                    <p class="loading-text">Loading your courses...</p>
                </div>
            `;
        }

        // Fetch enrolled courses from backend
        const res = await fetch(`${API}/students/${studentId}/enrollments`);
        
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();

        // Clear container
        if (container) {
            container.innerHTML = "";
        }

        // Check if courses exist
        if (!data || data.length === 0) {
            displayEmptyState();
            updateDashboardStats([]);
            return;
        }

        // Process and display courses
        const courses = data.map(item => {
            const course = item.courses || item.course || item;
            return {
                id: course.id,
                title: course.title,
                category: course.category || 'General',
                description: course.description || 'No description available',
                lessons: course.lessons || course.total_lessons || 0,
                duration: course.duration || 'N/A',
                progress: course.progress || item.progress || 0,
                icon: course.icon || 'fa-book',
                badge: course.badge || 'Course',
                gradient: course.gradient || null
            };
        });

        // Display courses
        displayCourses(courses);
        
        // Update dashboard statistics
        updateDashboardStats(courses);

    } catch (error) {
        console.error('Error loading courses:', error);
        displayErrorState(error.message);
    }
}

/**
 * Display courses in the grid
 */
function displayCourses(courses) {
    const container = document.getElementById("myCourses");
    if (!container) return;

    container.innerHTML = "";

    // Default gradients for variety
    const defaultGradients = [
        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
        'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
    ];

    courses.forEach((course, index) => {
        const gradient = course.gradient || defaultGradients[index % defaultGradients.length];
        const icon = course.icon || 'fa-book';
        const badge = course.badge || 'Course';
        
        const statusText = course.progress === 0 ? 'Start Learning' : 
                         course.progress >= 100 ? 'Review Course' : 'Continue Learning';

        const card = document.createElement('div');
        card.className = 'course-card';
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        card.innerHTML = `
            <div class="course-thumbnail" style="background: ${gradient}">
                <div class="course-thumbnail-pattern"></div>
                <i class="fab ${icon} course-icon"></i>
                <span class="course-badge">${badge}</span>
                <div class="course-progress-wrapper">
                    <div class="progress-info">
                        <span class="progress-label">Progress</span>
                        <span class="progress-percentage">${course.progress}%</span>
                    </div>
                    <div class="progress-bar-bg">
                        <div class="progress-bar-fill" style="width: ${course.progress}%"></div>
                    </div>
                </div>
            </div>
            <div class="course-content">
                <span class="course-category">
                    <i class="fas fa-tag"></i>
                    ${course.category}
                </span>
                <h3 class="course-title">${course.title}</h3>
                <p class="course-description">${course.description}</p>
                <div class="course-meta">
                    <div class="meta-item">
                        <i class="fas fa-play-circle"></i>
                        <span>${course.lessons} Lessons</span>
                    </div>
                    <div class="meta-item">
                        <i class="fas fa-clock"></i>
                        <span>${course.duration}</span>
                    </div>
                </div>
                <div class="course-footer">
                    <button class="continue-btn" onclick="watchCourse(${course.id})">
                        <i class="fas fa-play"></i>
                        <span>${statusText}</span>
                    </button>
                    <button class="bookmark-btn" onclick="toggleBookmark(${course.id})">
                        <i class="fas fa-bookmark"></i>
                    </button>
                </div>
            </div>
        `;
        
        container.appendChild(card);

        // Animate card entrance
        setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

/**
 * Update dashboard statistics
 */
function updateDashboardStats(courses) {
    const totalCoursesEl = document.getElementById("totalCourses");
    const completedCoursesEl = document.getElementById("completedCourses");
    const inProgressCoursesEl = document.getElementById("inProgressCourses");

    if (totalCoursesEl) {
        totalCoursesEl.textContent = courses.length;
    }

    if (completedCoursesEl) {
        const completed = courses.filter(c => c.progress >= 100).length;
        completedCoursesEl.textContent = completed;
    }

    if (inProgressCoursesEl) {
        const inProgress = courses.filter(c => c.progress > 0 && c.progress < 100).length;
        inProgressCoursesEl.textContent = inProgress;
    }
}

/**
 * Display empty state when no courses are enrolled
 */
function displayEmptyState() {
    const container = document.getElementById("myCourses");
    if (!container) return;

    container.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
            <div class="empty-icon">
                <i class="fas fa-book-open"></i>
            </div>
            <h3 class="empty-title">No Courses Enrolled Yet</h3>
            <p class="empty-description">
                Start your learning journey today! Browse our extensive course catalog and enroll in courses that match your career goals.
            </p>
            <button class="browse-btn" onclick="window.location.href='/index.html'">
                <i class="fas fa-compass"></i>
                <span>Explore Courses</span>
            </button>
        </div>
    `;
}

/**
 * Display error state when course loading fails
 */
function displayErrorState(errorMessage) {
    const container = document.getElementById("myCourses");
    if (!container) return;

    container.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
            <div class="empty-icon">
                <i class="fas fa-exclamation-triangle" style="color: #f56565;"></i>
            </div>
            <h3 class="empty-title">Failed to Load Courses</h3>
            <p class="empty-description">
                ${errorMessage || 'An error occurred while loading your courses. Please try again later.'}
            </p>
            <button class="browse-btn" onclick="loadCourses()">
                <i class="fas fa-redo"></i>
                <span>Retry</span>
            </button>
        </div>
    `;
}

/**
 * Navigate to course player
 */
function watchCourse(id) {
    if (!id) {
        console.error('Course ID is required');
        return;
    }
    window.location.href = `/course-player.html?id=${id}`;
}

/**
 * Toggle course bookmark (placeholder for future implementation)
 */
function toggleBookmark(courseId) {
    console.log('Bookmark toggled for course:', courseId);
    // TODO: Implement bookmark functionality with backend
    // Example:
    // fetch(`${API}/students/${studentId}/bookmarks/${courseId}`, {
    //     method: 'POST'
    // });
}

/**
 * Logout functionality
 */
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        // Clear all stored data
        localStorage.removeItem("studentId");
        localStorage.removeItem("studentName");
        localStorage.removeItem("studentEmail");
        sessionStorage.clear();
        
        // Redirect to homepage
        window.location.href = "/index.html";
    }
}

/**
 * Initialize dashboard on page load
 */
document.addEventListener('DOMContentLoaded', function() {
    // Load student information
    const studentName = localStorage.getItem('studentName') || 'Student';
    const studentEmail = localStorage.getItem('studentEmail') || '';

    // Update UI with student info
    const studentNameEl = document.getElementById('studentName');
    const headerUserNameEl = document.getElementById('headerUserName');
    const userAvatarEl = document.getElementById('userAvatar');

    if (studentNameEl) {
        const firstName = studentName.split(' ')[0];
        studentNameEl.textContent = firstName;
    }

    if (headerUserNameEl) {
        headerUserNameEl.textContent = studentName;
    }

    if (userAvatarEl) {
        const initials = studentName.split(' ')
            .map(n => n[0])
            .join('')
            .substring(0, 2)
            .toUpperCase();
        userAvatarEl.textContent = initials;
    }

    // Set greeting based on time of day
    setGreeting();

    // Load courses from backend
    loadCourses();
});

/**
 * Set greeting based on current time
 */
function setGreeting() {
    const greetingTimeEl = document.getElementById('greetingTime');
    if (!greetingTimeEl) return;

    const hour = new Date().getHours();
    let greeting = 'Good Morning';
    
    if (hour >= 12 && hour < 17) {
        greeting = 'Good Afternoon';
    } else if (hour >= 17) {
        greeting = 'Good Evening';
    }
    
    greetingTimeEl.textContent = greeting;
}

/**
 * Export functions for external use
 */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        loadCourses,
        watchCourse,
        logout,
        toggleBookmark
    };
}