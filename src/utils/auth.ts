type CuentaRegistrada = {
  id: string;
  nombre: string;
  email: string;
  contrasena: string;
};

export type PerfilMascota = {
  id: string;
  nombre: string;
  raza: string;
  peso?: number | null;
  tamano: string;
  esSociable: boolean;
  foto?: string | null;
};

export type LugarFavorito = {
  id: string;
  nombre: string;
  direccion: string;
  admitePerrosGrandes: boolean;
  accesoInterior: boolean;
};

export type EventoCreado = {
  id: string;
  nombre: string;
  fechaHora: string;
  direccion: string;
  maxAttendees?: number | null;
};

export type EventoGuardado = EventoCreado & {
  organizer?: string;
  petTypes?: string[];
  description?: string;
};

export type PerfilUsuario = {
  nombre: string;
  email: string;
  zonaHabitual?: string;
  biografia?: string;
  avatar?: string | null;
  mascotas: PerfilMascota[];
  favoritos: LugarFavorito[];
  eventos: EventoCreado[];
  eventosGuardados: EventoGuardado[];
};

export type SesionPetMate = {
  user: {
    id: string;
    email: string;
    user_metadata: {
      nombre?: string;
    };
  };
};

type DatosPerfilBase = {
  idUsuario: string;
  email: string;
  nombre: string;
  avatar?: string | null;
};

const CLAVE_CUENTAS = 'petmate_cuentas';
const CLAVE_SESION = 'petmate_sesion';
const CLAVE_PERFILES = 'petmate_perfiles';

const suscriptores = new Set<() => void>();

function leerJson<T>(clave: string, valorPorDefecto: T): T {
  if (typeof window === 'undefined') {
    return valorPorDefecto;
  }

  const valor = window.localStorage.getItem(clave);
  if (!valor) {
    return valorPorDefecto;
  }

  try {
    return JSON.parse(valor) as T;
  } catch {
    return valorPorDefecto;
  }
}

function guardarJson<T>(clave: string, valor: T) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(clave, JSON.stringify(valor));
}

function generarId(prefijo: string) {
  return `${prefijo}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function obtenerCuentas() {
  return leerJson<CuentaRegistrada[]>(CLAVE_CUENTAS, []);
}

function guardarCuentas(cuentas: CuentaRegistrada[]) {
  guardarJson(CLAVE_CUENTAS, cuentas);
}

function obtenerPerfiles() {
  return leerJson<Record<string, PerfilUsuario>>(CLAVE_PERFILES, {});
}

function guardarPerfiles(perfiles: Record<string, PerfilUsuario>) {
  guardarJson(CLAVE_PERFILES, perfiles);
}

function crearSesionDesdeCuenta(cuenta: CuentaRegistrada): SesionPetMate {
  return {
    user: {
      id: cuenta.id,
      email: cuenta.email,
      user_metadata: {
        nombre: cuenta.nombre,
      },
    },
  };
}

function notificarCambioAutenticacion() {
  suscriptores.forEach((callback) => callback());
}

export async function registrarCuenta({
  nombre,
  email,
  contrasena,
}: {
  nombre: string;
  email: string;
  contrasena: string;
}) {
  const cuentas = obtenerCuentas();
  const emailNormalizado = email.trim().toLowerCase();

  if (cuentas.some((cuenta) => cuenta.email.toLowerCase() === emailNormalizado)) {
    throw new Error('Ese correo ya está registrado. Prueba a iniciar sesión.');
  }

  const cuentaNueva: CuentaRegistrada = {
    id: generarId('usr'),
    nombre: nombre.trim(),
    email: emailNormalizado,
    contrasena,
  };

  guardarCuentas([...cuentas, cuentaNueva]);

  const sesion = crearSesionDesdeCuenta(cuentaNueva);
  guardarJson(CLAVE_SESION, sesion);
  await asegurarPerfilBase({
    idUsuario: cuentaNueva.id,
    nombre: cuentaNueva.nombre,
    email: cuentaNueva.email,
    avatar: null,
  });
  notificarCambioAutenticacion();

  return sesion;
}

export async function iniciarSesion({
  email,
  contrasena,
}: {
  email: string;
  contrasena: string;
}) {
  const emailNormalizado = email.trim().toLowerCase();
  const cuenta = obtenerCuentas().find(
    (cuentaActual) => cuentaActual.email.toLowerCase() === emailNormalizado && cuentaActual.contrasena === contrasena,
  );

  if (!cuenta) {
    throw new Error('Correo o contraseña incorrectos.');
  }

  const sesion = crearSesionDesdeCuenta(cuenta);
  guardarJson(CLAVE_SESION, sesion);
  notificarCambioAutenticacion();
  return sesion;
}

export async function obtenerSesion() {
  return leerJson<SesionPetMate | null>(CLAVE_SESION, null);
}

export async function obtenerUsuarioActual() {
  const sesion = await obtenerSesion();
  return sesion?.user ?? null;
}

export async function limpiarSesion() {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(CLAVE_SESION);
  }

  notificarCambioAutenticacion();
}

export function suscribirCambioAutenticacion(callback: () => void) {
  suscriptores.add(callback);
  return () => {
    suscriptores.delete(callback);
  };
}

export async function asegurarPerfilBase({
  idUsuario,
  email,
  nombre,
  avatar = null,
}: DatosPerfilBase) {
  const perfiles = obtenerPerfiles();
  const perfilExistente = perfiles[idUsuario];

  perfiles[idUsuario] = {
    nombre: nombre.trim(),
    email: email.trim().toLowerCase(),
    zonaHabitual: perfilExistente?.zonaHabitual ?? '',
    biografia: perfilExistente?.biografia ?? '',
    avatar,
    mascotas: perfilExistente?.mascotas ?? [],
    favoritos: perfilExistente?.favoritos ?? [],
    eventos: perfilExistente?.eventos ?? [],
    eventosGuardados: perfilExistente?.eventosGuardados ?? [],
  };

  guardarPerfiles(perfiles);
}

export async function obtenerPerfilUsuario(): Promise<PerfilUsuario | null> {
  const sesion = await obtenerSesion();
  if (!sesion) {
    return null;
  }

  const perfiles = obtenerPerfiles();
  const perfil = perfiles[sesion.user.id];
  if (!perfil) {
    return null;
  }

  return {
    ...perfil,
    eventosGuardados: perfil.eventosGuardados ?? [],
  };
}

export function esPerfilIncompleto(perfil: PerfilUsuario | null) {
  return !perfil || !perfil.nombre || !perfil.nombre.trim();
}

export async function guardarMascotas(mascotas: PerfilMascota[], idDueno: string) {
  const perfiles = obtenerPerfiles();
  const perfil = perfiles[idDueno];

  if (!perfil) {
    return;
  }

  perfiles[idDueno] = {
    ...perfil,
    mascotas,
  };

  guardarPerfiles(perfiles);
}

export async function guardarPerfilUsuario(perfil: PerfilUsuario) {
  const sesion = await obtenerSesion();

  if (!sesion) {
    throw new Error('No hay sesión activa.');
  }

  const perfiles = obtenerPerfiles();
  perfiles[sesion.user.id] = {
    ...perfil,
    nombre: perfil.nombre.trim(),
    email: perfil.email.trim().toLowerCase(),
    eventosGuardados: perfil.eventosGuardados ?? [],
  };
  guardarPerfiles(perfiles);

  const cuentas = obtenerCuentas();
  const indiceCuenta = cuentas.findIndex((cuenta) => cuenta.id === sesion.user.id);
  if (indiceCuenta >= 0) {
    cuentas[indiceCuenta] = {
      ...cuentas[indiceCuenta],
      nombre: perfil.nombre.trim(),
      email: perfil.email.trim().toLowerCase(),
    };
    guardarCuentas(cuentas);
  }

  guardarJson(CLAVE_SESION, {
    user: {
      ...sesion.user,
      email: perfil.email.trim().toLowerCase(),
      user_metadata: {
        ...sesion.user.user_metadata,
        nombre: perfil.nombre.trim(),
      },
    },
  });

  notificarCambioAutenticacion();
}

export async function limpiarPerfilUsuario() {
  const sesion = await obtenerSesion();
  if (!sesion) {
    return;
  }

  const perfiles = obtenerPerfiles();
  delete perfiles[sesion.user.id];
  guardarPerfiles(perfiles);

  const cuentas = obtenerCuentas().filter((cuenta) => cuenta.id !== sesion.user.id);
  guardarCuentas(cuentas);
}
