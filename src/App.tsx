import { useState } from 'react';
import { useRelaisData } from './hooks/useRelaisData';
import { Header } from './components/UI/Header';
import { LoadingSpinner } from './components/UI/LoadingSpinner';
import { ErrorMessage } from './components/UI/ErrorMessage';
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

  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={refetch} />;
  }

  return (
    <div className="h-screen flex flex-col">
      <Header
        relaisCount={data?.relais.length ?? 0}
        filteredCount={filteredRelais.length}
        lastUpdate={data?.lastUpdate}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Toggle Button (Mobile) */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed bottom-4 left-4 z-[1000] bg-primary-600 text-white p-3 rounded-full shadow-lg"
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
            w-80 lg:w-96
            h-[calc(100%-60px)] lg:h-auto
            bg-white
            border-r border-gray-200
            flex flex-col
            transition-transform duration-300
            shadow-lg lg:shadow-none
          `}
        >
          <div className="p-4 border-b border-gray-200">
            <SearchBar
              value={filters.searchQuery}
              onChange={(query) =>
                setFilters((f) => ({ ...f, searchQuery: query }))
              }
            />
          </div>

          <div className="p-4 border-b border-gray-200 overflow-y-auto max-h-[40%]">
            <FilterPanel
              filters={filters}
              onFilterChange={setFilters}
            />
          </div>

          <div className="flex-1 overflow-y-auto p-4">
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
    </div>
  );
}

export default App;
