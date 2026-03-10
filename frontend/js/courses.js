const API = "http://localhost:5000/api";

async function loadCourses(){

  const response = await fetch(`${API}/courses`);
  const courses = await response.json();

  const container = document.getElementById("courses-container");

  container.innerHTML = "";

  courses.forEach(course => {

    container.innerHTML += `
    
    <div class="course-card">

      <h3>${course.title}</h3>

      <p>Price: Rs ${course.price}</p>

      <button onclick="buyCourse(${course.id})">
      Buy Course
      </button>

    </div>

    `;

  });

}

function buyCourse(id){

  window.location.href = `payment.html?course=${id}`;

}

loadCourses();