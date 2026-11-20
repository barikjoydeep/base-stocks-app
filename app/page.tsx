'use client'

import { useEffect, useState } from 'react'
import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function Home() {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  const [stocks, setStocks] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<any | null>(null)
  const [mounted, setMounted] = useState(false)
  const [activityData, setActivityData] = useState<any[]>([])

  const { data: ethBalance } = useBalance({ address, chainId: 8453, query: { enabled: isConnected } })

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    fetch('/api/stocks')
      .then(res => res.json())
      .then(data => setStocks(data.tokens || []))
  }, [])

  useEffect(() => {
    fetch('https://api.growthepie.com/v1/export/txcount.json')
      .then(res => res.json())
      .then(data => {
        const base = data.filter((i: any) => i.origin_key === 'base').slice(-7)
        setActivityData(base.map((d: any) => ({
          date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          txs: d.value
        })))
      })
      .catch(() => {})
  }, [])

  const filtered = stocks.filter(s =>
    s.symbol?.toLowerCase().includes(search.toLowerCase()) ||
    s.name?.toLowerCase().includes(search.toLowerCase())
  )

  const formatPrice = (p: any) => (p == null || isNaN(Number(p)) ? 'N/A' : Number(p).toFixed(2))
  const getLogo = (s: string) => `https://api.coinbase.com/v1/tokenized-stocks/images/${s}`

  return (
    <main className="min-h-screen p-6 md:p-10 bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 text-white">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 flex flex-wrap gap-2 justify-center">
          <a href="/" className="px-4 py-2 rounded-xl bg-cyan-600 text-sm">Trade</a>
          <a href="/explore" className="px-4 py-2 rounded-xl bg-slate-800/60 border border-slate-700 text-sm">Explore</a>
          <a href="/swap" className="px-4 py-2 rounded-xl bg-slate-800/60 border border-slate-700 text-sm">Swap</a>
          <a href="/lend" className="px-4 py-2 rounded-xl bg-slate-800/60 border border-slate-700 text-sm">Lend & Stake</a>
          <a href="/launch" className="px-4 py-2 rounded-xl bg-slate-800/60 border border-slate-700 text-sm">Launch</a>
          <a href="/profile" className="px-4 py-2 rounded-xl bg-slate-800/60 border border-slate-700 text-sm">Profile</a>
        </div>

        <h1 className="text-4xl font-bold text-cyan-300 mb-2">Base Tokenized Stocks</h1>
        <p className="text-blue-200/70 mb-6">Stocks Maxxing Dashboard</p>

        {activityData.length > 0 && (
          <div className="mb-8 p-6 bg-slate-900/60 border border-slate-700 rounded-2xl">
            <h2 className="text-lg font-semibold text-cyan-300 mb-4">Base Daily Transactions</h2>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="date" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip />
                  <Line type="monotone" dataKey="txs" stroke="#22d3ee" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        <div className="mb-6 p-5 bg-slate-900/80 rounded-2xl border border-slate-700">
          {isConnected ? (
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div>
                <div className="text-sm text-slate-400">Wallet</div>
                <div className="font-mono text-sm text-emerald-400">{address}</div>
                <div className="text-sm mt-1">Balance: {ethBalance ? (Number(ethBalance.value) / 1e18).toFixed(4) : '...'} ETH</div>
              </div>
              <button onClick={() => disconnect()} className="bg-rose-600 px-5 py-2 rounded-xl">Disconnect</button>
            </div>
          ) : (
            mounted && connectors.map(c => (
              <button key={c.id} onClick={() => connect({ connector: c })} className="bg-indigo-600 px-6 py-3 rounded-xl mr-2">
                Connect {c.name}
              </button>
            ))
          )}
        </div>

        <input
          type="text"
          placeholder="Search stocks..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full mb-6 bg-slate-900/70 border border-slate-700 rounded-xl px-5 py-4"
        />

        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map(stock => (
            <div
              key={stock.symbol}
              onClick={() => setSelected(stock)}
              className="bg-slate-900/60 border border-slate-700 rounded-2xl p-5 cursor-pointer hover:border-cyan-500/50"
            >
              <div className="flex items-center gap-4">
                <img
                  src={getLogo(stock.symbol)}
                  alt={stock.symbol}
                  className="w-12 h-12 rounded-full bg-slate-800"
                  onError={e => (e.target as HTMLImageElement).style.display = 'none'}
                />
                <div className="flex-1">
                  <div className="text-xl font-bold">{stock.symbol}</div>
                  <div className="text-slate-400 text-sm">{stock.name}</div>
                </div>
                <div className="text-emerald-400 font-semibold">${formatPrice(stock.nav_price)}</div>
              </div>
            </div>
          ))}
        </div>

        {selected && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={() => setSelected(null)}>
            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
              <div className="flex items-center gap-4 mb-4">
                <img src={getLogo(selected.symbol)} alt="" className="w-14 h-14 rounded-full bg-slate-800" onError={e => (e.target as HTMLImageElement).style.display = 'none'} />
                <div>
                  <h2 className="text-2xl font-bold">{selected.symbol}</h2>
                  <p className="text-slate-400">{selected.name}</p>
                </div>
              </div>
              <p>Price: ${formatPrice(selected.nav_price)}</p>
              <div className="mt-4 flex gap-2">
                <a href={`https://aerodrome.finance/swap?to=${selected.contract_address}`} target="_blank" className="flex-1 bg-emerald-600 text-center py-2 rounded-xl">Buy</a>
                <button onClick={() => setSelected(null)} className="flex-1 bg-slate-700 py-2 rounded-xl">Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}