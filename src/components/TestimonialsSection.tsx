import React from 'react';
import { Quote, Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Maria Garcia',
    pet: 'con Max (Golden Retriever)',
    rating: 5,
    text: 'PetMate ha cambiado completamente la forma en que disfruto de Madrid con mi perro. Cada fin de semana descubrimos lugares nuevos.',
    avatar: '🐕',
  },
  {
    id: 2,
    name: 'Carlos Rodriguez',
    pet: 'con Luna (Border Collie)',
    rating: 5,
    text: 'La comunidad es increible. Hemos hecho muchos amigos, tanto humanos como peludos. Totalmente recomendado.',
    avatar: '🐶',
  },
  {
    id: 3,
    name: 'Ana Martinez',
    pet: 'con Simba (Gato)',
    rating: 5,
    text: 'No solo hay eventos para perros. Tambien encontre cafeterias pet-friendly perfectas para ir con mi gato.',
    avatar: '🐱',
  },
];

export function TestimonialsSection() {
  return (
    <section id="testimonios" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
            Lo que dicen nuestros{' '}
            <span className="bg-gradient-to-r from-[#1a9b8e] to-[#ff8c42] bg-clip-text text-transparent">usuarios</span>
          </h2>
          <p className="mx-auto max-w-2xl text-xl text-gray-600">
            Miles de mascotas felices y sus dueños ya confían en PetMate.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="relative rounded-2xl border border-gray-100 bg-gradient-to-br from-white to-[#f8f9fa] p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="absolute right-6 top-6 text-[#1a9b8e]/10">
                <Quote size={48} />
              </div>

              <div className="mb-4 flex gap-1">
                {Array.from({ length: testimonial.rating }).map((_, index) => (
                  <Star key={index} size={20} className="fill-[#ff8c42] text-[#ff8c42]" />
                ))}
              </div>

              <p className="relative z-10 mb-6 leading-relaxed text-gray-700">"{testimonial.text}"</p>

              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#1a9b8e] to-[#7ab851] text-2xl shadow-inner">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-bold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.pet}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="text-center">
            <div className="mb-2 bg-gradient-to-r from-[#1a9b8e] to-[#7ab851] bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
              150+
            </div>
            <div className="font-medium text-gray-600">Eventos Mensuales</div>
          </div>
          <div className="text-center">
            <div className="mb-2 bg-gradient-to-r from-[#ff8c42] to-[#ff6b6b] bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
              2.5K+
            </div>
            <div className="font-medium text-gray-600">Mascotas Activas</div>
          </div>
          <div className="text-center">
            <div className="mb-2 bg-gradient-to-r from-[#7ab851] to-[#1a9b8e] bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
              98%
            </div>
            <div className="font-medium text-gray-600">Satisfaccion</div>
          </div>
          <div className="text-center">
            <div className="mb-2 bg-gradient-to-r from-[#1a9b8e] to-[#ff8c42] bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
              50+
            </div>
            <div className="font-medium text-gray-600">Lugares Verificados</div>
          </div>
        </div>
      </div>
    </section>
  );
}
