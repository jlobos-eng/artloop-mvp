import React from 'react';

export function DropCardSkeleton() {
  return (
    <div className="card flex flex-col">
      <div className="aspect-[4/5] skeleton" />
      <div className="p-6 space-y-4">
        <div className="skeleton h-5 w-3/4" />
        <div className="skeleton h-3 w-1/2" />
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="skeleton h-12" />
          <div className="skeleton h-12" />
        </div>
      </div>
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="space-y-4 max-w-3xl">
      <div className="skeleton h-12 w-1/3 rounded-full" />
      <div className="skeleton h-16 w-full rounded-2xl" />
      <div className="skeleton h-16 w-3/4 rounded-2xl" />
      <div className="skeleton h-6 w-1/2 rounded-full mt-6" />
    </div>
  );
}
