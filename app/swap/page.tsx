'use client'
import { useState } from 'react'

export default function Swap() {
  const [from, setFrom] = useState('USDC')
  const [to, setTo] = useState('NVDAc')
  const [amount, setAmount] = useState('100')

  return (
    <main className="min-h-screen p-6 md:p-10 bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 text-white">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 flex flex-wrap gap-2 justify-center">
          <a href="/" className="px-4 py-2 rounded-xl bg-slate-800/60 border border-slate-700 text-sm">Trade</a>
          <a href="/explore" className="px-4 py-2 rounded-xl bg-slate-800/60 border border-slate-700 text-sm">Explore</a>
          <a href="/swap" className="px-4 py-2 rounded-xl bg-cyan-600 text-sm">Swap</a>
          <a href="/lend" className="px-4 py-2 rounded-xl bg-slate-800/60 border border-slate-700 text-sm">Lend & Stake</a>
          <a href="/launch" className="px-4 py-2 rounded-xl bg-slate-800/60 border border-slate-700 text-sm">Launch</a>
          <a href="/profile" className="px-4 py-2 rounded-xl bg-slate-800/60 border border-slate-700 text-sm">Profile</a>
        </div>

        <h1 className="text-4xl font-bold text-cyan-300 mb-6">Swap</h1>

        <div className="bg-slate-900/70 border border-cyan-700/40 rounded-2xl p-6 max-w-lg">
          <div className="space-y-4">
            <div>
              <label className="text-xs text-slate-400">From</label>
              <select value={from} onChange={e => setFrom(e.target.value)} className="w-full mt-1 bg-slate-800 border border-slate-600 rounded-xl px-4 py-3">
                <option value="USDC">USDC</option>
                <option value="ETH">ETH</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400">Amount</label>
              <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="w-full mt-1 bg-slate-800 border border-slate-600 rounded-xl px-4 py-3" />
            </div>
            <div>
              <label className="text-xs text-slate-400">To</label>
              <select value={to} onChange={e => setTo(e.target.value)} className="w-full mt-1 bg-slate-800 border border-slate-600 rounded-xl px-4 py-3">
                <option value="NVDAc">NVDAc</option>
                <option value="TSLAc">TSLAc</option>
                <option value="AAPLc">AAPLc</option>
              </select>
            </div>
          </div>
          <a href="https://aerodrome.finance/swap" target="_blank" className="mt-6 block text-center bg-cyan-600 hover:bg-cyan-500 py-3 rounded-xl font-semibold">Swap on Aerodrome</a>
        </div>
      </div>
    </main>
  )
}