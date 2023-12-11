/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
import Navbar from "@/components/navbar";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import SyntaxHighlighter from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/hljs";

export default function Home() {
  const input = useRef<HTMLInputElement>(null);
  const [pixel, setPixel] = useState<null | string>(null);
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      setTimeout(() => setCopied(false), 1500);
    }
  }, [copied]);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setPixel(input.current!.value);
    setShowModal(true);
    input.current!.value = "";
  };

  return (
    <div className="h-[100vh] w-full bg-gray-200">
      <Navbar />
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                <div className="relative p-6 flex-auto">
                  <SyntaxHighlighter language="markdown" style={dracula}>
                    {`<img alt="pixel" src="https://md-analytics.vercel.app/api/track/${encodeURI(pixel || "")}" />`}
                  </SyntaxHighlighter>
                </div>
                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                  <CopyToClipboard
                    text={`<img alt="pixel" src="https://md-analytics.vercel.app/api/track/${encodeURI(pixel || "")}" />`}
                  >
                    <button
                      className="bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-4 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => setCopied(true)}
                    >
                      {copied ? "Copied" : "Copy"}
                    </button>
                  </CopyToClipboard>
                  <Link
                    className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    href={`/${encodeURI(pixel || "")}`}
                  >
                    Go to Analytics
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
      <main className="w-full flex justify-center select-none pt-12 flex-col text-center">
        <div>
          <h1 className="text-inherit w-full text-6xl text-center">
            Create a <i className="text-green-500 not-italic">pixel</i> for your{" "}
            <i className="text-green-500">Markdown!</i>
          </h1>
          <h3 className="pt-2 text-2xl text-bold">
            It will be with this that you can access the analytics.
          </h3>
        </div>
        <div className="flex flex-col pt-8 w-full justify-center items-center">
          <div className="w-[75%]">
            <form onSubmit={handleSubmit}>
              <input
                ref={input}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="id"
                required
                type="text"
                placeholder="Unique identifier..."
              ></input>
              <button
                type="submit"
                className="mt-3 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 border border-green-700 rounded"
              >
                Generate
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
