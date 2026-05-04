import React from 'react';
import { Facebook, Instagram, Mail, MapPin, Phone, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

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
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} PetMate - Todos los derechos reservados. | Políticas de privacidad | Políticas de cookies |</p>
        </div>
      </div>
    </footer>
  );
}
