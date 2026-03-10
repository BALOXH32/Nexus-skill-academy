const API = "http://localhost:5000/api";

const params = new URLSearchParams(window.location.search);
const courseId = params.get("id");

async function loadCourse() {

  const response = await fetch(`${API}/courses/${courseId}`);
  const course = await response.json();

  document.getElementById("course-title").innerText = course.title;
  document.getElementById("course-price").innerText = "Rs " + course.price;

  document.getElementById("buyBtn").href =
    `payment.html?course_id=${course.id}`;

}

loadCourse();