
'use client'

import { useState } from 'react'

const markets = [
  {
    name: 'USD Coin',
    symbol: 'USDC',
    color: 'text-blue-400',
    icon: '💵',
    apy: '--',
    risk: 'Stablecoin',
  },
  {
    name: 'Ethereum',
    symbol: 'ETH',
    color: 'text-purple-400',
    icon: '💎',
    apy: '--',
    risk: 'Crypto Asset',
  },
  {
    name: 'Coinbase Bitcoin',
    symbol: 'cbBTC',
    color: 'text-orange-400',
    icon: '₿',
    apy: '--',
    risk: 'Bitcoin Asset',
  },
]

export default function Lend() {
  const [activeTab, setActiveTab] = useState('Lending')
  const [selectedAsset, setSelectedAsset] = useState('USDC')

  return (
    <main className="min-h-screen bg-[#080f22] text-white">

      <div className="max-w-7xl mx-auto px-5 py-7 md:px-8">

        {/* Navigation */}

        <nav className="flex flex-wrap justify-center gap-2 mb-10">

          {[
            ['Trade', '/'],
            ['Explore', '/explore'],
            ['Swap', '/swap'],
            ['Lend & Stake', '/lend'],
            ['Launch', '/launch'],
            ['Profile', '/profile'],
          ].map(([name, href]) => (

            <a
              key={href}
              href={href}
              className={`px-4 py-2 rounded-xl text-sm border transition ${
                href === '/lend'
                  ? 'bg-cyan-500 text-black border-cyan-400 font-bold'
                  : 'bg-slate-800/70 border-slate-700 hover:bg-slate-700'
              }`}
            >
              {name}
            </a>

          ))}

        </nav>

        {/* Header */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-10">

          <div>
            <p className="text-cyan-400 text-sm font-semibold mb-2">
              BASE DEFI ECOSYSTEM
            </p>

            <h1 className="text-4xl md:text-5xl font-bold">
              Lend <span className="text-cyan-400">&</span> Stake
            </h1>

            <p className="text-slate-400 mt-3">
              Put your digital assets to work.
            </p>
          </div>

          <button
            disabled
            className="px-6 py-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-semibold opacity-70 cursor-not-allowed"
          >
            Wallet Integration Pending
          </button>

        </div>

        {/* Overview */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">

          {[
            {
              title: 'Total Supplied',
              value: '$0.00',
              icon: '↗',
              color: 'text-cyan-400',
            },
            {
              title: 'Total Borrowed',
              value: '$0.00',
              icon: '↙',
              color: 'text-purple-400',
            },
            {
              title: 'Your Rewards',
              value: '$0.00',
              icon: '✦',
              color: 'text-green-400',
            },
          ].map((item) => (

            <div
              key={item.title}
              className="rounded-2xl border border-white/10 bg-[#111d35] p-6 hover:border-cyan-500/40 transition"
            >
              <div className="flex justify-between items-center">
                <p className="text-slate-400 text-sm">
                  {item.title}
                </p>

                <span className={`text-2xl ${item.color}`}>
                  {item.icon}
                </span>
              </div>

              <h2 className="text-3xl font-bold mt-5">
                {item.value}
              </h2>

              <p className="text-xs text-slate-500 mt-2">
                Connect wallet to view your position
              </p>
            </div>

          ))}

        </div>

        {/* Main Dashboard */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Markets */}

          <section className="lg:col-span-2 rounded-2xl border border-white/10 bg-[#111d35] p-5 md:p-7">

            <div className="flex flex-wrap justify-between items-center gap-4 mb-7">

              <div>
                <h2 className="text-2xl font-bold">
                  Explore Markets
                </h2>

                <p className="text-slate-400 text-sm mt-2">
                  Lending opportunities on Base
                </p>
              </div>

              <span className="text-xs px-3 py-2 rounded-lg bg-blue-500/10 text-blue-300 border border-blue-500/20">
                Base Network
              </span>

            </div>

            {/* Tabs */}

            <div className="flex gap-3 mb-6">

              {['Lending', 'Staking'].map((tab) => (

                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2 rounded-xl text-sm font-semibold transition ${
                    activeTab === tab
                      ? 'bg-cyan-500 text-black'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {tab}
                </button>

              ))}

            </div>

            {activeTab === 'Lending' ? (

              <div className="space-y-4">

                {markets.map((market) => (

                  <div
                    key={market.symbol}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl bg-[#0b152b] border border-white/5 p-5 hover:border-cyan-500/30 transition"
                  >

                    <div className="flex items-center gap-4">

                      <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-2xl">
                        {market.icon}
                      </div>

                      <div>
                        <h3 className={`font-bold ${market.color}`}>
                          {market.symbol}
                        </h3>

                        <p className="text-xs text-slate-500 mt-1">
                          {market.name}
                        </p>
                      </div>

                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6">

                      <div>
                        <p className="text-xs text-slate-500">
                          Supply APY
                        </p>

                        <p className="font-bold text-lg text-green-400">
                          {market.apy}
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedAsset(market.symbol)
                          setActiveTab('Lending')
                        }}
                        className="px-5 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-sm hover:bg-cyan-500 hover:text-black transition"
                      >
                        Select
                      </button>

                    </div>

                  </div>

                ))}

              </div>

            ) : (

              <div className="rounded-xl bg-[#0b152b] border border-white/5 p-8 text-center">

                <div className="text-5xl mb-5">✦</div>

                <h3 className="text-xl font-bold">
                  Staking Opportunities
                </h3>

                <p className="text-slate-400 text-sm mt-3">
                  Staking integrations are coming soon.
                </p>

                <span className="inline-block mt-5 px-4 py-2 rounded-lg bg-purple-500/10 text-purple-300 text-sm">
                  Coming Soon
                </span>

              </div>

            )}

            <p className="text-xs text-slate-500 mt-6">
              APY and market liquidity will appear after protocol integration.
            </p>

          </section>

          {/* Supply Panel */}

          <aside className="rounded-2xl border border-cyan-500/20 bg-gradient-to-b from-[#122747] to-[#111d35] p-6 h-fit">

            <p className="text-cyan-400 text-sm font-semibold">
              LENDING PANEL
            </p>

            <h2 className="text-2xl font-bold mt-3">
              Supply Assets
            </h2>

            <p className="text-sm text-slate-400 mt-2">
              Choose an asset to see your supply options.
            </p>

            <div className="mt-7">

              <label className="text-sm text-slate-400">
                Select Asset
              </label>

              <select
                value={selectedAsset}
                onChange={(e) => setSelectedAsset(e.target.value)}
                className="w-full mt-2 p-4 rounded-xl bg-[#0b152b] border border-slate-700 outline-none text-white"
              >

                {markets.map((market) => (
                  <option key={market.symbol} value={market.symbol}>
                    {market.symbol}
                  </option>
                ))}

              </select>

            </div>

            <div className="mt-6">

              <label className="text-sm text-slate-400">
                Amount
              </label>

              <div className="mt-2 flex items-center rounded-xl bg-[#0b152b] border border-slate-700 p-4">
                <input
                  type="number"
                  min="0"
                  placeholder="0.00"
                  disabled
                  className="w-full bg-transparent outline-none text-white placeholder:text-slate-600"
                />

                <span className="text-cyan-300 font-bold">
                  {selectedAsset}
                </span>
              </div>

            </div>

            <div className="mt-6 p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/10">

              <div className="flex justify-between text-sm">
                <span className="text-slate-400">
                  Network
                </span>

                <span className="text-cyan-300">
                  Base
                </span>
              </div>

              <div className="flex justify-between text-sm mt-3">
                <span className="text-slate-400">
                  Estimated APY
                </span>

                <span>
                  --
                </span>
              </div>

            </div>

            <button
              disabled
              className="w-full mt-6 py-4 rounded-xl bg-cyan-500 text-black font-bold opacity-50 cursor-not-allowed"
            >
              Supply (Integration Pending)
            </button>

            <p className="text-xs text-slate-500 text-center mt-4">
              Wallet and lending protocol are not connected yet.
            </p>

          </aside>

        </div>

        {/* Bottom Information */}

        <section className="mt-10 rounded-2xl border border-white/10 bg-[#111d35] p-6 md:p-8">

          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-5">

            <div>
              <h2 className="text-xl font-bold">
                Start Exploring Base DeFi
              </h2>

              <p className="text-slate-400 text-sm mt-2">
                Discover lending, liquidity and staking opportunities.
              </p>
            </div>

            <span className="text-cyan-300 text-sm font-semibold">
              Powered by Base Ecosystem
            </span>

          </div>

        </section>

        {/* Footer */}

        <footer className="text-center text-slate-500 text-xs mt-12 pb-5">
          Base Stocks App © 2026 | Lend & Stake
        </footer>

      </div>

    </main>
  )
}
