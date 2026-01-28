import { useState, useEffect, useCallback } from 'react';
import { RelaisData, Relais, FilterState } from '../types/relais';

interface UseRelaisDataResult {
  data: RelaisData | null;
  filteredRelais: Relais[];
  loading: boolean;
  error: string | null;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  selectedRelais: Relais | null;
  setSelectedRelais: (relais: Relais | null) => void;
  refetch: () => Promise<void>;
}

const initialFilters: FilterState = {
  band: [],
  typ: [],
  bundesland: [],
  status: ['aktiv'],
  searchQuery: '',
};

export function useRelaisData(): UseRelaisDataResult {
  const [data, setData] = useState<RelaisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [selectedRelais, setSelectedRelais] = useState<Relais | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/data/relais.json');
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
      const jsonData: RelaisData = await response.json();
      setData(jsonData);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unbekannter Fehler';
      setError(`Fehler beim Laden der Relaisdaten: ${message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredRelais = filterRelais(data?.relais ?? [], filters);

  return {
    data,
    filteredRelais,
    loading,
    error,
    filters,
    setFilters,
    selectedRelais,
    setSelectedRelais,
    refetch: fetchData,
  };
}

function filterRelais(relais: Relais[], filters: FilterState): Relais[] {
  return relais.filter((r) => {
    // Band Filter
    if (filters.band.length > 0 && !filters.band.includes(r.band)) {
      return false;
    }

    // Typ Filter
    if (filters.typ.length > 0 && !filters.typ.includes(r.typ)) {
      return false;
    }

    // Bundesland Filter
    if (filters.bundesland.length > 0 && !filters.bundesland.includes(r.bundesland)) {
      return false;
    }

    // Status Filter
    if (filters.status.length > 0 && !filters.status.includes(r.status)) {
      return false;
    }

    // Suchfilter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const searchableText = [
        r.rufzeichen,
        r.standort,
        r.bundesland,
        r.qth,
        r.betreiber,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      if (!searchableText.includes(query)) {
        return false;
      }
    }

    return true;
  });
}

export default useRelaisData;
