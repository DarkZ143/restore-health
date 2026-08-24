import Link from "next/link";
import { ArrowLeft, Home, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-[radial-gradient(circle_at_top_right,_rgba(200,148,22,0.18),_transparent_34%),linear-gradient(135deg,_#f8fbf5,_#edf6ed)] px-6 py-20 text-[#173f15] dark:bg-[radial-gradient(circle_at_top_right,_rgba(200,148,22,0.18),_transparent_34%),linear-gradient(135deg,_#071b12,_#0d2d20)] dark:text-white">
      <div className="w-full max-w-xl text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#246b1c] text-white shadow-lg shadow-[#246b1c]/20 dark:bg-[#0dce91] dark:text-[#062118]">
          <SearchX size={30} aria-hidden="true" />
        </div>

        <p className="mt-8 text-sm font-bold uppercase tracking-[0.24em] text-[#c89416]">
          Error 404
        </p>
        <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
          Page not found
        </h1>
        <p className="mx-auto mt-5 max-w-md text-base leading-7 text-[#54654f] dark:text-emerald-100/75">
          The page you are looking for may have moved or is no longer available.
        </p>

        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#246b1c] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#1b5515] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c89416] dark:bg-[#0dce91] dark:text-[#062118] dark:hover:bg-[#34d399]"
          >
            <Home size={17} aria-hidden="true" />
            Go to homepage
          </Link>
          <Link
            href="/auth/login"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#b7cbb2] bg-white/70 px-5 py-3 text-sm font-bold text-[#246b1c] transition hover:border-[#246b1c] hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c89416] dark:border-emerald-800 dark:bg-white/5 dark:text-emerald-200 dark:hover:border-emerald-500 dark:hover:bg-white/10"
          >
            <ArrowLeft size={17} aria-hidden="true" />
            Back to login
          </Link>
        </div>
      </div>
    </main>
  );
}