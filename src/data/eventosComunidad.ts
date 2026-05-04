export type EventoComunidad = {
  id: number;
  title: string;
  organizer: string;
  date: string;
  time: string;
  attendees: number;
  maxAttendees: number;
  location: string;
  petTypes: string[];
  description: string;
};

export const eventosComunidad: EventoComunidad[] = [
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
    description: 'Paseo tranquilo para empezar la mañana, socializar y disfrutar de una ruta cómoda con mascotas.',
  },
  {
    id: 2,
    title: 'Brunch Canino',
    organizer: 'Carlos R.',
    date: '16 Ene',
    time: '11:30',
    attendees: 5,
    maxAttendees: 8,
    location: 'Café Central',
    petTypes: ['🐕', '🐩'],
    description: 'Encuentro relajado para compartir mesa, charlar y descubrir un local pet-friendly en grupo.',
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
    description: 'Plan abierto para pasear, jugar y dejar que las mascotas socialicen en un entorno amplio.',
  },
];
