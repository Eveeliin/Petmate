import React from 'react';
import { CommunitySection } from '../components/CommunitySection';
import { EventsSection } from '../components/EventsSection';
import { FeaturesSection } from '../components/FeatureSection';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { HeroSection } from '../components/HeroSection';
import { MapSection } from '../components/MapSection';
import { TestimonialsSection } from '../components/TestimonialsSection';

export function PaginaInicio() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <MapSection />
        <EventsSection />
        <CommunitySection />
        <FeaturesSection />
        <TestimonialsSection />
      </main>
      <Footer />
    </div>
  );
}
