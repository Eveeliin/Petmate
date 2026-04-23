import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { PaginaInicio } from './pages/HomePage';
import { PaginaAcceso } from './pages/LoginPage';
import { PaginaOnboarding } from './pages/OnboardingPage';
import { PaginaPerfil } from './pages/ProfilePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PaginaInicio />} />
        <Route path="/login" element={<PaginaAcceso />} />
        <Route path="/onboarding" element={<PaginaOnboarding />} />
        <Route path="/perfil" element={<PaginaPerfil />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
