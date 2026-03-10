const API = "http://localhost:5000/api";

async function adminLogin() {

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const response = await fetch(`${API}/admin/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  });

  const data = await response.json();

  if (data.token) {

    localStorage.setItem("adminToken", data.token);

    window.location.href = "/admin/dashboard.html";

  } else {

    alert("Admin login failed");

  }

}
