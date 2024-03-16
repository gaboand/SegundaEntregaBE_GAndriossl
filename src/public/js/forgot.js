async function postForgot(email, newPassword) {
  try {
    const response = await fetch("/api/session/forgot", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, newPassword }),
    });
    
    const data = await response.json();

    if (data.message === "ok") {
      window.location.href = "/login";

    } else {
      alert(data.message || "Ocurrió un error al intentar recuperar la contraseña.");
    }
  } catch (error) {
    console.error(error);
    alert("Error al procesar la solicitud. Por favor, intenta de nuevo.");
  }
}

document.addEventListener("DOMContentLoaded", function() {
  const form = document.getElementById("forgot-form");
  if (form) {
      form.addEventListener("submit", function(e) {
          e.preventDefault();
          const email = document.getElementById("email").value;
          const newPassword = document.getElementById("newPassword").value;
          const newTwoPassword = document.getElementById("newTwoPassword").value;

          if (newPassword !== newTwoPassword) {
              alert("Las contraseñas no coinciden.");
              return;
          }
          postForgot(email, newPassword);
      });
  } else {
      console.error("El formulario forgot-form no fue encontrado.");
  }
});
