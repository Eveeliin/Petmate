import React from 'react';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';

export function PaginaPrivacidad() {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f6fcfb_0%,#ffffff_40%,#fffaf4_100%)]">
      <Header />
      <main className="pt-20">
        <section className="border-b border-gray-100 bg-white">
          <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.28em] text-[#1a9b8e]">Legal</p>
            <h1 className="text-4xl font-bold text-gray-900 md:text-5xl">Política de privacidad</h1>
            <p className="mt-6 text-lg leading-relaxed text-gray-600">
              En PetMate valoramos tu privacidad. Esta página resume cómo tratamos la información personal que puedes
              proporcionar al utilizar nuestra aplicación.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="space-y-8 rounded-[2rem] border border-gray-100 bg-white p-8 shadow-lg">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Responsable del tratamiento</h2>
              <p className="mt-3 leading-relaxed text-gray-600">
                PetMate trata los datos personales con fines relacionados con el funcionamiento de la plataforma:
                gestión de cuenta, perfil, mascotas, favoritos y eventos.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900">Datos que recopilamos</h2>
              <ul className="mt-3 list-disc space-y-2 pl-6 leading-relaxed text-gray-600">
                <li>Datos de cuenta, como nombre visible y correo electrónico.</li>
                <li>Informacion de perfil, mascotas, favoritos y eventos creados o guardados.</li>
                <li>Datos necesarios para mantener la sesión y mejorar la experiencia de uso.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900">Finalidad</h2>
              <p className="mt-3 leading-relaxed text-gray-600">
                Utilizamos la información para permitir el registro, el inicio de sesión, la gestión del perfil, la
                organización de eventos y el guardado de establecimientos favoritos.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900">Conservación y seguridad</h2>
              <p className="mt-3 leading-relaxed text-gray-600">
                Los datos se conservan mientras la cuenta esté activa o sean necesarios para prestar el servicio.
                Aplicamos medidas técnicas razonables para proteger la información frente a accesos no autorizados.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900">Derechos de las personas usuarias</h2>
              <p className="mt-3 leading-relaxed text-gray-600">
                Puedes solicitar el acceso, la rectificación o la eliminación de tus datos. También puedes eliminar tu
                cuenta desde el perfil cuando esta opción esté disponible en la aplicación.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900">Contacto</h2>
              <p className="mt-3 leading-relaxed text-gray-600">
                Para consultas sobre privacidad puedes escribir a{' '}
                <a href="mailto:hola@petmate.es" className="font-semibold text-[#1a9b8e] hover:underline">
                  hola@petmate.es
                </a>
                .
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
