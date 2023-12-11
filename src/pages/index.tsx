/* eslint-disable @next/next/no-img-element */
import Navbar from "@/components/navbar";
import Link from "next/link";

export default function Home() {
  return (
    <div className="h-[100vh] w-full bg-gray-200">
      <Navbar />
      <main className="w-full flex justify-center select-none pt-12 flex-col text-center">
        <div>
          <h1 className="text-inherit w-full text-6xl text-center">
            Collect <i className="text-green-500 not-italic">analytics</i> from
            your <i className="text-green-500">Markdown!</i>
          </h1>
          <h3 className="pt-2 italic text-2xl text-bold">Easy, ⚡ fast and 🤑widgets!</h3>
        </div>
        <div className="flex w-full justify-center pt-12 flex-col items-center">
          <div className="w-full md:w-1/2 flex flex-col justify-center items-center">
          <img alt="view-count" className="" src="/api/widgets/view-counter/ID-UNICO-DE-RASTREAMENTO-DA-PAGINA" />
          <img alt="unique" className="pt-8" src="/api/widgets/total-views/ID-UNICO-DE-RASTREAMENTO-DA-PAGINA" />
          </div>
        </div>
        <div className="flex flex-col pt-8 w-full justify-center items-center">
          <Link
            href={"create"}
            className="rounded-md p-2 bg-green-500 text-white"
          >
            <span>Start with your first pixel right now.</span>
          </Link>
          <span className="text-sm pt-2">* No signup required!</span>
        </div>
      </main>
    </div>
  );
}
