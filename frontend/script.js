const registerForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');
const getInstalacionesButton = document.getElementById('get-instalaciones');
const createInstalacionForm = document.getElementById('create-instalacion-form');
const instalacionesResponse = document.getElementById('instalaciones-response');
const createInstalacionResponse = document.getElementById('create-instalacion-response');

// Función para enviar solicitudes POST
async function postData(url, data) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  return response.json();
}

// Función para enviar solicitudes GET
async function getData(url) {
  const response = await fetch(url);
  return response.json();
}

// Registro
registerForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(registerForm);
  const data = {
    correo: formData.get('correo'),
    contraseña: formData.get('contraseña'),
    rol: formData.get('rol')
  };

  try {
    const response = await postData('/register', data);
    console.log(response);
    // Mostrar mensaje de éxito o error al usuario
  } catch (error) {
    console.error('Error al registrarse:', error);
  }
});

// Inicio de sesión
loginForm.addEventListener('submit', async (event) => {
  // ... similar al registro, pero almacena el token en el localStorage
});

// Obtener instalaciones
getInstalacionesButton.addEventListener('click', async () => {
  try {
    const response = await getData('/instalaciones');
    instalacionesResponse.textContent = JSON.stringify(response, null, 2);
  } catch (error) {
    console.error('Error al obtener instalaciones:', error);
  }
});

// Crear instalación
createInstalacionForm.addEventListener('submit', async (event) => {
  // ... similar a los otros formularios, pero asegúrate de incluir el token en el encabezado
  // para las rutas protegidas
});