Centro de Reservas de Centros Deportivos y Sociales.

Autor: @xsilvamo,
Version: 1.2

Notas de cambios:

- Se modificó la base de datos con nuevas tablas
- Endpoints de actividades (Filtros).
- Se modificaron parámetros de los EndPoint de Register, Login, Usuarios.
- Los EndPoint de usuario funcionan correctamente.
- Uso de servicio de Firebase Storage para almacenar imágenes.
- Uso de servicio de Supabase Database para almacenar la base de datos relacional.

Se eliminó la carpeta frontend y se estableció solamente este directorio para el backend.


Modo de uso:

1. Instala las dependencias con npm.

npm install

2. Ejecuta con node el app.js

node .\app.js

3. Documentación en Swagger

http://127.0.0.1:3000/api-docs
