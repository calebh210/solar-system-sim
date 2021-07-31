const loginForm = document.getElementById("login-Form");
const loginButton = document.getElementById("submit-Button");
const loginErrorMsg = document.getElementById("login-error-msg");

loginButton.addEventListener("click", (e) => {
    e.preventDefault();
    //const username = loginForm.username.value;
    const password = loginForm.password.value;

    if (password === "yeetabix") {
        alert("You have successfully logged in.");
        window.location = "secrets.html"
    } else {
      loginErrorMsg.style.opacity = 1;
    }
})
