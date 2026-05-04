import React from 'react';
import { Calendar, Filter, MapPin, Smartphone, Star, Users } from 'lucide-react';
//CARACTERISTICAS PRINCIPALES Preguntas Frecuentes
const features = [
  {
    icon: Calendar,
    title: '¿Cómo puedo registrame en un evento',
    description: 'Inicia sesión o crea tu cuenta. Luego ve a la pestaña "Eventos" y haz clic en Unirme. Todos tus eventos quedarán registrados en tu perfil',
    color: 'from-[#1a9b8e] to-[#7ab851]',
    bgColor: 'bg-[#e8f8f5]',
  },
  {
    icon: MapPin,
    title: '¿Necesito cuenta para guardar lugares favoritos?',
    description: 'Sí. Para poder guardar y consultar tus lugares favoritos es necesario tener una cuenta en PetMate.',
    color: 'from-[#ff8c42] to-[#ff6b6b]',
    bgColor: 'bg-[#fff4eb]',
  },
  {
    icon: Filter,
    title: '¿Puedo filtrar lugares?',
    description: 'Por ahora puedes filtrar lugares por categorías. Estamos trabajando en otros tipos de filtro para mejorar vuestra experiencia.',
    color: 'from-[#7ab851] to-[#1a9b8e]',
    bgColor: 'bg-[#f0f8e8]',
  },
];

export function FeaturesSection() {
  return (
    <section id="beneficios" className="bg-gradient-to-br from-[#fafafa] to-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
            Preguntas{' '}
            <span className="bg-gradient-to-r from-[#1a9b8e] to-[#ff8c42] bg-clip-text text-transparent">Frecuentes</span>
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
      </div>
    </section>
  );
}
