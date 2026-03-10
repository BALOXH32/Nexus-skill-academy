document.getElementById("signupForm").addEventListener("submit", async function(e) {
  e.preventDefault();

  const name = document.getElementById("signupName").value;
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPwd").value;

  try {
    const response = await fetch("http://localhost:5000/api/students", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: name,
        email: email,
        password: password
      })
    });

    const data = await response.json();

    if(response.ok){
      alert("Signup Successful 🎉");
      console.log(data);
    }else{
      alert(data.error || "Signup failed");
    }

  } catch (error) {
    console.error(error);
    alert("Server error");
  }
});