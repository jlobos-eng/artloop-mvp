import React from 'react';
import { Hammer, LineChart, ShieldCheck } from 'lucide-react';

const STEPS = [
  {
    icon: Hammer,
    title: 'Curaduría editorial',
    body: 'Seleccionamos obras originales y producimos ediciones fine-art numeradas, con papel Hahnemühle 308gsm.',
  },
  {
    icon: LineChart,
    title: 'Validación en vivo',
    body: 'Cada print vendido incrementa automáticamente el valor implícito del original. El precio responde al mercado.',
  },
  {
    icon: ShieldCheck,
    title: 'Certificado digital',
    body: 'Tu pieza llega con certificado de autenticidad firmado y trazabilidad on-chain.',
  },
];

export function HowItWorks() {
  return (
    <section id="cta-section" className="relative py-20">
      <div className="max-w-3xl">
        <p className="text-xs uppercase tracking-[0.2em] text-fuchsia-400 font-semibold">Cómo funciona</p>
        <h2 className="font-display text-3xl md:text-5xl font-bold mt-3 leading-tight">
          Una galería que se mueve con sus coleccionistas.
        </h2>
        <p className="text-slate-400 mt-4 text-lg leading-relaxed">
          Pensamos ArtLoop como una capa de validación entre artistas y un mercado global. Cada interacción
          construye prueba de demanda.
        </p>
      </div>
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        {STEPS.map((step, i) => (
          <div key={step.title} className="glass rounded-3xl p-7 relative overflow-hidden">
            <div className="text-[64px] absolute -top-2 -right-2 font-display font-bold text-white/[0.04] select-none">
              0{i + 1}
            </div>
            <step.icon size={28} className="text-fuchsia-400 mb-4" />
            <h3 className="font-display text-xl font-semibold text-white">{step.title}</h3>
            <p className="text-slate-400 mt-2 text-sm leading-relaxed">{step.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
