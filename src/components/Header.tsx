import React, { useEffect, useState } from 'react';
import { LogIn, Menu, UserRound, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { limpiarSesion, obtenerSesion, suscribirCambioAutenticacion } from '../utils/auth';

const logo = '/logo_def_pm.png';

export function Header() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [estaAutenticado, setEstaAutenticado] = useState(Boolean(obtenerSesion()));
  const navigate = useNavigate();

  useEffect(() => {
    const sincronizarAutenticacion = () => setEstaAutenticado(Boolean(obtenerSesion()));
    sincronizarAutenticacion();
    const cancelarSuscripcion = suscribirCambioAutenticacion(sincronizarAutenticacion);
    return cancelarSuscripcion;
  }, []);

  const cerrarSesion = () => {
    limpiarSesion();
    setMenuAbierto(false);
    navigate('/');
  };

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="shrink-0">
            <Link to="/" className="block transition-transform hover:scale-105 active:scale-95" title="Ir al inicio">
              <img src={logo} alt="PetMate" className="h-16 w-auto" />
            </Link>
          </div>

          <nav className="hidden items-center space-x-8 md:flex">
            <a href="#mapa" className="font-medium text-gray-700 transition-colors hover:text-[#1a9b8e]">
              Mapa
            </a>
            <a href="#eventos" className="font-medium text-gray-700 transition-colors hover:text-[#1a9b8e]">
              Eventos
            </a>
            <a href="#comunidad" className="font-medium text-gray-700 transition-colors hover:text-[#1a9b8e]">
              Comunidad
            </a>
            <a href="#beneficios" className="font-medium text-gray-700 transition-colors hover:text-[#1a9b8e]">
              Caracteristicas
            </a>
            {estaAutenticado ? (
              <>
                <Link
                  to="/perfil"
                  className="flex items-center gap-2 rounded-full border-2 border-gray-200 px-6 py-2 font-medium text-gray-700 transition-all hover:border-[#1a9b8e] hover:text-[#1a9b8e]"
                >
                  <UserRound size={18} />
                  Mi Perfil
                </Link>
                <button
                  type="button"
                  onClick={cerrarSesion}
                  className="rounded-full bg-gradient-to-r from-[#1a9b8e] to-[#7ab851] px-6 py-2 font-medium text-white transition-all hover:shadow-lg"
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center gap-2 rounded-full border-2 border-gray-200 px-6 py-2 font-medium text-gray-700 transition-all hover:border-[#1a9b8e] hover:text-[#1a9b8e]"
                >
                  <LogIn size={18} />
                  Iniciar sesión
                </Link>
                <Link
                  to="/login?mode=register"
                  className="rounded-full bg-gradient-to-r from-[#1a9b8e] to-[#7ab851] px-6 py-2 font-medium text-white transition-all hover:shadow-lg"
                >
                  Registrarse
                </Link>
              </>
            )}
          </nav>

          <button
            className="p-2 text-gray-600 transition-colors hover:text-[#1a9b8e] md:hidden"
            onClick={() => setMenuAbierto((valorActual) => !valorActual)}
            aria-label="Abrir menu"
          >
            {menuAbierto ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {menuAbierto && (
          <nav className="animate-in slide-in-from-top-4 duration-300 border-t border-gray-100 py-4 fade-in md:hidden">
            <div className="flex flex-col space-y-4">
              <a
                href="#mapa"
                className="px-2 py-1 text-gray-700 transition-colors hover:text-[#1a9b8e]"
                onClick={() => setMenuAbierto(false)}
              >
                Mapa
              </a>
              <a
                href="#eventos"
                className="px-2 py-1 text-gray-700 transition-colors hover:text-[#1a9b8e]"
                onClick={() => setMenuAbierto(false)}
              >
                Eventos
              </a>
              <a
                href="#comunidad"
                className="px-2 py-1 text-gray-700 transition-colors hover:text-[#1a9b8e]"
                onClick={() => setMenuAbierto(false)}
              >
                Comunidad
              </a>
              <a
                href="#beneficios"
                className="px-2 py-1 text-gray-700 transition-colors hover:text-[#1a9b8e]"
                onClick={() => setMenuAbierto(false)}
              >
                Caracteristicas
              </a>
              <div className="flex flex-col gap-3 pt-2">
                {estaAutenticado ? (
                  <>
                    <Link
                      to="/perfil"
                      onClick={() => setMenuAbierto(false)}
                      className="flex items-center justify-center gap-2 rounded-full border-2 border-gray-200 px-6 py-3 text-gray-700 hover:border-[#1a9b8e]"
                    >
                      <UserRound size={18} />
                      Mi Perfil
                    </Link>
                    <button
                      type="button"
                      onClick={cerrarSesion}
                      className="rounded-full bg-gradient-to-r from-[#1a9b8e] to-[#7ab851] px-6 py-3 text-center text-white shadow-md"
                    >
                      Cerrar sesión
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setMenuAbierto(false)}
                      className="flex items-center justify-center gap-2 rounded-full border-2 border-gray-200 px-6 py-3 text-gray-700 hover:border-[#1a9b8e]"
                    >
                      <LogIn size={18} />
                      Iniciar sesión
                    </Link>
                    <Link
                      to="/login?mode=register"
                      onClick={() => setMenuAbierto(false)}
                      className="rounded-full bg-gradient-to-r from-[#1a9b8e] to-[#7ab851] px-6 py-3 text-center text-white shadow-md"
                    >
                      Registrarse
                    </Link>
                  </>
                )}
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
