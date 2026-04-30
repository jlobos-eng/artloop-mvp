import React, { useState, useEffect } from 'react';
import { Flame, Clock, ArrowLeft, TrendingUp, ShieldCheck, PlusCircle, User, LayoutGrid } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const [activeArtworkId, setActiveArtworkId] = useState(null);
  const [activeArtist, setActiveArtist] = useState(null);
  const [drops, setDrops] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estado para el formulario de Admin
  const [newDrop, setNewDrop] = useState({ title: '', artist: '', image: '', originalBid: '', printPrice: '', totalPrints: 500 });

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

  const handleAddDrop = async (e) => {
    e.preventDefault();
    const response = await fetch('https://artloop-mvp.onrender.com/api/admin/add-drop', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newDrop)
    });
    if (response.ok) {
      alert("Obra subida con éxito");
      window.location.reload();
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
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans">
      {/* NAVBAR */}
      <nav className="sticky top-0 w-full z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 h-16 flex items-center">
        <div className="max-w-7xl mx-auto px-4 w-full flex justify-between items-center">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('home')}>
            <TrendingUp className="text-fuchsia-500" />
            <span className="font-bold text-xl tracking-tighter italic">ARTLOOP</span>
          </div>
          <div className="flex space-x-6">
            <button onClick={() => navigate('home')} className="text-sm font-medium hover:text-fuchsia-400 transition-colors">Explorar</button>
            <button onClick={() => navigate('admin')} className="text-xs bg-slate-800 px-3 py-1 rounded-full text-slate-400 hover:bg-slate-700">Admin</button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">

        {/* VISTA: HOME */}
        {currentView === 'home' && (
          <div className="animate-in fade-in duration-700">
            <header className="mb-12">
              <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">CURADURÍA<br />EXCLUSIVA</h1>
              <p className="text-slate-400 max-w-xl text-lg">Adquiere ediciones limitadas Fine Art o invierte en piezas originales cuyo valor escala con la demanda real.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {drops.map(drop => (
                <div key={drop.id} className="group relative bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 hover:border-fuchsia-500/50 transition-all shadow-2xl">
                  <div onClick={() => navigate('artwork', drop.id)} className="aspect-[4/5] overflow-hidden cursor-pointer">
                    <img src={drop.image} alt={drop.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80"></div>
                  </div>

                  <div className="p-6 absolute bottom-0 w-full">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-2xl font-bold leading-none mb-1">{drop.title}</h3>
                        <button onClick={() => navigate('artist', drop.artist)} className="text-fuchsia-400 text-sm hover:underline flex items-center">
                          <User size={14} className="mr-1" /> {drop.artist}
                        </button>
                      </div>
                      <div className="bg-fuchsia-500 text-white text-[10px] font-black px-2 py-1 rounded">HOT</div>
                    </div>
                    <div className="flex justify-between items-end mt-4 pt-4 border-t border-white/10">
                      <div>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Original</p>
                        <p className="text-xl font-bold text-cyan-400">${drop.originalBid?.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Print</p>
                        <p className="text-xl font-bold text-white">${drop.printPrice}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VISTA: PERFIL DE ARTISTA */}
        {currentView === 'artist' && (
          <div className="animate-in slide-in-from-bottom-4 duration-500">
            <button onClick={() => navigate('home')} className="flex items-center text-slate-400 hover:text-white mb-8"><ArrowLeft size={20} className="mr-2" /> Galería General</button>
            <div className="flex items-center space-x-6 mb-12">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-fuchsia-600 to-cyan-500 flex items-center justify-center text-3xl font-bold">{activeArtist[0]}</div>
              <div>
                <h1 className="text-5xl font-black">{activeArtist}</h1>
                <p className="text-slate-400">Artista Residente en ArtLoop • {drops.filter(d => d.artist === activeArtist).length} Obras</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {drops.filter(d => d.artist === activeArtist).map(drop => (
                <div key={drop.id} onClick={() => navigate('artwork', drop.id)} className="aspect-square relative rounded-xl overflow-hidden cursor-pointer group">
                  <img src={drop.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <p className="font-bold text-lg">{drop.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VISTA: ADMIN PANEL (Oculto) */}
        {currentView === 'admin' && (
          <div className="max-w-2xl mx-auto bg-slate-900 p-8 rounded-3xl border border-slate-800">
            <h2 className="text-3xl font-bold mb-6 flex items-center"><PlusCircle className="mr-2 text-fuchsia-500" /> Subir Nueva Obra</h2>
            <form onSubmit={handleAddDrop} className="space-y-4">
              <input type="text" placeholder="Título de la Obra" className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl" onChange={e => setNewDrop({ ...newDrop, title: e.target.value })} required />
              <input type="text" placeholder="Nombre del Artista" className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl" onChange={e => setNewDrop({ ...newDrop, artist: e.target.value })} required />
              <input type="text" placeholder="URL de la Imagen (Dropbox, Unsplash, etc)" className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl" onChange={e => setNewDrop({ ...newDrop, image: e.target.value })} required />
              <div className="grid grid-cols-2 gap-4">
                <input type="number" placeholder="Precio Original ($)" className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl" onChange={e => setNewDrop({ ...newDrop, originalBid: e.target.value })} required />
                <input type="number" placeholder="Precio Print ($)" className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl" onChange={e => setNewDrop({ ...newDrop, printPrice: e.target.value })} required />
              </div>
              <button type="submit" className="w-full bg-fuchsia-600 hover:bg-fuchsia-500 py-4 rounded-xl font-bold transition-all">PUBLICAR EN ARTLOOP</button>
            </form>
            <button onClick={() => navigate('home')} className="w-full mt-4 text-slate-500 hover:text-white">Cancelar</button>
          </div>
        )}

        {/* VISTA: DETALLE (ARTWORK) */}
        {currentView === 'artwork' && drops.find(d => d.id === activeArtworkId) && (() => {
          const art = drops.find(d => d.id === activeArtworkId);
          return (
            <div className="animate-in fade-in duration-500">
              <button onClick={() => navigate('home')} className="flex items-center text-slate-400 mb-8"><ArrowLeft className="mr-2" /> Volver</button>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="relative group rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
                  <img src={art.image} className="w-full object-cover" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                </div>
                <div className="flex flex-col justify-center">
                  <h1 className="text-5xl font-black mb-2 leading-none uppercase">{art.title}</h1>
                  <p className="text-2xl text-fuchsia-400 font-medium mb-8">Por {art.artist}</p>
                  <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 mb-8">
                    <div className="flex items-center mb-6">
                      <Flame className="text-orange-500 mr-2" fill="currentColor" />
                      <p className="text-xl font-bold">{art.printsSold} de {art.totalPrints} vendidas</p>
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Coleccionista Privado</p>
                        <p className="text-4xl font-bold text-cyan-400">${art.originalBid?.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Edición Fine Art</p>
                        <p className="text-4xl font-bold text-white">${art.printPrice}</p>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => handleBuyPrint(art.id)} className="w-full bg-fuchsia-600 hover:bg-fuchsia-500 text-white text-xl font-black py-6 rounded-2xl shadow-lg shadow-fuchsia-600/20 active:scale-95 transition-all">ADQUIRIR EDICIÓN LIMITADA</button>
                  <p className="text-center mt-4 text-slate-500 text-xs">Incluye Certificado de Autenticidad Digital</p>
                </div>
              </div>
            </div>
          )
        })()}

      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-900 py-10 mt-20">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-slate-600 text-sm">
          <p>© 2026 ARTLOOP LABS</p>
          <div className="flex space-x-4">
            <button onClick={() => navigate('admin')} className="hover:text-white">Admin Access</button>
          </div>
        </div>
      </footer>
    </div>
  );
}