'use client';

import { useState } from 'react';

const images: string[] = [
  '/typeghost.png',
  '/typeelectric.png',
  '/typepsychic.png',
  '/typefire.png',
  '/typesteel.png',
  '/typefighting-nobg.png',
  '/typenormal.png',
  '/typewater.png',
  '/typefairy.png',
  '/typedragon-nobg.png',
];

const labels: string[] = [
  'Ghost Type',
  'Electric Type',
  'Psychic Type',
  'Fire Type',
  'Steel Type',
  'Fighting Type',
  'Normal Type',
  'Water Type',
  'Fairy Type',
  'Dragon Type',
];

const ImageCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const nextImage = (): void => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = (): void => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <div className="relative w-full max-w-[50rem] h-[20rem] mx-auto bg-white/10 border-4 border-white rounded-3xl shadow-xl backdrop-blur-sm overflow-hidden flex items-center justify-center">

      <button
        onClick={prevImage}
        className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-black/60 text-white p-2 rounded-full hover:bg-black transition z-10"
      >
        &#10094;
      </button>

      <img
        src={images[currentIndex]}
        alt={`Image ${currentIndex}`}
        className="max-h-full max-w-full object-contain"
      />
      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 text-black text-xl font-pixelify-sans font-semibold bg-white/50 px-4 py-2 rounded-md">
        {labels[currentIndex]}
      </div>

      <button
        onClick={nextImage}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-black/60 text-white p-2 rounded-full hover:bg-black transition z-10"
      >
        &#10095;
      </button>
    </div>
  );
};

export default ImageCarousel;