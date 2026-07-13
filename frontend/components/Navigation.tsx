'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';

const Navigation = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement | null>(null);

  const isActive = (path: string) => pathname === path;

  const linkClasses = (path: string) =>
    `block text-center font-pixelify-sans uppercase tracking-widest py-4 px-8 text-sm sm:text-lg transition-all duration-200 hover:bg-[#7200009b] hover:text-white hover:shadow-lg ${
      isActive(path) ? 'bg-[#7200007b] text-white shadow-lg' : 'text-[#720000]'
    }`;

  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    closeMenu();
  }, [pathname]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
      if (!isMenuOpen || !navRef.current) {
        return;
      }

      if (!navRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [isMenuOpen]);

  const toggleAudio = async () => {
    if (!audioRef.current) {
      audioRef.current = new Audio('/themesong.mp3');
      audioRef.current.loop = true;
    }

    const audio = audioRef.current;

    if (!audio.paused) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    try {
      await audio.play();
      setIsPlaying(true);
    } catch(err) {
      console.error('Audio failed to play:', err);
      setIsPlaying(false);
    }
  };

  return (
    <header ref={navRef} className="top-0 left-0 w-full bg-[#f5f5f572] z-50">
      <nav className="w-full">
        <div className="relative flex items-center justify-between sm:justify-center px-4 sm:px-0">
          <button
            type="button"
            className="sm:hidden inline-flex items-center justify-center p-2 text-[#720000]"
            aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          <ul className="list-none hidden sm:flex">
            <li>
            <Link href="/" className={linkClasses('/')}>
              Home
            </Link>
          </li>
          <li>
            <Link href="/pokedex" className={linkClasses('/pokedex')}>
              Pokédex
            </Link>
          </li>

          <li className="py-4 px-8 flex items-center justify-center">
            <button
              type="button"
              onClick={toggleAudio}
              aria-label={isPlaying ? 'Pause' : 'Play'}
              aria-pressed={isPlaying}
              className="cursor-pointer flex items-center justify-center leading-none p-0"
            >
              <Image
                src={isPlaying ? '/pokeball-open.png' : '/pokeball.png'}
                alt="Pokeball"
                width={20}
                height={20}
                className="w-5 h-5 sm:w-7 sm:h-7 transition-transform transform hover:scale-110"
              />
            </button>
          </li>

          <li>
            <Link href="/contact" className={linkClasses('/contact')}>
              Contact
            </Link>
          </li>
          <li>
            <Link href="/admin" className={linkClasses('/admin')}>
              Admin
            </Link>
          </li>
          </ul>

          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3">
            <div className="sm:hidden">
              <button
                type="button"
                onClick={toggleAudio}
                aria-label={isPlaying ? 'Pause' : 'Play'}
                aria-pressed={isPlaying}
                className="cursor-pointer flex items-center justify-center leading-none p-0"
              >
                <Image
                  src={isPlaying ? '/pokeball-open.png' : '/pokeball.png'}
                  alt="Pokeball"
                  width={20}
                  height={20}
                  className="w-6 h-6 transition-transform transform hover:scale-110"
                />
              </button>
            </div>
            <ThemeToggle />
          </div>
        </div>

        <div
          className={`sm:hidden overflow-hidden border-t border-[#72000033] bg-[#f8e8e8e8] transition-[max-height,opacity] duration-200 ${
            isMenuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
          }`}
          style={{ transitionTimingFunction: 'steps(5, end)' }}
        >
          <ul className="list-none">
            <li>
              <Link href="/" className={linkClasses('/')} onClick={closeMenu}>
                Home
              </Link>
            </li>
            <li>
              <Link href="/pokedex" className={linkClasses('/pokedex')} onClick={closeMenu}>
                Pokédex
              </Link>
            </li>
            <li>
              <Link href="/contact" className={linkClasses('/contact')} onClick={closeMenu}>
                Contact
              </Link>
            </li>
            <li>
              <Link href="/admin" className={linkClasses('/admin')} onClick={closeMenu}>
                Admin
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Navigation;
