/// <reference types="vite/client" />
import './Table.css'
import PlayerSeat from '../playerSeat/PlayerSeat'
import { useEffect, useRef, useState } from 'react'
import Pot from '../Pot/Pot'
import type { Card } from '../../types/card'
import { generateCards } from '../../utils/deck'
import { determineWinner } from '../../game/handEvalutor'
import type { Player } from '../../types/player'

const avatar = new URL('../../assets/hacker.png', import.meta.url).toString()
const DEAL_INTERVAL_MS = 400
const DEAL_SEATS = [1, 4, 1, 4, 1, 4]
const BET_AMOUNT = 100

const initialSeats: Player[] = [
    { seatNumber: 1, playerName: 'Dealer', chips: 0, avatar, cards: [], winner: false },
    { seatNumber: 4, playerName: 'Player 4', chips: 2500, avatar, cards: [], winner: false }
]

function createEmptyPlayerCards(): Record<number, Card[]> {
    return Object.fromEntries(
        Array.from({ length: 6 }, (_, index) => [index + 1, []])
    )
}

function Table() {
    const [deck, setDeck] = useState<Card[]>(generateCards)
    const [seats, setSeats] = useState<Player[]>(initialSeats)
    const [resultDeclared, setResultDeclared] = useState(false)
    const [winner, setWinner] = useState<string | null>(null)
    const [potAmount, setPotAmount] = useState(0)
    const [activeRound, setActiveRound] = useState(false)
    const [isDealing, setIsDealing] = useState(false)
    const [playerCards, setPlayerCards] = useState<Record<number, Card[]>>(createEmptyPlayerCards)
    const [winningAmount, setWinningAmount] = useState(0)
    const dealTimerRef = useRef<number | null>(null)

    useEffect(() => {
        return () => {
            if (dealTimerRef.current !== null) {
                window.clearTimeout(dealTimerRef.current)
            }
        }
    }, [])

    function placeBet() {
        setPotAmount((previousPot) => previousPot + BET_AMOUNT)
        setSeats((prevSeats) =>
            prevSeats.map((seat) =>
                seat.seatNumber === 4 ? { ...seat, chips: seat.chips - BET_AMOUNT } : seat
            )
        )
    }

    function dealCards() {
        if (deck.length < DEAL_SEATS.length || isDealing || potAmount <= 0) {
            return
        }

        const nextDeck = [...deck]
        const nextPlayerCards = Object.fromEntries(
            Object.entries(playerCards).map(([seatNumber, cards]) => [seatNumber, [...cards]])
        ) as Record<number, Card[]>

        setIsDealing(true)
        setActiveRound(true)

        const dealCard = (index: number) => {
            const seatNumber = DEAL_SEATS[index]
            const randomIndex = Math.floor(Math.random() * nextDeck.length)
            const [dealtCard] = nextDeck.splice(randomIndex, 1)
            nextPlayerCards[seatNumber] = [...nextPlayerCards[seatNumber], dealtCard]

            setDeck([...nextDeck])
            setPlayerCards({ ...nextPlayerCards })

            if (index === DEAL_SEATS.length - 1) {
                const roundResult = determineWinner(nextPlayerCards) ?? { winner: null, amount: 0 }
                setWinner(roundResult.winner === null ? null : `Player ${roundResult.winner}`)
                setWinningAmount(roundResult.amount)
                setResultDeclared(true)
                setIsDealing(false)
                dealTimerRef.current = null
                return
            }

            dealTimerRef.current = window.setTimeout(() => dealCard(index + 1), DEAL_INTERVAL_MS)
        }

        dealCard(0)
    }

    function resetGame() {
        if (dealTimerRef.current !== null) {
            window.clearTimeout(dealTimerRef.current)
            dealTimerRef.current = null
        }
        setDeck(generateCards())
        setSeats(initialSeats)
        setResultDeclared(false)
        setWinner(null)
        setPotAmount(0)
        setActiveRound(false)
        setIsDealing(false)
        setPlayerCards(createEmptyPlayerCards())
        setWinningAmount(0)
    }
    return (
        <div className="table">
            <div className="table-container">
                <Pot amount={winner ? winningAmount : potAmount} />
                {resultDeclared && winner && (
                    <div className="winner-announcement">
                        <h2>{`${winner} wins!`}</h2>
                    </div>
                )}
                {seats.map((seat) => (
                    <PlayerSeat
                        key={seat.seatNumber}
                        seatNumber={seat.seatNumber}
                        playerName={seat.playerName}
                        chips={seat.chips}
                        avatar={seat.avatar}
                        cards={playerCards[seat.seatNumber]}
                        winner={Boolean(resultDeclared && winner?.includes('Player 4') && seat.seatNumber === 4)}
                    />
                ))}
            </div>
            <div className="table-actions">
                {!activeRound && (
                    <button onClick={placeBet}>Place Bet</button>
                )}
                {!activeRound && (
                    <button onClick={dealCards} disabled={potAmount <= 0 || isDealing}>
                        {isDealing ? 'Dealing...' : 'Deal Cards'}
                    </button>
                )}
                {resultDeclared && (
                    <button onClick={resetGame}>Reset Game</button>
                )}
            </div>
        </div>
    )
}

export default Table