document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("register-form");

  if (!signupForm) {
    console.error("Signup form not found!");
    return;
  }

  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("register-name").value.trim();
    const email = document.getElementById("register-email").value.trim();
    const password = document.getElementById("register-password").value.trim();

    const nameError = document.getElementById("register-name-error");
    const emailError = document.getElementById("register-email-error");
    const passwordError = document.getElementById("register-password-error");

    let isValid = true;


    if (name === "") {
      nameError.innerText = "Please enter your name.";
      isValid = false;
    } else {
      nameError.innerText = "";
    }


    if (email === "") {
      emailError.innerText = "Please enter a valid email.";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      emailError.innerText = "Invalid email format.";
      isValid = false;
    } else {
      emailError.innerText = "";
    }


    if (password === "") {
      passwordError.innerText = "Password cannot be empty.";
      isValid = false;
    } else if (password.length < 6) {
      passwordError.innerText = "Password must be at least 6 characters.";
      isValid = false;
    } else {
      passwordError.innerText = "";
    }


    if (isValid) {
      try {
        const res = await fetch("http://localhost:5000/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Signup failed");
        }

        alert("Signup successful! You can now login.");
        window.location.href = "login.html";
      } catch (error) {
        console.error("Signup Error:", error);
        alert(error.message);
      }
    }
  });
});
