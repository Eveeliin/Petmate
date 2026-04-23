import React, { useEffect, useMemo, useState } from 'react';
import {
  CalendarDays,
  Check,
  Edit3,
  Heart,
  LogOut,
  MapPin,
  PawPrint,
  Sparkles,
  Trash2,
  UserRound,
  X,
} from 'lucide-react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import {
  guardarPerfilUsuario,
  limpiarPerfilUsuario,
  limpiarSesion,
  obtenerPerfilUsuario,
  obtenerSesion,
  type PerfilUsuario,
} from '../utils/auth';

const logo = '/logo_def_pm.png';
const nivelesEnergia = ['Baja', 'Media', 'Alta'] as const;
const nivelesTamano = ['Pequeño', 'Mediano', 'Grande', 'Muy grande'] as const;

export function PaginaPerfil() {
  const navigate = useNavigate();
  const sesion = useMemo(() => obtenerSesion(), []);
  const [perfil, setPerfil] = useState<PerfilUsuario | null>(() => obtenerPerfilUsuario(sesion));
  const [estaEditandoPerfil, setEstaEditandoPerfil] = useState(false);
  const [idMascotaEnEdicion, setIdMascotaEnEdicion] = useState<string | null>(null);
  const [idEventoEnEdicion, setIdEventoEnEdicion] = useState<string | null>(null);
  const [idFavoritoPendienteDeBorrado, setIdFavoritoPendienteDeBorrado] = useState<string | null>(null);
  const [idEventoPendienteDeBorrado, setIdEventoPendienteDeBorrado] = useState<string | null>(null);
  const [modalEliminarCuentaAbierto, setModalEliminarCuentaAbierto] = useState(false);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    if (perfil) {
      guardarPerfilUsuario(perfil);
    }
  }, [perfil]);

  if (!sesion) {
    return <Navigate to="/login" replace />;
  }

  if (!perfil) {
    return null;
  }

  const mostrarMensajeTemporal = (texto: string) => {
    setMensaje(texto);
    window.setTimeout(() => setMensaje(''), 2500);
  };

  const cerrarSesion = () => {
    limpiarSesion();
    navigate('/');
  };

  const actualizarCampoPerfil = (campo: keyof PerfilUsuario, valor: string) => {
    setPerfil((perfilActual) => (perfilActual ? { ...perfilActual, [campo]: valor } : perfilActual));
  };

  const guardarCambiosPerfil = () => {
    if (!perfil) {
      return;
    }

    guardarPerfilUsuario(perfil);
    setEstaEditandoPerfil(false);
    mostrarMensajeTemporal('Tu perfil se ha actualizado correctamente.');
  };

  const anadirMascota = () => {
    if (idMascotaEnEdicion) {
      mostrarMensajeTemporal('Termina de editar la mascota actual antes de añadir otra.');
      return;
    }

    const idMascota = `pet-${Date.now()}`;
    setPerfil((perfilActual) =>
      perfilActual
        ? {
            ...perfilActual,
            pets: [
              ...perfilActual.pets,
              {
                id: idMascota,
                name: '',
                type: '',
                breed: '',
                age: '',
                size: '',
                energy: '',
                description: '',
              },
            ],
          }
        : perfilActual,
    );
    setIdMascotaEnEdicion(idMascota);
    mostrarMensajeTemporal('Se ha añadido una nueva mascota.');
  };

  const actualizarCampoMascota = (
    idMascota: string,
    campo: 'name' | 'type' | 'breed' | 'age' | 'size' | 'energy' | 'description',
    valor: string,
  ) => {
    if (campo === 'age' && !/^\d*$/.test(valor)) {
      return;
    }

    setPerfil((perfilActual) =>
      perfilActual
        ? {
            ...perfilActual,
            pets: perfilActual.pets.map((mascota) =>
              mascota.id === idMascota ? { ...mascota, [campo]: valor } : mascota,
            ),
          }
        : perfilActual,
    );
  };

  const alternarEdicionMascota = (idMascota: string) => {
    if (idMascotaEnEdicion === idMascota) {
      setIdMascotaEnEdicion(null);
      mostrarMensajeTemporal('Los cambios de la mascota se han guardado correctamente.');
      return;
    }

    setIdMascotaEnEdicion(idMascota);
  };

  const eliminarMascota = (idMascota: string) => {
    setPerfil((perfilActual) =>
      perfilActual
        ? {
            ...perfilActual,
            pets: perfilActual.pets.filter((mascota) => mascota.id !== idMascota),
          }
        : perfilActual,
    );

    if (idMascotaEnEdicion === idMascota) {
      setIdMascotaEnEdicion(null);
    }

    mostrarMensajeTemporal('La mascota se ha eliminado correctamente.');
  };

  const actualizarCampoEvento = (
    idEvento: string,
    campo: 'title' | 'description' | 'location' | 'time',
    valor: string,
  ) => {
    if (campo === 'time' && !/^([01]?\d|2[0-3])?(:?[0-5]?\d)?$/.test(valor)) {
      return;
    }

    setPerfil((perfilActual) =>
      perfilActual
        ? {
            ...perfilActual,
            createdEvents: perfilActual.createdEvents.map((evento) =>
              evento.id === idEvento ? { ...evento, [campo]: valor } : evento,
            ),
          }
        : perfilActual,
    );
  };

  const alternarEdicionEvento = (idEvento: string) => {
    if (idEventoEnEdicion === idEvento) {
      setIdEventoEnEdicion(null);
      mostrarMensajeTemporal('Los cambios del evento se han guardado correctamente.');
      return;
    }

    setIdEventoEnEdicion(idEvento);
  };

  const anadirEvento = () => {
    if (idEventoEnEdicion) {
      mostrarMensajeTemporal('Termina de editar el evento actual antes de crear otro.');
      return;
    }

    const idEvento = `event-${Date.now()}`;
    setPerfil((perfilActual) =>
      perfilActual
        ? {
            ...perfilActual,
            createdEvents: [
              ...perfilActual.createdEvents,
              {
                id: idEvento,
                title: '',
                description: '',
                location: '',
                time: '',
                attendees: 0,
                status: 'Borrador',
              },
            ],
          }
        : perfilActual,
    );
    setIdEventoEnEdicion(idEvento);
    mostrarMensajeTemporal('Se ha añadido un nuevo evento.');
  };

  const eliminarEvento = (idEvento: string) => {
    setPerfil((perfilActual) =>
      perfilActual
        ? {
            ...perfilActual,
            createdEvents: perfilActual.createdEvents.filter((evento) => evento.id !== idEvento),
          }
        : perfilActual,
    );

    if (idEventoEnEdicion === idEvento) {
      setIdEventoEnEdicion(null);
    }

    setIdEventoPendienteDeBorrado(null);
    mostrarMensajeTemporal('El evento se ha eliminado correctamente.');
  };

  const eliminarFavorito = (idFavorito: string) => {
    setPerfil((perfilActual) =>
      perfilActual
        ? {
            ...perfilActual,
            favorites: perfilActual.favorites.filter((favorito) => favorito.id !== idFavorito),
          }
        : perfilActual,
    );

    setIdFavoritoPendienteDeBorrado(null);
    mostrarMensajeTemporal('El lugar favorito se ha eliminado correctamente.');
  };

  const eliminarCuenta = () => {
    limpiarPerfilUsuario();
    limpiarSesion();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f6fcfb_0%,#ffffff_35%,#fff9f3_100%)]">
      <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="PetMate" className="h-14 w-auto" />
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.24em] text-[#1a9b8e]">PetMate</div>
              <div className="text-xs text-gray-500">Mi Perfil</div>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:border-[#1a9b8e] hover:text-[#1a9b8e]"
            >
              Volver al inicio
            </Link>
            <button
              type="button"
              onClick={cerrarSesion}
              className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              <LogOut size={16} />
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-gradient-to-br from-[#1a9b8e] via-[#1f8d84] to-[#7ab851] p-8 text-white shadow-[0_25px_80px_rgba(26,155,142,0.28)]">
            <div className="absolute right-0 top-0 h-40 w-40 translate-x-1/3 -translate-y-1/3 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute bottom-0 left-0 h-32 w-32 -translate-x-1/3 translate-y-1/3 rounded-full bg-white/10 blur-2xl" />

            <div className="relative z-10 flex flex-col gap-6">
              <div className="flex items-start gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white/15 backdrop-blur">
                  <UserRound size={36} />
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-white/70">Cuenta personal</p>
                  <h1 className="mt-2 text-4xl font-bold">{perfil.fullName}</h1>
                  <div className="mt-3 flex flex-wrap gap-3 text-sm text-white/80">
                    <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1">
                      <MapPin size={14} />
                      {perfil.district}
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1">
                      <CalendarDays size={14} />
                      {perfil.joinedLabel}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 md:max-w-md">
                <div className="flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3 backdrop-blur">
                  <span className="text-sm font-medium text-white/80">Mascotas registradas</span>
                  <span className="text-2xl font-bold text-white">{perfil.pets.length}</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3 backdrop-blur">
                  <span className="text-sm font-medium text-white/80">Lugares favoritos</span>
                  <span className="text-2xl font-bold text-white">{perfil.favorites.length}</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3 backdrop-blur">
                  <span className="text-sm font-medium text-white/80">Eventos creados</span>
                  <span className="text-2xl font-bold text-white">{perfil.createdEvents.length}</span>
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
                  value={perfil.fullName}
                  onChange={(event) => actualizarCampoPerfil('fullName', event.target.value)}
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
              <label className="block sm:col-span-2">
                <span className="mb-2 block text-sm font-medium text-gray-600">Zona habitual</span>
                <input
                  type="text"
                  value={perfil.district}
                  onChange={(event) => actualizarCampoPerfil('district', event.target.value)}
                  disabled={!estaEditandoPerfil}
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-[#1a9b8e] disabled:bg-gray-50"
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="mb-2 block text-sm font-medium text-gray-600">Biografía</span>
                <textarea
                  value={perfil.bio}
                  onChange={(event) => actualizarCampoPerfil('bio', event.target.value)}
                  disabled={!estaEditandoPerfil}
                  rows={4}
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-[#1a9b8e] disabled:bg-gray-50"
                />
              </label>
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
                  {perfil.pets.length} perfiles
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
              {perfil.pets.map((mascota) => (
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
                              <input
                                type="text"
                                value={mascota.name}
                                onChange={(event) => actualizarCampoMascota(mascota.id, 'name', event.target.value)}
                                placeholder="Nombre"
                                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-[#1a9b8e]"
                              />
                              <div className="grid gap-3 md:grid-cols-2">
                                <input
                                  type="text"
                                  value={mascota.type}
                                  onChange={(event) => actualizarCampoMascota(mascota.id, 'type', event.target.value)}
                                  placeholder="Tipo (ej. perro)"
                                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-[#1a9b8e]"
                                />
                                <input
                                  type="text"
                                  value={mascota.breed}
                                  onChange={(event) => actualizarCampoMascota(mascota.id, 'breed', event.target.value)}
                                  placeholder="Raza"
                                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-[#1a9b8e]"
                                />
                                <select
                                  value={mascota.size}
                                  onChange={(event) => actualizarCampoMascota(mascota.id, 'size', event.target.value)}
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
                                  type="text"
                                  value={mascota.age}
                                  onChange={(event) => actualizarCampoMascota(mascota.id, 'age', event.target.value)}
                                  placeholder="Edad"
                                  inputMode="numeric"
                                  pattern="[0-9]*"
                                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-[#1a9b8e]"
                                />
                                <select
                                  value={mascota.energy}
                                  onChange={(event) => actualizarCampoMascota(mascota.id, 'energy', event.target.value)}
                                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-[#1a9b8e]"
                                >
                                  <option value="" disabled>
                                    Energía
                                  </option>
                                  {nivelesEnergia.map((energia) => (
                                    <option key={energia} value={energia}>
                                      {energia}
                                    </option>
                                  ))}
                                </select>
                                <textarea
                                  value={mascota.description}
                                  onChange={(event) =>
                                    actualizarCampoMascota(mascota.id, 'description', event.target.value)
                                  }
                                  placeholder="Descripción (opcional)"
                                  rows={3}
                                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-[#1a9b8e] md:col-span-2"
                                />
                                <button
                                  type="button"
                                  onClick={() => alternarEdicionMascota(mascota.id)}
                                  className="w-full rounded-2xl bg-[#1a9b8e] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#16887d] md:col-span-2"
                                >
                                  Guardar
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="flex items-center justify-between gap-4">
                                <h3 className="text-lg font-bold text-gray-900">{mascota.name || 'Sin nombre'}</h3>
                                <span className="rounded-full bg-[#fff4eb] px-3 py-1 text-xs font-semibold text-[#ff8c42]">
                                  Energía {mascota.energy || 'Pendiente'}
                                </span>
                              </div>
                              <p className="mt-1 text-sm text-gray-600">
                                {[mascota.type || 'Tipo pendiente', mascota.breed || 'Raza pendiente', mascota.size || 'Tamaño pendiente', mascota.age || 'Edad pendiente'].join(' · ')}
                              </p>
                              {mascota.description && <p className="mt-2 text-sm text-gray-600">{mascota.description}</p>}
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
                {perfil.favorites.map((favorito) => (
                  <article key={favorito.id} className="rounded-3xl border border-gray-100 p-5 transition hover:shadow-md">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{favorito.name}</h3>
                        <p className="mt-1 text-sm text-gray-600">
                          {favorito.category} · {favorito.area}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-[#eef7f5] px-3 py-1 text-xs font-semibold text-[#1a9b8e]">
                          Guardado
                        </span>
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
                    </div>
                    <p className="mt-3 text-sm text-gray-600">{favorito.petRule}</p>
                  </article>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-gray-100 bg-white p-8 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#7ab851]">Tus eventos</p>
                  <h2 className="mt-2 text-2xl font-bold text-gray-900">Eventos creados</h2>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={anadirEvento}
                    className="rounded-full bg-gradient-to-r from-[#1a9b8e] to-[#7ab851] px-4 py-2 text-sm font-semibold text-white transition hover:shadow-lg"
                  >
                    + Crear evento
                  </button>
                  <Sparkles size={20} className="text-[#7ab851]" />
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {perfil.createdEvents.map((evento) => (
                  <article key={evento.id} className="rounded-3xl border border-gray-100 bg-[#fbfdf9] p-5">
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div className="flex-1">
                          {idEventoEnEdicion === evento.id ? (
                            <div className="space-y-3">
                              <input
                                type="text"
                                value={evento.title}
                                onChange={(event) => actualizarCampoEvento(evento.id, 'title', event.target.value)}
                                placeholder="Nombre del evento"
                                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-[#1a9b8e]"
                              />
                              <textarea
                                value={evento.description}
                                onChange={(event) => actualizarCampoEvento(evento.id, 'description', event.target.value)}
                                placeholder="Descripcion"
                                rows={4}
                                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-[#1a9b8e]"
                              />
                              <div className="grid gap-3 md:grid-cols-2">
                                <input
                                  type="text"
                                  value={evento.location}
                                  onChange={(event) => actualizarCampoEvento(evento.id, 'location', event.target.value)}
                                  placeholder="Lugar"
                                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-[#1a9b8e]"
                                />
                                <input
                                  type="text"
                                  value={evento.time}
                                  onChange={(event) => actualizarCampoEvento(evento.id, 'time', event.target.value)}
                                  placeholder="00:00"
                                  inputMode="numeric"
                                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-[#1a9b8e]"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => alternarEdicionEvento(evento.id)}
                                className="w-full rounded-2xl bg-[#1a9b8e] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#16887d]"
                              >
                                Guardar
                              </button>
                            </div>
                          ) : (
                            <>
                              <h3 className="text-lg font-bold text-gray-900">{evento.title || 'Evento sin título'}</h3>
                              {evento.description && <p className="mt-2 text-sm text-gray-600">{evento.description}</p>}
                              <p className="mt-1 text-sm text-gray-600">
                                {[evento.location || 'Lugar pendiente', evento.time || 'Hora pendiente'].join(' | ')}
                              </p>
                            </>
                          )}
                        </div>

                        <div className="flex gap-2">
                          {idEventoEnEdicion !== evento.id && (
                            <button
                              type="button"
                              onClick={() => alternarEdicionEvento(evento.id)}
                              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#eef7f5] text-[#1a9b8e] transition hover:bg-[#dff3ef]"
                              aria-label="Editar evento"
                              title="Editar evento"
                            >
                              <Edit3 size={16} />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => setIdEventoPendienteDeBorrado(evento.id)}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#fff1f1] text-[#e25b5b] transition hover:bg-[#ffe3e3]"
                            aria-label="Eliminar evento"
                            title="Eliminar evento"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full bg-[#eef7f5] px-3 py-1 text-xs font-semibold text-[#1a9b8e]">
                          {evento.attendees} asistentes
                        </span>
                        <span className="rounded-full bg-[#f0f8e8] px-3 py-1 text-xs font-semibold text-[#7ab851]">
                          {evento.status}
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
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
                Si eliminas tu cuenta, se cerrará tu sesión y se borrarán los datos guardados localmente en este
                navegador.
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

      {idFavoritoPendienteDeBorrado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/45 px-4">
          <div className="w-full max-w-md rounded-[2rem] bg-white p-8 shadow-[0_30px_90px_rgba(15,23,42,0.25)]">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#fff1f1] text-[#e25b5b]">
              <Trash2 size={28} />
            </div>

            <div className="mt-5 text-center">
              <h3 className="text-2xl font-bold text-gray-900">¿Está seguro que quiere borrarlo?</h3>
              <p className="mt-2 text-sm text-gray-600">Este lugar dejará de aparecer en tus favoritos.</p>
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

      {idEventoPendienteDeBorrado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/45 px-4">
          <div className="w-full max-w-md rounded-[2rem] bg-white p-8 shadow-[0_30px_90px_rgba(15,23,42,0.25)]">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#fff1f1] text-[#e25b5b]">
              <Trash2 size={28} />
            </div>

            <div className="mt-5 text-center">
              <h3 className="text-2xl font-bold text-gray-900">¿Está seguro que quiere borrarlo?</h3>
              <p className="mt-2 text-sm text-gray-600">Este evento dejará de aparecer en tu perfil.</p>
            </div>

            <div className="mt-8 flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => eliminarEvento(idEventoPendienteDeBorrado)}
                className="inline-flex items-center gap-2 rounded-full bg-[#1fa463] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#178250]"
              >
                <Check size={18} />
                Confirmar
              </button>
              <button
                type="button"
                onClick={() => setIdEventoPendienteDeBorrado(null)}
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
              <h3 className="text-2xl font-bold text-gray-900">¿Estás seguro que quieres dejarnos?</h3>
              <p className="mt-2 text-sm text-gray-600">
                Esta acción cerrará tu sesión y eliminará tu cuenta guardada en este navegador.
              </p>
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
