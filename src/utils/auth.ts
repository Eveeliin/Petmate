export type SesionAutenticacion = {
  email: string;
  mode: 'login' | 'register';
  loggedAt: string;
};

export type PerfilMascota = {
  id: string;
  name: string;
  type: string;
  breed: string;
  age: string;
  size: string;
  energy: string;
  description: string;
};

export type LugarFavorito = {
  id: string;
  name: string;
  category: string;
  area: string;
  petRule: string;
};

export type EventoCreado = {
  id: string;
  title: string;
  description: string;
  location: string;
  time: string;
  attendees: number;
  status: string;
};

export type PerfilUsuario = {
  fullName: string;
  email: string;
  district: string;
  bio: string;
  joinedLabel: string;
  pets: PerfilMascota[];
  favorites: LugarFavorito[];
  createdEvents: EventoCreado[];
};

type EventoCreadoGuardado = Partial<EventoCreado> & {
  date?: string;
};

type PerfilMascotaGuardado = Partial<PerfilMascota>;

const CLAVE_SESION = 'petmate-auth';
const CLAVE_PERFIL = 'petmate-profile';
const EVENTO_AUTENTICACION = 'petmate-auth-change';

export function obtenerSesion(): SesionAutenticacion | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const sesionSinProcesar = window.localStorage.getItem(CLAVE_SESION);
  if (!sesionSinProcesar) {
    return null;
  }

  try {
    return JSON.parse(sesionSinProcesar) as SesionAutenticacion;
  } catch {
    return null;
  }
}

export function guardarSesion(sesion: SesionAutenticacion) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));
  window.dispatchEvent(new Event(EVENTO_AUTENTICACION));
}

export function limpiarSesion() {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(CLAVE_SESION);
  window.dispatchEvent(new Event(EVENTO_AUTENTICACION));
}

export function suscribirCambioAutenticacion(callback: () => void) {
  if (typeof window === 'undefined') {
    return () => undefined;
  }

  window.addEventListener(EVENTO_AUTENTICACION, callback);
  return () => window.removeEventListener(EVENTO_AUTENTICACION, callback);
}

function normalizarEventoCreado(evento: EventoCreadoGuardado, indice: number): EventoCreado {
  const horaHeradada =
    typeof evento.date === 'string' && evento.date.includes('·')
      ? evento.date.split('·').pop()?.trim() ?? ''
      : '';

  return {
    id: evento.id ?? `event-${indice}`,
    title: evento.title ?? '',
    description: evento.description ?? '',
    location: evento.location ?? '',
    time: evento.time ?? horaHeradada,
    attendees: evento.attendees ?? 0,
    status: evento.status ?? 'Borrador',
  };
}

function normalizarPerfilMascota(mascota: PerfilMascotaGuardado, indice: number): PerfilMascota {
  return {
    id: mascota.id ?? `pet-${indice}`,
    name: mascota.name ?? '',
    type: mascota.type ?? '',
    breed: mascota.breed ?? '',
    age: mascota.age ?? '',
    size: mascota.size ?? '',
    energy: mascota.energy ?? '',
    description: mascota.description ?? '',
  };
}

function construirPerfilPorDefecto(email: string): PerfilUsuario {
  const nombreDesdeEmail = email.split('@')[0].replace(/[._-]/g, ' ');
  const nombreCapitalizado = nombreDesdeEmail.replace(/\b\w/g, (letra) => letra.toUpperCase());

  return {
    fullName: nombreCapitalizado || 'Usuario PetMate',
    email,
    district: 'Madrid Centro',
    bio: 'Amante de los planes pet-friendly, los paseos largos y los sitios donde las mascotas son bienvenidas.',
    joinedLabel: 'Miembro desde 2026',
    pets: [
      {
        id: 'pet-1',
        name: 'Milo',
        type: 'Perro',
        breed: 'Mestizo',
        age: '3 años',
        size: 'Mediano',
        energy: 'Alta',
        description: 'Le encanta correr, jugar con otros perros y salir a pasear por zonas verdes amplias.',
      },
      {
        id: 'pet-2',
        name: 'Nala',
        type: 'Gata',
        breed: 'Europea',
        age: '2 años',
        size: 'Pequeño',
        energy: 'Media',
        description: 'Es tranquila, curiosa y disfruta observando todo desde lugares altos.',
      },
    ],
    favorites: [
      {
        id: 'fav-1',
        name: 'El Perro y la Galleta',
        category: 'Cafeteria',
        area: 'Retiro',
        petRule: 'Acceso interior y terraza',
      },
      {
        id: 'fav-2',
        name: 'Parque Juan Carlos I',
        category: 'Zona verde',
        area: 'Barajas',
        petRule: 'Ideal para paseos largos',
      },
      {
        id: 'fav-3',
        name: 'Hotel Canino Sol y Patas',
        category: 'Alojamiento',
        area: 'Chamartin',
        petRule: 'Admite mascotas pequeñas y medianas',
      },
    ],
    createdEvents: [
      {
        id: 'event-1',
        title: 'Paseo grupal por Madrid Rio',
        description: 'Quedada para pasear junto al rio, conocer a otros dueños y dejar que las mascotas socialicen.',
        location: 'Madrid Rio',
        time: '10:30',
        attendees: 9,
        status: 'Abierto',
      },
      {
        id: 'event-2',
        title: 'Brunch pet-friendly en Malasaña',
        description: 'Encuentro relajado para compartir mesa, charlar y descubrir un local pet-friendly.',
        location: 'Malasaña',
        time: '12:00',
        attendees: 6,
        status: 'Confirmado',
      },
    ],
  };
}

export function crearPerfilOnboarding(email: string): PerfilUsuario {
  return {
    fullName: '',
    email,
    district: '',
    bio: '',
    joinedLabel: 'Miembro desde 2026',
    pets: [
      {
        id: `pet-${Date.now()}`,
        name: '',
        type: '',
        breed: '',
        age: '',
        size: '',
        energy: '',
        description: '',
      },
    ],
    favorites: [],
    createdEvents: [],
  };
}

export function obtenerPerfilUsuario(sesion: SesionAutenticacion | null): PerfilUsuario | null {
  if (typeof window === 'undefined' || !sesion) {
    return null;
  }

  const perfilSinProcesar = window.localStorage.getItem(CLAVE_PERFIL);
  if (!perfilSinProcesar) {
    const perfil = construirPerfilPorDefecto(sesion.email);
    guardarPerfilUsuario(perfil);
    return perfil;
  }

  try {
    const perfilGuardado = JSON.parse(perfilSinProcesar) as Omit<PerfilUsuario, 'pets' | 'createdEvents'> & {
      pets?: PerfilMascotaGuardado[];
      createdEvents?: EventoCreadoGuardado[];
    };

    return {
      ...perfilGuardado,
      email: sesion.email,
      pets: (perfilGuardado.pets ?? []).map((mascota, indice) => normalizarPerfilMascota(mascota, indice)),
      createdEvents: (perfilGuardado.createdEvents ?? []).map((evento, indice) =>
        normalizarEventoCreado(evento, indice),
      ),
    };
  } catch {
    const perfil = construirPerfilPorDefecto(sesion.email);
    guardarPerfilUsuario(perfil);
    return perfil;
  }
}

export function guardarPerfilUsuario(perfil: PerfilUsuario) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(CLAVE_PERFIL, JSON.stringify(perfil));
}

export function limpiarPerfilUsuario() {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(CLAVE_PERFIL);
}
