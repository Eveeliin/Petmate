export type CategoriaEstablecimiento = 'Restaurantes' | 'Ocio' | 'Alojamientos';

export type Establecimiento = {
  id: string;
  categoria: CategoriaEstablecimiento;
  nombre: string;
  descripcion: string;
  reglaMascota: string;
  direccion: string;
  barrio: string;
  imagen: string;
  destacado?: boolean;
  color: string;
  latitud: number;
  longitud: number;
  admitePerrosGrandes: boolean;
  accesoInterior: boolean;
};

export const establecimientos: Establecimiento[] = [
  {
    id: 'rest-1',
    categoria: 'Restaurantes',
    nombre: 'El Perro y la Galleta',
    descripcion: 'Restaurante amplio y desenfadado, ideal para comer con tu mascota sin complicaciones.',
    reglaMascota: 'Acceso interior y terraza con correa.',
    direccion: 'Calle Claudio Coello, 1',
    barrio: 'Barrio de Salamanca',
    imagen:
      'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=900&q=80',
    destacado: true,
    color: '#1a9b8e',
    latitud: 40.4259,
    longitud: -3.6878,
    admitePerrosGrandes: true,
    accesoInterior: true,
  },
  {
    id: 'rest-2',
    categoria: 'Restaurantes',
    nombre: 'Café del Art',
    descripcion: 'Cafetería céntrica con ambiente relajado para desayunar o merendar acompañado.',
    reglaMascota: 'Acceso interior permitido y agua disponible.',
    direccion: 'Calle del Prado, 18',
    barrio: 'Las Letras',
    imagen:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80',
    color: '#1a9b8e',
    latitud: 40.4139,
    longitud: -3.6986,
    admitePerrosGrandes: true,
    accesoInterior: true,
  },
  {
    id: 'rest-3',
    categoria: 'Restaurantes',
    nombre: 'Rías Bajas',
    descripcion: 'Marisquería gallega de referencia en Madrid, ideal para ocasiones especiales y también pet-friendly.',
    reglaMascota: 'Acceso interior permitido.',
    direccion: 'Calle de Clara del Rey, 33',
    barrio: 'Prosperidad',
    imagen: 'https://images.unsplash.com/photo-1555992336-03a23c7b20ee?auto=format&fit=crop&w=900&q=80',
    destacado: false,
    color: '#1a9b8e',
    latitud: 40.4447,
    longitud: -3.6725,
    admitePerrosGrandes: true,
    accesoInterior: true,
  },
  {
    id: 'ocio-1',
    categoria: 'Ocio',
    nombre: 'Urban Safari',
    descripcion: 'Plan diferente en el centro de Madrid: lanzamiento de hachas, música y bar en un ambiente divertido donde puedes ir con tu perro.',
    reglaMascota: 'Consultar condiciones.',
    direccion: 'Calle de las Delicias, 9',
    barrio: 'Arganzuela',
    imagen: 'https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=900&q=80',
    destacado: false,
    color: '#ff8c42',
    latitud: 40.4049,
    longitud: -3.6993,
    admitePerrosGrandes: true,
    accesoInterior: false,
  },
    {
    id: 'ocio-2',
    categoria: 'Ocio',
    nombre: 'Autocine Madrid RACE',
    descripcion: 'Disfruta de una película desde tu coche acompañado de tu perro. Un plan original y diferente en Madrid.',
    reglaMascota: 'Permitido en vehículo y zona inmediata con correa.',
    direccion: 'Calle de la Isla de Java, 2',
    barrio: 'Fuencarral',
    imagen: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=900&q=80',
    destacado: true,
    color: '#ff8c42',
    latitud: 40.5043,
    longitud: -3.6762,
    admitePerrosGrandes: true,
    accesoInterior: false,
  },
  {
    id: 'hotel-1',
    categoria: 'Alojamientos',
    nombre: 'B&B HOTEL Madrid Centro Puerta del Sol',
    descripcion: 'Hotel céntrico y moderno que admite mascotas, ideal para alojarte en Madrid sin separarte de tu perro.',
    reglaMascota: 'Admite mascotas pequeñas y medianas.',
    direccion: 'Calle Montera, 10',
    barrio: 'Centro',
    imagen: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80',
    destacado: false,
    color: '#7ab851',
    latitud: 40.4169,
    longitud: -3.7035,
    admitePerrosGrandes: false,
    accesoInterior: true,
  },
  {
    id: 'hotel-2',
    categoria: 'Alojamientos',
    nombre: 'Only YOU Hotel Atocha',
    descripcion: 'Hotel moderno y de diseño frente a Atocha, perfecto para escapadas urbanas con tu mascota.',
    reglaMascota: 'Admite mascotas (pueden aplicarse suplementos).',
    direccion: 'P.º de la Infanta Isabel, 13',
    barrio: 'Retiro',
    imagen: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=900&q=80',
    destacado: true,
    color: '#7ab851',
    latitud: 40.4078,
    longitud: -3.6901,
    admitePerrosGrandes: false,
    accesoInterior: true,
  },
];
