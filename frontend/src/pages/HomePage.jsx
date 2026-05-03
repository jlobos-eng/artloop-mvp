import React, { useMemo } from 'react';
import { Hero } from '../components/Hero';
import { DropCard } from '../components/DropCard';
import { DropCardSkeleton } from '../components/Skeleton';
import { HowItWorks } from '../components/HowItWorks';
import { EmptyState } from '../components/EmptyState';
import { slugify } from '../utils/format';

export function HomePage({ drops, status, error, currency, onOpenDrop, onOpenArtist, onReload }) {
  const totalArtists = useMemo(
    () => new Set(drops.map((d) => d.artist).filter(Boolean)).size,
    [drops],
  );

  return (
    <>
      <Hero
        totalDrops={status === 'ready' ? drops.length : '—'}
        totalArtists={status === 'ready' ? totalArtists : '—'}
        onPrimary={() =>
          document.getElementById('drops-grid')?.scrollIntoView({ behavior: 'smooth' })
        }
      />

      <section id="drops-grid" className="py-8">
        <div className="flex items-end justify-between mb-8 gap-4 flex-wrap">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-fuchsia-400 font-semibold">
              Curaduría 2026
            </p>
            <h2 className="font-display text-3xl md:text-5xl font-bold mt-2 leading-tight">
              Obras en circulación
            </h2>
          </div>
          {status === 'ready' && (
            <span className="text-sm text-slate-400">
              {drops.length} pieza{drops.length === 1 ? '' : 's'} disponibles
            </span>
          )}
        </div>

        {status === 'loading' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <DropCardSkeleton key={i} />
            ))}
          </div>
        )}

        {status === 'error' && (
          <EmptyState
            title="No pudimos cargar la curaduría"
            message={error?.message || 'Comprueba tu conexión e inténtalo nuevamente.'}
            action={{ label: 'Reintentar', onClick: onReload }}
          />
        )}

        {status === 'ready' && drops.length === 0 && (
          <EmptyState
            title="Aún no hay obras publicadas"
            message="El próximo drop será anunciado pronto. Vuelve en unos minutos."
            action={{ label: 'Refrescar', onClick: onReload }}
          />
        )}

        {status === 'ready' && drops.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {drops.map((drop, i) => (
              <DropCard
                key={drop.id}
                drop={drop}
                currency={currency}
                index={i}
                onOpen={(d) => onOpenDrop(d.id)}
                onArtist={(artist) => onOpenArtist(artist.slug || slugify(artist.name), artist.name)}
              />
            ))}
          </div>
        )}
      </section>

      <HowItWorks />
    </>
  );
}
