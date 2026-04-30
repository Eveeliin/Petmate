import React from 'react';
import { useState } from 'react';
import { Calendar, Clock, Heart, MapPin, Users } from 'lucide-react';
import { ImageWithFallback } from './ImageWithFallback';
//PROXIMOS EVENTOS
const events = [
  {
    id: 1,
    title: 'Paseo Canino en el Retiro',
    date: '15 Enero 2026',
    time: '10:00 AM',
    location: 'Parque del Retiro',
    attendees: 45,
    image:
      'https://images.unsplash.com/photo-1596693485933-42d810ff8318?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGRvZyUyMHBhcmt8ZW58MXx8fHwxNzY4MjE1MTE5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Paseo',
    featured: true,
  },
  {
    id: 2,
    title: 'Cafe & Mascotas',
    date: '16 Enero 2026',
    time: '5:00 PM',
    location: 'Cafe Central',
    attendees: 20,
    image:
      'https://images.unsplash.com/photo-1712746438761-f8604b6d867b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXQlMjBmcmllbmRseSUyMGNhZmV8ZW58MXx8fHwxNzY4MjM2NjkzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Social',
    featured: false,
  },
  {
    id: 3,
    title: 'Festival Pet-Friendly',
    date: '18 Enero 2026',
    time: '11:00 AM',
    location: 'Casa de Campo',
    attendees: 120,
    image:
      'https://images.unsplash.com/photo-1767840067868-64d805eb85d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2clMjBmZXN0aXZhbCUyMGV2ZW50fGVufDF8fHx8MTc2ODIzNjY5M3ww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Festival',
    featured: true,
  },
];

export function EventsSection() {
  const [likedEvents, setLikedEvents] = useState<Set<number>>(new Set());

  const toggleLike = (eventId: number) => {
    setLikedEvents((previous) => {
      const next = new Set(previous);
      if (next.has(eventId)) {
        next.delete(eventId);
      } else {
        next.add(eventId);
      }
      return next;
    });
  };

  return (
    <section id="eventos" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
            Proximos{' '}
            <span className="bg-gradient-to-r from-[#1a9b8e] to-[#7ab851] bg-clip-text text-transparent">
              Eventos
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-xl text-gray-600">
            Descubre las mejores actividades pet-friendly en Madrid.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <div
              key={event.id}
              className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="relative h-64 overflow-hidden">
                <ImageWithFallback
                  src={event.image}
                  alt={event.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                />

                {event.featured && (
                  <div className="absolute left-4 top-4 rounded-full bg-gradient-to-r from-[#ff8c42] to-[#ff6b6b] px-3 py-1 text-sm font-medium text-white">
                    Destacado
                  </div>
                )}

                <button
                  onClick={() => toggleLike(event.id)}
                  className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg transition-transform hover:scale-110"
                  aria-label="Añadir a favoritos"
                >
                  <Heart
                    size={20}
                    className={likedEvents.has(event.id) ? 'fill-[#ff8c42] text-[#ff8c42]' : 'text-gray-400'}
                  />
                </button>
              </div>

              <div className="p-6">
                <div className="mb-3 inline-block rounded-full bg-[#e8f8f5] px-3 py-1 text-sm font-medium text-[#1a9b8e]">
                  {event.category}
                </div>

                <h3 className="mb-3 text-xl font-bold text-gray-900">{event.title}</h3>

                <div className="mb-4 space-y-2">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar size={16} className="text-[#1a9b8e]" />
                    <span className="text-sm">{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock size={16} className="text-[#1a9b8e]" />
                    <span className="text-sm">{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin size={16} className="text-[#ff8c42]" />
                    <span className="text-sm">{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users size={16} className="text-[#7ab851]" />
                    <span className="text-sm">{event.attendees} asistentes</span>
                  </div>
                </div>

                <button className="w-full rounded-xl bg-gradient-to-r from-[#1a9b8e] to-[#7ab851] py-3 font-medium text-white transition-all hover:shadow-lg">
                  Ver Detalles
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button className="rounded-full border-2 border-gray-200 bg-white px-8 py-4 font-semibold text-gray-700 transition-all hover:border-[#1a9b8e] hover:shadow-lg">
            Ver Todos los Eventos
          </button>
        </div>
      </div>
    </section>
  );
}
