import React from 'react';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';

export function PaginaCookies() {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f6fcfb_0%,#ffffff_40%,#fffaf4_100%)]">
      <Header />
      <main className="pt-20">
        <section className="border-b border-gray-100 bg-white">
          <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.28em] text-[#ff8c42]">Legal</p>
            <h1 className="text-4xl font-bold text-gray-900 md:text-5xl">Política de cookies</h1>
            <p className="mt-6 text-lg leading-relaxed text-gray-600">
              Esta política explica qué cookies y tecnologías similares puede utilizar PetMate para que la aplicación
              funcione correctamente.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="space-y-8 rounded-[2rem] border border-gray-100 bg-white p-8 shadow-lg">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Qué son las cookies</h2>
              <p className="mt-3 leading-relaxed text-gray-600">
                Las cookies son pequeños archivos que se almacenan en tu dispositivo para recordar información técnica
                o preferencias de navegación.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900">Cookies que utilizamos</h2>
              <p className="mt-3 leading-relaxed text-gray-600">
                PetMate utiliza cookies o almacenamiento local necesarios para mantener la sesión, recordar preferencias
                básicas y garantizar el correcto funcionamiento de la aplicación.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900">Cookies de terceros</h2>
              <p className="mt-3 leading-relaxed text-gray-600">
                La aplicación puede apoyarse en servicios externos necesarios para su funcionamiento, como Supabase para
                autenticación y almacenamiento de datos. No usamos cookies publicitarias.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900">Gestión de cookies</h2>
              <p className="mt-3 leading-relaxed text-gray-600">
                Puedes configurar o eliminar cookies desde los ajustes de tu navegador. Ten en cuenta que bloquear
                cookies esenciales puede afectar al inicio de sesión o a otras funciones de PetMate.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900">Actualizaciones</h2>
              <p className="mt-3 leading-relaxed text-gray-600">
                Esta política puede actualizarse si incorporamos nuevas funcionalidades o herramientas que requieran
                información adicional sobre cookies.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
