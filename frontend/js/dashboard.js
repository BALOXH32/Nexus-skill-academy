document.getElementById("signupForm").addEventListener("submit", async function(e){

e.preventDefault();

const name = document.getElementById("signupName").value;
const email = document.getElementById("signupEmail").value;
const password = document.getElementById("signupPwd").value;
const phone = document.getElementById("signupPhone").value;

try{

const response = await fetch("http://localhost:5000/api/students",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body: JSON.stringify({
name:name,
email:email,
password:password,
phone:phone
})
});

const data = await response.json();

if(response.ok){

alert("Signup Successful!");

document.getElementById("signupForm").reset();

}else{

alert(data.error);

}

}catch(error){

console.error(error);

}

});