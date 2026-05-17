import React, { useEffect, useMemo, useState } from 'react';
import { Calendar, MapPin, MessageCircle, UserPlus, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  obtenerSesion,
  obtenerTodosLosEventos,
  suscribirCambioAutenticacion,
  type EventoCompleto,
} from '../utils/auth';

function separarFechaHora(fechaHora: string) {
  const [fecha = 'Por definir', hora = 'Por definir'] = fechaHora.split(' - ');
  return { fecha, hora: hora.replace(' h', '') };
}

export function CommunitySection() {
  const [estaAutenticado, setEstaAutenticado] = useState(false);
  const [eventos, setEventos] = useState<EventoCompleto[]>([]);
  const [cargandoEventos, setCargandoEventos] = useState(false);

  const proximosEventos = useMemo(() => eventos.slice(0, 3), [eventos]);

  useEffect(() => {
    const sincronizar = async () => {
      const sesion = await obtenerSesion();
      setEstaAutenticado(Boolean(sesion));

      if (!sesion) {
        setEventos([]);
        return;
      }

      setCargandoEventos(true);
      try {
        const eventosActuales = await obtenerTodosLosEventos(sesion.user.id);
        setEventos(eventosActuales);
      } catch (error) {
        console.error('[PetMate] Error cargando próximos eventos:', error);
        setEventos([]);
      } finally {
        setCargandoEventos(false);
      }
    };

    sincronizar();
    return suscribirCambioAutenticacion(() => {
      sincronizar();
    });
  }, []);

  return (
    <section id="comunidad" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl text-gray-900 md:text-5xl">
            Únete a nuestra{' '}
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
            <p className="text-gray-600">Conoce a otros propietarios de mascotas y crea vínculos en tu barrio.</p>
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
            <h3 className="mb-2 text-xl text-gray-900">Comparte experiencias</h3>
            <p className="text-gray-600">Intercambia consejos y recomendaciones con la comunidad.</p>
          </div>
        </div>

        {estaAutenticado && (
          <div className="rounded-3xl bg-gradient-to-br from-[#f8f9fa] to-white p-8 md:p-12">
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <h3 className="text-3xl text-gray-900">Próximos eventos</h3>
              <Link
                to="/perfil#tus-eventos"
                className="rounded-xl bg-gradient-to-r from-[#ff8c42] to-[#ff6b6b] px-6 py-3 text-white transition-shadow hover:shadow-lg"
              >
                Crear evento
              </Link>
            </div>

            {cargandoEventos ? (
              <p className="text-center text-gray-500">Cargando eventos...</p>
            ) : proximosEventos.length === 0 ? (
              <p className="rounded-2xl bg-white px-5 py-4 text-center text-gray-500 shadow-sm">
                Aún no hay eventos creados por la comunidad.
              </p>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {proximosEventos.map((evento) => {
                  const { fecha, hora } = separarFechaHora(evento.fechaHora);

                  return (
                    <article
                      key={evento.id}
                      className="rounded-2xl bg-white p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                    >
                      <div className="mb-4">
                        <h4 className="mb-2 text-lg font-bold text-gray-900">{evento.nombre}</h4>
                        <p className="text-sm text-gray-600">
                          Organiza {evento.creadorNombre || 'la comunidad'}
                        </p>
                      </div>

                      <div className="mb-5 space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar size={16} className="text-[#ff8c42]" />
                          <span>
                            {fecha} · {hora}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin size={16} className="text-[#1a9b8e]" />
                          <span>{evento.direccion}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Users size={16} className="text-[#7ab851]" />
                          <span>{evento.asistentes} asistentes</span>
                        </div>
                      </div>

                      <Link
                        to="/eventos"
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1a9b8e] to-[#7ab851] py-2 text-white transition-shadow hover:shadow-lg"
                      >
                        <UserPlus size={16} />
                        Ver evento
                      </Link>
                    </article>
                  );
                })}
              </div>
            )}

            <div className="mt-12 text-center">
              <p className="mb-4 text-gray-600">¿No encuentras un evento que te guste?</p>
              <Link
                to="/eventos"
                className="inline-flex rounded-full border-2 border-gray-200 bg-white px-8 py-4 text-gray-700 transition-all hover:border-[#ff8c42] hover:shadow-lg"
              >
                Ver todos los eventos
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
