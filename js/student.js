const API = "http://localhost:5000/api";

async function loadMyCourses(){

const studentId = localStorage.getItem("studentId");

if(!studentId){
  alert("Please login first");
  window.location.href="/student/login.html";
  return;
}

const response = await fetch(`${API}/students/${studentId}/enrollments`);

const courses = await response.json();

const container = document.getElementById("myCourses");

container.innerHTML = "";

courses.forEach(item => {

const course = item.courses;

container.innerHTML += `

<div class="course-card">

<h3>${course.title}</h3>

<button onclick="openCourse(${course.id})">
Watch Course
</button>

</div>

`;

});

}

function openCourse(id){

window.location.href = `/course-player.html?id=${id}`;

}

loadMyCourses();