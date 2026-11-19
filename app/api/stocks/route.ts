import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const res = await fetch('https://api.coinbase.com/v1/tokenized-stocks?page_size=100', {
      next: { revalidate: 60 }, // Cache for 60 seconds
    })

    if (!res.ok) {
      throw new Error(`Coinbase API error: ${res.status}`)
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (error: any) {
    console.error(error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch stocks' },
      { status: 500 }
    )
  }
}