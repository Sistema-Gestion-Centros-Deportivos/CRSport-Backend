// Registro de usuario
document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const correo = document.getElementById('register-email').value;
    const contraseña = document.getElementById('register-password').value;
    const rol = document.getElementById('register-role').value;
  
    try {
      const res = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, contraseña, rol })
      });
      const data = await res.json();
      document.getElementById('message').textContent = data.message;
    } catch (err) {
      document.getElementById('message').textContent = 'Error al registrar usuario';
    }
  });
  
  // Inicio de sesión
  document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const correo = document.getElementById('login-email').value;
    const contraseña = document.getElementById('login-password').value;
  
    try {
      const res = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, contraseña })
      });
      const data = await res.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
        window.location.href = 'instalaciones.html';
      } else {
        document.getElementById('message').textContent = data.error;
      }
    } catch (err) {
      document.getElementById('message').textContent = 'Error al iniciar sesión';
    }
  });
  
  // Obtener instalaciones
  if (window.location.pathname.endsWith('instalaciones.html')) {
    document.addEventListener('DOMContentLoaded', async () => {
      try {
        const res = await fetch('http://localhost:3000/instalaciones', {
          headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        });
        const data = await res.json();
        const instalacionesList = document.getElementById('instalaciones-list');
        data.forEach(instalacion => {
          const div = document.createElement('div');
          div.textContent = `${instalacion.nombre} - ${instalacion.ubicacion}`;
          instalacionesList.appendChild(div);
        });
      } catch (err) {
        console.error('Error al obtener instalaciones', err);
      }
    });
  }
  
  // Crear instalación (solo admin)
  if (window.location.pathname.endsWith('admin.html')) {
    document.getElementById('create-installation-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const nombre = document.getElementById('instalacion-nombre').value;
      const descripcion = document.getElementById('instalacion-descripcion').value;
      const ubicacion = document.getElementById('instalacion-ubicacion').value;
      const disponible_desde = document.getElementById('instalacion-desde').value;
      const disponible_hasta = document.getElementById('instalacion-hasta').value;
  
      try {
        const res = await fetch('http://localhost:3000/instalaciones', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          },
          body: JSON.stringify({ nombre, descripcion, ubicacion, disponible_desde, disponible_hasta })
        });
        const data = await res.json();
        document.getElementById('admin-message').textContent = data.message;
      } catch (err) {
        document.getElementById('admin-message').textContent = 'Error al crear instalación';
      }
    });
  }
  