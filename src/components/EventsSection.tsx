import React, { useState } from 'react';
import { Heart, MapPin, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { establecimientos } from '../data/establecimientos';
import { ImageWithFallback } from './ImageWithFallback';

const establecimientosDestacados = establecimientos.slice(0, 3);

export function EventsSection() {
  const [guardados, setGuardados] = useState<Set<string>>(new Set());

  const toggleGuardado = (idEstablecimiento: string) => {
    setGuardados((anteriores) => {
      const siguientes = new Set(anteriores);
      if (siguientes.has(idEstablecimiento)) {
        siguientes.delete(idEstablecimiento);
      } else {
        siguientes.add(idEstablecimiento);
      }
      return siguientes;
    });
  };

  return (
    <section id="eventos" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
            Establecimientos{' '}
            <span className="bg-gradient-to-r from-[#1a9b8e] to-[#7ab851] bg-clip-text text-transparent">
              Pet-Friendly
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-xl text-gray-600">
            Tres lugares destacados de nuestro mapa para empezar a descubrir Madrid con tu mascota.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {establecimientosDestacados.map((establecimiento) => (
            <article
              key={establecimiento.id}
              className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="relative h-64 overflow-hidden">
                <ImageWithFallback
                  src={establecimiento.imagen}
                  alt={establecimiento.nombre}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                />

                {establecimiento.destacado && (
                  <div className="absolute left-4 top-4 rounded-full bg-gradient-to-r from-[#ff8c42] to-[#ff6b6b] px-3 py-1 text-sm font-medium text-white">
                    Destacado
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => toggleGuardado(establecimiento.id)}
                  className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg transition-transform hover:scale-110"
                  aria-label="Guardar establecimiento"
                >
                  <Heart
                    size={20}
                    className={guardados.has(establecimiento.id) ? 'fill-[#ff8c42] text-[#ff8c42]' : 'text-gray-400'}
                  />
                </button>
              </div>

              <div className="p-6">
                <div className="mb-3 inline-block rounded-full bg-[#e8f8f5] px-3 py-1 text-sm font-medium text-[#1a9b8e]">
                  {establecimiento.categoria}
                </div>

                <h3 className="mb-3 text-xl font-bold text-gray-900">{establecimiento.nombre}</h3>

                <div className="mb-4 space-y-3">
                  <div className="flex items-start gap-2 text-gray-600">
                    <MapPin size={16} className="mt-0.5 shrink-0 text-[#ff8c42]" />
                    <span className="text-sm">
                      {establecimiento.direccion}, {establecimiento.barrio}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-gray-600">{establecimiento.descripcion}</p>
                  <div className="flex items-start gap-2 text-gray-600">
                    <ShieldCheck size={16} className="mt-0.5 shrink-0 text-[#7ab851]" />
                    <span className="text-sm">{establecimiento.reglaMascota}</span>
                  </div>
                </div>

                <Link
                  to="/establecimientos"
                  className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#1a9b8e] to-[#7ab851] py-3 font-medium text-white transition-all hover:shadow-lg"
                >
                  Ver establecimiento
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/establecimientos"
            className="inline-flex rounded-full border-2 border-gray-200 bg-white px-8 py-4 font-semibold text-gray-700 transition-all hover:border-[#1a9b8e] hover:shadow-lg"
          >
            Ver todos los establecimientos
          </Link>
        </div>
      </div>
    </section>
  );
}
