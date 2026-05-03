import React from 'react';
import { Clock } from 'lucide-react';
import { useCountdown } from '../hooks/useCountdown';
import { formatRemaining } from '../utils/format';

export function Countdown({ endsAt, fallback }) {
  const remaining = useCountdown(endsAt);

  if (!endsAt) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs">
        <Clock size={12} className="opacity-70" />
        {fallback || '24h 00m'}
      </span>
    );
  }

  const closed = remaining <= 0;
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-semibold tabular-nums ${
        closed ? 'text-rose-300' : 'text-slate-100'
      }`}
    >
      <Clock size={12} className={closed ? 'text-rose-400' : 'text-cyan-400'} />
      {closed ? 'Cerrado' : formatRemaining(remaining)}
    </span>
  );
}
