import React from 'react';
import { TrendingUp, User2 } from 'lucide-react';
import { Countdown } from './Countdown';
import { StatusBadge } from './StatusBadge';
import { formatPrice, slugify } from '../utils/format';

export function DropCard({ drop, currency, onOpen, onArtist, index = 0 }) {
  const progress = drop.totalPrints
    ? Math.min(100, Math.round((drop.printsSold / drop.totalPrints) * 100))
    : 0;

  return (
    <article
      className="card group flex flex-col rise"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <button
        onClick={() => onOpen(drop)}
        className="relative aspect-[4/5] overflow-hidden text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500/60 rounded-t-[1.5rem]"
        aria-label={`Ver ${drop.title}`}
      >
        <img
          src={drop.image}
          alt={`${drop.title} — ${drop.artist}`}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-90 group-hover:opacity-50 transition-opacity"
          style={{
            background:
              'linear-gradient(180deg, rgba(7,4,13,0) 35%, rgba(7,4,13,.45) 75%, rgba(7,4,13,.85) 100%)',
          }}
        />

        <div className="absolute top-3 left-3"><StatusBadge status={drop.status} /></div>

        <div className="absolute top-3 right-3 glass rounded-full px-2.5 py-1">
          <Countdown endsAt={drop.endsAt} fallback={drop.timeLeft} />
        </div>
      </button>

      <div className="p-6 flex flex-col flex-grow gap-5">
        <div>
          <h3 className="font-display text-2xl font-bold leading-tight tracking-tight text-white">
            {drop.title}
          </h3>
          <button
            onClick={() => onArtist({ name: drop.artist, slug: slugify(drop.artist) })}
            className="mt-1 inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-fuchsia-300 transition-colors"
          >
            <User2 size={13} /> {drop.artist}
          </button>
          {/* NUEVO: Dimensiones en la tarjeta */}
          {drop.dimensions && (
            <p className="mt-1 text-[11px] text-slate-500 font-medium">
              Formato: {drop.dimensions}
            </p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
            <span className="font-semibold uppercase tracking-widest">Edición</span>
            <span className="tabular-nums">
              <span className="text-white font-semibold">{drop.printsSold}</span>
              <span className="text-slate-500"> / {drop.totalPrints}</span>
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 via-fuchsia-400 to-cyan-400 transition-[width] duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="mt-auto grid grid-cols-2 gap-3">
          <PriceTile label="Original" value={formatPrice(drop.originalBid, currency)} accent="cyan" trend />
          <PriceTile label="Print fine-art" value={formatPrice(drop.printPrice, currency)} accent="white" />
        </div>
      </div>
    </article>
  );
}

function PriceTile({ label, value, accent, trend }) {
  const color = accent === 'cyan' ? 'text-cyan-300' : 'text-white';
  return (
    <div className="rounded-2xl bg-black/40 border border-white/5 px-4 py-3">
      <p className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold inline-flex items-center gap-1">
        {label} {trend && <TrendingUp size={11} className="text-cyan-400" />}
      </p>
      <p className={`font-display text-xl font-bold mt-1 ${color}`}>{value}</p>
    </div>
  );
}