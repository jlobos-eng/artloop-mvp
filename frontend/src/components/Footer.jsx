import React from 'react';
import { Logo } from './Logo';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative z-10 mt-24 border-t border-white/5 bg-gradient-to-b from-transparent to-black/60">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <Logo />
          <p className="mt-3 text-slate-400 text-sm leading-relaxed max-w-xs">
            Curaduría exclusiva de ediciones limitadas validadas en tiempo real por el mercado.
          </p>
        </div>
        <FooterCol title="Plataforma" items={['Explorar', 'Cómo funciona', 'Curaduría', 'Artistas']} />
        <FooterCol title="Empresa" items={['Sobre ArtLoop', 'Términos', 'Privacidad', 'Contacto']} />
      </div>
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-5 flex flex-col md:flex-row gap-2 items-center justify-between text-xs text-slate-500">
          <p>© {year} ArtLoop · Todos los derechos reservados.</p>
          <p className="font-semibold tracking-widest text-slate-400">
            HECHO EN <span className="gradient-text">CHILE</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }) {
  return (
    <div>
      <p className="text-[11px] tracking-widest text-slate-400 font-bold uppercase mb-4">{title}</p>
      <ul className="space-y-2.5 text-sm">
        {items.map((item) => (
          <li key={item}>
            <a className="text-slate-300 hover:text-white transition-colors cursor-pointer">{item}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
