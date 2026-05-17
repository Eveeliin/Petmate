import type { Session } from '@supabase/supabase-js';
import { supabase } from '../supabaseClient.ts';
import { type Establecimiento, type CategoriaEstablecimiento } from '../data/establecimientos';

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
  idLugar?: string;
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
  admision?: string | null;
  asistentes?: number | null;
  maximoAsistentes?: number | null;
};

export type EventoGuardado = EventoCreado & {
  organizador?: string;
};

export type EventoCompleto = {
  id: string;
  nombre: string;
  fechaHora: string;
  direccion: string;
  admision: string;
  asistentes: number;
  creadorNombre: string;
  estaUnido: boolean;
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

function mapearSesion(session: Session): SesionPetMate {
  return {
    user: {
      id: session.user.id,
      email: session.user.email ?? '',
      user_metadata: {
        nombre: session.user.user_metadata?.nombre as string | undefined,
      },
    },
  };
}

function parsearFechaHora(fechaHoraStr: string): string {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})\s*-\s*(\d{2}):(\d{2})/.exec(fechaHoraStr.trim());
  if (!match) return new Date().toISOString();
  const [, dia, mes, anio, hora, minuto] = match;
  return new Date(Number(anio), Number(mes) - 1, Number(dia), Number(hora), Number(minuto)).toISOString();
}

function formatearFechaHora(isoString: string): string {
  const fecha = new Date(isoString);
  const dia = String(fecha.getDate()).padStart(2, '0');
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const anio = fecha.getFullYear();
  const hora = String(fecha.getHours()).padStart(2, '0');
  const minuto = String(fecha.getMinutes()).padStart(2, '0');
  return `${dia}/${mes}/${anio} - ${hora}:${minuto} h`;
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
  const { data, error } = await supabase.auth.signUp({
    email,
    password: contrasena,
    options: { data: { nombre } },
  });

  if (error) throw new Error(error.message);
  if (!data.user) throw new Error('No se pudo crear la cuenta.');

  await asegurarPerfilBase({
    idUsuario: data.user.id,
    nombre: nombre.trim(),
    email: email.trim().toLowerCase(),
    avatar: null,
  });

  if (!data.session) {
    throw new Error('Revisa tu correo para confirmar la cuenta antes de entrar.');
  }

  return mapearSesion(data.session);
}

export async function iniciarSesion({
  email,
  contrasena,
}: {
  email: string;
  contrasena: string;
}) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: contrasena,
  });

  if (error) throw new Error(error.message);
  return mapearSesion(data.session);
}

export async function obtenerSesion(): Promise<SesionPetMate | null> {
  const { data } = await supabase.auth.getSession();
  if (!data.session) return null;
  return mapearSesion(data.session);
}

export async function obtenerUsuarioActual() {
  const { data } = await supabase.auth.getUser();
  if (!data.user) return null;
  return {
    id: data.user.id,
    email: data.user.email ?? '',
    user_metadata: data.user.user_metadata as { nombre?: string },
  };
}

export async function limpiarSesion() {
  await supabase.auth.signOut();
}

export function suscribirCambioAutenticacion(callback: () => void) {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(() => callback());
  return () => subscription.unsubscribe();
}

export async function asegurarPerfilBase({
  idUsuario,
  email,
  nombre,
  avatar = null,
}: DatosPerfilBase) {
  const { error } = await supabase.from('Perfil').upsert({
    id: idUsuario,
    nombre: nombre.trim(),
    email: email.trim().toLowerCase(),
    avatar,
  });

  if (error) throw new Error(error.message);
}

export async function obtenerPerfilUsuario(): Promise<PerfilUsuario | null> {
  const { data: sesionData } = await supabase.auth.getSession();
  if (!sesionData.session) return null;
  const idUsuario = sesionData.session.user.id;

  const { data: perfil, error: errorPerfil } = await supabase
    .from('Perfil')
    .select('*')
    .eq('id', idUsuario)
    .maybeSingle();

  if (errorPerfil) throw new Error(errorPerfil.message);
  if (!perfil) return null;

  const { data: mascotas } = await supabase
    .from('Mascotas')
    .select('*')
    .eq('dueno_id', idUsuario);

  const { data: favoritos } = await supabase
    .from('Favoritos')
    .select('id, lugar_id, Lugares(id, nombre, direccion, imagen, descripcion, admision_perros_grandes, acceso_interior)')
    .eq('perfil_id', idUsuario);

  const { data: eventos } = await supabase
    .from('Eventos')
    .select('*')
    .eq('creador_id', idUsuario);

  const { data: guardadosData } = await supabase
    .from('eventos_guardados')
    .select('evento_guardado, Eventos(id, nombre, fecha_hora, direccion, admision, asistentes, creador_id)')
    .eq('perfil_id', idUsuario);

  const eventosGuardadosRaw = (guardadosData ?? [])
    .map((g) => (g as { Eventos: any | null }).Eventos)
    .filter((e): e is NonNullable<typeof e> => e !== null);

  const creadoresGuardadosIds = [
    ...new Set(eventosGuardadosRaw.map((e) => e['creador_id'] as string).filter(Boolean)),
  ];
  const nombresGuardadosPorId: Record<string, string> = {};
  if (creadoresGuardadosIds.length > 0) {
    const { data: perfilesCreadores } = await supabase
      .from('Perfil')
      .select('id, nombre')
      .in('id', creadoresGuardadosIds);
    for (const p of perfilesCreadores ?? []) {
      nombresGuardadosPorId[p.id as string] = p.nombre as string;
    }
  }

  return {
    nombre: perfil.nombre,
    email: perfil.email,
    zonaHabitual: '',
    biografia: '',
    avatar: perfil.avatar ?? null,
    mascotas: (mascotas ?? []).map((m) => ({
      id: m.id,
      nombre: m.nombre,
      raza: m.raza ?? '',
      peso: m.peso ?? null,
      tamano: m.tamano ?? '',
      esSociable: m.sociabilidad ?? false,
      foto: m.foto ?? null,
    })),
    favoritos: (favoritos ?? [])
      .map((f) => ({
        idFavorito: (f as { id: string }).id,
        idLugar: String((f as { lugar_id: unknown }).lugar_id ?? ''),
        lugar: (f as { Lugares: any | null }).Lugares,
      }))
      .filter((f): f is { idFavorito: string; idLugar: string; lugar: any } => f.lugar !== null)
      .map((f) => ({
        id: f.idFavorito,
        idLugar: f.idLugar,
        nombre: f.lugar['nombre'] as string,
        direccion: f.lugar['direccion'] as string,
        admitePerrosGrandes: f.lugar['admision_perros_grandes'] as boolean,
        accesoInterior: f.lugar['acceso_interior'] as boolean,
      })),
    eventos: (eventos ?? []).map((e) => ({
      id: e.id,
      nombre: e.nombre,
      fechaHora: formatearFechaHora(e.fecha_hora),
      direccion: e.direccion,
      admision: e.admision ?? '',
      asistentes: e.asistentes ?? 1,
      maximoAsistentes: null,
    })),
    eventosGuardados: eventosGuardadosRaw.map((e) => ({
      id: e['id'] as string,
      nombre: e['nombre'] as string,
      fechaHora: formatearFechaHora(e['fecha_hora'] as string),
      direccion: e['direccion'] as string,
      admision: (e['admision'] as string) ?? '',
      asistentes: (e['asistentes'] as number) ?? 0,
      maximoAsistentes: null,
      organizador: nombresGuardadosPorId[e['creador_id'] as string] ?? '',
    })),
  };
}

export async function guardarPerfilUsuario(perfil: PerfilUsuario) {
  const { data: sesionData } = await supabase.auth.getSession();
  if (!sesionData.session) throw new Error('No hay sesión activa.');
  const idUsuario = sesionData.session.user.id;

  const { error: errorPerfil } = await supabase
    .from('Perfil')
    .update({ nombre: perfil.nombre, avatar: perfil.avatar ?? null })
    .eq('id', idUsuario);
  if (errorPerfil) throw new Error(errorPerfil.message);

  await supabase.from('Mascotas').delete().eq('dueno_id', idUsuario);
  if (perfil.mascotas.length > 0) {
    const { error: errorMascotas } = await supabase.from('Mascotas').insert(
      perfil.mascotas.map((m) => ({
        dueno_id: idUsuario,
        nombre: m.nombre,
        raza: m.raza || null,
        peso: m.peso ?? null,
        tamano: m.tamano || null,
        sociabilidad: m.esSociable,
        foto: m.foto ?? null,
      })),
    );
    if (errorMascotas) throw new Error(errorMascotas.message);
  }

  // Sincronizar eventos_guardados: eliminar los quitados desde el perfil
  const idsGuardados = new Set(perfil.eventosGuardados.map((e) => e.id));
  const { data: guardadosDB } = await supabase
    .from('eventos_guardados')
    .select('id, evento_guardado')
    .eq('perfil_id', idUsuario);

  const filasAEliminar = (guardadosDB ?? []).filter((g) => !idsGuardados.has(g.evento_guardado as string));
  for (const fila of filasAEliminar) {
    await supabase.from('eventos_guardados').delete().eq('id', fila.id);
    const { data: ev } = await supabase.from('Eventos').select('asistentes').eq('id', fila.evento_guardado).maybeSingle();
    const nuevosAsistentes = Math.max(2, ((ev?.asistentes as number) ?? 2) - 1);
    await supabase.from('Eventos').update({ asistentes: nuevosAsistentes }).eq('id', fila.evento_guardado);
  }
}

export async function limpiarPerfilUsuario() {
  const { data: sesionData } = await supabase.auth.getSession();
  if (!sesionData.session) return;
  const idUsuario = sesionData.session.user.id;

  try {
    // Eliminar todos los datos asociados del usuario
    await supabase.from('eventos_guardados').delete().eq('perfil_id', idUsuario);
    await supabase.from('Mascotas').delete().eq('dueno_id', idUsuario);
    await supabase.from('Eventos').delete().eq('creador_id', idUsuario);
    await supabase.from('Favoritos').delete().eq('perfil_id', idUsuario);
    await supabase.from('Perfil').delete().eq('id', idUsuario);

    // Eliminar usuario de autenticación
    await supabase.auth.admin.deleteUser(idUsuario);

    // Eliminar usuario de autenticación
    await supabase.auth.admin.deleteUser(idUsuario);

    // Cerrar sesión
    await supabase.auth.signOut();

    // Nota: El usuario ha sido eliminado completamente de la base de datos y autenticación.
  } catch (error) {
    // Intentar hacer signOut incluso si hay error al eliminar datos
    await supabase.auth.signOut();
    throw error;
  }
}

export async function guardarMascotas(mascotas: PerfilMascota[], idDueno: string) {
  await supabase.from('Mascotas').delete().eq('dueno_id', idDueno);
  if (mascotas.length > 0) {
    const { error } = await supabase.from('Mascotas').insert(
      mascotas.map((m) => ({
        dueno_id: idDueno,
        nombre: m.nombre,
        raza: m.raza || null,
        peso: m.peso ?? null,
        tamano: m.tamano || null,
        sociabilidad: m.esSociable,
        foto: m.foto ?? null,
      })),
    );
    if (error) throw new Error(error.message);
  }
}

export function esPerfilIncompleto(perfil: PerfilUsuario | null) {
  return !perfil || !perfil.nombre || !perfil.nombre.trim();
}

export async function obtenerTodosLosEventos(idUsuario: string | null = null): Promise<EventoCompleto[]> {
  const { data: eventos, error } = await supabase
    .from('Eventos')
    .select('id, nombre, fecha_hora, direccion, admision, asistentes, creador_id')
    .order('fecha_hora', { ascending: true });

  if (error) throw new Error(error.message);

  const creadorIds = [...new Set((eventos ?? []).map((e) => e.creador_id as string).filter(Boolean))];
  const nombresPorId: Record<string, string> = {};
  if (creadorIds.length > 0) {
    const { data: perfiles, error: errorPerfiles } = await supabase
      .from('Perfil')
      .select('id, nombre')
      .in('id', creadorIds);
    if (errorPerfiles) console.error('[Petmate] Error leyendo Perfil:', errorPerfiles.message);
    for (const p of perfiles ?? []) {
      nombresPorId[p.id as string] = p.nombre as string;
    }
  }

  let eventosUnidos = new Set<string>();
  if (idUsuario) {
    const { data: guardados, error: errGuardados } = await supabase
      .from('eventos_guardados')
      .select('evento_guardado')
      .eq('perfil_id', idUsuario);
    if (errGuardados) console.error('[Petmate] Error leyendo eventos_guardados:', errGuardados.message);
    eventosUnidos = new Set((guardados ?? []).map((g) => g.evento_guardado as string));
  }

  return (eventos ?? []).map((e) => ({
    id: e.id as string,
    nombre: e.nombre as string,
    fechaHora: formatearFechaHora(e.fecha_hora as string),
    direccion: e.direccion as string,
    admision: (e.admision as string) ?? '',
    asistentes: (e.asistentes as number) ?? 0,
    creadorNombre: nombresPorId[e.creador_id as string] ?? '',
    estaUnido: eventosUnidos.has(e.id as string),
  }));
}

export async function toggleEventoGuardado(
  idEvento: string,
  yaUnido: boolean,
): Promise<{ estaUnido: boolean; asistentes: number }> {
  const { data: sesionData } = await supabase.auth.getSession();
  if (!sesionData.session) throw new Error('No hay sesión activa.');
  const idUsuario = sesionData.session.user.id;

  const { data: eventoActual } = await supabase
    .from('Eventos')
    .select('asistentes')
    .eq('id', idEvento)
    .maybeSingle();

  const asistentesActuales = (eventoActual?.asistentes as number) ?? 0;

  if (yaUnido) {
    const { error: errDel, count } = await supabase
      .from('eventos_guardados')
      .delete({ count: 'exact' })
      .eq('perfil_id', idUsuario)
      .eq('evento_guardado', idEvento);
    if (errDel) throw new Error(`No se pudo salir del evento: ${errDel.message}`);
    if (count === 0) throw new Error('No se encontró el registro. Comprueba las políticas RLS de eventos_guardados en Supabase.');
    const nuevos = Math.max(2, asistentesActuales - 1);
    await supabase.from('Eventos').update({ asistentes: nuevos }).eq('id', idEvento);
    return { estaUnido: false, asistentes: nuevos };
  } else {
    const { error: errIns } = await supabase
      .from('eventos_guardados')
      .insert({ perfil_id: idUsuario, evento_guardado: idEvento });
    if (errIns) throw new Error(`No se pudo unir al evento: ${errIns.message}`);
    const nuevos = asistentesActuales + 1;
    await supabase.from('Eventos').update({ asistentes: nuevos }).eq('id', idEvento);
    return { estaUnido: true, asistentes: nuevos };
  }
}

export async function crearEvento(datos: {
  nombre: string;
  fechaHora: string;
  direccion: string;
  admision: string;
}): Promise<EventoCreado> {
  const { data: sesionData } = await supabase.auth.getSession();
  if (!sesionData.session) throw new Error('No hay sesión activa.');
  const idUsuario = sesionData.session.user.id;

  const { data, error } = await supabase
    .from('Eventos')
    .insert({
      creador_id: idUsuario,
      nombre: datos.nombre,
      fecha_hora: parsearFechaHora(datos.fechaHora),
      direccion: datos.direccion,
      admision: datos.admision,
      asistentes: 2,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  return {
    id: data.id as string,
    nombre: data.nombre as string,
    fechaHora: formatearFechaHora(data.fecha_hora as string),
    direccion: data.direccion as string,
    admision: (data.admision as string) ?? '',
    asistentes: 2,
    maximoAsistentes: null,
  };
}

export async function editarEventoCreado(datos: EventoCreado): Promise<EventoCreado> {
  const { data: sesionData } = await supabase.auth.getSession();
  if (!sesionData.session) throw new Error('No hay sesiÃ³n activa.');
  const idUsuario = sesionData.session.user.id;

  const { data, error } = await supabase
    .from('Eventos')
    .update({
      nombre: datos.nombre,
      fecha_hora: parsearFechaHora(datos.fechaHora),
      direccion: datos.direccion,
      admision: datos.admision ?? 'Cualquier Mascota',
    })
    .eq('id', datos.id)
    .eq('creador_id', idUsuario)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return {
    id: data.id as string,
    nombre: data.nombre as string,
    fechaHora: formatearFechaHora(data.fecha_hora as string),
    direccion: data.direccion as string,
    admision: (data.admision as string) ?? '',
    asistentes: (data.asistentes as number) ?? datos.asistentes ?? 0,
    maximoAsistentes: datos.maximoAsistentes ?? null,
  };
}

export async function eliminarEventoCreado(idEvento: string): Promise<void> {
  // Primero borrar de eventos_guardados de todos los asistentes
  const { error: errorGuardados } = await supabase
    .from('eventos_guardados')
    .delete()
    .eq('evento_guardado', idEvento);
  if (errorGuardados) throw new Error(errorGuardados.message);

  const { error } = await supabase.from('Eventos').delete().eq('id', idEvento);
  if (error) throw new Error(error.message);
}

export async function toggleFavorito(establecimiento: {
  nombre: string;
  direccion: string;
  admitePerrosGrandes: boolean;
  accesoInterior: boolean;
}): Promise<LugarFavorito[]> {
  const { data: sesionData } = await supabase.auth.getSession();
  if (!sesionData.session) throw new Error('No hay sesión activa.');
  const idUsuario = sesionData.session.user.id;

  const { data: lugar, error: errorLugar } = await supabase
    .from('Lugares')
    .select('id')
    .eq('nombre', establecimiento.nombre)
    .maybeSingle();

  if (errorLugar) throw new Error(errorLugar.message);
  if (!lugar) throw new Error(`"${establecimiento.nombre}" no está en la tabla Lugares.`);

  const idLugar = lugar.id as number;

  const { data: favExistente } = await supabase
    .from('Favoritos')
    .select('id')
    .eq('perfil_id', idUsuario)
    .eq('lugar_id', idLugar)
    .maybeSingle();

  if (favExistente) {
    await supabase.from('Favoritos').delete().eq('id', favExistente.id);
  } else {
    const { error } = await supabase.from('Favoritos').insert({ perfil_id: idUsuario, lugar_id: idLugar });
    if (error) throw new Error(error.message);
  }

  const { data: favoritosActualizados } = await supabase
    .from('Favoritos')
    .select('id, lugar_id, Lugares(id, nombre, direccion, imagen, descripcion, admision_perros_grandes, acceso_interior)')
    .eq('perfil_id', idUsuario);

  return (favoritosActualizados ?? [])
    .map((f) => ({
      idFavorito: (f as { id: string }).id,
      idLugar: String((f as { lugar_id: unknown }).lugar_id ?? ''),
      lugar: (f as { Lugares: any | null }).Lugares,
    }))
    .filter((f): f is { idFavorito: string; idLugar: string; lugar: any } => f.lugar !== null)
    .map((f) => ({
      id: f.idFavorito,
      idLugar: f.idLugar,
      nombre: f.lugar['nombre'] as string,
      direccion: f.lugar['direccion'] as string,
      admitePerrosGrandes: f.lugar['admision_perros_grandes'] as boolean,
      accesoInterior: f.lugar['acceso_interior'] as boolean,
    }));
}

export async function eliminarFavorito(idFavorito: string): Promise<LugarFavorito[]> {
  const { data: sesionData } = await supabase.auth.getSession();
  if (!sesionData.session) throw new Error('No hay sesión activa.');
  const idUsuario = sesionData.session.user.id;

  const { error: errorEliminar } = await supabase
    .from('Favoritos')
    .delete()
    .eq('id', idFavorito)
    .eq('perfil_id', idUsuario);
  if (errorEliminar) throw new Error(errorEliminar.message);

  const { data: favoritosActualizados } = await supabase
    .from('Favoritos')
    .select('id, lugar_id, Lugares(id, nombre, direccion, imagen, descripcion, admision_perros_grandes, acceso_interior)')
    .eq('perfil_id', idUsuario);

  return (favoritosActualizados ?? [])
    .map((f) => ({
      idFavorito: (f as { id: string }).id,
      idLugar: String((f as { lugar_id: unknown }).lugar_id ?? ''),
      lugar: (f as { Lugares: any | null }).Lugares,
    }))
    .filter((f): f is { idFavorito: string; idLugar: string; lugar: any } => f.lugar !== null)
    .map((f) => ({
      id: f.idFavorito,
      idLugar: f.idLugar,
      nombre: f.lugar['nombre'] as string,
      direccion: f.lugar['direccion'] as string,
      admitePerrosGrandes: f.lugar['admision_perros_grandes'] as boolean,
      accesoInterior: f.lugar['acceso_interior'] as boolean,
    }));
}

const coloresPorCategoria: Record<CategoriaEstablecimiento, string> = {
  Restaurantes: '#1a9b8e',
  Ocio: '#ff8c42',
  Alojamientos: '#7ab851',
};

const coordenadasPorLugar: Record<string, { latitud: number; longitud: number }> = {
  'Parque del Retiro': { latitud: 40.4197, longitud: -3.6887 },
  'Casa de Campo': { latitud: 40.4193, longitud: -3.7615 },
  'Centro Canino Madrid Sur': { latitud: 40.3691, longitud: -3.7016 },
  'Parque Juan Carlos I': { latitud: 40.4619, longitud: -3.6099 },
  'Café Pet Friendly Madrid': { latitud: 40.4254, longitud: -3.7009 },
  'Clínica Veterinaria Centro': { latitud: 40.4079, longitud: -3.7114 },
  'IFEMA Madrid': { latitud: 40.4656, longitud: -3.6178 },
  'Parque Lineal del Manzanares': { latitud: 40.3695, longitud: -3.6857 },
  'Centro de Adopción Animal Madrid': { latitud: 40.3774, longitud: -3.7784 },
  'Residencia Canina HappyDog': { latitud: 40.3313, longitud: -3.7716 },
  'El Perro y la Galleta': { latitud: 40.4259, longitud: -3.6878 },
  'Café del Art': { latitud: 40.4139, longitud: -3.6986 },
  'Rías Bajas': { latitud: 40.4447, longitud: -3.6725 },
  'Urban Safari': { latitud: 40.4049, longitud: -3.6993 },
  'Autocine Madrid RACE': { latitud: 40.5043, longitud: -3.6762 },
  'B&B HOTEL Madrid Centro Puerta del Sol': { latitud: 40.4169, longitud: -3.7035 },
  'Only YOU Hotel Atocha': { latitud: 40.4078, longitud: -3.6901 },
};

function normalizarNumero(valor: unknown): number {
  if (typeof valor === 'number') return valor;
  if (typeof valor === 'string') return Number(valor.replace(',', '.'));
  return Number.NaN;
}

function normalizarCategoria(valor: unknown): CategoriaEstablecimiento {
  const categoria = String(valor ?? '').trim().toLowerCase();
  if (categoria.startsWith('restaurante')) return 'Restaurantes';
  if (categoria.startsWith('alojamiento')) return 'Alojamientos';
  return 'Ocio';
}

function mapearLugar(l: any): Establecimiento {
  const categoria = normalizarCategoria(l.categoria ?? l.tipo_lugares);
  const coordenadasRespaldo = coordenadasPorLugar[l.nombre] ?? { latitud: Number.NaN, longitud: Number.NaN };
  const latitud = normalizarNumero(l.latitud ?? l.Latitud ?? l.latitude ?? l.lat);
  const longitud = normalizarNumero(l.longitud ?? l.Longitud ?? l.longitude ?? l.lng ?? l.lon);

  return {
    id: String(l.id),
    categoria,
    nombre: l.nombre,
    descripcion: l.descripcion || '',
    reglaMascota: l.regla_mascota || '',
    direccion: l.direccion,
    barrio: l.barrio || '',
    imagen: l.imagen || '',
    destacado: l.destacado || false,
    color: l.color || coloresPorCategoria[categoria] || '#1a9b8e',
    latitud: Number.isFinite(latitud) ? latitud : coordenadasRespaldo.latitud,
    longitud: Number.isFinite(longitud) ? longitud : coordenadasRespaldo.longitud,
    admitePerrosGrandes: Boolean(l.admision_perros_grandes),
    accesoInterior: Boolean(l.acceso_interior),
    tipoLugares: l.tipo_lugares || '',
  };
}

export async function obtenerTodosLosLugaresMapa(): Promise<Establecimiento[]> {
  const { data: lugares, error } = await supabase
    .from('Lugares')
    .select('*')
    .order('id', { ascending: true });

  if (error) throw new Error(error.message);

  return (lugares ?? []).map(mapearLugar);
}

export const eliminarCuentaSupabase = async () => {
  const { data: { session: sesion } } = await supabase.auth.getSession()

  if (!sesion) {
    console.error('No hay sesión activa')
    return
  }

  const { error, data } = await supabase.functions.invoke('delete-cuenta', {
    headers: {
      Authorization: `Bearer ${sesion.access_token}`
    }
  })

  if (error) {
    const detalleError = await (error as any).context?.text?.()
    console.error('Error al eliminar cuenta:', error, 'Detalle:', detalleError)
    return
  }

  await supabase.auth.signOut()
  window.location.href = '/'
}
