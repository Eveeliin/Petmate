import React from 'react';
import { Calendar, Coffee, Filter, Home, MapPin, Search, Star } from 'lucide-react';

export function MapSection() {
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
            Encuentra establecimientos permanentes y eventos temporales donde tu mascota es bienvenida.
          </p>
        </div>

        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="relative">
            <div className="rounded-3xl bg-gradient-to-br from-[#e8f8f5] to-[#f0f8e8] p-8 shadow-2xl">
              <div className="mb-6 flex items-center gap-3 rounded-2xl bg-white p-4 shadow-lg">
                <Search size={20} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar lugares o eventos..."
                  className="flex-1 text-gray-700 outline-none"
                  disabled
                />
                <button className="rounded-xl bg-gradient-to-r from-[#1a9b8e] to-[#7ab851] p-2 text-white transition-shadow hover:shadow-md">
                  <Filter size={20} />
                </button>
              </div>

              <div className="relative h-96 overflow-hidden rounded-2xl border border-gray-200 bg-gray-100">
                <div className="absolute inset-0 opacity-10">
                  <div className="grid h-full grid-cols-8 grid-rows-8">
                    {Array.from({ length: 64 }).map((_, index) => (
                      <div key={index} className="border border-gray-400" />
                    ))}
                  </div>
                </div>

                <div className="absolute left-1/3 top-1/4 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-[#1a9b8e] shadow-lg animate-bounce">
                  <Coffee size={20} className="text-white" />
                </div>
                <div
                  className="absolute right-1/4 top-1/2 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-[#ff8c42] shadow-lg animate-bounce"
                  style={{ animationDelay: '0.3s' }}
                >
                  <Calendar size={20} className="text-white" />
                </div>
                <div
                  className="absolute bottom-1/4 left-1/2 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-[#7ab851] shadow-lg animate-bounce"
                  style={{ animationDelay: '0.6s' }}
                >
                  <Home size={20} className="text-white" />
                </div>
                <div
                  className="absolute right-1/3 top-1/3 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-[#1a9b8e] shadow-lg animate-bounce"
                  style={{ animationDelay: '0.9s' }}
                >
                  <MapPin size={20} className="text-white" />
                </div>

                <div className="animate-in slide-in-from-bottom-2 absolute bottom-4 left-4 right-4 rounded-xl border border-gray-100 bg-white p-4 shadow-xl fade-in">
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#1a9b8e] to-[#7ab851]">
                      <Coffee size={24} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="mb-1 text-sm font-bold text-gray-900">El Perro y La Galleta</h4>
                      <div className="mb-2 flex items-center gap-2">
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, index) => (
                            <Star key={index} size={12} className="fill-[#ff8c42] text-[#ff8c42]" />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">(127 reseñas)</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="rounded-full bg-[#e8f8f5] px-2 py-1 text-xs font-medium text-[#1a9b8e]">
                          Cafeteria
                        </span>
                        <span className="rounded-full bg-[#fff4eb] px-2 py-1 text-xs font-medium text-[#ff8c42]">
                          Terraza
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap justify-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full bg-[#1a9b8e]" />
                  <span className="text-sm font-medium text-gray-600">Restaurantes</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full bg-[#ff8c42]" />
                  <span className="text-sm font-medium text-gray-600">Eventos</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full bg-[#7ab851]" />
                  <span className="text-sm font-medium text-gray-600">Alojamientos</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-gray-50 bg-white p-6 shadow-lg transition-all hover:shadow-xl">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#1a9b8e] to-[#7ab851]">
                  <MapPin size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-bold text-gray-900">Localizacion en Tiempo Real</h3>
                  <p className="leading-relaxed text-gray-600">
                    Visualiza restaurantes, cafeterías y alojamientos pet-friendly en toda la Comunidad de Madrid.
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
                  <h3 className="mb-2 text-xl font-bold text-gray-900">Eventos Temporales</h3>
                  <p className="leading-relaxed text-gray-600">
                    Descubre mercadillos, actividades culturales y eventos especiales donde tu mascota puede acompañarte.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-50 bg-white p-6 shadow-lg transition-all hover:shadow-xl">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#7ab851] to-[#1a9b8e]">
                  <Filter size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-bold text-gray-900">Filtros Especializados</h3>
                  <p className="leading-relaxed text-gray-600">
                    Filtra por tamaño de mascota, acceso a interiores, terrazas disponibles y mucho más.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full bg-[#e8f8f5] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#1a9b8e]">
                      Tamaño
                    </span>
                    <span className="rounded-full bg-[#fff4eb] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#ff8c42]">
                      Interiores
                    </span>
                    <span className="rounded-full bg-[#f0f8e8] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#7ab851]">
                      Terrazas
                    </span>
                    <span className="rounded-full bg-[#e8f8f5] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#1a9b8e]">
                      Tipo de animal
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
