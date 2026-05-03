import React from 'react';
import { Frown, RefreshCcw } from 'lucide-react';

export function EmptyState({ title, message, action, icon: Icon = Frown }) {
  return (
    <div className="glass rounded-3xl p-10 md:p-16 text-center max-w-lg mx-auto">
      <div className="mx-auto w-14 h-14 rounded-full grid place-items-center bg-white/5 border border-white/10">
        <Icon size={26} className="text-slate-300" />
      </div>
      <h3 className="font-display text-2xl font-semibold mt-5">{title}</h3>
      {message && <p className="text-slate-400 mt-2 text-sm leading-relaxed">{message}</p>}
      {action && (
        <button onClick={action.onClick} className="btn-primary mt-6">
          <RefreshCcw size={14} />
          {action.label}
        </button>
      )}
    </div>
  );
}
