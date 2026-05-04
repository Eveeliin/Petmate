import React from 'react';
import { CircleMarker, MapContainer, Popup, TileLayer } from 'react-leaflet';
import { establecimientos, type Establecimiento } from '../data/establecimientos';

type PetFriendlyMapProps = {
  puntos?: Establecimiento[];
  altoClase?: string;
};

const centroMadrid: [number, number] = [40.4168, -3.7038];

export function PetFriendlyMap({
  puntos = establecimientos,
  altoClase = 'h-[26rem]',
}: PetFriendlyMapProps) {
  return (
    <div className={`overflow-hidden rounded-3xl border border-gray-200 ${altoClase}`}>
      <MapContainer center={centroMadrid} zoom={12.5} scrollWheelZoom={false} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {puntos.map((establecimiento) => (
          <CircleMarker
            key={establecimiento.id}
            center={[establecimiento.latitud, establecimiento.longitud]}
            pathOptions={{
              color: '#ffffff',
              weight: 3,
              fillColor: establecimiento.color,
              fillOpacity: 1,
            }}
            radius={10}
          >
            <Popup>
              <div className="space-y-3 py-1">
                <div>
                  <h3 className="text-base font-bold text-gray-900">{establecimiento.nombre}</h3>
                  <p className="mt-1 text-sm text-gray-500">{establecimiento.direccion}</p>
                </div>
                <span className="inline-flex rounded-full bg-[#eef7f5] px-3 py-1 text-xs font-semibold text-[#1a9b8e]">
                  {establecimiento.categoria}
                </span>
                <p className="text-sm leading-relaxed text-gray-700">{establecimiento.descripcion}</p>
                <p className="text-sm font-medium text-gray-800">{establecimiento.reglaMascota}</p>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
