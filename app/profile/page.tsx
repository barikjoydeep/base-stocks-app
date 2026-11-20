'use client'
import { useAccount, useBalance, useDisconnect } from 'wagmi'

export default function Profile() {
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const { data: ethBalance } = useBalance({ address, chainId: 8453 })

  return (
    <main className="min-h-screen p-6 md:p-10 bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 text-white">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 flex flex-wrap gap-2 justify-center">
          <a href="/" className="px-4 py-2 rounded-xl bg-slate-800/60 border border-slate-700 text-sm">Trade</a>
          <a href="/explore" className="px-4 py-2 rounded-xl bg-slate-800/60 border border-slate-700 text-sm">Explore</a>
          <a href="/swap" className="px-4 py-2 rounded-xl bg-slate-800/60 border border-slate-700 text-sm">Swap</a>
          <a href="/lend" className="px-4 py-2 rounded-xl bg-slate-800/60 border border-slate-700 text-sm">Lend & Stake</a>
          <a href="/launch" className="px-4 py-2 rounded-xl bg-slate-800/60 border border-slate-700 text-sm">Launch</a>
          <a href="/profile" className="px-4 py-2 rounded-xl bg-cyan-600 text-sm">Profile</a>
        </div>

        <h1 className="text-4xl font-bold text-cyan-300 mb-6">Profile</h1>

        {isConnected ? (
          <div className="bg-slate-900/60 border border-slate-700 rounded-2xl p-6">
            <div className="text-sm text-slate-400">Address</div>
            <div className="font-mono text-emerald-400 break-all mt-1">{address}</div>
            <div className="mt-4 text-sm text-slate-400">Balance</div>
            <div className="text-2xl font-bold">{ethBalance ? (Number(ethBalance.value) / 1e18).toFixed(4) : '...'} ETH</div>
            <button onClick={() => disconnect()} className="mt-6 bg-rose-600 px-6 py-2 rounded-xl">Disconnect</button>
          </div>
        ) : (
          <div className="text-slate-400">Connect wallet from Trade page</div>
        )}
      </div>
    </main>
  )
}