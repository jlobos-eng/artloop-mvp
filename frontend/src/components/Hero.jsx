import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

export function Hero({ totalDrops, totalArtists, onPrimary }) {
  return (
    <section className="relative pt-12 md:pt-20 pb-12 md:pb-20">
      <div className="max-w-4xl">
        <div className="rise inline-flex items-center gap-2 glass rounded-full px-3 py-1.5 text-xs font-medium text-slate-200 mb-6">
          <span className="relative flex w-2 h-2">
            <span className="absolute inline-flex w-2 h-2 rounded-full bg-cyan-400 live-dot" />
            <span className="relative inline-flex w-2 h-2 rounded-full bg-cyan-400" />
          </span>
          Subastas en vivo · Curaduría 2026
        </div>

        <h1 className="rise rise-delay-1 font-display text-5xl md:text-7xl font-bold leading-[1.02] tracking-tight">
          Arte que <span className="gradient-text">se valida</span>
          <br />en tiempo real.
        </h1>

        <p className="rise rise-delay-2 mt-6 text-slate-300/90 text-lg md:text-xl leading-relaxed max-w-2xl">
          Adquiere ediciones <em className="not-italic text-white">fine-art</em> numeradas o invierte en
          piezas originales cuyo precio se mueve con cada print vendido.
        </p>

        <div className="rise rise-delay-3 mt-8 flex flex-col sm:flex-row gap-3">
          <button onClick={onPrimary} className="btn-primary">
            <Sparkles size={16} />
            Explorar la curaduría
            <ArrowRight size={16} />
          </button>
          <a
            href="#cta-section"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('cta-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="btn-ghost"
          >
            Cómo funciona
          </a>
        </div>

        <dl className="rise rise-delay-3 mt-12 grid grid-cols-3 gap-4 max-w-xl">
          <Stat label="Obras curadas" value={totalDrops} />
          <Stat label="Artistas activos" value={totalArtists} />
          <Stat label="Certificación" value="Digital" />
        </dl>
      </div>

      <div
        aria-hidden="true"
        className="absolute -top-10 -right-10 w-[420px] h-[420px] rounded-full opacity-50 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(217,70,239,0.45), transparent 60%)' }}
      />
    </section>
  );
}

function Stat({ label, value }) {
  return (
    <div className="glass rounded-2xl px-4 py-3">
      <dt className="text-[10px] tracking-widest text-slate-400 font-semibold uppercase">{label}</dt>
      <dd className="font-display text-2xl text-white font-semibold mt-1">{value}</dd>
    </div>
  );
}
