import React, { useState } from 'react';
import { ArrowLeft, Flame, LayoutGrid, ShieldCheck, TrendingUp, Zap } from 'lucide-react';
import { Countdown } from '../components/Countdown';
import { StatusBadge } from '../components/StatusBadge';
import { EmptyState } from '../components/EmptyState';
import { formatPrice, slugify } from '../utils/format';
import { api } from '../api/client';
import { useToast } from '../components/Toast';

export function ArtworkPage({ drops, status, dropId, currency, onBack, onArtist, onUpdateDrop }) {
  const drop = drops.find((d) => d.id === dropId);
  const [purchasing, setPurchasing] = useState(false);
  const [viewMode, setViewMode] = useState('detail'); // NUEVO: Estado para alternar vistas
  const toast = useToast();

  if (status === 'loading') {
    return (
      <div className="py-20">
        <div className="skeleton h-6 w-32 rounded-full mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="skeleton aspect-[4/5] rounded-3xl" />
          <div className="space-y-4">
            <div className="skeleton h-12 w-3/4" />
            <div className="skeleton h-6 w-1/2" />
            <div className="skeleton h-40 w-full mt-8" />
          </div>
        </div>
      </div>
    );
  }

  if (!drop) {
    return (
      <div className="py-20">
        <EmptyState
          title="Obra no disponible"
          message="La pieza que buscas ya no está en circulación o no existe."
          action={{ label: 'Volver a la curaduría', onClick: onBack }}
        />
      </div>
    );
  }

  const editionLeft = Math.max(0, drop.totalPrints - drop.printsSold);
  const isSoldOut = editionLeft === 0;

  const handleBuy = async () => {
    if (purchasing || isSoldOut) return;
    setPurchasing(true);
    try {
      const res = await api.buyPrint(drop.id);
      if (res?.drop) {
        onUpdateDrop(res.drop);
        toast.success('¡Adquisición confirmada!', `Tu print de "${res.drop.title}" fue reservado.`);
      } else {
        toast.success('¡Adquisición confirmada!');
      }
    } catch (err) {
      toast.error('No pudimos completar la compra', err.message);
    } finally {
      setPurchasing(false);
    }
  };

  // --- NUEVO: LÓGICA DE ESCALA MATEMÁTICA PARA EL MOCKUP ---
  const parseScale = (dimStr) => {
    if (!dimStr) return 30; // Si no hay tamaño, mostramos al 30% por defecto
    const match = dimStr.match(/(\d+)\s*[xX]/); // Extraemos el primer número (Ancho)
    if (match && match[1]) {
      const widthCm = parseInt(match[1]);
      // Asumimos que la pared visible de la imagen de fondo tiene ~350cm de ancho
      const scalePercent = (widthCm / 350) * 100;
      return Math.min(Math.max(scalePercent, 10), 85); // Mínimo 10%, Máximo 85% para que no se rompa la pantalla
    }
    return 30;
  };

  return (
    <div className="py-10 md:py-16">
      <button onClick={onBack} className="btn-ghost mb-8 text-sm">
        <ArrowLeft size={16} />
        Volver a la curaduría
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

        {/* --- CONTENEDOR VISUAL ACTUALIZADO (SWITCH + MOCKUP) --- */}
        <div className="rise relative rounded-3xl overflow-hidden border border-white/5 shadow-[0_50px_120px_-40px_rgba(0,0,0,0.8)] bg-slate-900">

          {/* SWITCH DE VISTAS */}
          <div className="absolute top-4 right-4 z-20 flex bg-slate-950/80 backdrop-blur-md rounded-full p-1 border border-white/10 shadow-xl">
            <button
              onClick={() => setViewMode('detail')}
              className={`px-4 py-1.5 rounded-full text-[11px] uppercase tracking-widest font-bold transition-all ${viewMode === 'detail' ? 'bg-fuchsia-600 text-white shadow-[0_0_15px_rgba(217,70,239,0.5)]' : 'text-slate-400 hover:text-white'}`}
            >
              Obra
            </button>
            <button
              onClick={() => setViewMode('mockup')}
              className={`px-4 py-1.5 rounded-full text-[11px] uppercase tracking-widest font-bold transition-all ${viewMode === 'mockup' ? 'bg-fuchsia-600 text-white shadow-[0_0_15px_rgba(217,70,239,0.5)]' : 'text-slate-400 hover:text-white'}`}
            >
              En Espacio
            </button>
          </div>

          {viewMode === 'detail' ? (
            <div className="relative">
              <img src={drop.image} alt={drop.title} className="w-full h-auto block" />
              <div className="absolute top-4 left-4 flex gap-2">
                <StatusBadge status={drop.status} />
                <span className="glass rounded-full px-3 py-1.5">
                  <Countdown endsAt={drop.endsAt} fallback={drop.timeLeft} />
                </span>
              </div>
            </div>
          ) : (
            <div className="relative aspect-[4/5] w-full flex items-center justify-center overflow-hidden bg-zinc-900">
              {/* Imagen de la sala de fondo (Unsplash) */}
              <img
                src="https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=1000&auto=format&fit=crop"
                alt="Room Mockup"
                className="absolute inset-0 w-full h-full object-cover opacity-80"
              />
              {/* La obra superpuesta y escalada */}
              <div
                className="relative z-10 transition-all duration-700 ease-in-out"
                style={{
                  width: `${parseScale(drop.dimensions)}%`,
                  transform: 'translateY(-20%)' // La subimos un poco para que quede sobre el sofá
                }}
              >
                <img
                  src={drop.image}
                  alt={drop.title}
                  className="w-full h-auto object-cover shadow-[0_30px_60px_rgba(0,0,0,0.8)] border border-black/20"
                />
              </div>
              <div className="absolute bottom-6 left-0 w-full text-center z-20">
                <p className="text-[10px] uppercase tracking-widest bg-black/70 inline-block px-4 py-2 rounded-full text-slate-300 backdrop-blur-md border border-white/10">
                  Escala calculada: {drop.dimensions || 'Dimensión no definida'}
                </p>
              </div>
            </div>
          )}
        </div>
        {/* --- FIN CONTENEDOR VISUAL --- */}

        <div className="rise rise-delay-1">
          <p className="text-xs uppercase tracking-[0.2em] text-fuchsia-400 font-semibold">
            Edición numerada · {drop.year || '2026'}
          </p>
          <h1 className="font-display text-4xl md:text-6xl font-bold leading-[1.04] tracking-tight mt-3">
            {drop.title}
          </h1>
          <button
            onClick={() => onArtist(slugify(drop.artist), drop.artist)}
            className="mt-3 text-fuchsia-300 hover:text-fuchsia-200 text-base font-medium transition-colors"
          >
            Por {drop.artist}
          </button>

          {/* Ficha Técnica Rápida */}
          <div className="mt-5 flex flex-wrap gap-2 text-xs text-slate-300">
            {drop.dimensions && (
              <span className="bg-white/5 border border-white/10 rounded-full px-3 py-1">
                <span className="text-slate-500 font-semibold mr-1">TAMAÑO:</span> {drop.dimensions}
              </span>
            )}
            {drop.technique && (
              <span className="bg-white/5 border border-white/10 rounded-full px-3 py-1">
                <span className="text-slate-500 font-semibold mr-1">TÉCNICA:</span> {drop.technique}
              </span>
            )}
            {drop.style && (
              <span className="bg-white/5 border border-white/10 rounded-full px-3 py-1">
                <span className="text-slate-500 font-semibold mr-1">ESTILO:</span> {drop.style}
              </span>
            )}
          </div>

          {drop.description && (
            <p className="mt-6 text-slate-300 leading-relaxed text-base max-w-xl">
              {drop.description}
            </p>
          )}

          <div className="mt-8 glass rounded-3xl p-6 flex items-center gap-4">
            <Flame size={28} className="text-orange-400" fill="currentColor" />
            <div>
              <p className="font-display text-xl font-bold text-white leading-none">
                {drop.printsSold} de {drop.totalPrints} ediciones vendidas
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {isSoldOut
                  ? 'Edición agotada · originales disponibles vía contacto privado.'
                  : `${editionLeft} ediciones restantes — generando tracción.`}
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <PriceCard
              icon={TrendingUp}
              label="Inversión original"
              value={formatPrice(drop.originalBid, currency)}
              accent="cyan"
            />
            <PriceCard
              icon={LayoutGrid}
              label="Print fine-art"
              value={formatPrice(drop.printPrice, currency)}
              accent="magenta"
            />
          </div>

          <button
            onClick={handleBuy}
            disabled={purchasing || isSoldOut}
            className="btn-primary w-full mt-8 text-lg py-5"
          >
            {isSoldOut ? (
              <>Edición agotada</>
            ) : purchasing ? (
              <>
                <Zap size={18} className="animate-pulse" />
                Procesando...
              </>
            ) : (
              <>Adquirir edición limitada</>
            )}
          </button>

          <p className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400">
            <ShieldCheck size={14} className="text-cyan-300" />
            Incluye certificado digital de autenticidad y trazabilidad
          </p>
        </div>
      </div>
    </div>
  );
}

function PriceCard({ icon: Icon, label, value, accent }) {
  const map = {
    cyan: { ring: 'border-cyan-500/20', text: 'text-cyan-300', bg: 'bg-cyan-500/[0.05]' },
    magenta: { ring: 'border-fuchsia-500/25', text: 'text-white', bg: 'bg-fuchsia-500/[0.05]' },
  };
  const m = map[accent] || map.cyan;
  return (
    <div className={`rounded-3xl border p-6 ${m.ring} ${m.bg}`}>
      <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold inline-flex items-center gap-1.5">
        <Icon size={12} className={m.text} /> {label}
      </p>
      <p className={`font-display text-3xl md:text-4xl font-bold mt-2 ${m.text}`}>{value}</p>
    </div>
  );
}