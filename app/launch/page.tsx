'use client'
import { useState } from 'react'

export default function Launch() {
  const [name, setName] = useState('')
  const [symbol, setSymbol] = useState('')

  return (
    <main className="min-h-screen p-6 md:p-10 bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 text-white">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 flex flex-wrap gap-2 justify-center">
          <a href="/" className="px-4 py-2 rounded-xl bg-slate-800/60 border border-slate-700 text-sm">Trade</a>
          <a href="/explore" className="px-4 py-2 rounded-xl bg-slate-800/60 border border-slate-700 text-sm">Explore</a>
          <a href="/swap" className="px-4 py-2 rounded-xl bg-slate-800/60 border border-slate-700 text-sm">Swap</a>
          <a href="/lend" className="px-4 py-2 rounded-xl bg-slate-800/60 border border-slate-700 text-sm">Lend & Stake</a>
          <a href="/launch" className="px-4 py-2 rounded-xl bg-cyan-600 text-sm">Launch</a>
          <a href="/profile" className="px-4 py-2 rounded-xl bg-slate-800/60 border border-slate-700 text-sm">Profile</a>
        </div>

        <h1 className="text-4xl font-bold text-cyan-300 mb-6">Launch Token</h1>

        <div className="bg-slate-900/60 border border-slate-700 rounded-2xl p-6 max-w-lg">
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Token Name" className="w-full mb-3 bg-slate-800 border border-slate-600 rounded-xl px-4 py-3" />
          <input value={symbol} onChange={e => setSymbol(e.target.value)} placeholder="Symbol" className="w-full mb-3 bg-slate-800 border border-slate-600 rounded-xl px-4 py-3" />
          <button onClick={() => alert(`Launching ${symbol || 'Token'}`)} className="w-full bg-cyan-600 py-3 rounded-xl font-semibold">Launch</button>
        </div>
      </div>
    </main>
  )
}