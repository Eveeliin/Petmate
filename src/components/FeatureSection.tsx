import React from 'react';
import { Calendar, Filter, MapPin, Smartphone, Star, Users } from 'lucide-react';

const features = [
  {
    icon: MapPin,
    title: 'Mapa Interactivo',
    description: 'Visualiza en tiempo real todos los lugares pet-friendly cerca de ti con nuestro mapa interactivo.',
    color: 'from-[#1a9b8e] to-[#7ab851]',
    bgColor: 'bg-[#e8f8f5]',
  },
  {
    icon: Filter,
    title: 'Filtros Especializados',
    description: 'Filtra por tamaño de mascota, acceso a interiores, tipo de animal y mucho más.',
    color: 'from-[#ff8c42] to-[#ff6b6b]',
    bgColor: 'bg-[#fff4eb]',
  },
  {
    icon: Users,
    title: 'Comunidad Activa',
    description: 'Únete a quedadas, organiza paseos grupales y conecta con otros amantes de las mascotas.',
    color: 'from-[#7ab851] to-[#1a9b8e]',
    bgColor: 'bg-[#f0f8e8]',
  },
  {
    icon: Calendar,
    title: 'Eventos y Establecimientos',
    description: 'Descubre tanto lugares permanentes como eventos temporales donde tu mascota es bienvenida.',
    color: 'from-[#1a9b8e] to-[#ff8c42]',
    bgColor: 'bg-[#e8f8f5]',
  },
  {
    icon: Star,
    title: 'Reseñas Verificadas',
    description: 'Lee opiniones reales de otros usuarios y ayuda a la comunidad compartiendo tu experiencia.',
    color: 'from-[#ff8c42] to-[#7ab851]',
    bgColor: 'bg-[#fff4eb]',
  },
  {
    icon: Smartphone,
    title: 'Fácil de Usar',
    description: 'Interfaz intuitiva diseñada para que encuentres lo que buscas en segundos.',
    color: 'from-[#7ab851] to-[#ff8c42]',
    bgColor: 'bg-[#f0f8e8]',
  },
];

export function FeaturesSection() {
  return (
    <section id="beneficios" className="bg-gradient-to-br from-[#fafafa] to-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
            ¿Por qué elegir{' '}
            <span className="bg-gradient-to-r from-[#1a9b8e] to-[#ff8c42] bg-clip-text text-transparent">PetMate</span>?
          </h2>
          <p className="mx-auto max-w-2xl text-xl text-gray-600">
            La plataforma más completa para disfrutar de Madrid con tu mascota.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group rounded-2xl border border-gray-50 bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl ${feature.bgColor} transition-transform group-hover:scale-110`}>
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${feature.color}`}>
                    <Icon size={20} className="text-white" />
                  </div>
                </div>

                <h3 className="mb-3 text-xl font-bold text-gray-900">{feature.title}</h3>
                <p className="leading-relaxed text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </div>

        <div className="relative mt-20 overflow-hidden rounded-3xl bg-gradient-to-r from-[#1a9b8e] to-[#7ab851] p-12 text-center text-white">
          <div className="absolute right-0 top-0 h-64 w-64 translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10" />
          <div className="absolute bottom-0 left-0 h-48 w-48 -translate-x-1/2 translate-y-1/2 rounded-full bg-white/10" />

          <div className="relative z-10">
            <h3 className="mb-4 text-3xl font-bold md:text-4xl">¿Organizas eventos pet-friendly?</h3>
            <p className="mx-auto mb-8 max-w-2xl text-xl opacity-90">
              Publica tus eventos gratis y llega a miles de amantes de las mascotas en Madrid.
            </p>
            <button className="rounded-full bg-white px-8 py-4 font-bold text-[#1a9b8e] shadow-md transition-all hover:scale-105 hover:shadow-2xl">
              Publicar Evento Gratis
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
