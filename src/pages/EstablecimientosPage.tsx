import React, { useEffect, useMemo, useState } from 'react';
import { Heart, MapPin, Search, ShieldCheck } from 'lucide-react';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { PetFriendlyMap } from '../components/PetFriendlyMap';
import {
  guardarPerfilUsuario,
  obtenerPerfilUsuario,
  obtenerSesion,
  type LugarFavorito,
  type PerfilUsuario,
} from '../utils/auth';
import { establecimientos, type CategoriaEstablecimiento } from '../data/establecimientos';

const categorias: Array<'Todas' | CategoriaEstablecimiento> = ['Todas', 'Restaurantes', 'Ocio', 'Alojamientos'];
const coloresCategoria: Record<'Todas' | CategoriaEstablecimiento, string> = {
  Todas: '#14213d',
  Restaurantes: '#1a9b8e',
  Ocio: '#ff8c42',
  Alojamientos: '#7ab851',
};

export function PaginaEstablecimientos() {
  const [categoriaActiva, setCategoriaActiva] = useState<'Todas' | CategoriaEstablecimiento>('Todas');
  const [busqueda, setBusqueda] = useState('');
  const [perfil, setPerfil] = useState<PerfilUsuario | null>(null);
  const [haySesion, setHaySesion] = useState(false);
  const [guardandoFavorito, setGuardandoFavorito] = useState<string | null>(null);
  const [mensajeBusqueda, setMensajeBusqueda] = useState('');

  useEffect(() => {
    const cargarEstado = async () => {
      const sesion = await obtenerSesion();
      setHaySesion(Boolean(sesion));

      if (!sesion) {
        setPerfil(null);
        return;
      }

      const perfilActual = await obtenerPerfilUsuario();
      setPerfil(perfilActual);
    };

    cargarEstado();
  }, []);

  const favoritosGuardados = useMemo(() => new Set(perfil?.favoritos.map((favorito) => favorito.id) ?? []), [perfil]);

  const establecimientosFiltrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();

    return establecimientos.filter((establecimiento) => {
      const coincideCategoria = categoriaActiva === 'Todas' || establecimiento.categoria === categoriaActiva;
      const coincideBusqueda =
        !texto ||
        establecimiento.nombre.toLowerCase().includes(texto) ||
        establecimiento.barrio.toLowerCase().includes(texto) ||
        establecimiento.direccion.toLowerCase().includes(texto);

      return coincideCategoria && coincideBusqueda;
    });
  }, [busqueda, categoriaActiva]);

  useEffect(() => {
    if (!busqueda.trim()) {
      setMensajeBusqueda('');
      return;
    }

    if (establecimientosFiltrados.length === 0) {
        setMensajeBusqueda('¡Lo sentimos! No se encuentra el establecimiento.');
      return;
    }

    setMensajeBusqueda('');
  }, [busqueda, establecimientosFiltrados]);

  const toggleFavorito = async (establecimientoId: string) => {
    if (!perfil) {
      return;
    }

    const establecimiento = establecimientos.find((item) => item.id === establecimientoId);
    if (!establecimiento) {
      return;
    }

    setGuardandoFavorito(establecimientoId);

    try {
      const yaGuardado = perfil.favoritos.some((favorito) => favorito.id === establecimientoId);

      const siguienteFavoritos: LugarFavorito[] = yaGuardado
        ? perfil.favoritos.filter((favorito) => favorito.id !== establecimientoId)
        : [
            ...perfil.favoritos,
            {
              id: establecimiento.id,
              nombre: establecimiento.nombre,
              direccion: establecimiento.direccion,
              admitePerrosGrandes: establecimiento.admitePerrosGrandes,
              accesoInterior: establecimiento.accesoInterior,
            },
          ];

      const perfilActualizado = {
        ...perfil,
        favoritos: siguienteFavoritos,
      };

      await guardarPerfilUsuario(perfilActualizado);
      setPerfil(perfilActualizado);
    } finally {
      setGuardandoFavorito(null);
    }
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f6fcfb_0%,#ffffff_35%,#fffaf4_100%)]">
      <Header />
      <main className="pt-20">
        <section className="border-b border-gray-100 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="max-w-4xl">
              <h1 className="text-4xl font-bold text-gray-900 md:text-6xl">
                Establecimientos pet-friendly en <span className="text-[#ff8c42]">Madrid</span>
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-gray-600">
                Aquí reunimos los lugares destacados de nuestra guía: restaurantes, alojamientos y planes fijos donde tu
                mascota también puede acompañarte.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="relative w-full max-w-xl">
              <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={busqueda}
                onChange={(event) => setBusqueda(event.target.value)}
                placeholder="Buscar por nombre, barrio o dirección"
                className="w-full rounded-full border border-gray-200 bg-white px-12 py-4 text-sm text-gray-800 outline-none transition focus:border-[#1a9b8e]"
              />
            </div>
          </div>

          {mensajeBusqueda && (
            <div className="mb-8 rounded-3xl border border-[#ffe1d3] bg-[#fff5ef] px-6 py-5 text-center text-[#c96e3e]">
              {mensajeBusqueda}
            </div>
          )}

          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-lg lg:sticky lg:top-28 lg:h-fit">
              <h2 className="text-3xl font-bold text-gray-900">Mapa de ubicaciones</h2>
              <p className="mt-3 text-lg text-gray-600">
                Visualiza todos los puntos y relaciona cada ubicación con las fichas de la derecha.
              </p>

              <div className="mt-6">
                <PetFriendlyMap puntos={establecimientosFiltrados} altoClase="h-[35rem]" />
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                {categorias.map((categoria) => (
                  <button
                    key={categoria}
                    type="button"
                    onClick={() => setCategoriaActiva(categoria)}
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                      categoriaActiva === categoria
                        ? 'bg-[#14213d] text-white shadow-md'
                        : 'bg-[#f2f7f6] text-gray-700 hover:bg-white hover:text-[#1a9b8e] hover:shadow-sm'
                    }`}
                    aria-pressed={categoriaActiva === categoria}
                  >
                    <span
                      className="h-3.5 w-3.5 rounded-full ring-2 ring-white/70"
                      style={{ backgroundColor: coloresCategoria[categoria] }}
                    />
                    {categoria}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              {establecimientosFiltrados.map((establecimiento) => {
                const estaGuardado = favoritosGuardados.has(establecimiento.id);

                return (
                  <article
                    key={establecimiento.id}
                    className="overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-lg"
                  >
                    <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
                      <div className="relative min-h-[18rem]">
                        {establecimiento.destacado && (
                          <span className="absolute left-5 top-5 z-10 rounded-full bg-gradient-to-r from-[#ff8c42] to-[#ff6b6b] px-4 py-2 text-sm font-semibold text-white">
                            Destacado
                          </span>
                        )}
                        <img
                          src={establecimiento.imagen}
                          alt={establecimiento.nombre}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div className="flex flex-col justify-between p-7">
                        <div>
                          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                            <div className="flex flex-wrap gap-3">
                              <span className="rounded-full bg-[#eef7f5] px-3 py-1 text-sm font-semibold text-[#1a9b8e]">
                                {establecimiento.categoria}
                              </span>
                              <span className="rounded-full bg-[#fffaf4] px-3 py-1 text-sm font-medium text-gray-600">
                                {establecimiento.barrio}
                              </span>
                            </div>

                            <button
                              type="button"
                              disabled={!haySesion || guardandoFavorito === establecimiento.id}
                              onClick={() => toggleFavorito(establecimiento.id)}
                              className={`flex h-12 w-12 items-center justify-center rounded-full transition ${
                                estaGuardado ? 'bg-[#fff1f1]' : 'bg-gray-100 hover:bg-gray-200'
                              } ${!haySesion ? 'cursor-not-allowed opacity-60' : ''}`}
                              aria-label="Guardar lugar"
                              title={haySesion ? 'Guardar lugar' : 'Inicia sesión para guardar lugares'}
                            >
                              <Heart
                                size={20}
                                className={estaGuardado ? 'fill-[#ff6b6b] text-[#ff6b6b]' : 'text-gray-600'}
                              />
                            </button>
                          </div>

                          <h3 className="text-3xl font-bold text-gray-900">{establecimiento.nombre}</h3>
                          <p className="mt-2 text-sm text-gray-500">{establecimiento.direccion}</p>

                          <div className="mt-6 space-y-5">
                            <div className="flex gap-3">
                              <MapPin size={18} className="mt-0.5 shrink-0 text-[#ff8c42]" />
                              <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#ff8c42]">
                                  Descripción
                                </p>
                                <p className="mt-2 text-base leading-relaxed text-gray-600">{establecimiento.descripcion}</p>
                              </div>
                            </div>

                            <div className="flex gap-3">
                              <ShieldCheck size={18} className="mt-0.5 shrink-0 text-[#1a9b8e]" />
                              <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1a9b8e]">
                                  Regla para mascotas
                                </p>
                                <p className="mt-2 text-base leading-relaxed text-gray-600">{establecimiento.reglaMascota}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {!haySesion && (
                          <p className="mt-6 text-sm text-gray-500">Inicia sesión para guardar este lugar en tu perfil.</p>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
