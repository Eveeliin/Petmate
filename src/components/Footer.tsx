import React from 'react';
import { Facebook, Instagram, Mail, MapPin, Phone, Twitter } from 'lucide-react';

const logo = '/logo_def_pm.png';

export function Footer() {
  return (
    <footer id="contacto" className="bg-gradient-to-br from-gray-900 to-gray-800 pb-8 pt-16 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <img src={logo} alt="PetMate" className="mb-4 h-20 w-auto object-contain" />
            <p className="mb-6 text-gray-400">
              La mejor plataforma para explorar el Madrid más pet-friendly. Alojamientos, locales y eventos en un solo
              lugar.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-[#1a9b8e]"
                aria-label="Ir a Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-[#1a9b8e]"
                aria-label="Ir a Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-[#1a9b8e]"
                aria-label="Ir a Twitter"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-lg font-semibold text-[#7ab851]">Enlaces Rapidos</h4>
            <ul className="space-y-3">
              <li>
                <a href="#mapa" className="text-gray-400 transition-colors hover:text-[#1a9b8e]">
                  Mapa Interactivo
                </a>
              </li>
              <li>
                <a href="#eventos" className="text-gray-400 transition-colors hover:text-[#1a9b8e]">
                  Proximos Eventos
                </a>
              </li>
              <li>
                <a href="#comunidad" className="text-gray-400 transition-colors hover:text-[#1a9b8e]">
                  Comunidad
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 transition-colors hover:text-[#1a9b8e]">
                  Blog Pet-Friendly
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-lg font-semibold text-[#7ab851]">Soporte</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-400 transition-colors hover:text-[#1a9b8e]">
                  Centro de Ayuda
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 transition-colors hover:text-[#1a9b8e]">
                  Preguntas Frecuentes
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 transition-colors hover:text-[#1a9b8e]">
                  Politica de Privacidad
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 transition-colors hover:text-[#1a9b8e]">
                  Terminos y Condiciones
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-lg font-semibold text-[#7ab851]">Contacto</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-gray-400">
                <MapPin size={20} className="mt-1 shrink-0 text-[#1a9b8e]" />
                <span>Madrid, España</span>
              </li>
              <li className="flex items-start gap-3 text-gray-400">
                <Mail size={20} className="mt-1 shrink-0 text-[#1a9b8e]" />
                <a href="mailto:hola@petmate.es" className="transition-colors hover:text-[#1a9b8e]">
                  hola@petmate.es
                </a>
              </li>
              <li className="flex items-start gap-3 text-gray-400">
                <Phone size={20} className="mt-1 shrink-0 text-[#1a9b8e]" />
                <a href="tel:+34123456789" className="transition-colors hover:text-[#1a9b8e]">
                  +34 123 456 789
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mb-8 border-t border-white/10 pt-8">
          <div className="mx-auto max-w-2xl text-center">
            <h4 className="mb-3 text-xl">Unete a la manada</h4>
            <p className="mb-6 text-gray-400">
              Recibe los mejores planes para disfrutar con tu mascota directamente en tu bandeja de entrada.
            </p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="Tu correo electronico"
                className="max-w-md flex-1 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-white placeholder-gray-400 focus:border-[#1a9b8e] focus:outline-none"
              />
              <button className="whitespace-nowrap rounded-full bg-gradient-to-r from-[#1a9b8e] to-[#7ab851] px-8 py-3 font-medium text-white transition-shadow hover:shadow-lg">
                Suscribirse
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} PetMate - IES Francisco de Quevedo. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
