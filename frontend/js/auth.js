const API = "http://localhost:5000/api";

async function loginStudent() {

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const response = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  });

  const data = await response.json();

  if (data.token) {

    localStorage.setItem("token", data.token);

    window.location.href = "/student/dashboard.html";

  } else {

    alert("Invalid login");

  }

}