import Image from "next/image";
import Link from "next/link";
import SpotifyWidget from "@/app/components/spotify-widget";
export default function Home() {
  return (
    <div className="bg-zinc-50 text-black flex flex-col min-h-screen font-[family-name:'JetBrains Mono']">
      <header className="pb-6 ml-2 mr-2 md:ml-48 md:mr-48 sm:mr-24 sm:ml-24">
        <div className="container mx-auto spacing-y-4 pt-8">
          <div className="flex flex-row justify-between">
            <div>
              <h1 className="text-xl md:text-3xl font-medium">matheus</h1>
              <p className="text-lg md:text-xl">software developer</p>
            </div>
            <SpotifyWidget />
            <div className="flex flex-row space-x-2 mt-5">
              <Link href="https://x.com/resfriados" target="_blank">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 30 30"
                >
                  <path d="M28,6.937c-0.957,0.425-1.985,0.711-3.064,0.84c1.102-0.66,1.947-1.705,2.345-2.951c-1.03,0.611-2.172,1.055-3.388,1.295 c-0.973-1.037-2.359-1.685-3.893-1.685c-2.946,0-5.334,2.389-5.334,5.334c0,0.418,0.048,0.826,0.138,1.215 c-4.433-0.222-8.363-2.346-10.995-5.574C3.351,6.199,3.088,7.115,3.088,8.094c0,1.85,0.941,3.483,2.372,4.439 c-0.874-0.028-1.697-0.268-2.416-0.667c0,0.023,0,0.044,0,0.067c0,2.585,1.838,4.741,4.279,5.23 c-0.447,0.122-0.919,0.187-1.406,0.187c-0.343,0-0.678-0.034-1.003-0.095c0.679,2.119,2.649,3.662,4.983,3.705 c-1.825,1.431-4.125,2.284-6.625,2.284c-0.43,0-0.855-0.025-1.273-0.075c2.361,1.513,5.164,2.396,8.177,2.396 c9.812,0,15.176-8.128,15.176-15.177c0-0.231-0.005-0.461-0.015-0.69C26.38,8.945,27.285,8.006,28,6.937z" />
                </svg>
              </Link>
              <Link href="https://github.com/matheus-hrm" target="_blank">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width="32"
                  height="32"
                  viewBox="0,0,256,256"
                >
                  <g
                    fill="#00000"
                    fillRule="nonzero"
                    stroke="none"
                    strokeWidth="1"
                    strokeLinecap="butt"
                    strokeLinejoin="miter"
                    strokeMiterlimit="10"
                    strokeDasharray=""
                    strokeDashoffset="0"
                    fontFamily="none"
                    fontWeight="none"
                    fontSize="none"
                    textAnchor="none"
                    style={{ mixBlendMode: "normal" }}
                  >
                    <g transform="scale(8.53333,8.53333)">
                      <path d="M15,3c-6.627,0 -12,5.373 -12,12c0,5.623 3.872,10.328 9.092,11.63c-0.056,-0.162 -0.092,-0.35 -0.092,-0.583v-2.051c-0.487,0 -1.303,0 -1.508,0c-0.821,0 -1.551,-0.353 -1.905,-1.009c-0.393,-0.729 -0.461,-1.844 -1.435,-2.526c-0.289,-0.227 -0.069,-0.486 0.264,-0.451c0.615,0.174 1.125,0.596 1.605,1.222c0.478,0.627 0.703,0.769 1.596,0.769c0.433,0 1.081,-0.025 1.691,-0.121c0.328,-0.833 0.895,-1.6 1.588,-1.962c-3.996,-0.411 -5.903,-2.399 -5.903,-5.098c0,-1.162 0.495,-2.286 1.336,-3.233c-0.276,-0.94 -0.623,-2.857 0.106,-3.587c1.798,0 2.885,1.166 3.146,1.481c0.896,-0.307 1.88,-0.481 2.914,-0.481c1.036,0 2.024,0.174 2.922,0.483c0.258,-0.313 1.346,-1.483 3.148,-1.483c0.732,0.731 0.381,2.656 0.102,3.594c0.836,0.945 1.328,2.066 1.328,3.226c0,2.697 -1.904,4.684 -5.894,5.097c1.098,0.573 1.899,2.183 1.899,3.396v2.734c0,0.104 -0.023,0.179 -0.035,0.268c4.676,-1.639 8.035,-6.079 8.035,-11.315c0,-6.627 -5.373,-12 -12,-12z"></path>
                    </g>
                  </g>
                </svg>
              </Link>
              <Link href="https://linkedin.com/in/matheus-hrm" target="_blank">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 30 30"
                >
                  <g fill="#000000">
                    <path d="M24,4h-18c-1.105,0 -2,0.895 -2,2v18c0,1.105 0.895,2 2,2h18c1.105,0 2,-0.895 2,-2v-18c0,-1.105 -0.895,-2 -2,-2zM10.954,22h-2.95v-9.492h2.95zM9.449,11.151c-0.951,0 -1.72,-0.771 -1.72,-1.72c0,-0.949 0.77,-1.719 1.72,-1.719c0.948,0 1.719,0.771 1.719,1.719c0,0.949 -0.771,1.72 -1.719,1.72zM22.004,22h-2.948v-4.616c0,-1.101 -0.02,-2.517 -1.533,-2.517c-1.535,0 -1.771,1.199 -1.771,2.437v4.696h-2.948v-9.492h2.83v1.297h0.04c0.394,-0.746 1.356,-1.533 2.791,-1.533c2.987,0 3.539,1.966 3.539,4.522z"></path>
                  </g>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </header>
      <main className="flex justify-center">
        <Image
          src="/static/wpp.jpg"
          alt="Image"
          width={500}
          height={500}
          className="rounded-lg ml-48 w-1/2 mx-auto max-w-[24rem] object-cover"
        />
        <div className="text-prose w-full max-w-md mx-auto px-4 mt-12 space-y-5">
          <p className="text-bold text-md md:text-xl">
            computer science at UFG
          </p>
          <div className="text-sm md:text-lg mt-6 md:mt-16 mb-2">
            <p className="font-semibold">languages =&gt;</p>
            <p className="ml-4">{"{ :typescript, :python, :c }"}</p>
            <p className="font-semibold mt-2">frameworks =&gt;</p>
            <p className="ml-4">{"{ :next.js, :fastify, :spring-boot }"}</p>
            <p className="font-semibold mt-2">tools =&gt;</p>
            <p className="ml-4">{"{ :neovim, :nix, :docker }"}</p>
            <p className="font-semibold mt-2">learning =&gt;</p>
            <p className="ml-4">{"{ :java, :elixir, :rust, :haskell }"}</p>
          </div>
          <div className="text-bold text-md md:text-xl leading-relaxed mt-6 md:mt-16 mb-2">
            <p className="mb-4">projects:</p>
            <ul className="lambda-list list-disc list-inside text-sm md:text-lg">
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
        <div className="font-light container text-xs md:text-base mx-auto text-center py-8">
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
