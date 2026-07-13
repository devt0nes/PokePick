import PokemonList from '../../components/PokemonList';

export default function PokemonPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center py-12">
      <h1 className="text-5xl font-pixelify-sans font-bold text-[#1a1a1a] dark:text-white mb-8 drop-shadow-lg text-center">
        Pokédex
      </h1>
      <div className="w-full max-w-5xl bg-white/80 dark:bg-gray-900/80 rounded-3xl shadow-[0px_5px_black,0px_-5px_black,5px_0px_black,-5px_0px_black,0px_10px_#00000038,5px_5px_#00000038,-5px_5px_#00000038,inset_0px_5px_#ffffff1f,inset_0px_-5px_#00000030] p-8 border-4 border-[rgb(6,0,78)]">
        <PokemonList />
      </div>
    </div>
  );
} 