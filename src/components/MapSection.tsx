import React, { useMemo, useState } from 'react';
import { Calendar, Info, MapPin } from 'lucide-react';
import { establecimientos, type CategoriaEstablecimiento } from '../data/establecimientos';
import { PetFriendlyMap } from './PetFriendlyMap';

const categorias: Array<'Todas' | CategoriaEstablecimiento> = ['Todas', 'Restaurantes', 'Ocio', 'Alojamientos'];

export function MapSection() {
  const [categoriaActiva, setCategoriaActiva] = useState<'Todas' | CategoriaEstablecimiento>('Todas');

  const establecimientosFiltrados = useMemo(() => {
    if (categoriaActiva === 'Todas') {
      return establecimientos;
    }

    return establecimientos.filter((establecimiento) => establecimiento.categoria === categoriaActiva);
  }, [categoriaActiva]);

  return (
    <section id="mapa" className="bg-gradient-to-br from-white via-[#e8f8f5]/30 to-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
            Explora con nuestro{' '}
            <span className="bg-gradient-to-r from-[#1a9b8e] to-[#7ab851] bg-clip-text text-transparent">
              Mapa Interactivo
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-xl text-gray-600">
            Encuentra establecimientos permanentes y planes de ocio donde tu mascota es bienvenida.
          </p>
        </div>

        <div className="grid items-start gap-12 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-3xl bg-gradient-to-br from-[#e8f8f5] to-[#f0f8e8] p-8 shadow-2xl">
            <PetFriendlyMap puntos={establecimientosFiltrados} altoClase="h-[26rem]" />

            <div className="mt-6 flex flex-wrap justify-center gap-4">
              {categorias.map((categoria) => {
                const color =
                  categoria === 'Restaurantes'
                    ? 'bg-[#1a9b8e]'
                    : categoria === 'Ocio'
                      ? 'bg-[#ff8c42]'
                      : categoria === 'Alojamientos'
                        ? 'bg-[#7ab851]'
                        : 'bg-[#14213d]';

                return (
                  <button
                    key={categoria}
                    type="button"
                    onClick={() => setCategoriaActiva(categoria)}
                    className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                      categoriaActiva === categoria ? 'bg-white text-gray-900 shadow-md' : 'text-gray-700 hover:text-[#1a9b8e]'
                    }`}
                  >
                    <span className={`h-4 w-4 rounded-full ${color}`} />
                    {categoria}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-gray-50 bg-white p-6 shadow-lg transition-all hover:shadow-xl">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#1a9b8e] to-[#7ab851]">
                  <MapPin size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-bold text-gray-900">Ubicaciones claras y útiles</h3>
                  <p className="leading-relaxed text-gray-600">
                    Visualiza restaurantes, alojamientos y planes fijos de Madrid en un mapa sencillo y directo.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-50 bg-white p-6 shadow-lg transition-all hover:shadow-xl">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#ff8c42] to-[#ff6b6b]">
                  <Calendar size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-bold text-gray-900">Planes con tu mascota</h3>
                  <p className="leading-relaxed text-gray-600">
                    Descubre actividades y espacios donde tu mascota puede acompañarte con total normalidad.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-50 bg-white p-6 shadow-lg transition-all hover:shadow-xl">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#7ab851] to-[#1a9b8e]">
                  <Info size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-bold text-gray-900">Información rápida</h3>
                  <p className="leading-relaxed text-gray-600">
                    Cada punto incluye su categoría, una breve descripción y la regla principal para ir con mascota.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full bg-[#e8f8f5] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#1a9b8e]">
                      Restaurantes
                    </span>
                    <span className="rounded-full bg-[#fff4eb] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#ff8c42]">
                      Ocio
                    </span>
                    <span className="rounded-full bg-[#f0f8e8] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#7ab851]">
                      Alojamientos
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
