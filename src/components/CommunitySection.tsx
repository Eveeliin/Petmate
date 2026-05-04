import React from 'react';
import { Calendar, Heart, MapPin, MessageCircle, UserPlus, Users } from 'lucide-react';
//PROXIMAS eventoS
const meetups = [
  {
    id: 1,
    title: 'Paseo Matutino Retiro',
    organizer: 'Maria G.',
    date: '15 Ene',
    time: '09:00',
    attendees: 8,
    maxAttendees: 12,
    location: 'Parque del Retiro',
    petTypes: ['🐕', '🐕‍🦺'],
  },
  {
    id: 2,
    title: 'Brunch Canino',
    organizer: 'Carlos R.',
    date: '16 Ene',
    time: '11:30',
    attendees: 5,
    maxAttendees: 8,
    location: 'Cafe Central',
    petTypes: ['🐕', '🐩'],
  },
  {
    id: 3,
    title: 'Tarde en el Parque',
    organizer: 'Ana M.',
    date: '17 Ene',
    time: '17:00',
    attendees: 12,
    maxAttendees: 15,
    location: 'Casa de Campo',
    petTypes: ['🐕', '🐕‍🦺', '🐩'],
  },
];

function EventsSubsection() {
  return (
    <div id="eventos" className="scroll-mt-20 rounded-3xl bg-gradient-to-br from-[#f8f9fa] to-white p-8 md:p-12">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h3 className="text-3xl text-gray-900">Proximos eventos</h3>
        <button className="rounded-xl bg-gradient-to-r from-[#ff8c42] to-[#ff6b6b] px-6 py-3 text-white transition-shadow hover:shadow-lg">
          Crear evento
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {meetups.map((meetup) => (
          <div
            key={meetup.id}
            className="rounded-2xl bg-white p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h4 className="mb-1 text-lg text-gray-900">{meetup.title}</h4>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-[#1a9b8e] to-[#7ab851] text-xs text-white">
                    {meetup.organizer.charAt(0)}
                  </div>
                  <span>{meetup.organizer}</span>
                </div>
              </div>
              <div className="flex gap-1">
                {meetup.petTypes.map((pet) => (
                  <span key={`${meetup.id}-${pet}`} className="text-lg">
                    {pet}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar size={16} className="text-[#ff8c42]" />
                <span>
                  {meetup.date} • {meetup.time}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin size={16} className="text-[#1a9b8e]" />
                <span>{meetup.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users size={16} className="text-[#7ab851]" />
                <span>
                  {meetup.attendees}/{meetup.maxAttendees} asistentes
                </span>
              </div>
            </div>

            <div className="mb-4">
              <div className="h-2 w-full rounded-full bg-gray-200">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-[#1a9b8e] to-[#7ab851]"
                  style={{ width: `${(meetup.attendees / meetup.maxAttendees) * 100}%` }}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1a9b8e] to-[#7ab851] py-2 text-white transition-shadow hover:shadow-lg">
                <UserPlus size={16} />
                Unirme
              </button>
              <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 transition-colors hover:bg-gray-200">
                <Heart size={18} className="text-gray-600" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="mb-4 text-gray-600">¿No encuentras una evento que te guste?</p>
        <button className="rounded-full border-2 border-gray-200 bg-white px-8 py-4 text-gray-700 transition-all hover:border-[#ff8c42] hover:shadow-lg">
          Ver Todos los Eventos
        </button>
      </div>
    </div>
  );
}

export function CommunitySection() {
  return (
    <section id="comunidad" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl text-gray-900 md:text-5xl">
            Unete a nuestra{' '}
            <span className="bg-gradient-to-r from-[#ff8c42] to-[#7ab851] bg-clip-text text-transparent">
              Comunidad
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-xl text-gray-600">
            Organiza eventos, paseos grupales y conecta con otros amantes de las mascotas en Madrid.
          </p>
        </div>

        <div className="mb-16 grid gap-8 md:grid-cols-3">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1a9b8e] to-[#7ab851]">
              <Users size={32} className="text-white" />
            </div>
            <h3 className="mb-2 text-xl text-gray-900">Socializa</h3>
            <p className="text-gray-600">Conoce a otros propietarios de mascotas y crea vinculos en tu barrio.</p>
          </div>

          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#ff8c42] to-[#ff6b6b]">
              <Calendar size={32} className="text-white" />
            </div>
            <h3 className="mb-2 text-xl text-gray-900">Organiza eventos</h3>
            <p className="text-gray-600">Crea tus propios eventos y paseos grupales personalizados.</p>
          </div>

          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7ab851] to-[#1a9b8e]">
              <MessageCircle size={32} className="text-white" />
            </div>
            <h3 className="mb-2 text-xl text-gray-900">Comparte Experiencias</h3>
            <p className="text-gray-600">Intercambia consejos y recomendaciones con la comunidad.</p>
          </div>
        </div>

        <EventsSubsection />
      </div>
    </section>
  );
}
