/// <reference types="vite/client" />
import './Table.css'
import PlayerSeat from '../playerSeat/PlayerSeat'
import { useState } from 'react'
import Pot from '../Pot/Pot'
import type { Card,Suit, Rank } from '../../types/card'
import { generateCards } from '../../utils/deck'
import { determineWinner } from '../../game/handEvalutor'
import { Player } from '../../types/player'

const avatar = new URL('../../assets/hacker.png', import.meta.url).toString()

function Table() {
    

    const [deck, setDeck] = useState<Card[]>(generateCards())
     const [seats,setSeats] = useState<Player[]>([
        { seatNumber: 1, playerName: 'Dealer', chips: 0, avatar: avatar, cards:[],winner: false },
        { seatNumber: 4, playerName: 'Player 4', chips: 2500, avatar: avatar, cards:[],winner: false }
    ])
    const [resultDeclared, setResultDeclared] = useState(false)
    const [winner, setWinner] = useState<string | null>(null)
    const [potAmount, setPotAmount] = useState(0)
    const [activeRound, setActiveRound] = useState(false)
    const [isDealing, setIsDealing] = useState(false)
    const [playerCards, setPlayerCards] = useState<Record<number, Card[]>>({
        1: [],
        2: [],
        3: [],
        4: [],
        5: [],
        6: []

    })
    const[winningAmount,setWinningAmount] = useState(0)

    function placeBet() {
        

        const betAmount = 100
        setPotAmount((prevPotAmount) => prevPotAmount + betAmount)
        setSeats((prevSeats) =>
            prevSeats.map((seat) =>
                seat.seatNumber === 4 ? { ...seat, chips: seat.chips - betAmount } : seat
            )
        )
    }

    function dealCards() {
        if (deck.length < 6 || isDealing) {
            return
        }

        const cardsToDeal = Math.min(6, deck.length)
        const nextDeck = [...deck]
        const nextPlayerCards: Record<number, Card[]> = {
            1: [...playerCards[1]],
            2: [...playerCards[2]],
            3: [...playerCards[3]],
            4: [...playerCards[4]],
            5: [...playerCards[5]],
            6: [...playerCards[6]]
        }
        const dealingSequence = Array.from({ length: cardsToDeal }, (_, index) => (index % 2 === 0 ? 1 : 4))

        setIsDealing(true)
        setActiveRound(true)

        dealingSequence.forEach((seatNumber, index) => {
            window.setTimeout(() => {
                if (nextDeck.length === 0) {
                    setDeck(generateCards())
                    nextDeck.push(...generateCards())
                }

                const randomIndex = Math.floor(Math.random() * nextDeck.length)
                const [dealtCard] = nextDeck.splice(randomIndex, 1)

                nextPlayerCards[seatNumber] = [...nextPlayerCards[seatNumber], dealtCard]
                setDeck([...nextDeck])
                setPlayerCards(nextPlayerCards)
                console.log(index, seatNumber, dealtCard, nextDeck.length, nextPlayerCards)
                if (index === dealingSequence.length - 1 || nextDeck.length === 0) {
                    setIsDealing(false)

                    const roundResult = determineWinner(nextPlayerCards) ?? { winner: null, amount: 0 }
                    const winningSeat = roundResult.winner
                    const winningPlayer = winningSeat === null ? null : `Player ${winningSeat}`

                    setWinner(winningPlayer)
                    setWinningAmount(roundResult.amount)
                    setResultDeclared(true)
                }
            }, index * 400)
        })
    }

   
    
    function resetGame() {
        setDeck(generateCards())
        setResultDeclared(false)
        setWinner(null)
        setPotAmount(0)
        setActiveRound(false)
        setIsDealing(false)
        setPlayerCards({
            1: [],
            2: [],
            3: [],
            4: [],
            5: [],
            6: []
        })
    }
    return (
        <div className="table">
            <div className="table-container">
                <Pot amount={winner? winningAmount : potAmount} />
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
                        winner={resultDeclared && winner && seat.seatNumber === 4 && winner.includes('Player 4')}
                    />
                ))}
            </div>
            <div className="table-actions">
                {!activeRound&&(
                    <button onClick={placeBet}>Place Bet</button>
                )}
                {!activeRound&&(
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