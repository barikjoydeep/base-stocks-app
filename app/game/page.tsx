'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const symbols = ['🚀', '💎', '📈', '🪙', '⚡', '🔥', '🌙', '⭐']

export default function MemoryGame() {
  const [cards, setCards] = useState<{ id: number; symbol: string; flipped: boolean; matched: boolean }[]>([])
  const [flipped, setFlipped] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [matches, setMatches] = useState(0)
  const [bestMoves, setBestMoves] = useState<number | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem('memory-best')
    if (saved) setBestMoves(Number(saved))
    initGame()
  }, [])

  const initGame = () => {
    const deck = [...symbols, ...symbols]
      .sort(() => Math.random() - 0.5)
      .map((symbol, index) => ({
        id: index,
        symbol,
        flipped: false,
        matched: false,
      }))
    setCards(deck)
    setFlipped([])
    setMoves(0)
    setMatches(0)
  }

  const handleFlip = (id: number) => {
    if (flipped.length === 2 || cards[id].flipped || cards[id].matched) return

    const newCards = [...cards]
    newCards[id].flipped = true
    setCards(newCards)
    setFlipped([...flipped, id])

    if (flipped.length === 1) {
      setMoves(m => m + 1)
      const firstId = flipped[0]
      if (cards[firstId].symbol === cards[id].symbol) {
        setTimeout(() => {
          const matchedCards = [...newCards]
          matchedCards[firstId].matched = true
          matchedCards[id].matched = true
          setCards(matchedCards)
          setMatches(m => m + 1)
          setFlipped([])

          if (matches + 1 === symbols.length) {
            const finalMoves = moves + 1
            if (!bestMoves || finalMoves < bestMoves) {
              setBestMoves(finalMoves)
              localStorage.setItem('memory-best', finalMoves.toString())
            }
          }
        }, 600)
      } else {
        setTimeout(() => {
          const resetCards = [...newCards]
          resetCards[firstId].flipped = false
          resetCards[id].flipped = false
          setCards(resetCards)
          setFlipped([])
        }, 900)
      }
    }
  }

  const won = matches === symbols.length

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-lg w-full text-center">
        <Link href="/" className="inline-block mb-6 text-cyan-300 hover:text-cyan-200 text-sm">
          ← Back to Dashboard
        </Link>

        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">
          Base Memory Match
        </h1>
        <p className="text-blue-200/70 mb-6">Match all the pairs!</p>

        <div className="flex justify-center gap-8 mb-6 text-sm">
          <div>Moves: <span className="font-bold text-cyan-400">{moves}</span></div>
          <div>Best: <span className="font-bold text-emerald-400">{bestMoves ?? '—'}</span></div>
        </div>

        <div className="grid grid-cols-4 gap-3 mb-8">
          {cards.map((card) => (
            <button
              key={card.id}
              onClick={() => handleFlip(card.id)}
              className={`aspect-square rounded-xl text-4xl flex items-center justify-center transition-all duration-300 ${
                card.flipped || card.matched
                  ? 'bg-slate-700 border-2 border-cyan-500'
                  : 'bg-slate-900 border border-slate-700 hover:border-slate-500'
              } ${card.matched ? 'opacity-60' : ''}`}
            >
              {card.flipped || card.matched ? card.symbol : '?'}
            </button>
          ))}
        </div>

        {won && (
          <div className="mb-6 text-xl font-semibold text-emerald-400">
            🎉 You Won in {moves} moves!
          </div>
        )}

        <button
          onClick={initGame}
          className="w-full bg-indigo-600 hover:bg-indigo-500 py-4 rounded-2xl text-lg font-bold transition"
        >
          {won ? 'Play Again' : 'Restart'}
        </button>
      </div>
    </main>
  )
}