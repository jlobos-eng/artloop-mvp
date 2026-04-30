import React, { useState, useEffect } from 'react';
import { Flame, Clock, Diamond, Printer, ArrowLeft, TrendingUp, ShieldCheck, Heart, Home, Briefcase } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const [activeArtworkId, setActiveArtworkId] = useState(null);
  const [drops, setDrops] = useState([]);
  const [vaultValue, setVaultValue] = useState(145200);

  // 1. Cargar el catálogo desde nuestro Backend
  useEffect(() => {
    fetch('https://artloop-mvp.onrender.com/api/drops')
      .then(res => res.json())
      .then(data => {
        // Validación: Si es un array real, lo guardamos. Si no, mostramos vacío.
        if (Array.isArray(data)) {
          setDrops(data);
        } else {
          console.error("El backend no devolvió un formato válido:", data);
          setDrops([]);
        }
      })
      .catch(err => {
        console.error("Error conectando al backend:", err);
        setDrops([]);
      });
  }, []);

  const navigate = (view, artworkId = null) => {
    setCurrentView(view);
    if (artworkId) setActiveArtworkId(artworkId);
    window.scrollTo(0, 0);
  };

  // 2. Ejecutar la compra B2C e inflar el precio (Llamada al Backend)
  const handleBuyPrint = async (dropId) => {
    try {
      const response = await fetch(`https://artloop-mvp.onrender.com/api/drops/${dropId}/buy-print`, {
        method: 'POST'
      });
      const data = await response.json();

      if (data.success) {
        alert("¡Print comprado! Observa cómo el precio del original acaba de subir en tiempo real.");
        // Actualizamos el estado visual con los nuevos datos del backend
        setDrops(currentDrops => currentDrops.map(d => d.id === dropId ? data.drop : d));
      } else {
        alert("Error: " + data.error);
      }
    } catch (err) {
      console.error("Error en la transacción:", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans pb-20 md:pb-0">
      {/* --- NAVEGACIÓN SUPERIOR --- */}
      <nav className="sticky top-0 w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('home')}>
              <TrendingUp className="text-fuchsia-500" />
              <span className="font-bold text-xl tracking-tight">ART<span className="text-fuchsia-500">LOOP</span></span>
            </div>
            <div className="hidden md:flex space-x-8 items-center">
              <button onClick={() => navigate('home')} className={`px-1 py-5 text-sm font-medium border-b-2 ${currentView === 'home' || currentView === 'artwork' ? 'border-fuchsia-500 text-fuchsia-400' : 'border-transparent text-slate-400'}`}>
                Live Drops
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* --- RENDERIZADO DE VISTAS --- */}
      <main className="pt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* VISTA 1: HOME */}
        {currentView === 'home' && (
          <div className="animate-in fade-in duration-500">
            <h1 className="text-3xl md:text-5xl font-bold mb-8">Drops de la Semana</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {drops.map(drop => (
                <div key={drop.id} onClick={() => navigate('artwork', drop.id)} className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800 cursor-pointer shadow-xl">
                  <div className="h-64 relative flex items-center justify-center text-slate-700 font-bold" style={{ background: drop.image }}>
                    <div className="absolute top-3 right-3 bg-black/70 px-2 py-1 rounded text-xs font-bold border border-slate-700 text-slate-300 flex items-center">
                      <Clock size={12} className="mr-1" /> {drop.timeLeft}
                    </div>
                    {drop.status === 'hot' && (
                      <div className="absolute top-3 left-3 bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/50 px-2 py-1 rounded text-xs font-bold flex items-center">
                        <Flame size={12} className="mr-1" /> {drop.printsSold} Prints
                      </div>
                    )}
                    <span className="opacity-20 text-4xl">ARTWORK</span>
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-bold mb-1">{drop.title}</h3>
                    <p className="text-slate-400 text-sm mb-4">Por {drop.artist}</p>
                    <div className="flex justify-between items-end border-t border-slate-800 pt-4">
                      <div>
                        <p className="text-[10px] uppercase text-slate-500 font-bold">Puja Original</p>
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

        {/* VISTA 2: DETALLE DE OBRA */}
        {currentView === 'artwork' && drops.find(d => d.id === activeArtworkId) && (() => {
          const artwork = drops.find(d => d.id === activeArtworkId);
          const progress = (artwork.printsSold / artwork.totalPrints) * 100;

          return (
            <div className="animate-in slide-in-from-right-4 duration-500 pb-10">
              <button onClick={() => navigate('home')} className="text-slate-400 hover:text-white text-sm flex items-center mb-6">
                <ArrowLeft size={16} className="mr-2" /> Volver a Drops
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Visual */}
                <div className="aspect-[4/5] w-full rounded-2xl border border-slate-800 shadow-2xl flex items-center justify-center relative" style={{ background: artwork.image }}>
                  <span className="text-white/20 text-6xl font-bold tracking-widest uppercase rotate-[-45deg]">WATERMARK</span>
                </div>

                {/* Panel Dual */}
                <div className="flex flex-col">
                  <h1 className="text-4xl font-bold mb-2">{artwork.title}</h1>
                  <p className="text-lg text-slate-400 mb-8">Por <span className="text-white font-semibold border-b border-slate-700 pb-1">{artwork.artist}</span></p>

                  {/* Social Proof */}
                  <div className="bg-slate-900/50 border border-fuchsia-500/20 rounded-2xl p-6 mb-8">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="text-4xl">🔥</div>
                      <div>
                        <p className="text-2xl font-bold text-white">{artwork.printsSold} Prints Vendidos</p>
                        <p className="text-xs text-slate-400">Generando alta revalorización B2B.</p>
                      </div>
                    </div>
                    <div className="w-full bg-slate-950 rounded-full h-2">
                      <div className="bg-gradient-to-r from-fuchsia-600 to-fuchsia-400 h-2 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                    </div>
                  </div>

                  {/* Botones de Acción */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Botón B2C */}
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between">
                      <p className="text-sm text-slate-400 mb-2">Print Limitado</p>
                      <p className="text-4xl font-bold text-white mb-6">${artwork.printPrice}</p>
                      <button onClick={() => handleBuyPrint(artwork.id)} className="w-full bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(217,70,239,0.3)] hover:scale-105">
                        Comprar Print
                      </button>
                    </div>

                    {/* Botón B2B */}
                    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between">
                      <p className="text-sm text-slate-400 mb-2 flex items-center">Puja Original <TrendingUp size={14} className="ml-2 text-cyan-400" /></p>
                      <p className="text-4xl font-bold text-cyan-400 mb-6 transition-all duration-300">${artwork.originalBid.toLocaleString()}</p>
                      <button className="w-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-bold py-3 rounded-xl cursor-not-allowed">
                        Pujar (Bloqueado)
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