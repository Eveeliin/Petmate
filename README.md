# PetMate - Accesos para revisión

Trabajo de Fin de Grado de Desarrollo de Aplicaciones Web.

## Enlaces principales

- Aplicación desplegada en Vercel: https://petmate-phi.vercel.app/
- Repositorio GitHub: https://github.com/Eveeliin/Petmate
- Proyecto Supabase: https://supabase.com/dashboard/project/jgmbozbmrnzzftqafagi
- URL pública de Supabase: https://jgmbozbmrnzzftqafagi.supabase.co

## Acceso a la aplicación

Para revisar la aplicación desde Vercel, abrir el enlace de la aplicación desplegada.

Si se desea probar de forma local:

```bash
cd petmate-app
npm install
npm run dev
```

Después, abrir la URL local que indique Vite en la terminal.

## Funcionalidades principales

- Registro e inicio de sesión de usuarios mediante Supabase Auth.
- Perfil privado de usuario.
- Gestión de mascotas.
- Consulta de establecimientos pet friendly en mapa con Leaflet y OpenStreetMap.
- Búsqueda por nombre, barrio o dirección.
- Filtro por categoría de establecimiento.
- Guardado de lugares favoritos.
- Consulta de eventos comunitarios.
- Creación, edición y eliminación de eventos propios.
- Unión y salida de eventos.
- Persistencia de datos mediante Supabase.

## Datos técnicos

- Frontend: React, TypeScript, Vite y Tailwind CSS.
- Backend y base de datos: Supabase.
- Mapa: Leaflet con tiles de OpenStreetMap.
- Despliegue: Vercel.
- Control de versiones: GitHub.

## Variables de entorno

La aplicación utiliza las siguientes variables:

```env
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

La clave pública `anon` de Supabase se gestiona como variable de entorno en desarrollo y en Vercel.

## Nota:

El acceso al panel privado de Supabase requiere una cuenta autorizada en el proyecto. Para revisar la aplicación no es necesario acceder al panel de administración; basta con utilizar la URL desplegada y, si procede, una cuenta de prueba.
