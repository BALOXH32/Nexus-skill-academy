const API = "http://localhost:5000/api";

const params = new URLSearchParams(window.location.search);
const courseId = params.get("course");

async function completePayment(){

  const studentId = localStorage.getItem("studentId");

  if(!studentId){
    alert("Please login first");
    window.location.href = "student/login.html";
    return;
  }

  const response = await fetch(`${API}/enrollments`,{

    method:"POST",

    headers:{
      "Content-Type":"application/json"
    },

    body: JSON.stringify({
      student_id: studentId,
      course_id: courseId,
      payment_status: "pending"
    })

  });

  const data = await response.json();

  console.log(data);

  if(response.ok){

    alert("Enrollment created! Send payment screenshot on WhatsApp.");

  }else{

    alert("Enrollment failed");

  }

}