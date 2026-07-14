import PokemonList from '../../components/PokemonList';

export default function PokemonPage() {
  return (
    <div className="min-h-screen /*bg-gray-50 dark:bg-gray-900*/ flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-5xl font-pixelify-sans font-bold text-[#1a1a1a] dark:text-white mb-8 drop-shadow-lg text-center">
        Pokédex
      </h1>
      <div className="w-full max-w-5xl bg-white/80 dark:bg-gray-900/80 rounded-3xl custom-border-style">
        <PokemonList />
      </div>
    </div>
  );
} 