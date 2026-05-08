import React, { useEffect, useState } from 'react';
import { Calendar, MapPin, UserPlus, Users } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import {
  obtenerTodosLosEventos,
  obtenerSesion,
  toggleEventoGuardado,
  type EventoCompleto,
} from '../utils/auth';

const EMOJIS_ADMISION: Record<string, string> = {
  Perros: '🐕',
  Gatos: '🐈',
  'Cualquier Mascota': '🐾',
  Guías: '🦮',
};

function emojisAdmision(admision: string): string[] {
  if (!admision.trim()) return ['🐾'];
  const emojis = admision
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((v) => EMOJIS_ADMISION[v] ?? '🐾');
  return emojis.length > 0 ? emojis : ['🐾'];
}

export function PaginaEventos() {
  const navigate = useNavigate();
  const [eventos, setEventos] = useState<EventoCompleto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [haySesion, setHaySesion] = useState(false);
  const [procesando, setProcesando] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    const cargar = async () => {
      const sesion = await obtenerSesion();
      setHaySesion(Boolean(sesion));

      try {
        const todos = await obtenerTodosLosEventos(sesion?.user.id ?? null);
        setEventos(todos);
      } finally {
        setCargando(false);
      }
    };

    cargar();
  }, []);

  const unirseEvento = async (evento: EventoCompleto) => {
    const sesion = await obtenerSesion();
    if (!sesion) {
      navigate('/login');
      return;
    }

    setProcesando(evento.id);
    try {
      const { estaUnido, asistentes } = await toggleEventoGuardado(evento.id, evento.estaUnido);

      setEventos((prev) =>
        prev.map((e) => (e.id === evento.id ? { ...e, estaUnido, asistentes } : e)),
      );

      if (estaUnido) {
        setMensaje(`Te has unido a "${evento.nombre}". Aparece en Mi perfil > Eventos guardados.`);
      } else {
        setMensaje(`Has salido de "${evento.nombre}".`);
      }
      window.setTimeout(() => setMensaje(''), 3500);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error desconocido';
      console.error('[Petmate] toggleEventoGuardado falló:', msg);
      setMensaje(`Error: ${msg}`);
      window.setTimeout(() => setMensaje(''), 5000);
    } finally {
      setProcesando(null);
    }
  };

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

          {cargando ? (
            <p className="text-center text-gray-500">Cargando eventos...</p>
          ) : eventos.length === 0 ? (
            <p className="text-center text-gray-500">No hay eventos disponibles aún.</p>
          ) : (
            <div className="space-y-6">
              {eventos.map((evento) => {
                const [fecha = 'Por definir', hora = 'Por definir'] = evento.fechaHora.split(' - ');

                return (
                  <article
                    key={evento.id}
                    className="rounded-[2rem] border border-gray-100 bg-white p-8 shadow-lg transition hover:shadow-xl"
                  >
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                      <div className="max-w-3xl">
                        <div className="mb-4 flex flex-wrap items-center gap-3">
                          <span className="rounded-full bg-[#eef7f5] px-3 py-1 text-sm font-semibold text-[#1a9b8e]">
                            Evento comunitario
                          </span>
                          <span className="rounded-full bg-[#fffaf4] px-3 py-1 text-sm font-medium text-gray-600">
                            Organiza {evento.creadorNombre}
                          </span>
                        </div>

                        <h2 className="text-2xl font-bold text-gray-900">{evento.nombre}</h2>

                        <div className="mt-6 grid gap-3 text-sm text-gray-600 sm:grid-cols-3">
                          <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-[#ff8c42]" />
                            <span>
                              {fecha} • {hora}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin size={16} className="text-[#1a9b8e]" />
                            <span>{evento.direccion}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users size={16} className="text-[#7ab851]" />
                            <span>{evento.asistentes} asistentes</span>
                          </div>
                        </div>
                      </div>

                      <div className="w-full max-w-sm rounded-3xl bg-[#fcfefd] p-5">
                        <div className="mb-4 flex gap-2 text-2xl">
                          {emojisAdmision(evento.admision).map((emoji, i) => (
                            <span key={i}>{emoji}</span>
                          ))}
                        </div>

                        <div className="flex gap-3">
                          {haySesion ? (
                            <button
                              type="button"
                              onClick={() => unirseEvento(evento)}
                              disabled={procesando === evento.id}
                              className={`group flex flex-1 items-center justify-center gap-2 rounded-2xl px-4 py-3 font-medium text-white transition hover:shadow-lg disabled:opacity-60 ${
                                evento.estaUnido
                                  ? 'bg-gray-400 hover:bg-red-400'
                                  : 'bg-gradient-to-r from-[#1a9b8e] to-[#7ab851]'
                              }`}
                            >
                              <UserPlus size={16} />
                              {procesando === evento.id ? (
                                'Procesando...'
                              ) : evento.estaUnido ? (
                                <>
                                  <span className="group-hover:hidden">Ya unido</span>
                                  <span className="hidden group-hover:inline">Salir del evento</span>
                                </>
                              ) : (
                                'Unirme'
                              )}
                            </button>
                          ) : (
                            <p className="w-full text-center text-sm text-gray-500">
                              <Link to="/login" className="text-[#1a9b8e] underline">
                                Inicia sesión
                              </Link>{' '}
                              para unirte a este evento.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
