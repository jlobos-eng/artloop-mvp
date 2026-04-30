import React, { useState, useEffect } from 'react';
import { Flame, Clock, ArrowLeft, TrendingUp, ShieldCheck, PlusCircle, User, LayoutGrid, Image as ImageIcon } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const [activeArtworkId, setActiveArtworkId] = useState(null);
  const [activeArtist, setActiveArtist] = useState(null);
  const [drops, setDrops] = useState([]);
  const [loading, setLoading] = useState(true);

  // ESTADOS NUEVOS
  const [currency, setCurrency] = useState('USD');
  const [isSubmitting, setIsSubmitting] = useState(false); // Estado de carga del botón

  const [newDrop, setNewDrop] = useState({ title: '', artist: '', image: '', originalBid: '', printPrice: '', totalPrints: 500 });
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetch('https://artloop-mvp.onrender.com/api/drops')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setDrops(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const navigate = (view, id = null) => {
    setCurrentView(view);
    if (view === 'artwork') setActiveArtworkId(id);
    if (view === 'artist') setActiveArtist(id);
    window.scrollTo(0, 0);
  };

  const formatPrice = (usdPrice) => {
    if (!usdPrice) return "0";
    const rates = { USD: 1, CLP: 950, EUR: 0.92 };
    const symbols = { USD: '$', CLP: '$', EUR: '€' };
    const converted = usdPrice * rates[currency];
    return `${symbols[currency]}${converted.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewDrop({ ...newDrop, image: reader.result });
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // FUNCIÓN DE SUBIDA MEJORADA (Con Feedback Visual)
  const handleAddDrop = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('https://artloop-mvp.onrender.com/api/admin/add-drop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDrop)
      });

      if (response.ok) {
        alert("✅ Obra subida con éxito");
        window.location.reload();
      } else {
        alert("❌ Error al subir. Probablemente la imagen es muy pesada (Límite 1MB).");
      }
    } catch (error) {
      alert("❌ Error de conexión con el servidor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBuyPrint = async (dropId) => {
    const response = await fetch(`https://artloop-mvp.onrender.com/api/drops/${dropId}/buy-print`, { method: 'POST' });
    const data = await response.json();
    if (data.success) {
      setDrops(drops.map(d => d.id === dropId ? data.drop : d));
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans flex flex-col">
      <nav className="sticky top-0 w-full z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 h-16 flex items-center">
        <div className="max-w-7xl mx-auto px-4 w-full flex justify-between items-center">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('home')}>
            <TrendingUp className="text-fuchsia-500" />
            <span className="font-bold text-xl tracking-tighter">ART<span className="text-fuchsia-500">LOOP</span></span>
          </div>

          <div className="flex items-center space-x-6">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-slate-950 text-slate-300 text-xs font-bold rounded-lg px-3 py-2 border border-slate-700 outline-none focus:border-fuchsia-500"
            >
              <option value="USD">USD</option>
              <option value="CLP">CLP</option>
              <option value="EUR">EUR</option>
            </select>
            <button onClick={() => navigate('home')} className="hidden md:block text-sm font-medium hover:text-fuchsia-400 transition-colors">Explorar</button>
            <button onClick={() => navigate('admin')} className="text-xs bg-slate-800 px-3 py-2 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white transition-colors">Admin</button>
          </div>
        </div>
      </nav>

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 py-8">

        {/* VISTA HOME */}
        {currentView === 'home' && (
          <div className="animate-in fade-in duration-700">
            <header className="mb-12">
              <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">Curaduría Exclusiva</h1>
              <p className="text-slate-400 max-w-xl text-lg">
                Adquiere ediciones limitadas o invierte en piezas originales validadas en tiempo real por el mercado.
              </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {drops.map(drop => (
                <div key={drop.id} className="group relative bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 hover:border-fuchsia-500/50 transition-all shadow-2xl flex flex-col">
                  <div onClick={() => navigate('artwork', drop.id)} className="aspect-[4/5] overflow-hidden cursor-pointer relative">
                    <img src={drop.image} alt={drop.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute top-3 right-3 bg-black/80 px-2 py-1 rounded text-xs font-bold border border-slate-700 text-slate-300 flex items-center">
                      <Clock size={12} className="mr-1" /> {drop.timeLeft || '24h 00m'}
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-grow">
                    <div className="mb-4">
                      <h3 className="text-2xl font-bold leading-tight mb-1">{drop.title}</h3>
                      <button onClick={() => navigate('artist', drop.artist)} className="text-slate-400 text-sm hover:text-fuchsia-400 flex items-center transition-colors">
                        <User size={14} className="mr-1" /> {drop.artist}
                      </button>
                    </div>

                    <div className="mt-auto bg-slate-950/80 rounded-xl p-4 border border-slate-800 flex justify-between items-center">
                      <div>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1 flex items-center">Original <TrendingUp size={10} className="ml-1 text-cyan-400" /></p>
                        <p className="text-xl font-bold text-cyan-400">{formatPrice(drop.originalBid)}</p>
                      </div>
                      <div className="w-px h-10 bg-slate-800 mx-4"></div>
                      <div className="text-right">
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Print Limited</p>
                        <p className="text-xl font-bold text-white">{formatPrice(drop.printPrice)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VISTA ADMIN */}
        {currentView === 'admin' && (
          <div className="max-w-2xl mx-auto bg-slate-900 p-8 rounded-3xl border border-slate-800">
            <h2 className="text-3xl font-bold mb-6 flex items-center"><PlusCircle className="mr-2 text-fuchsia-500" /> Subir Nueva Obra</h2>
            <form onSubmit={handleAddDrop} className="space-y-4">
              <input type="text" placeholder="Título de la Obra" className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl focus:border-fuchsia-500 outline-none" onChange={e => setNewDrop({ ...newDrop, title: e.target.value })} required />
              <input type="text" placeholder="Nombre del Artista" className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl focus:border-fuchsia-500 outline-none" onChange={e => setNewDrop({ ...newDrop, artist: e.target.value })} required />

              <div className="w-full bg-slate-950 border-2 border-dashed border-slate-800 p-6 rounded-xl text-center hover:border-fuchsia-500 transition-colors relative cursor-pointer">
                <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" required />
                <div className="flex flex-col items-center pointer-events-none">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="h-32 object-contain mb-2 rounded" />
                  ) : (
                    <ImageIcon size={32} className="text-slate-600 mb-2" />
                  )}
                  <p className="text-slate-400 font-medium">{imagePreview ? "Imagen lista. Haz clic para cambiar." : "Haz clic para subir imagen desde tu PC"}</p>
                  <p className="text-xs text-slate-600 mt-1">Formatos JPG, PNG. (Recomendado: Menos de 1MB)</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <span className="absolute left-3 top-3 text-slate-500">$</span>
                  <input type="number" placeholder="Valor Original (USD)" className="w-full bg-slate-950 border border-slate-800 p-3 pl-8 rounded-xl focus:border-fuchsia-500 outline-none" onChange={e => setNewDrop({ ...newDrop, originalBid: e.target.value })} required />
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-slate-500">$</span>
                  <input type="number" placeholder="Precio Print (USD)" className="w-full bg-slate-950 border border-slate-800 p-3 pl-8 rounded-xl focus:border-fuchsia-500 outline-none" onChange={e => setNewDrop({ ...newDrop, printPrice: e.target.value })} required />
                </div>
              </div>

              {/* BOTON INTELIGENTE DE CARGA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 rounded-xl font-bold transition-all mt-4 flex justify-center items-center ${isSubmitting
                    ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                    : 'bg-fuchsia-600 hover:bg-fuchsia-500 text-white shadow-[0_0_15px_rgba(217,70,239,0.3)]'
                  }`}
              >
                {isSubmitting ? (
                  <><span className="animate-spin mr-2">⏳</span> PROCESANDO SUBIDA...</>
                ) : (
                  'PUBLICAR EN ARTLOOP'
                )}
              </button>
            </form>
            {/* BOTON DE CANCELAR CORREGIDO */}
            <button type="button" onClick={() => navigate('home')} className="w-full mt-4 text-slate-500 hover:text-white">Cancelar</button>
          </div>
        )}

        {/* VISTA ARTWORK */}
        {currentView === 'artwork' && drops.find(d => d.id === activeArtworkId) && (() => {
          const art = drops.find(d => d.id === activeArtworkId);
          return (
            <div className="animate-in fade-in duration-500">
              <button onClick={() => navigate('home')} className="flex items-center text-slate-400 hover:text-white mb-8 transition-colors"><ArrowLeft className="mr-2" /> Volver</button>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="relative group rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
                  <img src={art.image} className="w-full object-cover" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                </div>
                <div className="flex flex-col justify-center">
                  <h1 className="text-4xl md:text-5xl font-black mb-2 leading-tight">{art.title}</h1>
                  <button onClick={() => navigate('artist', art.artist)} className="text-xl text-fuchsia-400 font-medium mb-8 hover:underline text-left">Por {art.artist}</button>

                  <div className="bg-slate-900/50 p-8 rounded-3xl border border-slate-800 mb-8">
                    <div className="flex items-center mb-8 bg-slate-950 p-4 rounded-2xl border border-slate-800/50">
                      <Flame className="text-orange-500 mr-3" size={28} fill="currentColor" />
                      <div>
                        <p className="text-xl font-bold text-white leading-none">{art.printsSold} de {art.totalPrints} vendidas</p>
                        <p className="text-xs text-slate-400 mt-1">Generando tracción global.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800">
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2 flex items-center"><TrendingUp size={12} className="mr-2 text-cyan-400" /> Inversión Original</p>
                        <p className="text-3xl md:text-4xl font-bold text-cyan-400">{formatPrice(art.originalBid)}</p>
                      </div>
                      <div className="bg-slate-950 p-6 rounded-2xl border border-fuchsia-900/30">
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2 flex items-center"><LayoutGrid size={12} className="mr-2 text-fuchsia-400" /> Edición Fine Art</p>
                        <p className="text-3xl md:text-4xl font-bold text-white">{formatPrice(art.printPrice)}</p>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => handleBuyPrint(art.id)} className="w-full bg-fuchsia-600 hover:bg-fuchsia-500 text-white text-xl font-black py-6 rounded-2xl shadow-[0_0_20px_rgba(217,70,239,0.3)] active:scale-95 transition-all">
                    ADQUIRIR EDICIÓN LIMITADA
                  </button>
                  <p className="text-center mt-4 text-slate-500 text-xs flex justify-center items-center"><ShieldCheck size={14} className="mr-1" /> Incluye Certificado de Autenticidad Digital</p>
                </div>
              </div>
            </div>
          )
        })()}

        {/* VISTA ARTISTA */}
        {currentView === 'artist' && (
          <div className="animate-in slide-in-from-bottom-4 duration-500">
            <button onClick={() => navigate('home')} className="flex items-center text-slate-400 hover:text-white mb-8 transition-colors"><ArrowLeft size={20} className="mr-2" /> Galería General</button>
            <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6 mb-12 border-b border-slate-800 pb-10">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-fuchsia-600 to-cyan-500 flex items-center justify-center text-4xl font-black shadow-lg shadow-fuchsia-500/20">{activeArtist[0]}</div>
              <div>
                <h1 className="text-4xl md:text-5xl font-black">{activeArtist}</h1>
                <p className="text-slate-400 mt-2 font-medium">Artista Residente en ArtLoop • {drops.filter(d => d.artist === activeArtist).length} Obras Disponibles</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {drops.filter(d => d.artist === activeArtist).map(drop => (
                <div key={drop.id} onClick={() => navigate('artwork', drop.id)} className="aspect-square relative rounded-2xl overflow-hidden cursor-pointer group shadow-xl">
                  <img src={drop.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity"></div>
                  <div className="absolute bottom-0 left-0 p-4">
                    <p className="font-bold text-white text-lg leading-tight mb-1">{drop.title}</p>
                    <p className="text-cyan-400 font-bold text-sm">{formatPrice(drop.originalBid)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center justify-center text-slate-500 text-sm space-y-2">
          <p className="font-bold tracking-widest text-slate-400">2026 ARTLOOP</p>
          <p className="flex items-center">Neurostrategia 🇨🇱</p>
        </div>
      </footer>
    </div>
  );
}