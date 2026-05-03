import React from 'react';
import { Flame, Sparkles, Lock } from 'lucide-react';

const STYLES = {
  hot:     { icon: Flame,    label: 'En tendencia',  cls: 'bg-orange-500/15 text-orange-300 border-orange-500/30' },
  early:   { icon: Sparkles, label: 'Recién subida', cls: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30' },
  live:    { icon: Sparkles, label: 'En vivo',       cls: 'bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/30' },
  soldout: { icon: Lock,     label: 'Sold out',      cls: 'bg-slate-700/40 text-slate-300 border-slate-600/40' },
};

export function StatusBadge({ status }) {
  const meta = STYLES[status] || STYLES.live;
  const Icon = meta.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest border rounded-full px-2.5 py-1 ${meta.cls}`}
    >
      <Icon size={10} />
      {meta.label}
    </span>
  );
}
