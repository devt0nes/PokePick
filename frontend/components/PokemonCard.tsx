import Image from 'next/image';

interface PokemonStats {
  attack: number;
  defense: number;
  'special-attack': number;
  'special-defense': number;
  speed: number;
  hp: number;
}

interface PokemonType {
  type: {
    name: string;
  };
}

interface PokemonCardProps {
  id: number;
  name: string;
  image: string;
  types: PokemonType[];
  stats: PokemonStats;
  onClick?: () => void;
}

const typeColors: { [key: string]: string } = {
  normal: 'bg-gray-400',
  fire: 'bg-red-500',
  water: 'bg-blue-500',
  electric: 'bg-yellow-400',
  grass: 'bg-green-500',
  ice: 'bg-cyan-300',
  fighting: 'bg-red-700',
  poison: 'bg-purple-500',
  ground: 'bg-yellow-600',
  flying: 'bg-indigo-400',
  psychic: 'bg-pink-500',
  bug: 'bg-green-400',
  rock: 'bg-yellow-800',
  ghost: 'bg-purple-700',
  dragon: 'bg-indigo-700',
  dark: 'bg-zinc-950',
  steel: 'bg-gray-500',
  fairy: 'bg-pink-300',
};

export default function PokemonCard({ id, name, image, types, stats, onClick }: PokemonCardProps) {
  const safeImage = image || '/placeholder.png';
  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 transform hover:scale-110 transition-transform duration-200 group flex flex-col h-full"
      onClick={onClick}
      style={onClick ? { cursor: 'pointer' } : {}}
    >
      {/* Pokemon Image */}
      <div className="relative h-48 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center transition-transform duration-200 group-hover:scale-100">
        <Image
          src={safeImage}
          alt={name}
          width={140}
          height={140}
          className="object-contain transition-transform duration-200 group-hover:scale-105"
          priority={id <= 20}
        />
        <div className="absolute top-2 right-2 bg-gray-800 text-white text-xs px-2 py-1 rounded-full">
          #{id.toString().padStart(3, '0')}
        </div>
      </div>

      {/* Pokemon Info */}
      <div className="p-4 flex flex-col flex-1">
        {/* Name + Types */}
        <div className="flex-1 flex flex-col justify-center">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white capitalize mb-2 text-center">
            {name}
          </h3>

          <div className="flex justify-center gap-2 mb-4">
            {types.map((type, index) => (
              <span
                key={index}
                className={`${typeColors[type.type.name] || 'bg-gray-400'} text-white text-xs px-2 py-1 rounded-full font-medium uppercase`}
              >
                {type.type.name.toUpperCase()}
              </span>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600 dark:text-gray-400">HP</span>
            <div className="flex-1 mx-2">
              <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-pink-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(stats.hp / 255) * 100}%` }}
                ></div>
              </div>
            </div>
            <span className="text-xs font-medium text-gray-800 dark:text-white w-8 text-right">
              {stats.hp}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600 dark:text-gray-400">ATK</span>
            <div className="flex-1 mx-2">
              <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-red-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(stats.attack / 255) * 100}%` }}
                ></div>
              </div>
            </div>
            <span className="text-xs font-medium text-gray-800 dark:text-white w-8 text-right">
              {stats.attack}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600 dark:text-gray-400">DEF</span>
            <div className="flex-1 mx-2">
              <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(stats.defense / 255) * 100}%` }}
                ></div>
              </div>
            </div>
            <span className="text-xs font-medium text-gray-800 dark:text-white w-8 text-right">
              {stats.defense}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600 dark:text-gray-400">SP.ATK</span>
            <div className="flex-1 mx-2">
              <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(stats['special-attack'] / 255) * 100}%` }}
                ></div>
              </div>
            </div>
            <span className="text-xs font-medium text-gray-800 dark:text-white w-8 text-right">
              {stats['special-attack']}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600 dark:text-gray-400">SP.DEF</span>
            <div className="flex-1 mx-2">
              <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(stats['special-defense'] / 255) * 100}%` }}
                ></div>
              </div>
            </div>
            <span className="text-xs font-medium text-gray-800 dark:text-white w-8 text-right">
              {stats['special-defense']}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600 dark:text-gray-400">SPD</span>
            <div className="flex-1 mx-2">
              <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(stats.speed / 255) * 100}%` }}
                ></div>
              </div>
            </div>
            <span className="text-xs font-medium text-gray-800 dark:text-white w-8 text-right">
              {stats.speed}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
