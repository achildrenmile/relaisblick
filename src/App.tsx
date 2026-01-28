import { useState, useEffect } from 'react';
import { useRelaisData } from './hooks/useRelaisData';
import { Header } from './components/UI/Header';
import { Footer } from './components/UI/Footer';
import { LoadingSpinner } from './components/UI/LoadingSpinner';
import { ErrorMessage } from './components/UI/ErrorMessage';
import { LegalModal } from './components/UI/LegalModal';
import { SearchBar } from './components/Sidebar/SearchBar';
import { FilterPanel } from './components/Sidebar/FilterPanel';
import { RelaisList } from './components/Sidebar/RelaisList';
import { RelaisMap } from './components/Map/RelaisMap';

function App() {
  const {
    data,
    filteredRelais,
    loading,
    error,
    filters,
    setFilters,
    selectedRelais,
    setSelectedRelais,
    refetch,
  } = useRelaisData();

  // Start with sidebar closed on mobile (< 1024px)
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024;
    }
    return true;
  });
  const [legalModal, setLegalModal] = useState<'imprint' | 'privacy' | null>(null);

  // Close sidebar when selecting a relais on mobile
  useEffect(() => {
    if (selectedRelais && window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  }, [selectedRelais]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={refetch} />;
  }

  return (
    <div className="h-[100dvh] flex flex-col overflow-hidden">
      <Header
        relaisCount={data?.relais.length ?? 0}
        filteredCount={filteredRelais.length}
        lastUpdate={data?.lastUpdate}
      />

      <div className="flex-1 flex overflow-hidden relative">
        {/* Overlay for mobile when sidebar is open */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/30 z-[998]"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar Toggle Button (Mobile) */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed bottom-20 left-4 z-[1000] bg-primary-600 text-white p-3 rounded-full shadow-lg active:bg-primary-700 touch-manipulation"
          style={{ bottom: 'calc(5rem + env(safe-area-inset-bottom, 0px))' }}
          aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {sidebarOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Sidebar */}
        <aside
          className={`
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            lg:translate-x-0
            fixed lg:relative
            z-[999] lg:z-auto
            w-[85vw] max-w-[320px] sm:w-80 lg:w-96
            h-full lg:h-auto
            top-0 lg:top-auto
            bg-white
            border-r border-gray-200
            flex flex-col
            transition-transform duration-300 ease-out
            shadow-xl lg:shadow-none
          `}
        >
          {/* Mobile header spacer */}
          <div className="h-14 lg:hidden flex-shrink-0" />

          <div className="p-3 sm:p-4 border-b border-gray-200">
            <SearchBar
              value={filters.searchQuery}
              onChange={(query) =>
                setFilters((f) => ({ ...f, searchQuery: query }))
              }
            />
          </div>

          <div className="p-3 sm:p-4 border-b border-gray-200 overflow-y-auto max-h-[35vh] sm:max-h-[40%] overscroll-contain">
            <FilterPanel
              filters={filters}
              onFilterChange={setFilters}
            />
          </div>

          <div className="flex-1 overflow-y-auto p-3 sm:p-4 overscroll-contain">
            <RelaisList
              relais={filteredRelais}
              selectedRelais={selectedRelais}
              onSelectRelais={setSelectedRelais}
            />
          </div>
        </aside>

        {/* Map */}
        <main className="flex-1 relative">
          <RelaisMap
            relais={filteredRelais}
            selectedRelais={selectedRelais}
            onSelectRelais={setSelectedRelais}
          />
        </main>
      </div>

      <Footer
        lastUpdate={data?.lastUpdate}
        onOpenImprint={() => setLegalModal('imprint')}
        onOpenPrivacy={() => setLegalModal('privacy')}
      />

      {/* Legal Modals */}
      {legalModal && (
        <LegalModal type={legalModal} onClose={() => setLegalModal(null)} />
      )}
    </div>
  );
}

export default App;
