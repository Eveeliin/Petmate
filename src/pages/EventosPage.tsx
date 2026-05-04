import React, { useEffect, useMemo, useState } from 'react';
import { Calendar, Heart, MapPin, UserPlus, Users } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { eventosComunidad } from '../data/eventosComunidad';
import { guardarPerfilUsuario, obtenerPerfilUsuario, obtenerSesion, type EventoCreado } from '../utils/auth';

type EventoListado = {
  id: string;
  title: string;
  organizer: string;
  date: string;
  time: string;
  attendees: number;
  maxAttendees: number;
  location: string;
  petTypes: string[];
  description: string;
  esComunitario: boolean;
};

function convertirEventoCreado(evento: EventoCreado): EventoListado {
  const [fecha = 'Por definir', hora = 'Por definir'] = evento.fechaHora.split(' - ');

  return {
    id: evento.id,
    title: evento.nombre || 'Evento sin nombre',
    organizer: 'Usuario PetMate',
    date: fecha,
    time: hora,
    attendees: 1,
    maxAttendees: evento.maxAttendees ?? 10,
    location: evento.direccion || 'Dirección pendiente',
    petTypes: ['🐾'],
    description: 'Evento creado por un usuario desde su perfil personal.',
    esComunitario: false,
  };
}

export function PaginaEventos() {
  const navigate = useNavigate();
  const [eventosUsuario, setEventosUsuario] = useState<EventoListado[]>([]);
  const [eventosGuardados, setEventosGuardados] = useState<Set<string>>(new Set());
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    const cargarEventosUsuario = async () => {
      const perfil = await obtenerPerfilUsuario();
      if (!perfil) {
        setEventosUsuario([]);
        return;
      }

      setEventosUsuario(perfil.eventos.map(convertirEventoCreado));
      setEventosGuardados(new Set((perfil.eventosGuardados ?? []).map((evento) => evento.id)));
    };

    cargarEventosUsuario();
  }, []);

  const unirseEvento = async (evento: EventoListado) => {
    const sesion = await obtenerSesion();
    if (!sesion) {
      navigate('/login');
      return;
    }

    const perfil = await obtenerPerfilUsuario();
    if (!perfil) {
      navigate('/onboarding');
      return;
    }

    const eventoGuardado = {
      id: evento.id,
      nombre: evento.title,
      fechaHora: `${evento.date} - ${evento.time}`,
      direccion: evento.location,
      maxAttendees: evento.maxAttendees,
      organizer: evento.organizer,
      petTypes: evento.petTypes,
      description: evento.description,
    };

    const eventosActuales = perfil.eventosGuardados ?? [];
    const yaGuardado = eventosActuales.some((eventoActual) => eventoActual.id === evento.id);

    if (!yaGuardado) {
      await guardarPerfilUsuario({
        ...perfil,
        eventosGuardados: [...eventosActuales, eventoGuardado],
      });
    }

    setEventosGuardados((eventosPrevios) => new Set(eventosPrevios).add(evento.id));
    setMensaje(`Te has unido a "${evento.title}". Aparece en Mi perfil > Mis eventos > Eventos guardados.`);
    window.setTimeout(() => setMensaje(''), 3500);
  };

  const eventosListado = useMemo<EventoListado[]>(
    () => [
      ...eventosUsuario,
      ...eventosComunidad.map((evento) => ({
        id: String(evento.id),
        title: evento.title,
        organizer: evento.organizer,
        date: evento.date,
        time: evento.time,
        attendees: evento.attendees,
        maxAttendees: evento.maxAttendees,
        location: evento.location,
        petTypes: evento.petTypes,
        description: evento.description,
        esComunitario: true,
      })),
    ],
    [eventosUsuario],
  );

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f6fcfb_0%,#ffffff_35%,#fffaf4_100%)]">
      <Header />
      <main className="pt-20">
        <section className="border-b border-gray-100 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <p className="mb-4 text-sm font-semibold uppercase tracking-[0.28em] text-[#ff8c42]">
                  Eventos de la comunidad
                </p>
                <h1 className="text-4xl font-bold text-gray-900 md:text-6xl">
                  Explora los <span className="text-[#7ab851]">eventos</span> creados por la comunidad
                </h1>
                <p className="mt-6 text-lg leading-relaxed text-gray-600">
                  Consulta próximos encuentros, paseos y planes en grupo para disfrutar Madrid con tu mascota.
                </p>
              </div>

              <Link
                to="/perfil#tus-eventos"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#1a9b8e] to-[#7ab851] px-8 py-4 font-semibold text-white transition hover:shadow-lg"
              >
                Crear evento
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          {mensaje && (
            <p className="mb-6 rounded-2xl bg-emerald-50 px-5 py-3 text-sm font-medium text-emerald-700">
              {mensaje}
            </p>
          )}

          <div className="space-y-6">
            {eventosListado.map((evento) => (
              <article
                key={evento.id}
                className="rounded-[2rem] border border-gray-100 bg-white p-8 shadow-lg transition hover:shadow-xl"
              >
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                  <div className="max-w-3xl">
                    <div className="mb-4 flex flex-wrap items-center gap-3">
                      <span className="rounded-full bg-[#eef7f5] px-3 py-1 text-sm font-semibold text-[#1a9b8e]">
                        {evento.esComunitario ? 'Evento comunitario' : 'Evento creado por usuario'}
                      </span>
                      <span className="rounded-full bg-[#fffaf4] px-3 py-1 text-sm font-medium text-gray-600">
                        Organiza {evento.organizer}
                      </span>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900">{evento.title}</h2>
                    <p className="mt-4 text-base leading-relaxed text-gray-600">{evento.description}</p>

                    <div className="mt-6 grid gap-3 text-sm text-gray-600 sm:grid-cols-3">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-[#ff8c42]" />
                        <span>
                          {evento.date} • {evento.time}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-[#1a9b8e]" />
                        <span>{evento.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users size={16} className="text-[#7ab851]" />
                        <span>
                          {evento.attendees}/{evento.maxAttendees} asistentes
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="w-full max-w-sm rounded-3xl bg-[#fcfefd] p-5">
                    <div className="mb-4 flex gap-1 text-lg">
                      {evento.petTypes.map((pet) => (
                        <span key={`${evento.id}-${pet}`}>{pet}</span>
                      ))}
                    </div>

                    <div className="mb-4 h-2 w-full rounded-full bg-gray-200">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-[#1a9b8e] to-[#7ab851]"
                        style={{ width: `${Math.min((evento.attendees / evento.maxAttendees) * 100, 100)}%` }}
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => unirseEvento(evento)}
                        className={`flex flex-1 items-center justify-center gap-2 rounded-2xl px-4 py-3 font-medium text-white transition hover:shadow-lg ${
                          eventosGuardados.has(evento.id)
                            ? 'bg-gray-500'
                            : 'bg-gradient-to-r from-[#1a9b8e] to-[#7ab851]'
                        }`}
                      >
                        <UserPlus size={16} />
                        {eventosGuardados.has(evento.id) ? 'Ya unido' : 'Unirme'}
                      </button>
                      <button className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 transition hover:bg-gray-200">
                        <Heart size={18} className="text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
