import NavBar from "./NavBar";
import Head from "next/head";

export default function Layout({ children, title = "Game Score Predictor" }) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Game score prediction application" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen flex flex-col bg-gray-100">
        <NavBar />
        <main className="flex-grow container mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="bg-gray-800 text-white p-4 text-center">
          &copy; {new Date().getFullYear()} Game Score Predictor - Prototype
        </footer>
      </div>
    </>
  );
}
