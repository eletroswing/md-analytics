/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
import Navbar from "@/components/navbar";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";

function ImageButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false);
      }, 1500);
    }
  }, [copied]);

  return (
    <div className="relative w-full group">
      <div className="w-full justify-end items-end flex">
        <CopyToClipboard
          text={`https://md-analytics.vercel.app${url}`}
          onCopy={() => setCopied(true)}
        >
          <button className="hidden group-hover:block bg-blue-500 text-white p-2 rounded-full transform translate-y-3 translate-x-2 absolute">
            {copied ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={15}
                height={15}
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="#000"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 12.611 8.923 17.5 20 6.5"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={15}
                height={15}
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  fill="#0F0F0F"
                  fillRule="evenodd"
                  d="M21 8a3 3 0 0 0-3-3h-8a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8Zm-2 0a1 1 0 0 0-1-1h-8a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V8Z"
                  clipRule="evenodd"
                />
                <path
                  fill="#0F0F0F"
                  d="M6 3h10a1 1 0 1 0 0-2H6a3 3 0 0 0-3 3v14a1 1 0 1 0 2 0V4a1 1 0 0 1 1-1Z"
                />
              </svg>
            )}
          </button>
        </CopyToClipboard>
      </div>
      <img className="w-full" alt="widget" src={url} />
    </div>
  );
}

export default function Home() {
  const router = useRouter();

  return (
    <div className="h-[100vh] w-full bg-gray-200">
      <Navbar />
      <div className="pt-6 flex w-full items-center justify-center text-center">
        <i>
          {" "}
          You're analyzing: <b>{router.query.item}</b>
        </i>
      </div>
      <main className="w-full flex select-none pt-6 flex-col text-center md:px-12 items-center h-[80vh]">
        <div className="w-[90%] md:w-[80%] flex flex-col justify-center items-center">
          <div className="w-full flex justify-center">
            <div className="m-2">
              <ImageButton
                url={`/api/widgets/view-counter/${router.query.item}`}
              />
            </div>
          </div>
          <div className="flex w-full flex-col md:w-[50%]">
            <div className="flex w-full flex-col">
              <div>
                <ImageButton
                  url={`/api/widgets/analytic-widget/${router.query.item}`}
                />
              </div>
              <div className="flex gap-2 mt-2">
                <ImageButton
                  url={`/api/widgets/total-views/${router.query.item}`}
                />
                <ImageButton url={`/api/widgets/views/${router.query.item}`} />
              </div>
            </div>
            <div className=" mt-2 w-full mb-12">
              <ImageButton url={`/api/widgets/graph/${router.query.item}`} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
