/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full h- flex p-4 select-none" >
      <img width={1} height={1} alt="pixel" src="/api/track/ID-UNICO-DE-RASTREAMENTO-DA-PAGINA" />
      <div className="cursor-pointer">
        <Link href={"/"} >
          <Image
            alt="markdown analytics"
            draggable={false}
            src="/logo.png"
            width={120}
            height={100}
            quality={100}
          />
        </Link>
      </div>
      <div className="w-full flex justify-end">
       <Link href={'https://github.com/eletroswing/md-analytics'} replace={false}>
       <span className="font-medium cursor-pointer px-2 py-1 border-2 border-black rounded-md text-sm">
          GitHub
        </span></Link>
      </div>
    </nav>
  );
}
