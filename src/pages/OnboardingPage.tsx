import React, { useEffect, useState } from 'react';
import { ArrowLeft, PawPrint, Plus, Sparkles, UserRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  guardarPerfilUsuario,
  obtenerPerfilUsuario,
  obtenerSesion,
  obtenerUsuarioActual,
  type PerfilMascota,
  type PerfilUsuario,
} from '../utils/auth';

const logo = '/logo_def_pm.png';
const nivelesTamano = ['Pequeno', 'Mediano', 'Grande', 'Muy grande'] as const;

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

export function PaginaOnboarding() {
  const navigate = useNavigate();
  const [sesion, setSesion] = useState<Awaited<ReturnType<typeof obtenerSesion>> | undefined>(undefined);
  const [perfil, setPerfil] = useState<PerfilUsuario | null>(null);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      const sesionActiva = await obtenerSesion();
      if (!sesionActiva) {
        navigate('/login', { replace: true });
        return;
      }

      setSesion(sesionActiva);

      const perfilExistente = await obtenerPerfilUsuario();
      if (perfilExistente) {
        setPerfil({
          ...perfilExistente,
          mascotas: perfilExistente.mascotas.length > 0 ? perfilExistente.mascotas : [crearMascotaVacia()],
        });
      } else {
        const usuarioActual = await obtenerUsuarioActual();
        const nombreSugerido =
          typeof usuarioActual?.user_metadata?.nombre === 'string' ? usuarioActual.user_metadata.nombre : '';

        setPerfil({
          nombre: nombreSugerido,
          email: sesionActiva.user.email ?? '',
          avatar: null,
          mascotas: [crearMascotaVacia()],
          favoritos: [],
          eventos: [],
        });
      }

      setCargando(false);
    };

    cargarDatos();
  }, [navigate]);

  if (cargando || !sesion || !perfil) {
    return null;
  }

  const actualizarCampoPerfil = (campo: 'nombre' | 'avatar', valor: string | null) => {
    setPerfil((perfilActual) => (perfilActual ? { ...perfilActual, [campo]: valor } : perfilActual));
  };

  const actualizarCampoMascota = (
    idMascota: string,
    campo: 'nombre' | 'raza' | 'peso' | 'tamano' | 'esSociable' | 'foto',
    valor: string | boolean | number | null,
  ) => {
    setPerfil((perfilActual) =>
      perfilActual
        ? {
            ...perfilActual,
            mascotas: perfilActual.mascotas.map((mascota) =>
              mascota.id === idMascota ? { ...mascota, [campo]: valor } : mascota,
            ),
          }
        : perfilActual,
    );
  };

  const anadirMascota = () => {
    setPerfil((perfilActual) =>
      perfilActual
        ? {
            ...perfilActual,
            mascotas: [...perfilActual.mascotas, crearMascotaVacia()],
          }
        : perfilActual,
    );
  };

  const eliminarMascota = (idMascota: string) => {
    setPerfil((perfilActual) => {
      if (!perfilActual) return perfilActual;

      if (perfilActual.mascotas.length === 1) {
        return {
          ...perfilActual,
          mascotas: [crearMascotaVacia()],
        };
      }

      return {
        ...perfilActual,
        mascotas: perfilActual.mascotas.filter((mascota) => mascota.id !== idMascota),
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
      setError('No se pudo cargar la imagen del avatar.');
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
      setError('No se pudo cargar la foto de la mascota.');
    } finally {
      event.target.value = '';
    }
  };

  const manejarEnvio = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (!perfil.nombre.trim()) {
      setError('Indica tu nombre para completar el registro.');
      return;
    }

    const hayMascotaValida = perfil.mascotas.some((mascota) => mascota.nombre.trim() || mascota.raza.trim());

    if (hayMascotaValida) {
      const mascotaIncompleta = perfil.mascotas.find(
        (mascota) =>
          (mascota.nombre.trim() || mascota.raza.trim()) &&
          (!mascota.nombre.trim() || !mascota.raza.trim() || !mascota.tamano.trim()),
      );

      if (mascotaIncompleta) {
        setError('Completa todos los campos obligatorios de cada mascota que quieras anadir.');
        return;
      }
    }

    const perfilSanitizado: PerfilUsuario = {
      ...perfil,
      nombre: perfil.nombre.trim(),
      avatar: perfil.avatar?.trim() ? perfil.avatar.trim() : null,
      mascotas: hayMascotaValida
        ? perfil.mascotas
            .filter((mascota) => mascota.nombre.trim() && mascota.raza.trim() && mascota.tamano.trim())
            .map((mascota) => ({
              ...mascota,
              nombre: mascota.nombre.trim(),
              raza: mascota.raza.trim(),
              tamano: mascota.tamano.trim(),
              foto: mascota.foto?.trim() ? mascota.foto.trim() : null,
            }))
        : [],
    };

    try {
      await guardarPerfilUsuario(perfilSanitizado);
      navigate('/perfil', { replace: true });
    } catch (errorDesconocido: unknown) {
      const mensaje = errorDesconocido instanceof Error ? errorDesconocido.message : 'Hubo un problema al guardar tu perfil.';
      setError(mensaje);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(26,155,142,0.16),_transparent_38%),linear-gradient(180deg,#f5fcfa_0%,#ffffff_40%,#fff8f2_100%)]">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-gray-200 transition hover:text-[#1a9b8e]"
          >
            <ArrowLeft size={16} />
            Cancelar
          </button>
        </div>

        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <section className="hidden lg:block">
            <div className="sticky top-24 rounded-[2rem] bg-gradient-to-br from-[#1a9b8e] via-[#228b84] to-[#7ab851] p-8 text-white shadow-[0_28px_90px_rgba(26,155,142,0.25)]">
              <img src={logo} alt="PetMate" className="h-20 w-auto" />

              <div className="mt-8 space-y-5">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-sm font-medium text-white/90">
                  <Sparkles size={16} />
                  Ya casi esta todo listo
                </span>

                <h1 className="text-4xl font-bold leading-tight">
                  Completa tu perfil y empieza a usar <span className="text-[#fff2d9]">PetMate</span>.
                </h1>

                <p className="text-base leading-relaxed text-white/85">
                  Anade tus datos y los de tus mascotas para tener una experiencia mas util desde el primer momento.
                </p>
              </div>
            </div>
          </section>

          <section>
            <div className="rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.10)] backdrop-blur xl:p-8">
              <div className="flex flex-col gap-3">
                <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#eef7f5] px-4 py-2 text-sm font-semibold text-[#1a9b8e]">
                  <UserRound size={16} />
                  Configuracion inicial
                </span>
                <h2 className="text-3xl font-bold text-gray-900">Vamos a preparar tu cuenta</h2>
                <p className="text-sm leading-relaxed text-gray-600">
                  Rellena lo esencial ahora y podras editarlo mas adelante desde tu perfil.
                </p>
              </div>

              <form onSubmit={manejarEnvio} className="mt-8 space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.24em] text-[#ff8c42]">
                    <UserRound size={16} />
                    Tu informacion
                  </div>

                  <div className="space-y-3">
                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-gray-700">Nombre visible</span>
                      <input
                        type="text"
                        value={perfil.nombre}
                        onChange={(event) => actualizarCampoPerfil('nombre', event.target.value)}
                        placeholder="Tu nombre"
                        className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-[#1a9b8e]"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-gray-700">Correo electronico</span>
                      <input
                        type="email"
                        value={perfil.email}
                        disabled
                        className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500 outline-none"
                      />
                    </label>

                    <div className="rounded-3xl border border-gray-100 bg-[#fcfefd] p-4">
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
                            placeholder="URL del avatar"
                            className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-[#1a9b8e]"
                          />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={manejarArchivoAvatar}
                            className="block w-full text-sm text-gray-600 file:mr-4 file:rounded-full file:border-0 file:bg-[#eef7f5] file:px-4 file:py-2 file:font-semibold file:text-[#1a9b8e] hover:file:bg-[#dff3ef]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.24em] text-[#1a9b8e]">
                        <PawPrint size={16} />
                        Tus mascotas
                      </div>
                      <p className="mt-2 text-sm text-gray-600">
                        Anade una o varias mascotas para dejar la cuenta preparada desde el inicio.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={anadirMascota}
                      className="inline-flex items-center gap-2 rounded-full bg-[#eef7f5] px-4 py-2 text-sm font-semibold text-[#1a9b8e] transition hover:bg-[#dff3ef]"
                    >
                      <Plus size={16} />
                      Anadir otra
                    </button>
                  </div>

                  <div className="space-y-4">
                    {perfil.mascotas.map((mascota, indice) => (
                      <article key={mascota.id} className="rounded-3xl border border-gray-100 bg-[#fcfefd] p-5">
                        <div className="flex items-center justify-between gap-4">
                          <h3 className="text-lg font-bold text-gray-900">Mascota {indice + 1}</h3>
                          <button
                            type="button"
                            onClick={() => eliminarMascota(mascota.id)}
                            className="text-sm font-semibold text-[#e25b5b] transition hover:text-[#c84747]"
                          >
                            Eliminar
                          </button>
                        </div>

                        <div className="mt-4 grid gap-3 md:grid-cols-2">
                          <input
                            type="text"
                            value={mascota.nombre}
                            onChange={(event) => actualizarCampoMascota(mascota.id, 'nombre', event.target.value)}
                            placeholder="Nombre"
                            className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-[#1a9b8e]"
                          />
                          <input
                            type="text"
                            value={mascota.raza}
                            onChange={(event) => actualizarCampoMascota(mascota.id, 'raza', event.target.value)}
                            placeholder="Raza"
                            className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-[#1a9b8e]"
                          />
                          <select
                            value={mascota.tamano}
                            onChange={(event) => actualizarCampoMascota(mascota.id, 'tamano', event.target.value)}
                            className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-[#1a9b8e]"
                          >
                            <option value="" disabled>
                              Tamano
                            </option>
                            {nivelesTamano.map((tamano) => (
                              <option key={tamano} value={tamano}>
                                {tamano}
                              </option>
                            ))}
                          </select>
                          <input
                            type="number"
                            value={mascota.peso ?? ''}
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

                          <div className="md:col-span-2">
                            <span className="mb-2 block text-sm font-medium text-gray-700">Sociabilidad</span>
                            <div className="grid gap-3 sm:grid-cols-2">
                              <button
                                type="button"
                                onClick={() => actualizarCampoMascota(mascota.id, 'esSociable', true)}
                                className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                                  mascota.esSociable
                                    ? 'bg-[#1a9b8e] text-white'
                                    : 'border border-gray-200 bg-white text-gray-800 hover:border-[#1a9b8e]'
                                }`}
                              >
                                Sociable: Si
                              </button>
                              <button
                                type="button"
                                onClick={() => actualizarCampoMascota(mascota.id, 'esSociable', false)}
                                className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                                  !mascota.esSociable
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
                            value={mascota.foto ?? ''}
                            onChange={(event) => actualizarCampoMascota(mascota.id, 'foto', event.target.value)}
                            placeholder="URL de foto (opcional)"
                            className="md:col-span-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-[#1a9b8e]"
                          />
                          <div className="md:col-span-2 rounded-3xl border border-gray-100 bg-white p-4">
                            <div className="flex items-center gap-4">
                              <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-3xl bg-[#eef7f5]">
                                {mascota.foto ? (
                                  <img src={mascota.foto} alt={mascota.nombre || 'Mascota'} className="h-full w-full object-cover" />
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
                        </div>
                      </article>
                    ))}
                  </div>
                </div>

                {error && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="submit"
                    className="flex-1 rounded-2xl bg-gradient-to-r from-[#1a9b8e] to-[#7ab851] px-5 py-3.5 text-sm font-semibold text-white transition hover:shadow-lg"
                  >
                    Guardar y continuar
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="flex-1 rounded-2xl border border-gray-200 bg-white px-5 py-3.5 text-sm font-semibold text-gray-700 transition hover:border-[#1a9b8e] hover:text-[#1a9b8e]"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
