import React from 'react';
import { useState } from 'react';
import type { ImgHTMLAttributes } from 'react';

const IMAGEN_ERROR =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg==';

export function ImageWithFallback(props: ImgHTMLAttributes<HTMLImageElement>) {
  const [falloCarga, setFalloCarga] = useState(false);
  const { src, alt, className, style, ...resto } = props;

  if (falloCarga) {
    return (
      <div className={`inline-block bg-gray-100 align-middle ${className ?? ''}`} style={style}>
        <div className="flex h-full w-full items-center justify-center">
          <img src={IMAGEN_ERROR} alt="Error al cargar la imagen" data-original-url={src} {...resto} />
        </div>
      </div>
    );
  }

  return <img src={src} alt={alt} className={className} style={style} onError={() => setFalloCarga(true)} {...resto} />;
}
