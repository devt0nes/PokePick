'use client';

import React, { useState, useEffect } from 'react';

interface TeamPokemon {
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
  };
  moves: string[];
}

export default function TeamSidebar() {
  const [collapsed, setCollapsed] = useState(true);
  const [team, setTeam] = useState<TeamPokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch team from backend
  const fetchTeam = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/team`);
      if (!response.ok) throw new Error('Failed to fetch team');
      const data = await response.json();
      setTeam(data.team || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load team');
    } finally {
      setLoading(false);
    }
  };

  // Remove Pokémon from team
  const removeFromTeam = async (id: number) => {
    try {
      const response = await fetch('http://localhost:4000/api/team/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) throw new Error('Failed to remove Pokémon');
      const data = await response.json();
      setTeam(data.team || []);
      // Notify other components
      window.dispatchEvent(new CustomEvent('teamUpdated'));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove Pokémon');
    }
  };

  // Clear entire team
  const clearTeam = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/team/clear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to clear team');
      const data = await response.json();
      setTeam(data.team || []);
      // Notify other components
      window.dispatchEvent(new CustomEvent('teamUpdated'));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear team');
    }
  };

  // Load team on mount
  useEffect(() => {
    fetchTeam();

    // Listen for team updates from other components
    const handleTeamUpdate = () => {
      fetchTeam();
    };

    window.addEventListener('teamUpdated', handleTeamUpdate);

    return () => {
      window.removeEventListener('teamUpdated', handleTeamUpdate);
    };
  }, []);

  return (
    <aside className={`fixed right-0 top-18 bottom-4 z-40 bg-sky-50 bg-[url('/pokemongrasssprite.jpg')] bg-cover bg-center /* dark:bg-[rgb(6,0,78)] */ border-y-4 border-l-4 border-2 border-[rgb(6,0,78)] shadow-[inset_2px_2px_0px_rgba(255,255,255,0.35),inset_-2px_-2px_0px_rgba(0,0,0,0.35),4px_4px_0px_rgba(0,0,0,0.25)] rounded-l-2xl transition-all duration-300 ${collapsed ? 'w-14' : 'w-72'} flex flex-col shadow-2xl overflow-hidden`}>
      <div className="flex items-center justify-between p-4 border-b-2 border-sky-200/60 bg-sky-100/50">
        <span className={`font-pixelify-sans font-bold text-xl uppercase tracking-wider text-[rgb(6,0,78)] transition-opacity duration-300 ${collapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'} /*whitespace-nowrap overflow-hidden transition-all duration-300 ${collapsed ? 'opacity-0 max-w-0' : 'opacity-100 max-w-40'}*/`}>My Team</span>
        <button
          onClick={() => setCollapsed((c) => !c)}
          className={`p-1 rounded-lg hover:bg-sky-200/50 text-[rgb(6,0,78)] focus:outline-none transition-all duration-300 ${collapsed ? 'absolute left-1/2 transform -translate-x-1/2' : 'ml-2'}`}
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          {collapsed ? (
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6" /></svg>
          ) : (
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" /></svg>
          )}
        </button>
      </div>
      <div className={`flex-1 p-4 overflow-y-auto transition-opacity duration-300 ${collapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-sm mb-2">{error}</div>
        ) : team.length === 0 ? (
          <div className="text-gray-500 text-center font-pixelify-sans">Your team is empty.</div>
        ) : (
          <div className="space-y-3">
            <div className="text-sm text-gray-600 font-pixelify-sans mb-2">
              {team.length}/6 Pokémon
            </div>
            {team.map((pokemon) => (
              <div key={pokemon.id} className="bg-white/80 rounded-xl p-3 border-2 border-sky-200/60 hover:border-sky-300 transition-all shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <img
                      src={pokemon.image || '/placeholder.png'}
                      alt={pokemon.name}
                      className="w-8 h-8 rounded"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.png';
                      }}
                    />
                    <span className="font-pixelify-sans font-bold text-base capitalize text-gray-800">
                      {pokemon.name}
                    </span>
                  </div>
                  <button
                    onClick={() => removeFromTeam(pokemon.id)}
                    className="text-red-500 hover:text-red-700 text-lg font-bold"
                    title="Remove from team"
                  >
                    ×
                  </button>
                </div>
                <div className="flex gap-1 mb-2">
                  {pokemon.types.map((type, index) => (
                    <span
                      key={index}
                      className="text-xs px-2 py-0.5 rounded font-pixelify-sans bg-sky-100 text-sky-800 border border-sky-200/50 uppercase"
                    >
                      {type.type.name}
                    </span>
                  ))}
                </div>
                <div className="text-xs text-gray-600 font-pixelify-sans">
                  <div className="font-semibold mb-1 text-[rgb(6,0,78)]">Moves:</div>
                  <div className="space-y-1 pl-1">
                    {pokemon.moves.map((move, index) => (
                      <div key={index} className="capitalize">{move}</div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            {team.length > 0 && (
              <button
                onClick={clearTeam}
                className="w-full mt-3 bg-red-500 hover:bg-red-600 text-white font-pixelify-sans py-2 px-3 rounded-lg border-2 border-[rgb(6,0,78)] shadow-[2px_2px_0px_rgba(6,0,78,1)] active:translate-y-[2px] active:shadow-none transition-all"
              >
                Clear Team
              </button>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}