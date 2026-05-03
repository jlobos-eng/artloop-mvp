import React, { useEffect, useState } from 'react';
import { Globe2, Menu, ShieldCheck, Sparkles, X } from 'lucide-react';
import { Logo } from './Logo';

export function Navbar({ currency, currencies, onCurrencyChange, onNavigate, currentRoute }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [currentRoute]);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'backdrop-blur-xl bg-[#07040d]/80 border-b border-white/5'
          : 'backdrop-blur-md bg-transparent border-b border-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-4">
        <Logo onClick={() => onNavigate('/')} />

        <div className="hidden md:flex items-center gap-1">
          <NavLink active={currentRoute === 'home'} onClick={() => onNavigate('/')}>
            <Sparkles size={14} className="opacity-60" /> Explorar
          </NavLink>
          <NavLink onClick={() => document.getElementById('cta-section')?.scrollIntoView({ behavior: 'smooth' })}>
            Cómo funciona
          </NavLink>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 glass rounded-full px-1.5 py-1 text-xs">
            <Globe2 size={14} className="text-slate-400 ml-1" />
            {currencies.map((code) => (
              <button
                key={code}
                onClick={() => onCurrencyChange(code)}
                className={`px-2.5 py-1 rounded-full font-semibold tracking-wide transition-colors ${
                  currency === code
                    ? 'bg-white text-slate-900'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {code}
              </button>
            ))}
          </div>

          <button
            onClick={() => onNavigate('/admin')}
            className="hidden md:inline-flex btn-ghost text-xs"
            aria-label="Panel admin"
          >
            <ShieldCheck size={14} />
            Admin
          </button>

          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden btn-ghost p-2"
            aria-expanded={mobileOpen}
            aria-label="Abrir menú"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div
        className={`md:hidden overflow-hidden transition-[max-height,opacity] duration-300 ${
          mobileOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 pb-4 space-y-3 border-t border-white/5 bg-[#07040d]/95 backdrop-blur-xl">
          <button onClick={() => onNavigate('/')} className="w-full text-left btn-ghost justify-start">
            Explorar
          </button>
          <button onClick={() => onNavigate('/admin')} className="w-full text-left btn-ghost justify-start">
            <ShieldCheck size={14} />
            Panel Admin
          </button>
          <div className="flex items-center gap-1.5 glass rounded-full px-1.5 py-1 text-xs w-fit">
            {currencies.map((code) => (
              <button
                key={code}
                onClick={() => onCurrencyChange(code)}
                className={`px-2.5 py-1 rounded-full font-semibold ${
                  currency === code ? 'bg-white text-slate-900' : 'text-slate-300'
                }`}
              >
                {code}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}

function NavLink({ children, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-sm font-medium inline-flex items-center gap-1.5 transition-colors ${
        active ? 'text-white bg-white/10' : 'text-slate-300 hover:text-white hover:bg-white/5'
      }`}
    >
      {children}
    </button>
  );
}
