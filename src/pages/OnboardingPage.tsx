import React, { useEffect, useState } from 'react';
import { ArrowLeft, MapPin, PawPrint, Plus, Sparkles, UserRound } from 'lucide-react';
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
const nivelesTamano = ['Pequeño', 'Mediano', 'Grande', 'Muy grande'] as const;

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
          zonaHabitual: '',
          biografia: '',
          avatar: null,
          mascotas: [crearMascotaVacia()],
          favoritos: [],
          eventos: [],
          eventosGuardados: [],
        });
      }

      setCargando(false);
    };

    cargarDatos();
  }, [navigate]);

  if (cargando || !sesion || !perfil) {
    return null;
  }

  const actualizarCampoPerfil = (campo: 'nombre' | 'zonaHabitual' | 'biografia', valor: string) => {
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
        setError('Completa todos los campos obligatorios de cada mascota que quieras añadir.');
        return;
      }
    }

    const perfilSanitizado: PerfilUsuario = {
      ...perfil,
      nombre: perfil.nombre.trim(),
      zonaHabitual: perfil.zonaHabitual?.trim() ?? '',
      biografia: perfil.biografia?.trim() ?? '',
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
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-10">
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

        <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr]">
          <section className="hidden lg:block">
            <div className="sticky top-10 min-h-[680px] rounded-[2rem] bg-gradient-to-br from-[#1a9b8e] via-[#228b84] to-[#7ab851] p-10 text-white shadow-[0_28px_90px_rgba(26,155,142,0.25)]">
              <img src={logo} alt="PetMate" className="h-20 w-auto" />

              <div className="mt-20 space-y-6">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-sm font-medium text-white/90">
                  <Sparkles size={16} />
                  Ya casi está todo listo
                </span>

                <h1 className="text-4xl font-bold leading-tight">
                  Completa tu perfil y empieza a usar <span className="text-[#fff2d9]">PetMate</span>.
                </h1>

                <p className="text-base leading-relaxed text-white/85">
                  Añade tus datos y los de tus mascotas para tener una experiencia más útil desde el primer momento.
                </p>
              </div>

              <div className="mt-14 space-y-5">
                <div className="rounded-3xl bg-white/15 p-6 backdrop-blur">
                  <div className="text-sm font-bold uppercase tracking-[0.24em] text-white/70">Paso 1</div>
                  <p className="mt-3 text-sm leading-relaxed text-white/90">
                    Cuéntanos quién eres y en qué zona te mueves habitualmente.
                  </p>
                </div>
                <div className="rounded-3xl bg-white/15 p-6 backdrop-blur">
                  <div className="text-sm font-bold uppercase tracking-[0.24em] text-white/70">Paso 2</div>
                  <p className="mt-3 text-sm leading-relaxed text-white/90">
                    Añade una o varias mascotas para personalizar mejor tu espacio.
                  </p>
                </div>
                <div className="rounded-3xl bg-white/15 p-6 backdrop-blur">
                  <div className="text-sm font-bold uppercase tracking-[0.24em] text-white/70">Paso 3</div>
                  <p className="mt-3 text-sm leading-relaxed text-white/90">
                    Guarda tu información y entra con tu perfil listo para empezar.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <div className="rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.10)] backdrop-blur xl:p-10">
              <div className="flex flex-col gap-3">
                <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#eef7f5] px-4 py-2 text-sm font-semibold text-[#1a9b8e]">
                  <UserRound size={16} />
                  Configuración inicial
                </span>
                <h2 className="text-4xl font-bold text-gray-900">Vamos a preparar tu cuenta</h2>
                <p className="text-base leading-relaxed text-gray-600">
                  Rellena lo esencial ahora y podrás editarlo más adelante desde tu perfil.
                </p>
              </div>

              <form onSubmit={manejarEnvio} className="mt-8 space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.24em] text-[#ff8c42]">
                    <MapPin size={16} />
                    Tus datos
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="block md:col-span-2">
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
                      <span className="mb-2 block text-sm font-medium text-gray-700">Correo electrónico</span>
                      <input
                        type="email"
                        value={perfil.email}
                        disabled
                        className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500 outline-none"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-gray-700">Zona habitual</span>
                      <input
                        type="text"
                        value={perfil.zonaHabitual ?? ''}
                        onChange={(event) => actualizarCampoPerfil('zonaHabitual', event.target.value)}
                        placeholder="Chamberí"
                        className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-[#1a9b8e]"
                      />
                    </label>

                    <label className="block md:col-span-2">
                      <span className="mb-2 block text-sm font-medium text-gray-700">Biografía</span>
                      <textarea
                        value={perfil.biografia ?? ''}
                        onChange={(event) => actualizarCampoPerfil('biografia', event.target.value)}
                        placeholder="Cuéntanos algo sobre ti y tu mascota."
                        rows={5}
                        className="w-full resize-y rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-[#1a9b8e]"
                      />
                    </label>
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
                        Añade una o varias mascotas para dejar la cuenta preparada desde el inicio.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={anadirMascota}
                      className="inline-flex items-center gap-2 rounded-full bg-[#eef7f5] px-5 py-3 text-sm font-semibold text-[#1a9b8e] transition hover:bg-[#dff3ef]"
                    >
                      <Plus size={16} />
                      Añadir otra
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
                                Sociable: Sí
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
