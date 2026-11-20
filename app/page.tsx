'use client'

import { useEffect, useState } from 'react'
import { useAccount, useConnect, useDisconnect, useReadContracts, useBalance } from 'wagmi'
import { erc20Abi } from 'viem'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import Link from 'next/link'

export default function Home() {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  const [stocks, setStocks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<'name' | 'price'>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [selectedStock, setSelectedStock] = useState<any | null>(null)
  const [favorites, setFavorites] = useState<string[]>([])
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false)
  const [showPortfolioOnly, setShowPortfolioOnly] = useState(false)
  const [page, setPage] = useState(1)
  const [darkMode, setDarkMode] = useState(true)
  const [toast, setToast] = useState<string | null>(null)
  const [activityData, setActivityData] = useState<any[]>([])
  const [gainers, setGainers] = useState<any[]>([])
  const [losers, setLosers] = useState<any[]>([])
  const [mounted, setMounted] = useState(false)
  const itemsPerPage = 8

  const { data: ethBalance } = useBalance({
    address,
    chainId: 8453,
    query: { enabled: isConnected && !!address },
  })

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('stock-favorites')
    if (saved) setFavorites(JSON.parse(saved))
  }, [])

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  const toggleFavorite = (symbol: string) => {
    const updated = favorites.includes(symbol)
      ? favorites.filter(s => s !== symbol)
      : [...favorites, symbol]
    setFavorites(updated)
    localStorage.setItem('stock-favorites', JSON.stringify(updated))
    showToast(updated.includes(symbol) ? `${symbol} added to favorites` : `${symbol} removed`)
  }

  const loadStocks = () => {
    setLoading(true)
    setError(null)
    fetch('/api/stocks')
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((data) => {
        let list = []
        if (Array.isArray(data?.tokens)) list = data.tokens
        else if (Array.isArray(data)) list = data
        setStocks(list)
        setLoading(false)
        showToast('Stocks refreshed')
      })
      .catch((err) => {
        setError(err.message || 'Failed to load stocks')
        setLoading(false)
      })
  }

  useEffect(() => {
    fetch('https://api.growthepie.com/v1/export/txcount.json')
      .then(res => res.json())
      .then(data => {
        const baseData = data.filter((item: any) => item.origin_key === 'base')
        const last7 = baseData.slice(-7).map((d: any) => ({
          date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          txs: d.value
        }))
        if (last7.length > 0) setActivityData(last7)
      })
      .catch(() => {
        setActivityData([
          { date: 'Nov 12', txs: 3200000 },
          { date: 'Nov 13', txs: 2980000 },
          { date: 'Nov 14', txs: 3775000 },
          { date: 'Nov 15', txs: 3212000 },
          { date: 'Nov 16', txs: 2627000 },
          { date: 'Nov 17', txs: 2760000 },
          { date: 'Nov 18', txs: 2720000 },
        ])
      })
  }, [])

  useEffect(() => {
    fetch('/api/movers')
      .then(res => res.json())
      .then(data => {
        setGainers(data.gainers || [])
        setLosers(data.losers || [])
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    loadStocks()
  }, [])

  const balanceContracts = stocks
    .filter(s => s.contract_address)
    .slice(0, 50)
    .map((stock) => ({
      address: stock.contract_address as `0x${string}`,
      abi: erc20Abi,
      functionName: 'balanceOf',
      args: [address as `0x${string}`],
    }))

  const { data: balances } = useReadContracts({
    contracts: isConnected && address ? balanceContracts : [],
    query: { enabled: isConnected && !!address },
  })

  const portfolioValue = stocks.reduce((total, stock, index) => {
    const balanceData = balances?.[index]
    const rawBalance = balanceData?.result as bigint | undefined
    const balance = rawBalance ? Number(rawBalance) / 1e18 : 0
    const price = stock.nav_price ? Number(stock.nav_price) : 0
    return total + balance * price
  }, 0)

  let filteredStocks = stocks.filter((stock) => {
    const query = search.toLowerCase()
    const matchesSearch = stock.symbol?.toLowerCase().includes(query) || stock.name?.toLowerCase().includes(query)
    const matchesFav = !showOnlyFavorites || favorites.includes(stock.symbol)
    const globalIndex = stocks.findIndex(s => s.symbol === stock.symbol)
    const balanceData = balances?.[globalIndex]
    const rawBalance = balanceData?.result as bigint | undefined
    const balance = rawBalance ? Number(rawBalance) / 1e18 : 0
    const matchesPortfolio = !showPortfolioOnly || balance > 0
    return matchesSearch && matchesFav && matchesPortfolio
  })

  filteredStocks = [...filteredStocks].sort((a, b) => {
    let valA: any = sortBy === 'name' ? (a.symbol || '') : (a.nav_price || 0)
    let valB: any = sortBy === 'name' ? (b.symbol || '') : (b.nav_price || 0)
    if (sortOrder === 'asc') return valA > valB ? 1 : -1
    return valA < valB ? 1 : -1
  })

  const totalPages = Math.ceil(filteredStocks.length / itemsPerPage)
  const paginatedStocks = filteredStocks.slice((page - 1) * itemsPerPage, page * itemsPerPage)

  const getAerodromeLink = (contract: string, isBuy: boolean) => {
    const usdc = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'
    return isBuy
      ? `https://aerodrome.finance/swap?from=${usdc}&to=${contract}`
      : `https://aerodrome.finance/swap?from=${contract}&to=${usdc}`
  }

  const exportPortfolio = () => {
    const rows = [['Symbol', 'Name', 'Balance', 'Price', 'Value']]
    stocks.forEach((stock, index) => {
      const balanceData = balances?.[index]
      const rawBalance = balanceData?.result as bigint | undefined
      const balance = rawBalance ? Number(rawBalance) / 1e18 : 0
      const price = stock.nav_price ? Number(stock.nav_price) : 0
      if (balance > 0) {
        rows.push([stock.symbol, stock.name, balance.toFixed(4), price.toFixed(2), (balance * price).toFixed(2)])
      }
    })
    const csv = rows.map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'base-stocks-portfolio.csv'
    a.click()
    showToast('Portfolio exported')
  }

  const sharePortfolio = () => {
    const text = `My Base Tokenized Stocks Portfolio: $${portfolioValue.toFixed(2)} 🚀\nBuilt on Base`
    navigator.clipboard.writeText(text)
    showToast('Portfolio summary copied!')
  }

  const formatNumber = (num: number) => {
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M'
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K'
    return num.toString()
  }

  return (
    <main className={`min-h-screen p-6 md:p-10 transition-colors ${darkMode ? 'bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 text-white' : 'bg-gradient-to-br from-blue-100 to-indigo-100 text-slate-900'}`}>
      <div className="max-w-5xl mx-auto">
        {toast && (
          <div className="fixed top-4 right-4 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-lg z-50">
            {toast}
          </div>
        )}

        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-300 to-blue-200 bg-clip-text text-transparent">
              Base Tokenized Stocks
            </h1>
            <p className="text-blue-200/70 mt-2">Stocks Maxxing Dashboard</p>
          </div>
          <button onClick={() => setDarkMode(!darkMode)} className="bg-slate-800/80 hover:bg-slate-700 border border-slate-600 px-4 py-2 rounded-xl text-sm transition">
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>

        <div className="mb-6 text-center">
          <Link href="/game">
            <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 px-6 py-3 rounded-xl font-semibold transition">
              🧠 Play Memory Match
            </button>
          </Link>
        </div>

        {/* Base Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-900/60 border border-slate-700 rounded-2xl p-5">
            <div className="text-sm text-slate-400">Daily Transactions</div>
            <div className="text-2xl font-bold text-cyan-400 mt-1">
              {activityData.length ? formatNumber(activityData[activityData.length - 1].txs) : '—'}
            </div>
          </div>
          <div className="bg-slate-900/60 border border-slate-700 rounded-2xl p-5">
            <div className="text-sm text-slate-400">Active Addresses</div>
            <div className="text-2xl font-bold text-cyan-400 mt-1">444K</div>
          </div>
          <div className="bg-slate-900/60 border border-slate-700 rounded-2xl p-5">
            <div className="text-sm text-slate-400">DEX Volume (24h)</div>
            <div className="text-2xl font-bold text-cyan-400 mt-1">$1.06B</div>
          </div>
        </div>

        {/* Top Movers */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-slate-900/60 border border-emerald-700/40 rounded-2xl p-5">
            <h3 className="text-lg font-semibold text-emerald-400 mb-4">📈 Top Volume Gainers</h3>
            <div className="space-y-3">
              {gainers.map((item, i) => (
                <div key={i} className="flex justify-between items-center bg-slate-800/50 rounded-xl px-4 py-3">
                  <div>
                    <div className="font-bold">{item.symbol}</div>
                    <div className="text-xs text-slate-400">{item.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-emerald-400 font-semibold">+{item.change}%</div>
                    <div className="text-xs text-slate-500">{item.volume}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900/60 border border-rose-700/40 rounded-2xl p-5">
            <h3 className="text-lg font-semibold text-rose-400 mb-4">📉 Top Losers</h3>
            <div className="space-y-3">
              {losers.map((item, i) => (
                <div key={i} className="flex justify-between items-center bg-slate-800/50 rounded-xl px-4 py-3">
                  <div>
                    <div className="font-bold">{item.symbol}</div>
                    <div className="text-xs text-slate-400">{item.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-rose-400 font-semibold">{item.change}%</div>
                    <div className="text-xs text-slate-500">{item.volume}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Activity Graph */}
        {activityData.length > 0 && (
          <div className="mb-8 p-6 bg-gradient-to-br from-slate-900/80 to-slate-800/60 border border-slate-700/50 rounded-2xl shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-cyan-300">Base Daily Transactions</h2>
              <span className="text-xs text-slate-400">Last 7 days</span>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={activityData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="date" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(value) => formatNumber(value)} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px' }} formatter={(value: any) => [formatNumber(value), 'Transactions']} />
                  <Line type="monotone" dataKey="txs" stroke="#22d3ee" strokeWidth={3} dot={{ fill: '#22d3ee', strokeWidth: 2, r: 5 }} activeDot={{ r: 7 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-slate-500 mt-3 text-center">Data source: growthepie</p>
          </div>
        )}

        {/* Portfolio */}
        {isConnected && (
          <div className="mb-6 p-5 bg-emerald-900/40 border border-emerald-700/50 rounded-2xl flex justify-between items-center flex-wrap gap-4">
            <div>
              <div className="text-sm text-emerald-300">Portfolio Value</div>
              <div className="text-3xl font-bold text-emerald-400">${portfolioValue.toFixed(2)}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={exportPortfolio} className="bg-emerald-700 hover:bg-emerald-600 px-4 py-2 rounded-xl text-sm transition">Export CSV</button>
              <button onClick={sharePortfolio} className="bg-cyan-700 hover:bg-cyan-600 px-4 py-2 rounded-xl text-sm transition">Share</button>
            </div>
          </div>
        )}

        {/* Wallet */}
        <div className="mb-6 p-5 bg-slate-900/80 backdrop-blur rounded-2xl border border-slate-700">
          {isConnected ? (
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="text-sm text-slate-400">Connected Wallet</div>
                <div className="font-mono text-sm break-all text-emerald-400">{address}</div>
                <div className="mt-1 text-sm">
                  <span className="text-slate-400">Base Balance: </span>
                  <span className="font-semibold text-amber-400">
                    {ethBalance ? `${(Number(ethBalance.value) / 10 ** ethBalance.decimals).toFixed(4)} ${ethBalance.symbol}` : '...'}
                  </span>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={loadStocks} className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-xl text-sm transition">Refresh</button>
                <button onClick={() => disconnect()} className="bg-rose-600 hover:bg-rose-700 px-5 py-2 rounded-xl font-medium transition">Disconnect</button>
              </div>
            </div>
          ) : (
            mounted && (
              <div className="flex flex-col sm:flex-row gap-3">
                {connectors.map((connector) => (
                  <button 
                    key={connector.id || connector.uid} 
                    onClick={() => connect({ connector })} 
                    className="bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded-xl font-semibold transition"
                  >
                    Connect {connector.name}
                  </button>
                ))}
              </div>
            )
          )}
        </div>

        {/* Controls */}
        <div className="mb-6 flex flex-col sm:flex-row gap-3 flex-wrap">
          <input type="text" placeholder="Search stocks..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} className="flex-1 min-w-[200px] bg-slate-900/70 border border-slate-700 rounded-xl px-5 py-4 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500" />
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className="bg-slate-900/70 border border-slate-700 rounded-xl px-4 py-4 text-white">
            <option value="name">Sort by Name</option>
            <option value="price">Sort by Price</option>
          </select>
          <button onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')} className="bg-slate-800 border border-slate-700 px-5 rounded-xl hover:bg-slate-700 transition">
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
          <button onClick={() => { setShowOnlyFavorites(!showOnlyFavorites); setPage(1) }} className={`px-5 rounded-xl border transition ${showOnlyFavorites ? 'bg-amber-600 border-amber-500' : 'bg-slate-800 border-slate-700 hover:bg-slate-700'}`}>
            ★ Favorites
          </button>
          {isConnected && (
            <button onClick={() => { setShowPortfolioOnly(!showPortfolioOnly); setPage(1) }} className={`px-5 rounded-xl border transition ${showPortfolioOnly ? 'bg-emerald-600 border-emerald-500' : 'bg-slate-800 border-slate-700 hover:bg-slate-700'}`}>
              My Portfolio
            </button>
          )}
        </div>

        {loading && (
          <div className="grid gap-4 md:grid-cols-2">
            {[1,2,3,4].map(i => <div key={i} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 animate-pulse h-48" />)}
          </div>
        )}

        {error && <div className="bg-red-900/50 border border-red-700 p-5 rounded-xl mb-6 text-red-200">{error}</div>}

        {!loading && !error && paginatedStocks.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <div className="text-5xl mb-4">📭</div>
            <div className="text-lg">No stocks found</div>
          </div>
        )}

        {!loading && !error && paginatedStocks.length > 0 && (
          <>
            <div className="grid gap-4 md:grid-cols-2">
              {paginatedStocks.map((stock: any) => {
                const globalIndex = stocks.findIndex(s => s.symbol === stock.symbol)
                const balanceData = balances?.[globalIndex]
                const rawBalance = balanceData?.result as bigint | undefined
                const balance = rawBalance ? Number(rawBalance) / 1e18 : 0
                const isFav = favorites.includes(stock.symbol)

                return (
                  <div key={stock.contract_address || stock.symbol} onClick={() => setSelectedStock(stock)} className="bg-slate-900/60 border border-slate-700 rounded-2xl p-5 hover:border-cyan-500/50 hover:bg-slate-800/50 transition cursor-pointer relative">
                    <button onClick={(e) => { e.stopPropagation(); toggleFavorite(stock.symbol) }} className="absolute top-4 right-4 text-xl hover:scale-110 transition">{isFav ? '★' : '☆'}</button>
                    <div className="flex justify-between items-start pr-10">
                      <div>
                        <div className="text-2xl font-bold">{stock.symbol}</div>
                        <div className="text-slate-400 text-sm mt-1 line-clamp-1">{stock.name}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-semibold text-emerald-400">{stock.nav_price ? `$${Number(stock.nav_price).toFixed(2)}` : '—'}</div>
                        <div className="text-xs text-slate-500">NAV Price</div>
                      </div>
                    </div>
                    {isConnected && (
                      <div className="mt-3 text-sm">
                        <span className="text-slate-400">Your Balance: </span>
                        <span className="font-semibold text-cyan-400">{balance > 0 ? balance.toFixed(4) : '0'}</span>
                      </div>
                    )}
                    <div className="mt-4 flex gap-3">
                      <a href={getAerodromeLink(stock.contract_address, true)} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-center py-2.5 rounded-xl font-semibold text-sm transition">Buy</a>
                      <a href={getAerodromeLink(stock.contract_address, false)} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="flex-1 bg-rose-600 hover:bg-rose-500 text-center py-2.5 rounded-xl font-semibold text-sm transition">Sell</a>
                    </div>
                  </div>
                )
              })}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-3 mt-8">
                <button disabled={page === 1} onClick={() => setPage(page - 1)} className="px-5 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg disabled:opacity-50 transition">Previous</button>
                <span className="text-slate-300">Page {page} of {totalPages}</span>
                <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="px-5 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg disabled:opacity-50 transition">Next</button>
              </div>
            )}
          </>
        )}

        {/* Modal */}
        {selectedStock && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50" onClick={() => setSelectedStock(null)}>
            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold">{selectedStock.symbol}</h2>
                  <p className="text-slate-400">{selectedStock.name}</p>
                </div>
                <button onClick={() => setSelectedStock(null)} className="text-slate-400 hover:text-white text-2xl">&times;</button>
              </div>
              <div className="space-y-3 text-sm">
                <div><span className="text-slate-400">NAV Price:</span> <span className="font-semibold text-emerald-400">${selectedStock.nav_price || '—'}</span></div>
                <div><span className="text-slate-400">Multiplier:</span> {selectedStock.multiplier || '1.0'}</div>
                <div><span className="text-slate-400">Contract:</span> <span className="font-mono text-xs break-all">{selectedStock.contract_address}</span></div>
              </div>
              <div className="mt-6 flex gap-3">
                <a href={getAerodromeLink(selectedStock.contract_address, true)} target="_blank" className="flex-1 bg-emerald-600 text-center py-3 rounded-xl font-semibold hover:bg-emerald-500 transition">Buy</a>
                <a href={getAerodromeLink(selectedStock.contract_address, false)} target="_blank" className="flex-1 bg-rose-600 text-center py-3 rounded-xl font-semibold hover:bg-rose-500 transition">Sell</a>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}