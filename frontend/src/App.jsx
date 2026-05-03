import React, { useCallback, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ToastProvider } from './components/Toast';
import { useDrops } from './hooks/useDrops';
import { useCurrency } from './hooks/useCurrency';
import { useRouter } from './hooks/useRouter';

import { HomePage } from './pages/HomePage';
import { ArtworkPage } from './pages/ArtworkPage';
import { ArtistPage } from './pages/ArtistPage';
import { AdminPage } from './pages/AdminPage';

function Shell() {
  const router = useRouter();
  const { drops, status, error, reload, replaceDrop } = useDrops();
  const { currency, currencies, setCurrency } = useCurrency();

  useEffect(() => {
    if (router.route === 'drop' || router.route === 'artist') {
      // ensure data is hydrated when deep-linking
      if (status === 'idle') reload();
    }
  }, [router.route, status, reload]);

  const handleNavigate = useCallback((to) => router.navigate(to), [router]);

  const renderRoute = () => {
    switch (router.route) {
      case 'admin':
        return (
          <AdminPage
            onBack={() => handleNavigate('/')}
            onCreated={() => reload({ force: true })}
          />
        );
      case 'drop':
        return (
          <ArtworkPage
            drops={drops}
            status={status}
            dropId={router.params.id}
            currency={currency}
            onBack={() => handleNavigate('/')}
            onArtist={(slug) => handleNavigate(`/artist/${slug}`)}
            onUpdateDrop={replaceDrop}
          />
        );
      case 'artist':
        return (
          <ArtistPage
            drops={drops}
            slug={router.params.slug}
            currency={currency}
            onBack={() => handleNavigate('/')}
            onOpenDrop={(id) => handleNavigate(`/drop/${id}`)}
          />
        );
      case 'home':
      default:
        return (
          <HomePage
            drops={drops}
            status={status}
            error={error}
            currency={currency}
            onOpenDrop={(id) => handleNavigate(`/drop/${id}`)}
            onOpenArtist={(slug) => handleNavigate(`/artist/${slug}`)}
            onReload={() => reload({ force: true })}
          />
        );
    }
  };

  return (
    <div className="relative min-h-dvh text-white">
      <div className="bg-mesh" aria-hidden="true" />
      <div className="bg-grid" aria-hidden="true" />

      <div className="relative z-10 flex flex-col min-h-dvh">
        <Navbar
          currency={currency}
          currencies={currencies}
          onCurrencyChange={setCurrency}
          onNavigate={handleNavigate}
          currentRoute={router.route}
        />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-6">
          {renderRoute()}
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <Shell />
    </ToastProvider>
  );
}
