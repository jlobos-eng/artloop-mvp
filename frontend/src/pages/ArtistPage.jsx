import React, { useMemo } from 'react';
import { ArrowLeft } from 'lucide-react';
import { EmptyState } from '../components/EmptyState';
import { formatPrice, initials, slugify } from '../utils/format';

export function ArtistPage({ drops, slug, currency, onBack, onOpenDrop }) {
  const works = useMemo(
    () => drops.filter((d) => slugify(d.artist) === slug),
    [drops, slug],
  );

  if (works.length === 0) {
    return (
      <div className="py-20">
        <EmptyState
          title="Artista no encontrado"
          message="El artista no tiene obras publicadas en este momento."
          action={{ label: 'Volver a la galería', onClick: onBack }}
        />
      </div>
    );
  }

  const artistName = works[0].artist;
  const totalSold = works.reduce((sum, w) => sum + (w.printsSold || 0), 0);

  return (
    <div className="py-10 md:py-16">
      <button onClick={onBack} className="btn-ghost mb-8 text-sm">
        <ArrowLeft size={16} />
        Galería general
      </button>

      <div className="rise flex flex-col md:flex-row md:items-center gap-6 md:gap-8 pb-10 mb-10 border-b border-white/5">
        <div
          className="w-24 h-24 md:w-28 md:h-28 rounded-3xl grid place-items-center text-4xl font-display font-bold shadow-[0_24px_60px_-20px_rgba(217,70,239,0.5)]"
          style={{ background: 'linear-gradient(135deg, #d946ef 0%, #22d3ee 100%)' }}
        >
          {initials(artistName) || '?'}
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-fuchsia-400 font-semibold">
            Artista residente
          </p>
          <h1 className="font-display text-4xl md:text-6xl font-bold mt-1 leading-[1.04] tracking-tight">
            {artistName}
          </h1>
          <p className="text-slate-400 mt-3 text-sm md:text-base">
            {works.length} obra{works.length === 1 ? '' : 's'} publicada{works.length === 1 ? '' : 's'} ·{' '}
            {totalSold} edición{totalSold === 1 ? '' : 'es'} vendida{totalSold === 1 ? '' : 's'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {works.map((drop, i) => (
          <button
            key={drop.id}
            onClick={() => onOpenDrop(drop.id)}
            className="group relative aspect-square rounded-2xl overflow-hidden text-left rise"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <img
              src={drop.image}
              alt={drop.title}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(180deg, rgba(7,4,13,0) 40%, rgba(7,4,13,.55) 75%, rgba(7,4,13,.92) 100%)',
              }}
            />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <p className="font-display text-base md:text-lg font-bold leading-tight">{drop.title}</p>
              <p className="text-cyan-300 font-semibold text-sm mt-1">
                {formatPrice(drop.originalBid, currency)}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
