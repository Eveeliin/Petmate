import React, { useMemo, useState } from 'react';
import { ArrowLeft, MapPin, PawPrint, Plus, Sparkles, UserRound } from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';
import {
  crearPerfilOnboarding,
  guardarPerfilUsuario,
  obtenerSesion,
  type PerfilMascota,
  type PerfilUsuario,
} from '../utils/auth';

const logo = '/logo_def_pm.png';
const nivelesEnergia = ['Baja', 'Media', 'Alta'] as const;
const nivelesTamano = ['Pequeño', 'Mediano', 'Grande', 'Muy grande'] as const;

function crearMascotaVacia(): PerfilMascota {
  return {
    id: `pet-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: '',
    type: '',
    breed: '',
    age: '',
    size: '',
    energy: '',
    description: '',
  };
}

export function PaginaOnboarding() {
  const navigate = useNavigate();
  const sesion = useMemo(() => obtenerSesion(), []);
  const [perfil, setPerfil] = useState<PerfilUsuario | null>(() =>
    sesion ? crearPerfilOnboarding(sesion.email) : null,
  );
  const [error, setError] = useState('');

  if (!sesion) {
    return <Navigate to="/login" replace />;
  }

  if (!perfil) {
    return null;
  }

  const actualizarCampoPerfil = (campo: 'fullName' | 'district' | 'bio', valor: string) => {
    setPerfil((perfilActual) => (perfilActual ? { ...perfilActual, [campo]: valor } : perfilActual));
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

  const anadirMascota = () => {
    setPerfil((perfilActual) =>
      perfilActual
        ? {
            ...perfilActual,
            pets: [...perfilActual.pets, crearMascotaVacia()],
          }
        : perfilActual,
    );
  };

  const eliminarMascota = (idMascota: string) => {
    setPerfil((perfilActual) => {
      if (!perfilActual) {
        return perfilActual;
      }

      if (perfilActual.pets.length === 1) {
        return {
          ...perfilActual,
          pets: [crearMascotaVacia()],
        };
      }

      return {
        ...perfilActual,
        pets: perfilActual.pets.filter((mascota) => mascota.id !== idMascota),
      };
    });
  };

  const cancelar = () => {
    navigate(-1);
  };

  const manejarEnvio = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    const hayMascotaValida = perfil.pets.some(
      (mascota) =>
        mascota.name.trim() ||
        mascota.type.trim() ||
        mascota.breed.trim() ||
        mascota.age.trim() ||
        mascota.size.trim() ||
        mascota.energy.trim(),
    );

    if (!perfil.fullName.trim()) {
      setError('Indica tu nombre para completar el registro.');
      return;
    }

    if (!perfil.district.trim()) {
      setError('Indica tu zona habitual para completar el registro.');
      return;
    }

    if (hayMascotaValida) {
      const mascotaIncompleta = perfil.pets.find(
        (mascota) =>
          !mascota.name.trim() ||
          !mascota.type.trim() ||
          !mascota.breed.trim() ||
          !mascota.age.trim() ||
          !mascota.size.trim() ||
          !mascota.energy.trim(),
      );

      if (mascotaIncompleta) {
        setError('Completa todos los campos obligatorios de cada mascota que quieras añadir.');
        return;
      }
    }

    const perfilSanitizado = {
      ...perfil,
      fullName: perfil.fullName.trim(),
      district: perfil.district.trim(),
      bio: perfil.bio.trim(),
      pets: hayMascotaValida ? perfil.pets : [],
    };

    guardarPerfilUsuario(perfilSanitizado);
    navigate('/perfil');
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(26,155,142,0.16),_transparent_38%),linear-gradient(180deg,#f5fcfa_0%,#ffffff_40%,#fff8f2_100%)]">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center">
          <button
            type="button"
            onClick={cancelar}
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
                  Ya casi está todo listo
                </span>

                <h1 className="text-4xl font-bold leading-tight">
                  Completa tu perfil y empieza a usar <span className="text-[#fff2d9]">PetMate</span>.
                </h1>

                <p className="text-base leading-relaxed text-white/85">
                  Añade tus datos y los de tus mascotas para tener una experiencia más útil desde el primer momento.
                </p>
              </div>

              <div className="mt-10 space-y-4">
                <div className="rounded-3xl bg-white/10 p-5 backdrop-blur">
                  <div className="text-sm font-semibold uppercase tracking-[0.24em] text-white/70">Paso 1</div>
                  <p className="mt-2 text-sm text-white/90">Cuéntanos quién eres y en qué zona te mueves habitualmente.</p>
                </div>
                <div className="rounded-3xl bg-white/10 p-5 backdrop-blur">
                  <div className="text-sm font-semibold uppercase tracking-[0.24em] text-white/70">Paso 2</div>
                  <p className="mt-2 text-sm text-white/90">Añade una o varias mascotas para personalizar mejor tu espacio.</p>
                </div>
                <div className="rounded-3xl bg-white/10 p-5 backdrop-blur">
                  <div className="text-sm font-semibold uppercase tracking-[0.24em] text-white/70">Paso 3</div>
                  <p className="mt-2 text-sm text-white/90">Guarda tu información y entra con tu perfil listo para empezar.</p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <div className="rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.10)] backdrop-blur xl:p-8">
              <div className="flex flex-col gap-3">
                <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#eef7f5] px-4 py-2 text-sm font-semibold text-[#1a9b8e]">
                  <UserRound size={16} />
                  Configuración inicial
                </span>
                <h2 className="text-3xl font-bold text-gray-900">Vamos a preparar tu cuenta</h2>
                <p className="text-sm leading-relaxed text-gray-600">
                  Rellena lo esencial ahora y podrás editarlo todo más adelante desde tu perfil.
                </p>
              </div>

              <form onSubmit={manejarEnvio} className="mt-8 space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.24em] text-[#ff8c42]">
                    <MapPin size={16} />
                    Tus datos
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block sm:col-span-2">
                      <span className="mb-2 block text-sm font-medium text-gray-700">Nombre visible</span>
                      <input
                        type="text"
                        value={perfil.fullName}
                        onChange={(event) => actualizarCampoPerfil('fullName', event.target.value)}
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
                        value={perfil.district}
                        onChange={(event) => actualizarCampoPerfil('district', event.target.value)}
                        placeholder="Ej. Madrid Centro"
                        className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-[#1a9b8e]"
                      />
                    </label>

                    <label className="block sm:col-span-2">
                      <span className="mb-2 block text-sm font-medium text-gray-700">Biografía</span>
                      <textarea
                        value={perfil.bio}
                        onChange={(event) => actualizarCampoPerfil('bio', event.target.value)}
                        rows={4}
                        placeholder="Cuéntanos algo sobre ti y tu mascota."
                        className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-[#1a9b8e]"
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
                        Añade una o varias mascotas para dejar tu cuenta preparada desde el inicio.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={anadirMascota}
                      className="inline-flex items-center gap-2 rounded-full bg-[#eef7f5] px-4 py-2 text-sm font-semibold text-[#1a9b8e] transition hover:bg-[#dff3ef]"
                    >
                      <Plus size={16} />
                      Añadir otra
                    </button>
                  </div>

                  <div className="space-y-4">
                    {perfil.pets.map((mascota, indice) => (
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
                            value={mascota.name}
                            onChange={(event) => actualizarCampoMascota(mascota.id, 'name', event.target.value)}
                            placeholder="Nombre"
                            className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-[#1a9b8e]"
                          />
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
                            onChange={(event) => actualizarCampoMascota(mascota.id, 'description', event.target.value)}
                            placeholder="Descripción (opcional)"
                            rows={3}
                            className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-[#1a9b8e] md:col-span-2"
                          />
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
                    onClick={cancelar}
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
