import Image from "next/image";
import ImageCarousel from '@/components/ImageCarousel';
import TypewriterComponent from "@/components/TypewriterComponent";
import Link from "next/link";

export default function Home() {
  return (
    <div className='text-center'>
      <div>
        <h1 className='mt-25 text-5xl font-pixelify-sans font-bold text-[#1a1a1a] dark:text-white drop-shadow-lg inline-block'>
          Welcome to
        </h1>
        <div className='animate-float flex justify-center items-center px-4'>
          <Image
            src='/title.png'
            alt='Title'
            width={1000}
            height={1000}
            className='mytitle w-full max-w-[50rem] h-auto'
          />
        </div>
      </div>
      <div className='m-10'>
        <h2 className='text-3xl font-bold mb-4 text-[rgb(6,0,78)]'>
        </h2>
        <div className="flex flex-col lg:flex-row gap-12 items-center justify-center">
          <div className="w-full lg:w-1/2 flex justify-center">

            <div className="container mx-auto w-full max-w-md text-center">
              <h1 className="bg-[#2e2e2e] text-white py-4 mb-8 text-2xl shadow-[0px_5px_black,0px_-5px_black,5px_0px_black,-5px_0px_black,0px_10px_#00000038,5px_5px_#00000038,-5px_5px_#00000038,inset_0px_5px_#ffffff1f,inset_0px_-5px_#00000030]">
                <div className="font-pixelify-sans font-bold text-3xl text-outline"><TypewriterComponent /></div>
              </h1>

              <Link href="/pokedex" passHref>
                <button className="text-white font-jersey-15 bg-[#6abc3a] px-8 py-3 mb-2 mr-10 text-2xl border-0 shadow-[0px_5px_black,0px_-5px_black,5px_0px_black,-5px_0px_black,0px_10px_#00000038,5px_5px_#00000038,-5px_5px_#00000038,inset_0px_5px_#ffffff36] active:translate-y-[5px] active:shadow-[0px_5px_black,0px_-5px_black,5px_0px_black,-5px_0px_black,inset_0px_5px_#00000038] cursor-pointer">
                  Pokédex
                </button>
              </Link>

              <Link href="/contact" passHref>
                <button className="text-white font-jersey-15 bg-[#d83434] px-8 py-3 mb-2 ml-10 text-2xl border-0 shadow-[0px_5px_black,0px_-5px_black,5px_0px_black,-5px_0px_black,0px_10px_#00000038,5px_5px_#00000038,-5px_5px_#00000038,inset_0px_5px_#ffffff36] active:translate-y-[5px] active:shadow-[0px_5px_black,0px_-5px_black,5px_0px_black,-5px_0px_black,inset_0px_5px_#00000038] cursor-pointer">
                  Contact
                </button>
                <br /><br />
              </Link>

              <Link href="/admin" passHref>
                <button className="text-white font-jersey-15 bg-[#38667f] px-8 py-3 mb-2 mr-10 text-2xl border-0 shadow-[0px_5px_black,0px_-5px_black,5px_0px_black,-5px_0px_black,0px_10px_#00000038,5px_5px_#00000038,-5px_5px_#00000038,inset_0px_5px_#ffffff36] active:translate-y-[5px] active:shadow-[0px_5px_black,0px_-5px_black,5px_0px_black,-5px_0px_black,inset_0px_5px_#00000038] cursor-pointer">
                  Admin
                </button>
              </Link>

              <a
                className="text-white font-jersey-15 bg-[#9f7db1] px-9 py-4 mb-2 ml-10 text-2xl border-0 shadow-[0px_5px_black,0px_-5px_black,5px_0px_black,-5px_0px_black,0px_10px_#00000038,5px_5px_#00000038,-5px_5px_#00000038,inset_0px_5px_#ffffff36] active:translate-y-[5px] active:shadow-[0px_5px_black,0px_-5px_black,5px_0px_black,-5px_0px_black,inset_0px_5px_#00000038]"
                href='https://play.pokemonshowdown.com/'
                target="_blank"
                rel="noopener noreferrer"
              >
                Play?
              </a>
              <br /><br />

              {/*
            <button className="text-white font-jersey-15 bg-[#FF5722] px-10 py-4 mb-2 text-lg border-0 shadow-[0px_5px_black,0px_-5px_black,5px_0px_black,-5px_0px_black,0px_10px_#00000038,5px_5px_#00000038,-5px_5px_#00000038,inset_0px_5px_#ffffff36] active:translate-y-[5px] active:shadow-[0px_5px_black,0px_-5px_black,5px_0px_black,-5px_0px_black,inset_0px_5px_#00000038]">
              Link 5
            </button>

            <button className="text-white font-jersey-15 bg-[#009688] px-10 py-4 mb-2 text-lg border-0 shadow-[0px_5px_black,0px_-5px_black,5px_0px_black,-5px_0px_black,0px_10px_#00000038,5px_5px_#00000038,-5px_5px_#00000038,inset_0px_5px_#ffffff36] active:translate-y-[5px] active:shadow-[0px_5px_black,0px_-5px_black,5px_0px_black,-5px_0px_black,inset_0px_5px_#00000038]">
              Link 6
            </button>
            */}
            </div>


          </div>
          <div className="w-full lg:w-1/3 flex justify-center"><ImageCarousel /></div>
        </div>
      </div>
    </div>
  );
}
