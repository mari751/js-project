let accessToken = "";
let signUpButton = document.getElementById("signup-button");
let signInButton = document.getElementById("signin-button");

signUpButton.addEventListener("click", function (event) {
  event.preventDefault();
  signUp();
});

signInButton.addEventListener("click", function (event) {
  event.preventDefault();
  signIn();
});

async function signUp() {
  const userData = {
    firstName: document.getElementById("signup-firsName").value,
    lastName: document.getElementById("signup-lastname").value,
    age: Number(document.getElementById("signup-age").value),
    email: document.getElementById("signup-email").value,
    password: document.getElementById("signup-password").value,
    address: document.getElementById("signup-address").value,
    phone: document.getElementById("phone").value,
    zipcode: document.getElementById("signup-zipcode").value,
    avatar: document.getElementById("signup-avatar").value,
    gender: document.getElementById("signup-gender").value,
  };
  const res = await fetch("https://api.everrest.educata.dev/auth/sign_up", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "*/*",
    },
    body: JSON.stringify(userData),
  });
  const data = await res.json();
  showModal("Welcome! You have successfully signed up.");
  console.log(data);
}

async function signIn() {
    const userData={
        email:document.getElementById("signin-email").value,
        password:document.getElementById("signin-password").value
    }
  const res = await fetch("https://api.everrest.educata.dev/auth/sign_in",{
    method:"POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "*/*",
    },
    body:JSON.stringify(userData)
  })
  const data = await res.json();
  accessToken=data.access_token;
  sessionStorage.setItem("token", accessToken)
  showModal("Welcome back!");
  console.log(data)
}

const modeToggle = document.getElementById("mode-toggle");

modeToggle.addEventListener("click", function () {
  if (modeToggle.textContent === "Toggle Dark Mode") {
    document.body.classList.add("dark-mode");
    modeToggle.textContent = "Toggle Light Mode";
  } else {
    document.body.classList.remove("dark-mode");
    modeToggle.textContent = "Toggle Dark Mode";
  }
});

function showModal(message) {
  const modal = document.getElementById("modal");
  const modalMessage = document.getElementById("modal-message");

  modalMessage.textContent = message;
  modal.classList.remove("hidden");
}


