import React from 'react';
import { ArrowRight, Calendar, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const logo = '/logo_def_pm.png';

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#e8f8f5] via-white to-[#fff4eb]">
      <div className="absolute left-10 top-20 h-32 w-32 rounded-full bg-[#1a9b8e]/10 blur-3xl" />
      <div className="absolute bottom-20 right-10 h-48 w-48 rounded-full bg-[#ff8c42]/10 blur-3xl" />
      <div className="absolute right-1/4 top-1/2 h-40 w-40 rounded-full bg-[#7ab851]/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="text-center lg:text-left">
            <div className="mb-6 inline-block rounded-full border border-[#1a9b8e]/20 bg-white px-4 py-2 shadow-sm">
              <div className="flex items-center gap-2 text-sm">
                <MapPin size={16} className="text-[#ff8c42]" />
                <span className="font-medium text-gray-700">Madrid, España</span>
              </div>
            </div>

            <h1 className="mb-6 text-5xl font-bold leading-tight text-gray-900 md:text-6xl lg:text-7xl">
              <span className="block">Explora el</span>
              <span className="block bg-gradient-to-r from-[#1a9b8e] to-[#7ab851] bg-clip-text text-transparent">
                Madrid mas
              </span>
              <span className="block bg-gradient-to-r from-[#ff8c42] to-[#ff6b6b] bg-clip-text text-transparent">
                Pet-Friendly
              </span>
            </h1>

            <p className="mx-auto mb-8 max-w-xl text-xl leading-relaxed text-gray-600 lg:mx-0">
              La mejor plataforma para encontrar establecimientos, alojamientos y eventos pet-friendly en Madrid. Mapa
              interactivo, filtros especializados y comunidad activa.
            </p>

            <div className="flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
              <a
                href="#mapa"
                className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#1a9b8e] to-[#7ab851] px-8 py-4 font-bold text-white transition-all hover:scale-105 hover:shadow-xl"
              >
                Explorar Mapa
                <ArrowRight size={20} />
              </a>
              <Link
                to="/login?mode=register"
                className="rounded-full border-2 border-gray-200 bg-white px-8 py-4 font-bold text-gray-700 transition-all hover:border-[#ff8c42] hover:text-[#ff8c42] hover:shadow-lg"
              >
                Crear Quedada
              </Link>
            </div>

            <div className="mx-auto mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-gray-100 pt-8 lg:mx-0">
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-[#1a9b8e]">150+</div>
                <div className="text-sm font-medium text-gray-600">Eventos</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-[#ff8c42]">2,500+</div>
                <div className="text-sm font-medium text-gray-600">Mascotas</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-[#7ab851]">1,200+</div>
                <div className="text-sm font-medium text-gray-600">Usuarios</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative mx-auto w-full max-w-lg">
              <div className="relative z-10 animate-float">
                <img
                  src={logo}
                  alt="PetMate"
                  className="h-auto w-full rounded-full border-8 border-white bg-white p-6 drop-shadow-2xl"
                />
              </div>

              <div className="animate-float-delay-1 absolute -left-8 -top-8 rounded-2xl border border-gray-50 bg-white p-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#1a9b8e] to-[#7ab851] text-xl text-white">
                    🐕
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-gray-500">Proximo</div>
                    <div className="text-sm font-semibold text-gray-900">Parque del Retiro</div>
                  </div>
                </div>
              </div>

              <div className="animate-float-delay-2 absolute -bottom-4 -right-8 rounded-2xl border border-gray-50 bg-white p-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#ff8c42] to-[#ff6b6b] text-white">
                    <Calendar size={24} />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-gray-500">Este fin de semana</div>
                    <div className="text-sm font-semibold text-gray-900">12 eventos</div>
                  </div>
                </div>
              </div>

              <div className="absolute -right-12 top-1/4 text-4xl text-[#1a9b8e]/20 animate-bounce">🐾</div>
              <div
                className="absolute -left-12 bottom-1/3 text-3xl text-[#ff8c42]/20 animate-bounce"
                style={{ animationDelay: '0.5s' }}
              >
                🐾
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-float-delay-1 {
          animation: float 3s ease-in-out infinite;
          animation-delay: 0.5s;
        }

        .animate-float-delay-2 {
          animation: float 3s ease-in-out infinite;
          animation-delay: 1s;
        }
      `}</style>
    </section>
  );
}
