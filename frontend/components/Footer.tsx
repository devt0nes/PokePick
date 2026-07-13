import React from 'react';
import Image from 'next/image';

const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-800 text-neutral-300 py-4 text-xs">
      <div className="max-w-8xl mx-auto px-0">
        <div className="flex flex-col md:flex-row items-center md:items-start max-w-8xl mx-auto px-4">

          <div className="flex flex-col w-full md:w-1/3 justify-start items-start space-y-2 px-0">
            <Image
              src="/logo.png"
              alt="PokéPick Logo"
              width={150}
              height={40}
            />
          </div>

          <div className="flex flex-col w-full md:w-1/3 items-center space-y-2">
            <a href="/terms" className="hover:text-white transition">
              Terms of Service
            </a>
            <a href="/privacy" className="hover:text-white transition">
              Privacy Policy
            </a>
            <div className="mt-2 text-center text-xs text-neutral-400 flex items-center justify-center space-x-2">
                <Image
                    src="/pokeball.png"
                    alt="Pokéball Icon"
                    width={15}
                    height={15}
                />
                <span>Made by Jujhar & Upkirat</span>
                <Image
                    src="/pokeball.png"
                    alt="Pokéball Icon"
                    width={15}
                    height={15}
                />
                </div>
          </div>

          <div className="flex flex-col w-full md:w-1/3 justify-end items-end text-right px-0">
            <p>
              1 League Plaza, Lumiose City
              <br />
              Kalos Region 75001
            </p>
            <p>Global Pokémon Authority, Pokémon World</p>
            <p className="mt-2">© {new Date().getFullYear()} PokéPick, Inc.</p>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
