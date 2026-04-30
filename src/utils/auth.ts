import { supabase } from '../supabaseClient';

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
};

export type PerfilUsuario = {
  nombre: string;
  email: string;
  avatar?: string | null;
  mascotas: PerfilMascota[];
  favoritos: LugarFavorito[];
  eventos: EventoCreado[];
};

type DatosPerfilBase = {
  idUsuario: string;
  email: string;
  nombre: string;
  avatar?: string | null;
};

export async function obtenerSesion() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

export async function obtenerUsuarioActual() {
  const { data } = await supabase.auth.getUser();
  return data.user;
}

export async function limpiarSesion() {
  await supabase.auth.signOut();
}

export function suscribirCambioAutenticacion(callback: () => void) {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(() => {
    callback();
  });

  return () => subscription.unsubscribe();
}

export async function asegurarPerfilBase({
  idUsuario,
  email,
  nombre,
  avatar = null,
}: DatosPerfilBase) {
  const perfilBase = {
    id: idUsuario,
    nombre: nombre.trim(),
    email: email.trim(),
    avatar,
  };

  const { data: perfilExistente, error: consultaError } = await supabase
    .from('Perfil')
    .select('id')
    .eq('id', idUsuario)
    .maybeSingle();

  if (consultaError) {
    throw new Error(`Error consultando perfil base: ${consultaError.message}`);
  }

  if (perfilExistente) {
    const { error: updateError } = await supabase.from('Perfil').update(perfilBase).eq('id', idUsuario);
    if (updateError) {
      throw new Error(`Error actualizando perfil base: ${updateError.message}`);
    }
    return;
  }

  const { error: insertError } = await supabase.from('Perfil').insert(perfilBase);
  if (insertError) {
    throw new Error(`Error creando perfil base: ${insertError.message}`);
  }
}

export async function obtenerPerfilUsuario(): Promise<PerfilUsuario | null> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) return null;

  const { data: perfil, error: perfilError } = await supabase
    .from('Perfil')
    .select('*')
    .eq('id', session.user.id)
    .maybeSingle();

  if (perfilError) {
    throw new Error(`Error obteniendo perfil: ${perfilError.message}`);
  }

  if (!perfil) return null;

  const { data: mascotas, error: mascotasError } = await supabase
    .from('Mascotas')
    .select('*')
    .eq('dueno_id', session.user.id);

  if (mascotasError) {
    throw new Error(`Error obteniendo mascotas: ${mascotasError.message}`);
  }

  const { data: favoritos, error: favoritosError } = await supabase
    .from('Favoritos')
    .select('id, Lugares(nombre, direccion, admision_perros_grandes, acceso_interior)')
    .eq('perfil_id', session.user.id);

  if (favoritosError) {
    throw new Error(`Error obteniendo favoritos: ${favoritosError.message}`);
  }

  const { data: eventos, error: eventosError } = await supabase
    .from('Eventos')
    .select('*')
    .eq('creador_id', session.user.id);

  if (eventosError) {
    throw new Error(`Error obteniendo eventos: ${eventosError.message}`);
  }

  return {
    nombre: perfil.nombre ?? '',
    email: perfil.email ?? '',
    avatar: perfil.avatar ?? null,
    mascotas: (mascotas ?? []).map((mascota) => ({
      id: mascota.id,
      nombre: mascota.nombre ?? '',
      raza: mascota.raza ?? '',
      peso: mascota.peso ?? null,
      tamano: mascota.tamano ?? '',
      esSociable: mascota.sociabilidad ?? false,
      foto: mascota.foto ?? null,
    })),
    favoritos: (favoritos ?? []).map((favorito) => {
      const lugar = Array.isArray(favorito.Lugares) ? favorito.Lugares[0] : favorito.Lugares;

      return {
        id: String(favorito.id),
        nombre: lugar?.nombre ?? '',
        direccion: lugar?.direccion ?? '',
        admitePerrosGrandes: lugar?.admision_perros_grandes ?? false,
        accesoInterior: lugar?.acceso_interior ?? false,
      };
    }),
    eventos: (eventos ?? []).map((evento) => ({
      id: evento.id,
      nombre: evento.nombre ?? '',
      fechaHora: evento.fecha_hora ?? '',
      direccion: evento.direccion ?? '',
    })),
  };
}

export function esPerfilIncompleto(perfil: PerfilUsuario | null) {
  return !perfil || !perfil.nombre || !perfil.nombre.trim();
}

export async function guardarMascotas(mascotas: PerfilMascota[], idDueno: string) {
  const mascotasValidas = mascotas.filter((mascota) => mascota.nombre.trim());

  const idsExistentes = mascotasValidas
    .filter((mascota) => !mascota.id.startsWith('pet-'))
    .map((mascota) => mascota.id);

  const { data: mascotasGuardadas, error: consultaError } = await supabase
    .from('Mascotas')
    .select('id')
    .eq('dueno_id', idDueno);

  if (consultaError) {
    throw new Error(`Error consultando mascotas guardadas: ${consultaError.message}`);
  }

  const idsParaEliminar = (mascotasGuardadas ?? [])
    .map((mascota) => mascota.id)
    .filter((id) => !idsExistentes.includes(id));

  if (idsParaEliminar.length > 0) {
    const { error: borradoError } = await supabase
      .from('Mascotas')
      .delete()
      .in('id', idsParaEliminar)
      .eq('dueno_id', idDueno);

    if (borradoError) {
      throw new Error(`Error eliminando mascotas: ${borradoError.message}`);
    }
  }

  for (const mascota of mascotasValidas) {
    const esNuevaMascota = mascota.id.startsWith('pet-');
    const idMascota = esNuevaMascota ? crypto.randomUUID() : mascota.id;
    const mascotaParaGuardar = {
      id: idMascota,
      dueno_id: idDueno,
      nombre: mascota.nombre.trim(),
      raza: mascota.raza.trim(),
      peso: mascota.peso ?? null,
      tamano: mascota.tamano.trim(),
      sociabilidad: mascota.esSociable,
      foto: mascota.foto?.trim() ? mascota.foto.trim() : null,
    };

    if (esNuevaMascota) {
      const { error } = await supabase.from('Mascotas').insert(mascotaParaGuardar);
      if (error) {
        throw new Error(`Error guardando mascota ${mascota.nombre}: ${error.message}`);
      }
    } else {
      const { error } = await supabase
        .from('Mascotas')
        .update(mascotaParaGuardar)
        .eq('id', mascota.id)
        .eq('dueno_id', idDueno);

      if (error) {
        throw new Error(`Error actualizando mascota ${mascota.nombre}: ${error.message}`);
      }
    }
  }
}

export async function guardarPerfilUsuario(perfil: PerfilUsuario) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error('No hay sesion activa');
  }

  await asegurarPerfilBase({
    idUsuario: session.user.id,
    email: perfil.email,
    nombre: perfil.nombre,
    avatar: perfil.avatar ?? null,
  });

  await guardarMascotas(perfil.mascotas, session.user.id);
}

export async function limpiarPerfilUsuario() {
  await supabase.auth.signOut();
}
