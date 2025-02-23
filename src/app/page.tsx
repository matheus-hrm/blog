import Image from "next/image";
import Link from "next/link";
import SpotifyWidget from "@/app/components/spotify-widget";
import { LastfmSvgIcon } from "./components/lastfm-icon";
import { GithubSVGIcon } from "./components/github-icon";
import { TwitterSVGIcon } from "./components/twitter-icon";
export default function Home() {
  return (
    <div className="bg-zinc-50 text-black flex flex-col min-h-screen font-[family-name:'JetBrains Mono']">
      <header className="pb-6 px-4 sm:px-6 md:px-12 lg:px-48">
        <div className="container mx-auto pt-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center">
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-medium">matheus</h1>
              <p className="text-base sm:text-lg md:text-xl">software developer</p>
            </div>
            <SpotifyWidget />
            <div className="flex flex-row space-x-3 mt-4 sm:mt-0">
              <Link href="https://x.com/resfriados" target="_blank">
                <TwitterSVGIcon />
              </Link>
              <Link href="https://github.com/matheus-hrm" target="_blank">
                <GithubSVGIcon />
              </Link>
              <Link href="https://last.fm/user/odeiomou" target="_blank">
                <LastfmSvgIcon />
              </Link>
            </div>
          </div>
        </div>
      </header>
      <main className="flex flex-col items-center px-4 sm:px-6 md:px-12 lg:flex-row lg:justify-center lg:gap-8">
        <Image
          src="/static/wpp.jpg"
          alt="Image"
          width={384}
          height={682}
          className="rounded-lg w-full max-w-[384px] h-auto object-cover mb-6 lg:mb-0 lg:w-[384px] order-2"
        />
        <div className="w-full max-w-md space-y-5 text-center lg:text-left">
          <p className="text-md sm:text-lg md:text-xl font-bold">
            computer science at UFG
          </p>
          <div className="text-sm sm:text-base md:text-lg space-y-4">
            <div>
              <p className="font-semibold">languages =&gt;</p>
              <p className="ml-4">{"{ :typescript, :python, :c }"}</p>
            </div>
            <div>
              <p className="font-semibold">frameworks =&gt;</p>
              <p className="ml-4">{"{ :next.js, :fastify, :spring-boot }"}</p>
            </div>
            <div>
              <p className="font-semibold">tools =&gt;</p>
              <p className="ml-4">{"{ :neovim, :nix, :docker }"}</p>
            </div>
            <div>
              <p className="font-semibold">learning =&gt;</p>
              <p className="ml-4">{"{ :java, :elixir, :rust, :haskell }"}</p>
            </div>
          </div>
          <div className="text-md sm:text-lg md:text-xl leading-relaxed space-y-4">
            <p>projects:</p>
            <ul className="lambda-list list-disc list-inside text-sm sm:text-base md:text-lg mb-4">
              <li>
                <Link
                  href="https://github.com/matheus-hrm/lox-interpreter"
                  target="_blank"
                  className="text-sky-600 hover:text-sky-950"
                >
                  lox interpreter
                </Link>
              </li>
              <li>
                <Link
                  href="https://github.com/matheus-hrm/curiously-next"
                  target="_blank"
                  className="text-sky-600 hover:text-sky-950"
                >
                  curiously, curious cat clone
                </Link>
              </li>
              <li>
                <Link
                  href="https://github.com/matheus-hrm/Flappy-Bird"
                  target="_blank"
                  className="text-sky-600 hover:text-sky-950"
                >
                  flappy bird game in C
                </Link>
              </li>
              <li>
                <Link
                  href="https://github.com/matheus-hrm/manga_App"
                  target="_blank"
                  className="text-sky-600 hover:text-sky-950"
                >
                  manga app
                </Link>
              </li>
              <li>
                <Link
                  href="https://github.com/matheus-hrm/steg"
                  target="_blank"
                  className="text-sky-600 hover:text-sky-950"
                >
                  steganography in C
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </main>
      <footer className="bg-zinc-50 text-zinc-900 mt-auto">
        <div className="font-light container text-xs sm:text-sm md:text-base mx-auto text-center py-8 px-4">
          A computer is like a violin. You can imagine a novice trying first a
          phonograph and then a violin. The latter, he says, sounds terrible.
          That is the argument we have heard from our humanists and most of our
          computer scientists. Computer programs are good, they say, for
          particular purposes, but they aren’t flexible. Neither is a violin, or
          a typewriter, until you learn how to use it.
        </div>
      </footer>
    </div>
  );
}
