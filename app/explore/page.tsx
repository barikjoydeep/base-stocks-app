'use client'
import Link from 'next/link'

export default function Explore() {
  return (
    <main className="min-h-screen p-6 md:p-10 bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 text-white">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 flex flex-wrap gap-2 justify-center">
          <Link href="/"><button className="px-4 py-2 rounded-xl bg-slate-800/60 border border-slate-700 hover:border-cyan-500/50 transition">Trade</button></Link>
          <Link href="/explore"><button className="px-4 py-2 rounded-xl bg-cyan-600">Explore</button></Link>
          <Link href="/swap"><button className="px-4 py-2 rounded-xl bg-slate-800/60 border border-slate-700 hover:border-cyan-500/50 transition">Swap</button></Link>
          <Link href="/lend"><button className="px-4 py-2 rounded-xl bg-slate-800/60 border border-slate-700 hover:border-cyan-500/50 transition">Lend & Stake</button></Link>
          <Link href="/launch"><button className="px-4 py-2 rounded-xl bg-slate-800/60 border border-slate-700 hover:border-cyan-500/50 transition">Launch</button></Link>
          <Link href="/profile"><button className="px-4 py-2 rounded-xl bg-slate-800/60 border border-slate-700 hover:border-cyan-500/50 transition">Profile</button></Link>
        </div>
        <h1 className="text-4xl font-bold text-cyan-300 mb-4">Explore</h1>
        <p className="text-slate-300">Discover new tokens, markets, and opportunities on Base.</p>
      </div>
    </main>
  )
}