import React, { useEffect, useState } from 'react';
import { CalendarDays, Check, Edit3, Heart, MapPin, PawPrint, Plus, Trash2, UserRound, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import {
  guardarPerfilUsuario,
  limpiarPerfilUsuario,
  limpiarSesion,
  obtenerPerfilUsuario,
  obtenerSesion,
  type EventoCreado,
  type PerfilMascota,
  type PerfilUsuario,
} from '../utils/auth';
const nivelesTamano = ['Pequeño', 'Mediano', 'Grande', 'Muy grande'] as const;

function leerArchivoComoDataUrl(archivo: File) {
  return new Promise<string>((resolve, reject) => {
    const lector = new FileReader();
    lector.onload = () => resolve(typeof lector.result === 'string' ? lector.result : '');
    lector.onerror = () => reject(new Error('No se pudo leer el archivo.'));
    lector.readAsDataURL(archivo);
  });
}

function crearMascotaVacia(): PerfilMascota {
  return {
    id: `pet-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    nombre: '',
    raza: '',
    peso: null,
    tamano: '',
    esSociable: false,
    foto: null,
  };
}

function crearEventoVacio(): EventoCreado {
  return {
    id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    nombre: '',
    fechaHora: '',
    direccion: '',
    maxAttendees: null,
  };
}

function esFechaValida(fecha: string) {
  const coincidencia = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(fecha.trim());
  if (!coincidencia) return false;

  const [, diaTexto, mesTexto, anioTexto] = coincidencia;
  const dia = Number(diaTexto);
  const mes = Number(mesTexto);
  const anio = Number(anioTexto);
  const fechaComprobada = new Date(anio, mes - 1, dia);

  return (
    fechaComprobada.getFullYear() === anio &&
    fechaComprobada.getMonth() === mes - 1 &&
    fechaComprobada.getDate() === dia
  );
}

function esHoraValida(hora: string) {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(hora.trim());
}

function formatearFechaEntrada(valor: string) {
  const digitos = valor.replace(/\D/g, '').slice(0, 8);
  const partes = [digitos.slice(0, 2), digitos.slice(2, 4), digitos.slice(4, 8)].filter(Boolean);
  return partes.join('/');
}

function formatearHoraEntrada(valor: string) {
  const digitos = valor.replace(/\D/g, '').slice(0, 4);
  if (digitos.length <= 2) {
    return digitos;
  }

  return `${digitos.slice(0, 2)}:${digitos.slice(2, 4)}`;
}

function normalizarHoraEntrada(valor: string) {
  const digitos = valor.replace(/\D/g, '');

  if (digitos.length === 3) {
    return `0${digitos[0]}:${digitos.slice(1, 3)}`;
  }

  if (digitos.length === 4) {
    return `${digitos.slice(0, 2)}:${digitos.slice(2, 4)}`;
  }

  return formatearHoraEntrada(valor);
}

export function PaginaPerfil() {
  const navigate = useNavigate();
  const [perfil, setPerfil] = useState<PerfilUsuario | null>(null);
  const [cargandoPerfil, setCargandoPerfil] = useState(true);
  const [errorCarga, setErrorCarga] = useState<string | null>(null);
  const [estaEditandoPerfil, setEstaEditandoPerfil] = useState(false);
  const [idMascotaEnEdicion, setIdMascotaEnEdicion] = useState<string | null>(null);
  const [idFavoritoPendienteDeBorrado, setIdFavoritoPendienteDeBorrado] = useState<string | null>(null);
  const [modalEliminarCuentaAbierto, setModalEliminarCuentaAbierto] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [mostrandoFormularioEvento, setMostrandoFormularioEvento] = useState(false);
  const [nuevoEvento, setNuevoEvento] = useState<EventoCreado>(crearEventoVacio());
  const [fechaNuevoEvento, setFechaNuevoEvento] = useState('');
  const [horaNuevoEvento, setHoraNuevoEvento] = useState('');
  const [borradoresMascota, setBorradoresMascota] = useState<Record<string, PerfilMascota>>({});

  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        setCargandoPerfil(true);
        setErrorCarga(null);

        const session = await obtenerSesion();
        if (!session) {
          navigate('/login', { replace: true });
          return;
        }

        const perfilUsuario = await obtenerPerfilUsuario();
        if (!perfilUsuario) {
          setErrorCarga('No se encontró tu perfil.');
          return;
        }

        setPerfil(perfilUsuario);
      } catch (errorDesconocido: unknown) {
        const mensajeError = errorDesconocido instanceof Error ? errorDesconocido.message : 'No se pudo cargar tu perfil.';
        console.error('Error cargando perfil:', errorDesconocido);
        setErrorCarga(mensajeError);
      } finally {
        setCargandoPerfil(false);
      }
    };

    cargarPerfil();
  }, [navigate]);

  const mostrarMensajeTemporal = (texto: string) => {
    setMensaje(texto);
    window.setTimeout(() => setMensaje(''), 2500);
  };

  const actualizarCampoPerfil = (campo: 'nombre' | 'avatar', valor: string | null) => {
    setPerfil((perfilActual) => (perfilActual ? { ...perfilActual, [campo]: valor } : perfilActual));
  };

  const actualizarCampoMascota = (
    idMascota: string,
    campo: 'nombre' | 'raza' | 'peso' | 'tamano' | 'esSociable' | 'foto',
    valor: string | boolean | number | null,
  ) => {
    setBorradoresMascota((borradoresActuales) => {
      const mascotaBase =
        borradoresActuales[idMascota] ?? perfil?.mascotas.find((mascota) => mascota.id === idMascota);

      if (!mascotaBase) {
        return borradoresActuales;
      }

      return {
        ...borradoresActuales,
        [idMascota]: {
          ...mascotaBase,
          [campo]: valor,
        },
      };
    });
  };

  const manejarArchivoAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = event.target.files?.[0];
    if (!archivo) return;

    try {
      const dataUrl = await leerArchivoComoDataUrl(archivo);
      actualizarCampoPerfil('avatar', dataUrl);
    } catch {
      mostrarMensajeTemporal('No se pudo cargar la imagen del avatar.');
    } finally {
      event.target.value = '';
    }
  };

  const manejarArchivoMascota = async (idMascota: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = event.target.files?.[0];
    if (!archivo) return;

    try {
      const dataUrl = await leerArchivoComoDataUrl(archivo);
      actualizarCampoMascota(idMascota, 'foto', dataUrl);
    } catch {
      mostrarMensajeTemporal('No se pudo cargar la foto de la mascota.');
    } finally {
      event.target.value = '';
    }
  };

  const guardarCambiosPerfil = async () => {
    if (!perfil) return;

    try {
      await guardarPerfilUsuario({
        ...perfil,
        nombre: perfil.nombre.trim(),
        avatar: perfil.avatar?.trim() ? perfil.avatar.trim() : null,
        mascotas: perfil.mascotas.map((mascota) => ({
          ...mascota,
          nombre: mascota.nombre.trim(),
          raza: mascota.raza.trim(),
          tamano: mascota.tamano.trim(),
          foto: mascota.foto?.trim() ? mascota.foto.trim() : null,
        })),
      });

      const perfilActualizado = await obtenerPerfilUsuario();
      if (perfilActualizado) {
        setPerfil(perfilActualizado);
      }

      setEstaEditandoPerfil(false);
      setIdMascotaEnEdicion(null);
      mostrarMensajeTemporal('Tu perfil se ha actualizado correctamente.');
    } catch (errorDesconocido: unknown) {
      const mensajeError = errorDesconocido instanceof Error ? errorDesconocido.message : 'Error al guardar los cambios.';
      console.error('Error guardando perfil:', errorDesconocido);
      mostrarMensajeTemporal(mensajeError);
    }
  };

  const anadirMascota = () => {
    if (!perfil) return;

    const nuevaMascota = crearMascotaVacia();
    const perfilActualizado: PerfilUsuario = {
      ...perfil,
      mascotas: [...perfil.mascotas, nuevaMascota],
    };

    setPerfil(perfilActualizado);
    setIdMascotaEnEdicion(nuevaMascota.id);
    setBorradoresMascota((borradoresActuales) => ({
      ...borradoresActuales,
      [nuevaMascota.id]: nuevaMascota,
    }));

    guardarPerfilUsuario(perfilActualizado)
      .then(() => mostrarMensajeTemporal('Mascota añadida. Los cambios se guardan automáticamente.'))
      .catch((errorDesconocido: unknown) => {
        const mensajeError = errorDesconocido instanceof Error ? errorDesconocido.message : 'No se pudo guardar la mascota.';
        mostrarMensajeTemporal(mensajeError);
      });
  };

  const alternarEdicionMascota = (idMascota: string) => {
    if (!perfil) return;

    const mascota = perfil.mascotas.find((mascotaActual) => mascotaActual.id === idMascota);
    if (!mascota) return;

    setIdMascotaEnEdicion((actual) => (actual === idMascota ? null : idMascota));
    setBorradoresMascota((borradoresActuales) => ({
      ...borradoresActuales,
      [idMascota]: mascota,
    }));
  };

  const cancelarEdicionMascota = (idMascota: string) => {
    setIdMascotaEnEdicion(null);
    setBorradoresMascota((borradoresActuales) => {
      const { [idMascota]: _borradorEliminado, ...borradoresRestantes } = borradoresActuales;
      return borradoresRestantes;
    });
  };

  const guardarMascotaEditada = async (idMascota: string) => {
    if (!perfil) return;

    const borrador = borradoresMascota[idMascota];
    if (!borrador) {
      setIdMascotaEnEdicion(null);
      return;
    }

    const perfilActualizado: PerfilUsuario = {
      ...perfil,
      mascotas: perfil.mascotas.map((mascota) =>
        mascota.id === idMascota
          ? {
              ...borrador,
              nombre: borrador.nombre.trim(),
              raza: borrador.raza.trim(),
              tamano: borrador.tamano.trim(),
              foto: borrador.foto?.trim() ? borrador.foto.trim() : null,
            }
          : mascota,
      ),
    };

    try {
      await guardarPerfilUsuario(perfilActualizado);
      setPerfil(perfilActualizado);
      setIdMascotaEnEdicion(null);
      setBorradoresMascota((borradoresActuales) => {
        const { [idMascota]: _borradorEliminado, ...borradoresRestantes } = borradoresActuales;
        return borradoresRestantes;
      });
      mostrarMensajeTemporal('Mascota guardada correctamente.');
    } catch (errorDesconocido: unknown) {
      const mensajeError = errorDesconocido instanceof Error ? errorDesconocido.message : 'No se pudo guardar la mascota.';
      mostrarMensajeTemporal(mensajeError);
    }
  };

  const eliminarMascota = (idMascota: string) => {
    if (!perfil) return;

    const perfilActualizado: PerfilUsuario = {
      ...perfil,
      mascotas: perfil.mascotas.filter((mascota) => mascota.id !== idMascota),
    };

    setPerfil(perfilActualizado);

    if (idMascotaEnEdicion === idMascota) {
      setIdMascotaEnEdicion(null);
    }
    setBorradoresMascota((borradoresActuales) => {
      const { [idMascota]: _borradorEliminado, ...borradoresRestantes } = borradoresActuales;
      return borradoresRestantes;
    });

    guardarPerfilUsuario(perfilActualizado)
      .then(() => mostrarMensajeTemporal('La mascota se ha eliminado correctamente.'))
      .catch((errorDesconocido: unknown) => {
        const mensajeError = errorDesconocido instanceof Error ? errorDesconocido.message : 'No se pudo eliminar la mascota.';
        mostrarMensajeTemporal(mensajeError);
      });
  };

  const eliminarFavorito = (idFavorito: string) => {
    setPerfil((perfilActual) =>
      perfilActual
        ? {
            ...perfilActual,
            favoritos: perfilActual.favoritos.filter((favorito) => favorito.id !== idFavorito),
          }
        : perfilActual,
    );

    setIdFavoritoPendienteDeBorrado(null);
    mostrarMensajeTemporal('El favorito se ha quitado de la vista local.');
  };

  const actualizarCampoNuevoEvento = (campo: keyof EventoCreado, valor: string | number | null) => {
    setNuevoEvento((eventoActual) => ({
      ...eventoActual,
      [campo]: valor,
    }));
  };

  const actualizarFechaNuevoEvento = (valor: string) => {
    setFechaNuevoEvento(formatearFechaEntrada(valor));
  };

  const actualizarHoraNuevoEvento = (valor: string) => {
    setHoraNuevoEvento(formatearHoraEntrada(valor));
  };

  const normalizarHoraNuevoEvento = () => {
    setHoraNuevoEvento((horaActual) => normalizarHoraEntrada(horaActual));
  };

  const guardarNuevoEvento = async () => {
    if (!perfil) return;

    const fechaLimpia = fechaNuevoEvento.trim();
    const horaLimpia = horaNuevoEvento.trim();

    if (!nuevoEvento.nombre.trim() || !fechaLimpia || !horaLimpia || !nuevoEvento.direccion.trim()) {
      mostrarMensajeTemporal('Completa nombre, fecha, hora y dirección del evento.');
      return;
    }

    if (!esFechaValida(fechaLimpia)) {
      mostrarMensajeTemporal('La fecha debe tener formato DD/MM/AAAA y ser una fecha válida.');
      return;
    }

    if (!esHoraValida(horaLimpia)) {
      mostrarMensajeTemporal('La hora debe tener formato 00:00 h, entre 00:00 y 23:59.');
      return;
    }

    const fechaHora = `${fechaLimpia} - ${horaLimpia} h`;

    const perfilActualizado: PerfilUsuario = {
      ...perfil,
      eventos: [
        ...perfil.eventos,
        {
          ...nuevoEvento,
          nombre: nuevoEvento.nombre.trim(),
          fechaHora,
          direccion: nuevoEvento.direccion.trim(),
        },
      ],
    };

    await guardarPerfilUsuario(perfilActualizado);
    setPerfil(perfilActualizado);
    setNuevoEvento(crearEventoVacio());
    setFechaNuevoEvento('');
    setHoraNuevoEvento('');
    setMostrandoFormularioEvento(false);
    mostrarMensajeTemporal('Evento creado correctamente.');
  };

  const eliminarEvento = async (idEvento: string) => {
    if (!perfil) return;

    const perfilActualizado: PerfilUsuario = {
      ...perfil,
      eventos: perfil.eventos.filter((evento) => evento.id !== idEvento),
    };

    await guardarPerfilUsuario(perfilActualizado);
    setPerfil(perfilActualizado);
    mostrarMensajeTemporal('Evento eliminado.');
  };

  const eliminarEventoGuardado = async (idEvento: string) => {
    if (!perfil) return;

    const perfilActualizado: PerfilUsuario = {
      ...perfil,
      eventosGuardados: perfil.eventosGuardados.filter((evento) => evento.id !== idEvento),
    };

    await guardarPerfilUsuario(perfilActualizado);
    setPerfil(perfilActualizado);
    mostrarMensajeTemporal('Evento guardado eliminado.');
  };

  const eliminarCuenta = async () => {
    await limpiarPerfilUsuario();
    await limpiarSesion();
    navigate('/');
  };

  if (cargandoPerfil) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#f6fcfb_0%,#ffffff_35%,#fff9f3_100%)]">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-[#1a9b8e]" />
          <p className="mt-4 text-gray-600">Cargando tu perfil...</p>
        </div>
      </div>
    );
  }

  if (errorCarga) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#f6fcfb_0%,#ffffff_35%,#fff9f3_100%)]">
        <div className="max-w-md rounded-[2rem] border border-red-200 bg-red-50 p-6 text-center">
          <h1 className="text-xl font-bold text-red-900">Error</h1>
          <p className="mt-2 text-sm text-red-700">{errorCarga}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-4 rounded-full bg-red-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Recargar página
          </button>
        </div>
      </div>
    );
  }

  if (!perfil) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f6fcfb_0%,#ffffff_35%,#fff9f3_100%)]">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-28 sm:px-6 lg:px-8">
        <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-gradient-to-br from-[#1a9b8e] via-[#1f8d84] to-[#7ab851] p-8 text-white shadow-[0_25px_80px_rgba(26,155,142,0.28)]">
            <div className="absolute right-0 top-0 h-40 w-40 translate-x-1/3 -translate-y-1/3 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute bottom-0 left-0 h-32 w-32 -translate-x-1/3 translate-y-1/3 rounded-full bg-white/10 blur-2xl" />

            <div className="relative z-10 flex flex-col gap-6">
              <div className="flex items-start gap-4">
                <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-3xl bg-white/15 backdrop-blur">
                  {perfil.avatar ? (
                    <img src={perfil.avatar} alt="Avatar" className="h-full w-full object-cover" />
                  ) : (
                    <UserRound size={36} />
                  )}
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-white/70">Cuenta personal</p>
                  <h1 className="mt-2 text-4xl font-bold">{perfil.nombre || 'Sin nombre'}</h1>
                  <div className="mt-3 text-sm text-white/80">{perfil.email}</div>
                </div>
              </div>

              <div className="grid gap-3 md:max-w-md">
                <div className="flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3 backdrop-blur">
                  <span className="text-sm font-medium text-white/80">Mascotas registradas</span>
                  <span className="text-2xl font-bold text-white">{perfil.mascotas.length}</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3 backdrop-blur">
                  <span className="text-sm font-medium text-white/80">Lugares favoritos</span>
                  <span className="text-2xl font-bold text-white">{perfil.favoritos.length}</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3 backdrop-blur">
                  <span className="text-sm font-medium text-white/80">Eventos creados</span>
                  <span className="text-2xl font-bold text-white">{perfil.eventos.length}</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3 backdrop-blur">
                  <span className="text-sm font-medium text-white/80">Eventos guardados</span>
                  <span className="text-2xl font-bold text-white">{perfil.eventosGuardados.length}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-gray-100 bg-white p-8 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#ff8c42]">Datos personales</p>
                <h2 className="mt-2 text-2xl font-bold text-gray-900">Tu información</h2>
              </div>
              <button
                type="button"
                onClick={() => (estaEditandoPerfil ? guardarCambiosPerfil() : setEstaEditandoPerfil(true))}
                className="inline-flex items-center gap-2 rounded-full bg-[#fff4eb] px-4 py-2 text-sm font-semibold text-[#ff8c42] transition hover:bg-[#ffe6d4]"
              >
                <Edit3 size={16} />
                {estaEditandoPerfil ? 'Guardar cambios' : 'Editar perfil'}
              </button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-600">Nombre visible</span>
                <input
                  type="text"
                  value={perfil.nombre}
                  onChange={(event) => actualizarCampoPerfil('nombre', event.target.value)}
                  disabled={!estaEditandoPerfil}
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-[#1a9b8e] disabled:bg-gray-50"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-600">Correo electrónico</span>
                <input
                  type="email"
                  value={perfil.email}
                  disabled
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500 outline-none"
                />
              </label>
              <div className="sm:col-span-2 rounded-3xl border border-gray-100 bg-[#fcfefd] p-4">
                <span className="mb-3 block text-sm font-medium text-gray-700">Avatar</span>
                <div className="flex items-center gap-4">
                  <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-3xl bg-[#eef7f5]">
                    {perfil.avatar ? (
                      <img src={perfil.avatar} alt="Avatar" className="h-full w-full object-cover" />
                    ) : (
                      <UserRound size={32} className="text-[#1a9b8e]" />
                    )}
                  </div>
                  <div className="flex-1 space-y-3">
                    <input
                      type="text"
                      value={perfil.avatar ?? ''}
                      onChange={(event) => actualizarCampoPerfil('avatar', event.target.value)}
                      disabled={!estaEditandoPerfil}
                      placeholder="URL del avatar"
                      className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-[#1a9b8e] disabled:bg-gray-50"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={manejarArchivoAvatar}
                      disabled={!estaEditandoPerfil}
                      className="block w-full text-sm text-gray-600 file:mr-4 file:rounded-full file:border-0 file:bg-[#eef7f5] file:px-4 file:py-2 file:font-semibold file:text-[#1a9b8e] hover:file:bg-[#dff3ef] disabled:opacity-60"
                    />
                  </div>
                </div>
              </div>
            </div>

            {mensaje && <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{mensaje}</p>}
          </div>
        </section>

        <section className="mt-8 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] border border-gray-100 bg-white p-8 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#1a9b8e]">Mascotas</p>
                <h2 className="mt-2 text-2xl font-bold text-gray-900">Tus compañeros</h2>
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-[#eef7f5] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#1a9b8e]">
                  {perfil.mascotas.length} perfiles
                </span>
                <button
                  type="button"
                  onClick={anadirMascota}
                  className="rounded-full bg-gradient-to-r from-[#1a9b8e] to-[#7ab851] px-4 py-2 text-sm font-semibold text-white transition hover:shadow-lg"
                >
                  Añadir
                </button>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {perfil.mascotas.map((mascota) => (
                <article key={mascota.id} className="rounded-3xl border border-gray-100 bg-[#fcfefd] p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1a9b8e] to-[#7ab851] text-white">
                      <PawPrint size={24} />
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div className="flex-1">
                          {idMascotaEnEdicion === mascota.id ? (
                            <div className="space-y-3">
                              <div className="grid gap-3 md:grid-cols-2">
                                <input
                                  type="text"
                                  value={(borradoresMascota[mascota.id] ?? mascota).nombre}
                                  onChange={(event) => actualizarCampoMascota(mascota.id, 'nombre', event.target.value)}
                                  placeholder="Nombre"
                                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-[#1a9b8e]"
                                />
                                <input
                                  type="text"
                                  value={(borradoresMascota[mascota.id] ?? mascota).raza}
                                  onChange={(event) => actualizarCampoMascota(mascota.id, 'raza', event.target.value)}
                                  placeholder="Raza"
                                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-[#1a9b8e]"
                                />
                                <select
                                  value={(borradoresMascota[mascota.id] ?? mascota).tamano}
                                  onChange={(event) => actualizarCampoMascota(mascota.id, 'tamano', event.target.value)}
                                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-[#1a9b8e]"
                                >
                                  <option value="" disabled>
                                    Tamaño
                                  </option>
                                  {nivelesTamano.map((tamano) => (
                                    <option key={tamano} value={tamano}>
                                      {tamano}
                                    </option>
                                  ))}
                                </select>
                                <input
                                  type="number"
                                  value={(borradoresMascota[mascota.id] ?? mascota).peso ?? ''}
                                  onChange={(event) =>
                                    actualizarCampoMascota(
                                      mascota.id,
                                      'peso',
                                      event.target.value ? parseFloat(event.target.value) : null,
                                    )
                                  }
                                  placeholder="Peso (kg)"
                                  step="0.1"
                                  min="0"
                                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-[#1a9b8e]"
                                />
                              </div>

                              <div>
                                <span className="mb-2 block text-sm font-medium text-gray-700">Sociabilidad</span>
                                <div className="grid gap-3 sm:grid-cols-2">
                                  <button
                                    type="button"
                                    onClick={() => actualizarCampoMascota(mascota.id, 'esSociable', true)}
                                    className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                                      (borradoresMascota[mascota.id] ?? mascota).esSociable
                                        ? 'bg-[#1a9b8e] text-white'
                                        : 'border border-gray-200 bg-white text-gray-800 hover:border-[#1a9b8e]'
                                    }`}
                                  >
                                    Sociable: Sí
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => actualizarCampoMascota(mascota.id, 'esSociable', false)}
                                    className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                                      !(borradoresMascota[mascota.id] ?? mascota).esSociable
                                        ? 'bg-[#ff8c42] text-white'
                                        : 'border border-gray-200 bg-white text-gray-800 hover:border-[#ff8c42]'
                                    }`}
                                  >
                                    Sociable: No
                                  </button>
                                </div>
                              </div>

                              <input
                                type="text"
                                value={(borradoresMascota[mascota.id] ?? mascota).foto ?? ''}
                                onChange={(event) => actualizarCampoMascota(mascota.id, 'foto', event.target.value)}
                                placeholder="URL de foto (opcional)"
                                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-[#1a9b8e]"
                              />

                              <div className="rounded-3xl border border-gray-100 bg-white p-4">
                                <div className="flex items-center gap-4">
                                  <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-3xl bg-[#eef7f5]">
                                    {(borradoresMascota[mascota.id] ?? mascota).foto ? (
                                      <img
                                        src={(borradoresMascota[mascota.id] ?? mascota).foto ?? ''}
                                        alt={(borradoresMascota[mascota.id] ?? mascota).nombre || 'Mascota'}
                                        className="h-full w-full object-cover"
                                      />
                                    ) : (
                                      <PawPrint size={28} className="text-[#1a9b8e]" />
                                    )}
                                  </div>
                                  <div className="flex-1">
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={(event) => manejarArchivoMascota(mascota.id, event)}
                                      className="block w-full text-sm text-gray-600 file:mr-4 file:rounded-full file:border-0 file:bg-[#eef7f5] file:px-4 file:py-2 file:font-semibold file:text-[#1a9b8e] hover:file:bg-[#dff3ef]"
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="grid gap-3 sm:grid-cols-2">
                                <button
                                  type="button"
                                  onClick={() => guardarMascotaEditada(mascota.id)}
                                  className="rounded-2xl bg-[#1a9b8e] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#16887d]"
                                >
                                  Guardar
                                </button>
                                <button
                                  type="button"
                                  onClick={() => cancelarEdicionMascota(mascota.id)}
                                  className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:border-[#ff8c42] hover:text-[#ff8c42]"
                                >
                                  Cancelar
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="flex items-center justify-between gap-4">
                                <h3 className="text-lg font-bold text-gray-900">{mascota.nombre || 'Sin nombre'}</h3>
                              </div>
                              <p className="mt-1 text-sm text-gray-600">
                                {[mascota.raza || 'Raza pendiente', mascota.tamano || 'Tamaño pendiente'].join(' · ')}
                              </p>
                              <p className="mt-2 text-sm text-gray-600">
                                {mascota.peso ? `${mascota.peso} kg` : 'Peso pendiente'}
                              </p>
                              {mascota.foto && (
                                <img
                                  src={mascota.foto}
                                  alt={mascota.nombre || 'Mascota'}
                                  className="mt-3 h-32 w-full rounded-3xl object-cover"
                                />
                              )}
                              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                                <button
                                  type="button"
                                  disabled
                                  className={`rounded-2xl px-4 py-2 text-sm font-semibold ${
                                    mascota.esSociable
                                      ? 'bg-[#1a9b8e] text-white'
                                      : 'border border-gray-200 bg-white text-gray-400'
                                  }`}
                                >
                                  Sociable: Sí
                                </button>
                                <button
                                  type="button"
                                  disabled
                                  className={`rounded-2xl px-4 py-2 text-sm font-semibold ${
                                    !mascota.esSociable
                                      ? 'bg-[#ff8c42] text-white'
                                      : 'border border-gray-200 bg-white text-gray-400'
                                  }`}
                                >
                                  Sociable: No
                                </button>
                              </div>
                            </>
                          )}
                        </div>

                        <div className="flex gap-2">
                          {idMascotaEnEdicion !== mascota.id && (
                            <button
                              type="button"
                              onClick={() => alternarEdicionMascota(mascota.id)}
                              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#eef7f5] text-[#1a9b8e] transition hover:bg-[#dff3ef]"
                              aria-label="Editar mascota"
                              title="Editar mascota"
                            >
                              <Edit3 size={16} />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => eliminarMascota(mascota.id)}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#fff1f1] text-[#e25b5b] transition hover:bg-[#ffe3e3]"
                            aria-label="Eliminar mascota"
                            title="Eliminar mascota"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <div className="rounded-[2rem] border border-gray-100 bg-white p-8 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#ff8c42]">Favoritos</p>
                  <h2 className="mt-2 text-2xl font-bold text-gray-900">Lugares guardados</h2>
                </div>
                <Heart size={20} className="text-[#ff8c42]" />
              </div>

              <div className="mt-6 grid gap-4">
                {perfil.favoritos.length === 0 && <p className="text-sm text-gray-500">Aún no hay favoritos guardados.</p>}

                {perfil.favoritos.map((favorito) => (
                  <article key={favorito.id} className="rounded-3xl border border-gray-100 p-5 transition hover:shadow-md">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{favorito.nombre}</h3>
                        <p className="mt-1 text-sm text-gray-600">{favorito.direccion || 'Dirección pendiente'}</p>
                        <div className="mt-3 grid gap-2 sm:grid-cols-2">
                          <button
                            type="button"
                            disabled
                            className={`rounded-2xl px-4 py-2 text-sm font-semibold ${
                              favorito.admitePerrosGrandes
                                ? 'bg-[#1a9b8e] text-white'
                                : 'border border-gray-200 bg-white text-gray-500'
                            }`}
                          >
                            Perros grandes: Sí
                          </button>
                          <button
                            type="button"
                            disabled
                            className={`rounded-2xl px-4 py-2 text-sm font-semibold ${
                              !favorito.admitePerrosGrandes
                                ? 'bg-[#ff8c42] text-white'
                                : 'border border-gray-200 bg-white text-gray-500'
                            }`}
                          >
                            Perros grandes: No
                          </button>
                          <button
                            type="button"
                            disabled
                            className={`rounded-2xl px-4 py-2 text-sm font-semibold ${
                              favorito.accesoInterior
                                ? 'bg-[#1a9b8e] text-white'
                                : 'border border-gray-200 bg-white text-gray-500'
                            }`}
                          >
                            Acceso interior: Sí
                          </button>
                          <button
                            type="button"
                            disabled
                            className={`rounded-2xl px-4 py-2 text-sm font-semibold ${
                              !favorito.accesoInterior
                                ? 'bg-[#ff8c42] text-white'
                                : 'border border-gray-200 bg-white text-gray-500'
                            }`}
                          >
                            Acceso interior: No
                          </button>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIdFavoritoPendienteDeBorrado(favorito.id)}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#fff1f1] text-[#e25b5b] transition hover:bg-[#ffe3e3]"
                        aria-label="Eliminar favorito"
                        title="Eliminar favorito"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div id="tus-eventos" className="rounded-[2rem] border border-gray-100 bg-white p-8 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#7ab851]">Mis eventos</p>
                  <h2 className="mt-2 text-2xl font-bold text-gray-900">Eventos creados</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setMostrandoFormularioEvento((valorActual) => !valorActual)}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#1a9b8e] to-[#7ab851] px-4 py-2 text-sm font-semibold text-white transition hover:shadow-lg"
                >
                  <Plus size={16} />
                  Crear evento
                </button>
              </div>

              {mostrandoFormularioEvento && (
                <div className="mt-6 rounded-3xl border border-gray-100 bg-[#fcfefd] p-5">
                  <div className="grid gap-3 md:grid-cols-2">
                    <input
                      type="text"
                      value={nuevoEvento.nombre}
                      onChange={(event) => actualizarCampoNuevoEvento('nombre', event.target.value)}
                      placeholder="Nombre del evento"
                      className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-[#1a9b8e] md:col-span-2"
                    />
                    <input
                      type="text"
                      value={fechaNuevoEvento}
                      onChange={(event) => actualizarFechaNuevoEvento(event.target.value)}
                      placeholder="Fecha DD/MM/AAAA"
                      inputMode="numeric"
                      maxLength={10}
                      className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-[#1a9b8e]"
                    />
                    <input
                      type="text"
                      value={horaNuevoEvento}
                      onChange={(event) => actualizarHoraNuevoEvento(event.target.value)}
                      onBlur={normalizarHoraNuevoEvento}
                      placeholder="Hora 00:00 h"
                      inputMode="numeric"
                      maxLength={5}
                      className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-[#1a9b8e]"
                    />
                    <input
                      type="number"
                      min="1"
                      value={nuevoEvento.maxAttendees ?? ''}
                      onChange={(event) =>
                        actualizarCampoNuevoEvento(
                          'maxAttendees',
                          event.target.value ? parseInt(event.target.value, 10) : null,
                        )
                      }
                      placeholder="Participantes máximos"
                      className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-[#1a9b8e]"
                    />
                    <input
                      type="text"
                      value={nuevoEvento.direccion}
                      onChange={(event) => actualizarCampoNuevoEvento('direccion', event.target.value)}
                      placeholder="Dirección"
                      className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-[#1a9b8e] md:col-span-2"
                    />
                  </div>

                  <div className="mt-4 flex gap-3">
                    <button
                      type="button"
                      onClick={guardarNuevoEvento}
                      className="rounded-2xl bg-[#1a9b8e] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#16887d]"
                    >
                      Guardar
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMostrandoFormularioEvento(false);
                        setNuevoEvento(crearEventoVacio());
                        setFechaNuevoEvento('');
                        setHoraNuevoEvento('');
                      }}
                      className="rounded-2xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:border-[#1a9b8e] hover:text-[#1a9b8e]"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-6 space-y-4">
                {perfil.eventos.length === 0 && <p className="text-sm text-gray-500">Aún no has creado eventos.</p>}

                {perfil.eventos.map((evento) => (
                  <article key={evento.id} className="rounded-3xl border border-gray-100 bg-[#fbfdf9] p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{evento.nombre || 'Evento sin nombre'}</h3>
                        <p className="mt-2 text-sm text-gray-600">{evento.direccion || 'Dirección pendiente'}</p>
                        <p className="mt-1 text-sm text-gray-600">{evento.fechaHora || 'Fecha pendiente'}</p>
                        {evento.maxAttendees ? (
                          <p className="mt-1 text-sm text-gray-600">Máximo {evento.maxAttendees} participantes</p>
                        ) : null}
                      </div>
                      <button
                        type="button"
                        onClick={() => eliminarEvento(evento.id)}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#fff1f1] text-[#e25b5b] transition hover:bg-[#ffe3e3]"
                        aria-label="Eliminar evento"
                        title="Eliminar evento"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </article>
                ))}
              </div>

              <div className="mt-8 border-t border-gray-100 pt-8">
                <h2 className="mt-2 text-2xl font-bold text-gray-900">Eventos guardados</h2>

                <div className="mt-5 space-y-4">
                  {perfil.eventosGuardados.length === 0 && (
                    <p className="text-sm text-gray-500">Aún no te has unido a ningún evento.</p>
                  )}

                  {perfil.eventosGuardados.map((evento) => (
                    <article key={evento.id} className="rounded-3xl border border-gray-100 bg-[#fcfefd] p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-[#eef7f5] px-3 py-1 text-xs font-semibold text-[#1a9b8e]">
                            Unido
                          </span>
                          {evento.organizer && (
                            <span className="rounded-full bg-[#fffaf4] px-3 py-1 text-xs font-medium text-gray-600">
                              Organiza {evento.organizer}
                            </span>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => eliminarEventoGuardado(evento.id)}
                          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#fff1f1] text-[#e25b5b] transition hover:bg-[#ffe3e3]"
                          aria-label="Eliminar evento guardado"
                          title="Eliminar evento guardado"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <h4 className="mt-3 text-lg font-bold text-gray-900">{evento.nombre}</h4>
                      {evento.description && <p className="mt-2 text-sm text-gray-600">{evento.description}</p>}

                      <div className="mt-4 grid gap-3 text-sm text-gray-600 sm:grid-cols-2">
                        <span className="flex items-center gap-2">
                          <CalendarDays size={16} className="text-[#ff8c42]" />
                          {evento.fechaHora || 'Fecha pendiente'}
                        </span>
                        <span className="flex items-center gap-2">
                          <MapPin size={16} className="text-[#1a9b8e]" />
                          {evento.direccion || 'Dirección pendiente'}
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-[2rem] border border-[#ffd7d7] bg-[#fff6f6] p-8 shadow-lg">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#d35454]">Zona de cuenta</p>
              <h2 className="mt-2 text-2xl font-bold text-gray-900">Eliminar cuenta</h2>
              <p className="mt-2 max-w-2xl text-sm text-gray-600">
                Esta acción eliminará tu cuenta local y cerrará tu sesión actual.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setModalEliminarCuentaAbierto(true)}
              className="inline-flex items-center justify-center rounded-full bg-[#e25b5b] px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-[#c84747]"
            >
              Eliminar cuenta
            </button>
          </div>
        </section>
      </main>

      <Footer />

      {idFavoritoPendienteDeBorrado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/45 px-4">
          <div className="w-full max-w-md rounded-[2rem] bg-white p-8 shadow-[0_30px_90px_rgba(15,23,42,0.25)]">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#fff1f1] text-[#e25b5b]">
              <Trash2 size={28} />
            </div>

            <div className="mt-5 text-center">
              <h3 className="text-2xl font-bold text-gray-900">¿Quieres ocultar este favorito?</h3>
              <p className="mt-2 text-sm text-gray-600">Se quitará de tu lista de lugares guardados.</p>
            </div>

            <div className="mt-8 flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => eliminarFavorito(idFavoritoPendienteDeBorrado)}
                className="inline-flex items-center gap-2 rounded-full bg-[#1fa463] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#178250]"
              >
                <Check size={18} />
                Confirmar
              </button>
              <button
                type="button"
                onClick={() => setIdFavoritoPendienteDeBorrado(null)}
                className="inline-flex items-center gap-2 rounded-full bg-[#e25b5b] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#c84747]"
              >
                <X size={18} />
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {modalEliminarCuentaAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/45 px-4">
          <div className="w-full max-w-md rounded-[2rem] bg-white p-8 shadow-[0_30px_90px_rgba(15,23,42,0.25)]">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#fff1f1] text-[#e25b5b]">
              <Trash2 size={28} />
            </div>

            <div className="mt-5 text-center">
              <h3 className="text-2xl font-bold text-gray-900">¿Seguro que quieres salir?</h3>
              <p className="mt-2 text-sm text-gray-600">Esta acción cerrará tu sesión actual.</p>
            </div>

            <div className="mt-8 flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={eliminarCuenta}
                className="inline-flex items-center gap-2 rounded-full bg-[#1fa463] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#178250]"
              >
                <Check size={18} />
                Confirmar
              </button>
              <button
                type="button"
                onClick={() => setModalEliminarCuentaAbierto(false)}
                className="inline-flex items-center gap-2 rounded-full bg-[#e25b5b] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#c84747]"
              >
                <X size={18} />
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
