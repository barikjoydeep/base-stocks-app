import { NextResponse } from 'next/server'

export async function GET() {
  // Sample data based on typical Base tokenized stocks movers
  // Later you can replace with real data from TrueHold, DexScreener, or on-chain
  const gainers = [
    { symbol: 'TSLAc', name: 'Tesla Inc.', change: 4.82, volume: '12.4M' },
    { symbol: 'NVDAc', name: 'NVIDIA Corporation', change: 3.15, volume: '28.7M' },
    { symbol: 'METAc', name: 'Meta Platforms', change: 2.41, volume: '8.9M' },
    { symbol: 'AAPLc', name: 'Apple Inc.', change: 1.67, volume: '15.2M' },
    { symbol: 'AMZNc', name: 'Amazon.com', change: 1.23, volume: '9.6M' },
  ]

  const losers = [
    { symbol: 'MSTRc', name: 'MicroStrategy', change: -5.34, volume: '6.1M' },
    { symbol: 'COINc', name: 'Coinbase', change: -3.89, volume: '4.8M' },
    { symbol: 'GOOGLc', name: 'Alphabet', change: -2.15, volume: '11.3M' },
    { symbol: 'MSFTc', name: 'Microsoft', change: -1.72, volume: '7.4M' },
    { symbol: 'INTCc', name: 'Intel', change: -1.28, volume: '3.2M' },
  ]

  return NextResponse.json({ gainers, losers })
}