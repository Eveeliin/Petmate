import React from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { PaginaInicio } from './pages/HomePage';
import { PaginaAcceso } from './pages/LoginPage';
import { PaginaOnboarding } from './pages/OnboardingPage';
import { PaginaPerfil } from './pages/ProfilePage';
import { PaginaEstablecimientos } from './pages/EstablecimientosPage';
import { PaginaEventos } from './pages/EventosPage';

function GestorScroll() {
  const { hash, pathname } = useLocation();

  React.useEffect(() => {
    if (hash) {
      window.setTimeout(() => {
        const elemento = document.querySelector(hash);
        elemento?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 0);
      return;
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [hash, pathname]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <GestorScroll />
      <Routes>
        <Route path="/" element={<PaginaInicio />} />
        <Route path="/login" element={<PaginaAcceso />} />
        <Route path="/onboarding" element={<PaginaOnboarding />} />
        <Route path="/perfil" element={<PaginaPerfil />} />
        <Route path="/establecimientos" element={<PaginaEstablecimientos />} />
        <Route path="/eventos" element={<PaginaEventos />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
