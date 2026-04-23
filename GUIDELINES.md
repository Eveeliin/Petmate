# PetMate: guia rapida del prototipo

## Estructura actual

- `src/main.tsx`: punto de entrada de Vite.
- `src/App.tsx`: composicion de la landing.
- `src/components/`: secciones visuales de la home.
- `src/styles/globals.css`: estilos base y Tailwind.
- `public/`: logos e iconos estaticos.

## Criterios de mantenimiento

- Mantener la home simple y modular, con una seccion por componente.
- Evitar carpetas o librerias generadas que no esten en uso real.
- Si se añade logica reutilizable, crearla solo cuando exista una necesidad clara.
- Si se añaden nuevas dependencias, justificar su uso y mantener `package.json` alineado.
