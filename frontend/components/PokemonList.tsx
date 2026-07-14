'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import PokemonCard from './PokemonCard';
import PokemonModal from './PokemonModal';

interface Pokemon {
  id: number;
  name: string;
  image: string;
  types: Array<{
    type: {
      name: string;
    };
  }>;
  stats: {
    hp: number;
    attack: number;
    defense: number;
    'special-attack': number;
    'special-defense': number;
    speed: number;
    [key: string]: number;
  };
}

interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Array<{
    name: string;
    url: string;
  }>;
}

const STAT_OPTIONS = [
  { key: 'hp', label: 'HP' },
  { key: 'attack', label: 'Attack' },
  { key: 'defense', label: 'Defense' },
  { key: 'special-attack', label: 'Sp. Atk' },
  { key: 'special-defense', label: 'Sp. Def' },
  { key: 'speed', label: 'Speed' },
];

// Helper type for stat keys
const STAT_KEYS = ['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed'] as const;
type StatKey = typeof STAT_KEYS[number];

export default function PokemonList() {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalLoading, setModalLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const pokemonPerPage = 20;
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [allPokemonList, setAllPokemonList] = useState<{ name: string; url: string }[]>([]);
  const [searchResults, setSearchResults] = useState<Pokemon[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const searchAbortRef = useRef<AbortController | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [typeOptions, setTypeOptions] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState('');
  const [sortStat, setSortStat] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [globalSortedPokemon, setGlobalSortedPokemon] = useState<Pokemon[] | null>(null);
  const [globalSortLoading, setGlobalSortLoading] = useState(false);
  const [displayedPokemon, setDisplayedPokemon] = useState<Pokemon[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const batchSize = 20;
  const [offset, setOffset] = useState(0);

  // Fetch all Pokemon names/URLs on mount
  useEffect(() => {
    fetch('https://pokeapi.co/api/v2/pokemon?limit=1300')
      .then((res) => res.json())
      .then((data) => setAllPokemonList(data.results));
  }, []);

  // Fetch all types on mount
  useEffect(() => {
    fetch('https://pokeapi.co/api/v2/type')
      .then((res) => res.json())
      .then((data) => setTypeOptions(data.results.map((t: any) => t.name)));
  }, []);

  // Debounced search effect
  useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    if (!search || search.length < 2) {
      setSearchResults([]);
      setSearchLoading(false);
      setSearchError(null);
      if (searchAbortRef.current) searchAbortRef.current.abort();
      return;
    }
    setSearchLoading(true);
    setSearchError(null);
    searchTimeoutRef.current = setTimeout(() => {
      const matches = allPokemonList.filter((p) => p.name.toLowerCase().includes(search.toLowerCase())).slice(0, 20);
      if (matches.length === 0) {
        setSearchResults([]);
        setSearchLoading(false);
        return;
      }
      // Abort previous search requests
      if (searchAbortRef.current) searchAbortRef.current.abort();
      const abortController = new AbortController();
      searchAbortRef.current = abortController;
      Promise.all(
        matches.map(async (p) => {
          const res = await fetch(p.url, { signal: abortController.signal });
          if (!res.ok) throw new Error('Failed to fetch');
          const detailData = await res.json();
          const stats: Pokemon['stats'] = {} as Pokemon['stats'];
          STAT_KEYS.forEach((key) => {
            stats[key] = detailData.stats.find((stat: { stat: { name: string } }) => stat.stat.name === key)?.base_stat || 0;
          });
          return {
            id: detailData.id,
            name: detailData.name,
            image: detailData.sprites.other['official-artwork'].front_default || detailData.sprites.front_default,
            types: detailData.types,
            stats,
          };
        })
      )
        .then((results) => {
          if (!abortController.signal.aborted) setSearchResults(results);
          setSearchLoading(false);
        })
        .catch((err) => {
          if (!abortController.signal.aborted) {
            setSearchError('Failed to fetch Pokémon. Please try again.');
            setSearchLoading(false);
          }
        });
    }, 400);
    // Cleanup
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
      if (searchAbortRef.current) searchAbortRef.current.abort();
    };
  }, [search, allPokemonList]);

  const fetchPokemonData = async (page: number) => {
    try {
      setLoading(true);
      setError(null);

      // Calculate offset for pagination
      const offset = (page - 1) * pokemonPerPage;
      
      // Fetch Pokemon list
      const listResponse = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=${pokemonPerPage}&offset=${offset}`
      );
      
      if (!listResponse.ok) {
        throw new Error('Failed to fetch Pokemon list');
      }

      const listData: PokemonListResponse = await listResponse.json();
      
      // Calculate total pages
      setTotalPages(Math.ceil(listData.count / pokemonPerPage));

      // Fetch detailed data for each Pokemon
      const pokemonPromises = listData.results.map(async (pokemon) => {
        const detailResponse = await fetch(pokemon.url);
        if (!detailResponse.ok) {
          throw new Error(`Failed to fetch ${pokemon.name}`);
        }
        const detailData = await detailResponse.json();

        // Extract and format stats
        const stats: Pokemon['stats'] = {} as Pokemon['stats'];
        STAT_KEYS.forEach((key) => {
          stats[key] = detailData.stats.find((stat: { stat: { name: string } }) => stat.stat.name === key)?.base_stat || 0;
        });

        return {
          id: detailData.id,
          name: detailData.name,
          image: detailData.sprites.other['official-artwork'].front_default || detailData.sprites.front_default,
          types: detailData.types,
          stats,
        };
      });

      const pokemonData = await Promise.all(pokemonPromises);
      setPokemon(pokemonData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPokemonData(currentPage);
  }, [currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Fetch extra details for modal (moves, sprites, etc.)
  const handleCardClick = async (pokemon: Pokemon) => {
    setModalLoading(true);
    try {
      const detailResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.id}`);
      if (!detailResponse.ok) throw new Error('Failed to fetch details');
      const detailData = await detailResponse.json();
      setSelectedPokemon(detailData);
      setModalOpen(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setModalLoading(false);
    }
  };

  // Effect: global sort (not searching)
  useEffect(() => {
    if (!sortStat || search.length >= 2) {
      setGlobalSortedPokemon(null);
      setGlobalSortLoading(false);
      return;
    }
    setGlobalSortLoading(true);
    // Fetch all details if not already
    const fetchAllDetails = async () => {
      const allList = allPokemonList.length ? allPokemonList : (await fetch('https://pokeapi.co/api/v2/pokemon?limit=1300').then(r => r.json()).then(d => d.results));
      const batchSize = 40;
      let allDetails: Pokemon[] = [];
      for (let i = 0; i < allList.length; i += batchSize) {
        const batch = allList.slice(i, i + batchSize);
        const batchDetails = await Promise.all(
          batch.map(async (p) => {
            const res = await fetch(p.url);
            if (!res.ok) return null;
            const detailData = await res.json();
            const stats: Pokemon['stats'] = {} as Pokemon['stats'];
            STAT_KEYS.forEach((key) => {
              stats[key] = detailData.stats.find((stat: { stat: { name: string } }) => stat.stat.name === key)?.base_stat || 0;
            });
            return {
              id: detailData.id,
              name: detailData.name,
              image: detailData.sprites.other['official-artwork'].front_default || detailData.sprites.front_default,
              types: detailData.types,
              stats,
            };
          })
        );
        allDetails = allDetails.concat(batchDetails.filter(Boolean) as Pokemon[]);
      }
      return allDetails;
    };
    fetchAllDetails().then((allDetails) => {
      if (!allDetails) {
        setGlobalSortedPokemon([]);
        setGlobalSortLoading(false);
        return;
      }
      const sorted = [...allDetails].sort((a, b) => {
        const aVal = a.stats[sortStat as StatKey] || 0;
        const bVal = b.stats[sortStat as StatKey] || 0;
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      });
      setGlobalSortedPokemon(sorted);
      setGlobalSortLoading(false);
    });
  }, [sortStat, sortOrder, search, allPokemonList]);

  // Effect: global type filter (not searching, not sorting)
  const [globalTypeFilteredPokemon, setGlobalTypeFilteredPokemon] = useState<Pokemon[] | null>(null);
  const [globalTypeLoading, setGlobalTypeLoading] = useState(false);

  useEffect(() => {
    if (!selectedType || search.length >= 2 || sortStat) {
      setGlobalTypeFilteredPokemon(null);
      setGlobalTypeLoading(false);
      return;
    }
    setGlobalTypeLoading(true);
    // Fetch all details and filter by type
    const fetchAllDetails = async () => {
      const allList = allPokemonList.length ? allPokemonList : (await fetch('https://pokeapi.co/api/v2/pokemon?limit=1300').then(r => r.json()).then(d => d.results));
      const batchSize = 40;
      let allDetails: Pokemon[] = [];
      for (let i = 0; i < allList.length; i += batchSize) {
        const batch = allList.slice(i, i + batchSize);
        const batchDetails = await Promise.all(
          batch.map(async (p) => {
            const res = await fetch(p.url);
            if (!res.ok) return null;
            const detailData = await res.json();
            const stats: Pokemon['stats'] = {} as Pokemon['stats'];
            STAT_KEYS.forEach((key) => {
              stats[key] = detailData.stats.find((stat: { stat: { name: string } }) => stat.stat.name === key)?.base_stat || 0;
            });
            return {
              id: detailData.id,
              name: detailData.name,
              image: detailData.sprites.other['official-artwork'].front_default || detailData.sprites.front_default,
              types: detailData.types,
              stats,
            };
          })
        );
        allDetails = allDetails.concat(batchDetails.filter(Boolean) as Pokemon[]);
      }
      return allDetails;
    };
    fetchAllDetails().then((allDetails) => {
      if (!allDetails) {
        setGlobalTypeFilteredPokemon([]);
        setGlobalTypeLoading(false);
        return;
      }
      const filtered = allDetails.filter((poke) =>
        poke.types.some((t) => t.type.name === selectedType)
      );
      setGlobalTypeFilteredPokemon(filtered);
      setGlobalTypeLoading(false);
    });
  }, [selectedType, search, sortStat, allPokemonList]);

  // Compute the base list to display
  let baseList: Pokemon[] = [];
  if (search && search.length >= 2) {
    baseList = searchResults;
  } else if (sortStat && globalSortedPokemon) {
    baseList = globalSortedPokemon;
  } else if (selectedType && globalTypeFilteredPokemon) {
    baseList = globalTypeFilteredPokemon;
  } else {
    baseList = pokemon;
  }

  // Apply type filter (only if not using global type filter)
  let filteredList = baseList;
  if (selectedType && !globalTypeFilteredPokemon) {
    filteredList = filteredList.filter((poke) =>
      poke.types.some((t: { type: { name: string } }) => t.type.name === selectedType)
    );
  }

  // If not using globalSortedPokemon, apply stat sort here
  if (sortStat && (!globalSortedPokemon || (search && search.length >= 2))) {
    filteredList = [...filteredList].sort((a, b) => {
      const aVal = a.stats[sortStat as StatKey] || 0;
      const bVal = b.stats[sortStat as StatKey] || 0;
      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    });
  }

  // Reset page to 1 when filters or sorts change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, sortStat, selectedType]);

  // Reset on filter/sort/search change
  useEffect(() => {
    setDisplayedPokemon([]);
    setOffset(0);
    setHasMore(true);
  }, [search, sortStat, sortOrder, selectedType]);

  // Load more Pokémon (main, filtered, or search)
  const loadMore = useCallback(async () => {
    if (loading || searchLoading || globalSortLoading || globalTypeLoading || !hasMore) return;
    
    let isSearch = search && search.length >= 2;
    let isGlobalSort = sortStat && globalSortedPokemon && !isSearch;
    let isGlobalTypeFilter = selectedType && globalTypeFilteredPokemon && !isSearch && !sortStat;
    
    if (isSearch) {
      // Search: get all matches, then slice
      const matches = allPokemonList.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
      const batch = matches.slice(offset, offset + batchSize);
      if (batch.length === 0) { setHasMore(false); return; }
      const details = await Promise.all(batch.map(async (p) => {
        const res = await fetch(p.url);
        if (!res.ok) return null;
        const detailData = await res.json();
        const stats: Pokemon['stats'] = {} as Pokemon['stats'];
        STAT_KEYS.forEach((key) => {
          stats[key] = detailData.stats.find((stat: { stat: { name: string } }) => stat.stat.name === key)?.base_stat || 0;
        });
        return {
          id: detailData.id,
          name: detailData.name,
          image: detailData.sprites.other['official-artwork'].front_default || detailData.sprites.front_default,
          types: detailData.types,
          stats,
        } as Pokemon;
      }));
      let newBatch = details.filter(Boolean) as Pokemon[];
      // Type filter
      if (selectedType) {
        newBatch = newBatch.filter((poke) => poke.types.some((t) => t.type.name === selectedType));
      }
      // Stat sort
      if (sortStat) {
        newBatch = [...newBatch].sort((a, b) => {
          const aVal = a.stats[sortStat as StatKey] || 0;
          const bVal = b.stats[sortStat as StatKey] || 0;
          return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
        });
      }
      setDisplayedPokemon((prev) => [...prev, ...newBatch]);
      setOffset((prev) => prev + batchSize);
      if (newBatch.length < batchSize) setHasMore(false);
      return;
    }
    
    if (isGlobalSort) {
      // Global sort: slice from the already sorted global data
      const startIndex = offset;
      const endIndex = startIndex + batchSize;
      const newBatch = globalSortedPokemon!.slice(startIndex, endIndex);
      
      // Apply type filter to the batch
      let filteredBatch = newBatch;
      if (selectedType) {
        filteredBatch = newBatch.filter((poke) => poke.types.some((t) => t.type.name === selectedType));
      }
      
      setDisplayedPokemon((prev) => [...prev, ...filteredBatch]);
      setOffset((prev) => prev + batchSize);
      
      // Check if we've reached the end
      if (endIndex >= globalSortedPokemon!.length || filteredBatch.length < batchSize) {
        setHasMore(false);
      }
      return;
    }
    
    if (isGlobalTypeFilter) {
      // Global type filter: slice from the already filtered global data
      const startIndex = offset;
      const endIndex = startIndex + batchSize;
      const newBatch = globalTypeFilteredPokemon!.slice(startIndex, endIndex);
      
      setDisplayedPokemon((prev) => [...prev, ...newBatch]);
      setOffset((prev) => prev + batchSize);
      
      // Check if we've reached the end
      if (endIndex >= globalTypeFilteredPokemon!.length || newBatch.length < batchSize) {
        setHasMore(false);
      }
      return;
    }
    
    // Default: use paginated API (no search, no global sort, no type filter)
    const fetchUrl = `https://pokeapi.co/api/v2/pokemon?limit=${batchSize}&offset=${offset}`;
    const listResponse = await fetch(fetchUrl);
    if (!listResponse.ok) { setHasMore(false); return; }
    const listData: PokemonListResponse = await listResponse.json();
    const details = await Promise.all(listData.results.map(async (pokemon: { name: string; url: string }) => {
      const detailResponse = await fetch(pokemon.url);
      if (!detailResponse.ok) return null;
      const detailData = await detailResponse.json();
      const stats: Pokemon['stats'] = {} as Pokemon['stats'];
      STAT_KEYS.forEach((key) => {
        stats[key] = detailData.stats.find((stat: { stat: { name: string } }) => stat.stat.name === key)?.base_stat || 0;
      });
      return {
        id: detailData.id,
        name: detailData.name,
        image: detailData.sprites.other['official-artwork'].front_default || detailData.sprites.front_default,
        types: detailData.types,
        stats,
      } as Pokemon;
    }));
    let newBatch = details.filter(Boolean) as Pokemon[];
    // Type filter
    if (selectedType) {
      newBatch = newBatch.filter((poke) => poke.types.some((t) => t.type.name === selectedType));
    }
    // Stat sort
    if (sortStat) {
      newBatch = [...newBatch].sort((a, b) => {
        const aVal = a.stats[sortStat as StatKey] || 0;
        const bVal = b.stats[sortStat as StatKey] || 0;
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      });
    }
    setDisplayedPokemon((prev) => [...prev, ...newBatch]);
    setOffset((prev) => prev + batchSize);
    if (!listData.next || newBatch.length < batchSize) setHasMore(false);
  }, [search, sortStat, sortOrder, selectedType, offset, loading, searchLoading, globalSortLoading, globalTypeLoading, hasMore, allPokemonList, globalSortedPokemon, globalTypeFilteredPokemon]);

  // Infinite scroll observer
  useEffect(() => {
    if (observer.current) observer.current.disconnect();
    observer.current = new window.IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        loadMore();
      }
    });
    if (loadMoreRef.current) observer.current.observe(loadMoreRef.current);
    return () => observer.current?.disconnect();
  }, [loadMore, hasMore]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => fetchPokemonData(currentPage)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sky-100 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Filter & Sort Controls */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
          {/* Type Filter */}
          <div className="relative w-fit">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="cursor-pointer appearance-none pl-3 pr-10 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              {typeOptions.map((type) => (
                <option key={type} value={type} className="capitalize">
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
            <svg
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          {/* Stat Sort */}
          <div className="flex gap-2 items-center">
            <div className="relative w-fit">
              <select
                value={sortStat}
                onChange={(e) => setSortStat(e.target.value)}
                className="cursor-pointer appearance-none pl-3 pr-10 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sort by Stat</option>
                {STAT_OPTIONS.map((stat) => (
                  <option key={stat.key} value={stat.key}>{stat.label}</option>
                ))}
              </select>
              <svg
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            <button
              onClick={() => setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'))}
              className="cursor-pointer px-2 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
          {/* Clear All Filters Button */}
          {(selectedType || sortStat || search) && (
            <button
              onClick={() => {
                setSelectedType('');
                setSortStat('');
                setSearch('');
                setSortOrder('desc');
              }}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-red-500 hover:bg-red-600 text-white font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Clear All Filters
            </button>
          )}
        </div>
        {/* Search Bar */}
        <div className="flex justify-center mb-8">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Pokémon by name..."
            className="w-full max-w-md px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {/* Loading State */}
        {(loading || searchLoading || globalSortLoading || globalTypeLoading) && (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              {globalSortLoading && (
                <p className="text-gray-600 dark:text-gray-400">
                  Sorting all {allPokemonList.length} Pokémon by {STAT_OPTIONS.find(s => s.key === sortStat)?.label || sortStat}...
                </p>
              )}
              {globalTypeLoading && (
                <p className="text-gray-600 dark:text-gray-400">
                  Filtering all {allPokemonList.length} Pokémon by {selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} type...
                </p>
              )}
            </div>
          </div>
        )}
        {/* Search Error */}
        {searchError && (
          <div className="text-center text-red-500 mb-4">{searchError}</div>
        )}
        {/* Pokemon Grid */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-6 mb-8">
          {displayedPokemon.map((poke, idx) => (
            <PokemonCard
              key={poke.id ? poke.id : `${poke.name}-${idx}`}
              id={poke.id}
              name={poke.name}
              image={poke.image}
              types={poke.types}
              stats={poke.stats}
              onClick={() => handleCardClick(poke)}
            />
          ))}
        </div>
        {/* Infinite scroll trigger */}
        <div ref={loadMoreRef} className="h-12"></div>

        {modalLoading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-xl">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-700 dark:text-gray-300">
                Loading Pokémon...
              </p>
            </div>
          </div>
        )}
        {/* Modal */}
        {modalOpen && selectedPokemon && (
          <PokemonModal
            pokemon={selectedPokemon}
            onClose={() => setModalOpen(false)}
          />
        )}
      </div>
    </div>
  );
} 