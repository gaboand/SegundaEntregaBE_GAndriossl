async function postSignup(first_name, last_name, email, password, age) {
  const data = {
    first_name,
    last_name,
    email,
    password,
    age,
  };

  try {
      const response = await fetch("/api/session/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      return result;

      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
  } catch (error) {
      console.error("Error en la solicitud de registro:", error);
      return null;
  }
};

  const signupForm = document.getElementById("signup-form");
  
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const first_name = document.getElementById("first_name").value;
    const last_name = document.getElementById("last_name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const age = document.getElementById("age").value;
    const result = await postSignup(first_name, last_name, email, password, age);
    if (result.message === "Usuario creado con éxito") {
      window.location.href = "/login";
    } else {
      alert("El usuario ya existe");
    }
  });