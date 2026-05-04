import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Eye, EyeOff, Lock, Mail, PawPrint, UserRound } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { esPerfilIncompleto, iniciarSesion, obtenerPerfilUsuario, registrarCuenta } from '../utils/auth';

const logo = '/logo_def_pm.png';

function establecerMensajeValidacionEnEspanol(event: React.InvalidEvent<HTMLInputElement>) {
  const input = event.currentTarget;

  if (input.validity.valueMissing) {
    input.setCustomValidity('Por favor, completa este campo.');
  } else if (input.validity.typeMismatch && input.type === 'email') {
    input.setCustomValidity('Introduce un correo electrónico válido.');
  } else if (input.validity.tooShort) {
    input.setCustomValidity(`Introduce al menos ${input.minLength} caracteres.`);
  } else {
    input.setCustomValidity('Revisa este campo.');
  }
}

function limpiarMensajeValidacion(event: React.FormEvent<HTMLInputElement>) {
  event.currentTarget.setCustomValidity('');
}

export function PaginaAcceso() {
  const [parametrosBusqueda, setParametrosBusqueda] = useSearchParams();
  const navigate = useNavigate();

  const modoInicial = useMemo(() => {
    return parametrosBusqueda.get('mode') === 'register' ? 'register' : 'login';
  }, [parametrosBusqueda]);

  const [modo, setModo] = useState<'login' | 'register'>(modoInicial);
  const [correo, setCorreo] = useState('');
  const [nombre, setNombre] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmacionContrasena, setConfirmacionContrasena] = useState('');
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [mostrarConfirmacionContrasena, setMostrarConfirmacionContrasena] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [estaEnviando, setEstaEnviando] = useState(false);

  useEffect(() => {
    setModo(modoInicial);
  }, [modoInicial]);

  const actualizarModo = (siguienteModo: 'login' | 'register') => {
    setModo(siguienteModo);
    setError('');
    setExito('');
    setParametrosBusqueda(siguienteModo === 'register' ? { mode: 'register' } : {});
  };

  const manejarEnvio = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setExito('');
    setEstaEnviando(true);

    const correoLimpio = correo.trim();
    const nombreLimpio = nombre.trim();

    if (modo === 'register' && !nombreLimpio) {
      setError('El nombre es obligatorio.');
      setEstaEnviando(false);
      return;
    }

    if (modo === 'register' && contrasena !== confirmacionContrasena) {
      setError('Las contraseñas no coinciden.');
      setEstaEnviando(false);
      return;
    }

    try {
      if (modo === 'register') {
        await registrarCuenta({
          nombre: nombreLimpio,
          email: correoLimpio,
          contrasena,
        });
        setExito('Cuenta creada correctamente. Vamos a completar tu perfil...');
        await new Promise((resolve) => setTimeout(resolve, 800));
        navigate('/onboarding');
      } else {
        await iniciarSesion({
          email: correoLimpio,
          contrasena,
        });

        const perfil = await obtenerPerfilUsuario();
        setExito('Inicio de sesión completado correctamente. Redirigiendo...');
        await new Promise((resolve) => setTimeout(resolve, 800));

        if (esPerfilIncompleto(perfil)) {
          navigate('/onboarding');
        } else {
          navigate('/perfil');
        }
      }
    } catch (errorDesconocido: unknown) {
      const mensaje = errorDesconocido instanceof Error ? errorDesconocido.message : 'Ha ocurrido un error.';
      setError(mensaje);
    } finally {
      setEstaEnviando(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(26,155,142,0.16),_transparent_35%),linear-gradient(135deg,#f4fbf9_0%,#fff7f0_55%,#ffffff_100%)]">
      <div className="absolute left-[-5rem] top-16 h-48 w-48 rounded-full bg-[#1a9b8e]/10 blur-3xl" />
      <div className="absolute bottom-12 right-[-4rem] h-64 w-64 rounded-full bg-[#ff8c42]/10 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-gray-200 transition hover:text-[#1a9b8e]"
          >
            <ArrowLeft size={16} />
            Volver al inicio
          </Link>
        </div>

        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="hidden lg:block">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#1a9b8e]/15 bg-white/80 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm">
                <PawPrint size={16} className="text-[#1a9b8e]" />
                Tu comunidad pet-friendly en Madrid
              </span>

              <h1 className="mt-6 text-5xl font-bold leading-tight text-gray-900">
                Accede a <span className="text-[#1a9b8e]">PetMate</span> y organiza planes con tu mascota.
              </h1>

              <p className="mt-5 text-lg leading-relaxed text-gray-600">
                Guarda tus favoritos, sigue tus eventos y prepara nuevos planes desde una experiencia clara, rápida y
                pensada para acompañarte en cada paso.
              </p>
            </div>
          </section>

          <section className="mx-auto w-full max-w-md">
            <div className="rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.10)] backdrop-blur xl:p-8">
              <div className="flex flex-col items-center text-center">
                <Link to="/" className="transition-transform hover:scale-105">
                  <img src={logo} alt="PetMate" className="h-24 w-auto object-contain" />
                </Link>
                <h2 className="mt-4 text-3xl font-bold text-gray-900">Bienvenido a PetMate</h2>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  Inicia sesión o crea tu cuenta para guardar favoritos, organizar eventos y seguir tus planes.
                </p>
              </div>

              <div className="mt-8 flex rounded-full bg-[#eef7f5] p-1">
                <button
                  type="button"
                  onClick={() => actualizarModo('login')}
                  className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${
                    modo === 'login' ? 'bg-[#1a9b8e] text-white shadow-sm' : 'text-gray-600 hover:text-[#1a9b8e]'
                  }`}
                >
                  Iniciar sesión
                </button>
                <button
                  type="button"
                  onClick={() => actualizarModo('register')}
                  className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${
                    modo === 'register' ? 'bg-[#ff8c42] text-white shadow-sm' : 'text-gray-600 hover:text-[#ff8c42]'
                  }`}
                >
                  Registrarse
                </button>
              </div>

              <form onSubmit={manejarEnvio} className="mt-6 space-y-4">
                {modo === 'register' && (
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-gray-700">Nombre</span>
                    <div className="flex items-center rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
                      <UserRound size={18} className="mr-3 text-gray-400" />
                      <input
                        type="text"
                        value={nombre}
                        onChange={(event) => setNombre(event.target.value)}
                        placeholder="Tu nombre"
                        className="w-full border-none bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
                        required
                      />
                    </div>
                  </label>
                )}

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-gray-700">Correo electrónico</span>
                  <div className="flex items-center rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm focus-within:border-[#1a9b8e] focus-within:ring-2 focus-within:ring-[#1a9b8e]/15">
                    <Mail size={18} className="mr-3 text-gray-400" />
                    <input
                      type="email"
                      value={correo}
                      onChange={(event) => setCorreo(event.target.value)}
                      onInput={limpiarMensajeValidacion}
                      onInvalid={establecerMensajeValidacionEnEspanol}
                      placeholder="tu@email.com"
                      className="w-full border-none bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
                      required
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-gray-700">Contraseña</span>
                  <div className="flex items-center rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm focus-within:border-[#1a9b8e] focus-within:ring-2 focus-within:ring-[#1a9b8e]/15">
                    <Lock size={18} className="mr-3 text-gray-400" />
                    <input
                      type={mostrarContrasena ? 'text' : 'password'}
                      value={contrasena}
                      onChange={(event) => setContrasena(event.target.value)}
                      onInput={limpiarMensajeValidacion}
                      onInvalid={establecerMensajeValidacionEnEspanol}
                      placeholder="Mínimo 6 caracteres"
                      className="w-full border-none bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
                      minLength={6}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setMostrarContrasena((valorActual) => !valorActual)}
                      className="ml-3 text-gray-400 transition hover:text-[#1a9b8e]"
                      aria-label={mostrarContrasena ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    >
                      {mostrarContrasena ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </label>

                {modo === 'register' && (
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-gray-700">Confirmar contraseña</span>
                    <div className="flex items-center rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm focus-within:border-[#ff8c42] focus-within:ring-2 focus-within:ring-[#ff8c42]/15">
                      <Lock size={18} className="mr-3 text-gray-400" />
                      <input
                        type={mostrarConfirmacionContrasena ? 'text' : 'password'}
                        value={confirmacionContrasena}
                        onChange={(event) => setConfirmacionContrasena(event.target.value)}
                        onInput={limpiarMensajeValidacion}
                        onInvalid={establecerMensajeValidacionEnEspanol}
                        placeholder="Repite tu contraseña"
                        className="w-full border-none bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
                        minLength={6}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setMostrarConfirmacionContrasena((valorActual) => !valorActual)}
                        className="ml-3 text-gray-400 transition hover:text-[#ff8c42]"
                        aria-label={mostrarConfirmacionContrasena ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                      >
                        {mostrarConfirmacionContrasena ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </label>
                )}

                {error && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
                {exito && <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{exito}</p>}

                <button
                  type="submit"
                  disabled={estaEnviando}
                  className={`w-full rounded-2xl px-5 py-3.5 text-sm font-semibold text-white transition ${
                    modo === 'login'
                      ? 'bg-gradient-to-r from-[#1a9b8e] to-[#7ab851] hover:shadow-lg'
                      : 'bg-gradient-to-r from-[#ff8c42] to-[#ff6b6b] hover:shadow-lg'
                  } ${estaEnviando ? 'cursor-not-allowed opacity-75' : ''}`}
                >
                  {estaEnviando ? 'Procesando...' : modo === 'login' ? 'Entrar en PetMate' : 'Crear cuenta'}
                </button>
              </form>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
