import React, { useState, useEffect } from 'react';
import { Flame, Clock, ArrowLeft, TrendingUp, ShieldCheck, Heart } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const [activeArtworkId, setActiveArtworkId] = useState(null);
  const [drops, setDrops] = useState([]);

  useEffect(() => {
    fetch('https://artloop-mvp.onrender.com/api/drops')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setDrops(data);
        else setDrops([]);
      })
      .catch(err => setDrops([]));
  }, []);

  const navigate = (view, artworkId = null) => {
    setCurrentView(view);
    if (artworkId) setActiveArtworkId(artworkId);
    window.scrollTo(0, 0);
  };

  const handleBuyPrint = async (dropId) => {
    try {
      const response = await fetch(`https://artloop-mvp.onrender.com/api/drops/${dropId}/buy-print`, {
        method: 'POST'
      });
      const data = await response.json();
      if (data.success) {
        setDrops(currentDrops => currentDrops.map(d => d.id === dropId ? data.drop : d));
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans pb-20 md:pb-0">
      {/* NAVEGACIÓN */}
      <nav className="sticky top-0 w-full z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('home')}>
            <TrendingUp className="text-fuchsia-500" />
            <span className="font-bold text-xl tracking-tight">ART<span className="text-fuchsia-500">LOOP</span></span>
          </div>
          <div className="hidden md:flex space-x-8 items-center">
            <button onClick={() => navigate('home')} className="px-1 py-5 text-sm font-medium border-b-2 border-fuchsia-500 text-fuchsia-400">
              Curaduría Exclusiva
            </button>
          </div>
        </div>
      </nav>

      <main className="pt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* VISTA 1: HOME (CATÁLOGO) */}
        {currentView === 'home' && (
          <div className="animate-in fade-in duration-500">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">Curaduría Exclusiva</h1>
            <p className="text-slate-400 mb-8 max-w-2xl">Adquiere ediciones limitadas (B2C) o invierte en piezas originales validadas en tiempo real por el mercado (B2B).</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {drops.map(drop => (
                <div key={drop.id} onClick={() => navigate('artwork', drop.id)} className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800 cursor-pointer shadow-xl group hover:border-slate-600 transition-colors">

                  {/* IMAGEN DE LA OBRA */}
                  <div className="h-72 relative flex items-center justify-center overflow-hidden">
                    <div
                      className="absolute inset-0 group-hover:scale-105 transition-transform duration-700"
                      style={{ backgroundImage: `url(${drop.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                    ></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent"></div>

                    <div className="absolute top-3 right-3 bg-black/70 px-2 py-1 rounded text-xs font-bold border border-slate-700 text-slate-300 flex items-center">
                      <Clock size={12} className="mr-1" /> {drop.timeLeft}
                    </div>
                    {drop.status === 'hot' && (
                      <div className="absolute top-3 left-3 bg-fuchsia-500/90 text-white border border-fuchsia-400 px-2 py-1 rounded text-xs font-bold flex items-center shadow-lg">
                        <Flame size={12} className="mr-1" /> {drop.printsSold} Prints
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <h3 className="text-xl font-bold mb-1">{drop.title}</h3>
                    <p className="text-slate-400 text-sm mb-4">Por {drop.artist}</p>
                    <div className="flex justify-between items-end border-t border-slate-800 pt-4">
                      <div>
                        <p className="text-[10px] uppercase text-slate-500 font-bold">Valor Original Estimado</p>
                        <p className="font-bold text-lg text-cyan-400">${drop.originalBid.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] uppercase text-slate-500 font-bold">Print ({drop.totalPrints - drop.printsSold} left)</p>
                        <p className="font-bold text-lg text-white">${drop.printPrice}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VISTA 2: DETALLE DE LA OBRA */}
        {currentView === 'artwork' && drops.find(d => d.id === activeArtworkId) && (() => {
          const artwork = drops.find(d => d.id === activeArtworkId);
          const progress = (artwork.printsSold / artwork.totalPrints) * 100;

          return (
            <div className="animate-in slide-in-from-right-4 duration-500 pb-10">
              <button onClick={() => navigate('home')} className="text-slate-400 hover:text-white text-sm flex items-center mb-6">
                <ArrowLeft size={16} className="mr-2" /> Volver a Curaduría
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Visual con Imagen Real */}
                <div
                  className="aspect-[4/5] w-full rounded-2xl border border-slate-800 shadow-2xl flex items-center justify-center relative overflow-hidden group"
                >
                  <div
                    className="absolute inset-0 transition-transform duration-1000 group-hover:scale-105"
                    style={{ backgroundImage: `url(${artwork.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                  ></div>
                  <div className="absolute inset-0 bg-slate-950/20"></div>
                  <span className="text-white/30 text-6xl font-bold tracking-widest uppercase rotate-[-45deg] z-10 select-none">WATERMARK</span>
                </div>

                {/* Panel Dual */}
                <div className="flex flex-col">
                  <h1 className="text-4xl font-bold mb-2">{artwork.title}</h1>
                  <p className="text-lg text-slate-400 mb-8">Por <span className="text-white font-semibold">{artwork.artist}</span></p>

                  {/* Social Proof Pitch */}
                  <div className="bg-slate-900/50 border border-fuchsia-500/20 rounded-2xl p-6 mb-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-fuchsia-500/10 rounded-full blur-3xl"></div>
                    <div className="flex items-center space-x-4 mb-4 relative z-10">
                      <div className="text-4xl">🔥</div>
                      <div>
                        <p className="text-2xl font-bold text-white">{artwork.printsSold} Prints Vendidos</p>
                        <p className="text-xs text-slate-400">Generando tracción global y revalorizando el original.</p>
                      </div>
                    </div>
                    <div className="w-full bg-slate-950 rounded-full h-2 relative z-10">
                      <div className="bg-gradient-to-r from-fuchsia-600 to-fuchsia-400 h-2 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                    </div>

                    <div className="mt-6 space-y-2 relative z-10 border-t border-slate-800 pt-4">
                      <p className="flex items-center text-xs text-slate-300"><ShieldCheck size={14} className="mr-2 text-fuchsia-500" /> Certificado de Autenticidad Digital</p>
                      <p className="flex items-center text-xs text-slate-300"><ShieldCheck size={14} className="mr-2 text-fuchsia-500" /> Papel Fine Art de Calidad Museo</p>
                    </div>
                  </div>

                  {/* Botones de Acción */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Panel B2C */}
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between hover:border-fuchsia-500/50 transition-colors">
                      <p className="text-sm text-slate-400 mb-2">Retail B2C</p>
                      <p className="text-4xl font-bold text-white mb-6">${artwork.printPrice}</p>
                      <button onClick={() => handleBuyPrint(artwork.id)} className="w-full bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(217,70,239,0.3)] hover:scale-105 active:scale-95">
                        Adquirir Print
                      </button>
                    </div>

                    {/* Panel B2B */}
                    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between">
                      <p className="text-sm text-slate-400 mb-2 flex items-center">Mercado B2B <TrendingUp size={14} className="ml-2 text-cyan-400" /></p>
                      <p className="text-4xl font-bold text-cyan-400 mb-6 transition-all duration-300">${artwork.originalBid.toLocaleString()}</p>
                      <button className="w-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-bold py-3 rounded-xl cursor-not-allowed opacity-70">
                        Inversión Privada
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
      </main>
    </div>
  );
}