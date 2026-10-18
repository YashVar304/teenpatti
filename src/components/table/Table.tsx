/// <reference types="vite/client" />
import './table.css'
import PlayerSeat from '../playerSeat/PlayerSeat'
import { useEffect, useRef, useState } from 'react'
import Pot from '../Pot/Pot'
import type { Card } from '../../types/card'
import { generateCards, shuffleDeck, drawCard } from '../../game/deck'
import { determineWinner } from '../../game/handEvalutor'
import type { Player } from '../../types/player'


const avatar = new URL('../../assets/hacker.png', import.meta.url).toString()
const DEAL_INTERVAL_MS = 400
const DEALER_SEAT = 1
const MAX_SEATS = 6
const MAX_PLAYERS = MAX_SEATS - 1
const MIN_PLAYERS = 2
const CARDS_PER_PLAYER = 3
const BET_AMOUNT = 100
const SEEN_BET_MULTIPLIER = 2
const PLAYER_NICKNAMES = [
    'Ace',
    'Blaze',
    'Clover',
    'Dash',
    'Echo',
    'Flash',
    'Lucky',
    'Maverick',
    'Nova',
    'Raven',
    'Rocket',
    'Shadow',
    'Sparrow',
    'Tiger',
    'Viper',
    'Wizard'
]

function getRandomNickname(existingNames: string[]): string {
    const availableNames = PLAYER_NICKNAMES.filter((name) => !existingNames.includes(name))
    const nicknames = availableNames.length > 0 ? availableNames : PLAYER_NICKNAMES
    return nicknames[Math.floor(Math.random() * nicknames.length)]
}

const firstPlayerName = getRandomNickname([])
const initialSeats: Player[] = [
    { seatNumber: DEALER_SEAT, playerName: 'Dealer', chips: 0, avatar, cards: [], winner: false, isBlind: false, blindCount: 0 },
    { seatNumber: 4, playerName: firstPlayerName, chips: 2500, avatar, cards: [], winner: false, isBlind: true, blindCount: 0 },
    { seatNumber: 3, playerName: getRandomNickname([firstPlayerName]), chips: 2500, avatar, cards: [], winner: false, isBlind: true, blindCount: 0 }
]

function getPlayingSeats(tableSeats: Player[]): Player[] {
    return tableSeats.filter((seat) => seat.seatNumber !== DEALER_SEAT)
}

function createEmptyPlayerCards(): Record<number, Card[]> {
    return Object.fromEntries(
        Array.from({ length: 6 }, (_, index) => [index + 1, []])
    )
}

function Table() {
    const [deck, setDeck] = useState<Card[]>(() => shuffleDeck(generateCards()))
    const [seats, setSeats] = useState<Player[]>(initialSeats)
    const [resultDeclared, setResultDeclared] = useState(false)
    const [winningSeats, setWinningSeats] = useState<number[]>([])
    const [foldedSeats, setFoldedSeats] = useState<number[]>([])
    const [potAmount, setPotAmount] = useState(0)
    const [activeRound, setActiveRound] = useState(false)
    const [isDealing, setIsDealing] = useState(false)
    const [playerCards, setPlayerCards] = useState<Record<number, Card[]>>(createEmptyPlayerCards)
    const [winningAmount, setWinningAmount] = useState(0)
    const [roundMessage, setRoundMessage] = useState('')
    const [currentTurnSeat, setCurrentTurnSeat] = useState<number | null>(null)
    const [lastBetAmount, setLastBetAmount] = useState(0)
    const [showCurrentHand, setShowCurrentHand] = useState(false)
    const dealTimerRef = useRef<number | null>(null)
    const setupLocked = activeRound || potAmount > 0
    const currentPlayer = seats.find((seat) => seat.seatNumber === currentTurnSeat)
    const playingSeats = getPlayingSeats(seats)
    const turnBetAmount = currentPlayer?.isBlind
        ? BET_AMOUNT
        : BET_AMOUNT * SEEN_BET_MULTIPLIER

    useEffect(() => {
        return () => {
            if (dealTimerRef.current !== null) {
                window.clearTimeout(dealTimerRef.current)
            }
        }
    }, [])

    function placeBet() {
        if (playingSeats.some((seat) => seat.chips < BET_AMOUNT)) {
            return
        }

        setPotAmount((previousPot) => previousPot + BET_AMOUNT * playingSeats.length)
        setSeats((prevSeats) =>
            prevSeats.map((seat) =>
                seat.seatNumber === DEALER_SEAT
                    ? seat
                    : { ...seat, chips: seat.chips - BET_AMOUNT }
            )
        )
    }

    function addPlayer() {
        setSeats((previousSeats) => {
            if (getPlayingSeats(previousSeats).length >= MAX_PLAYERS) {
                return previousSeats
            }

            const occupiedSeats = new Set(previousSeats.map((seat) => seat.seatNumber))
            const seatNumber = Array.from({ length: MAX_SEATS }, (_, index) => index + 1)
                .find((number) => !occupiedSeats.has(number))

            if (seatNumber === undefined) {
                return previousSeats
            }

            return [
                ...previousSeats,
                {
                    seatNumber,
                    playerName: getRandomNickname(previousSeats.map((seat) => seat.playerName)),
                    chips: 2500,
                    avatar,
                    cards: [],
                    winner: false,
                    isBlind: true,
                    blindCount: 0
                }
            ]
        })
    }

    function removePlayer() {
        setSeats((previousSeats) => {
            if (getPlayingSeats(previousSeats).length <= MIN_PLAYERS) {
                return previousSeats
            }
            const lastPlayerSeat = [...previousSeats].reverse()
                .find((seat) => seat.seatNumber !== DEALER_SEAT)?.seatNumber
            return previousSeats.filter((seat) => seat.seatNumber !== lastPlayerSeat)
        })
    }

    function finishRound(activeSeatNumbers: number[], finishType: 'fold' | 'showdown') {
        const activeCards = Object.fromEntries(
            activeSeatNumbers.map((seatNumber) => [seatNumber, playerCards[seatNumber] ?? []])
        )
        const roundResult = determineWinner(activeCards)
        const winners = activeSeatNumbers.length === 1
            ? activeSeatNumbers
            : roundResult?.winners ?? []

        setWinningSeats(winners)
        setWinningAmount(winners.length > 0 ? potAmount : 0)
        if (winners.length > 0) {
            const basePayout = Math.floor(potAmount / winners.length)
            const remainder = potAmount % winners.length
            const payouts = new Map(
                winners.map((seatNumber, index): [number, number] => [
                    seatNumber,
                    basePayout + (index < remainder ? 1 : 0)
                ])
            )
            setSeats((previousSeats) =>
                previousSeats.map((seat) => ({
                    ...seat,
                    chips: seat.chips + (payouts.get(seat.seatNumber) ?? 0)
                }))
            )
        }

        const winnerNames = winners
            .map((seatNumber) => seats.find((seat) => seat.seatNumber === seatNumber)?.playerName)
            .filter((name): name is string => name !== undefined)
        setRoundMessage(
            winners.length === 0
                ? "It's a tie!"
                : winners.length > 1
                    ? `It's a tie! The pot is split between ${winnerNames.join(' and ')}.`
                    : finishType === 'fold'
                        ? `${winnerNames[0]} wins because everyone else folded!`
                        : `${winnerNames[0]} wins at showdown!`
        )
        setResultDeclared(true)
        setCurrentTurnSeat(null)
        setShowCurrentHand(false)
    }

    function advanceTurn(fromSeat: number, foldedSeatNumbers = foldedSeats) {
        const turnOrder = getPlayingSeats(seats)
        const currentIndex = turnOrder.findIndex((seat) => seat.seatNumber === fromSeat)
        for (let offset = 1; offset <= turnOrder.length; offset += 1) {
            const nextSeat = turnOrder[(currentIndex + offset) % turnOrder.length]
            if (!foldedSeatNumbers.includes(nextSeat.seatNumber)) {
                setCurrentTurnSeat(nextSeat.seatNumber)
                return
            }
        }
    }

    function revealCurrentHand() {
        if (currentTurnSeat === null) {
            return
        }
        setSeats((previousSeats) =>
            previousSeats.map((seat) =>
                seat.seatNumber === currentTurnSeat ? { ...seat, isBlind: false } : seat
            )
        )
        setShowCurrentHand(true)
    }

    function betOrCall(amount: number) {
        if (currentTurnSeat === null) {
            return
        }
        const currentPlayer = seats.find((seat) => seat.seatNumber === currentTurnSeat)
        if (!currentPlayer || currentPlayer.chips < amount) {
            return
        }

        setSeats((previousSeats) =>
            previousSeats.map((seat) =>
                seat.seatNumber === currentTurnSeat ? { ...seat, chips: seat.chips - amount } : seat
            )
        )
        setPotAmount((previousPot) => previousPot + amount)
        setLastBetAmount(amount)
        setShowCurrentHand(false)
        advanceTurn(currentTurnSeat)
    }

    function foldCurrentPlayer() {
        if (currentTurnSeat === null) {
            return
        }
        const foldingSeat = currentTurnSeat
        const updatedFoldedSeats = [...foldedSeats, foldingSeat]
        const remainingSeats = seats
            .filter((seat) => seat.seatNumber !== DEALER_SEAT)
            .map((seat) => seat.seatNumber)
            .filter((seatNumber) => !updatedFoldedSeats.includes(seatNumber))

        setFoldedSeats(updatedFoldedSeats)
        setShowCurrentHand(false)
        if (remainingSeats.length === 1) {
            finishRound(remainingSeats, 'fold')
            return
        }

        advanceTurn(foldingSeat, updatedFoldedSeats)
    }

    function showDown() {
        const activeSeatNumbers = seats
            .filter((seat) => seat.seatNumber !== DEALER_SEAT)
            .map((seat) => seat.seatNumber)
            .filter((seatNumber) => !foldedSeats.includes(seatNumber))
        finishRound(activeSeatNumbers, 'showdown')
    }

    function dealCards() {
        const dealOrder = Array.from(
            { length: CARDS_PER_PLAYER },
            () => playingSeats.map((seat) => seat.seatNumber)
        ).flat()

        if (deck.length < dealOrder.length || isDealing || potAmount <= 0) {
            return
        }

        let nextDeck = [...deck]
        const nextPlayerCards = Object.fromEntries(
            Object.entries(playerCards).map(([seatNumber, cards]) => [seatNumber, [...cards]])
        ) as Record<number, Card[]>

        setIsDealing(true)
        setActiveRound(true)

        const dealCard = (index: number) => {
            const seatNumber = dealOrder[index]

            const { card: dealtCard, newDeck: updatedDeck } = drawCard(nextDeck)
            nextDeck = updatedDeck
            nextPlayerCards[seatNumber] = [...nextPlayerCards[seatNumber], dealtCard]

            setDeck([...updatedDeck])
            setPlayerCards({ ...nextPlayerCards })

            if (index === dealOrder.length - 1) {
                setCurrentTurnSeat(playingSeats[0].seatNumber)
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
        setDeck(shuffleDeck(generateCards()))
        setSeats((previousSeats) =>
            previousSeats.map((seat) => ({
                ...seat,
                chips: seat.seatNumber === DEALER_SEAT ? 0 : 2500,
                cards: [],
                winner: false,
                isBlind: seat.seatNumber !== DEALER_SEAT,
                blindCount: 0
            }))
        )
        setResultDeclared(false)
        setWinningSeats([])
        setFoldedSeats([])
        setPotAmount(0)
        setActiveRound(false)
        setIsDealing(false)
        setPlayerCards(createEmptyPlayerCards())
        setWinningAmount(0)
        setCurrentTurnSeat(null)
        setLastBetAmount(0)
        setShowCurrentHand(false)
        setRoundMessage('')
    }
    return (
        <div className="table">
            <div className="table-container">
                <Pot amount={winningSeats.length > 0 ? winningAmount : potAmount} />
                {resultDeclared && (
                    <div className="winner-announcement">
                        <h2>{roundMessage}</h2>
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
                        cardsVisible={resultDeclared
                            ? !foldedSeats.includes(seat.seatNumber)
                            : currentTurnSeat === seat.seatNumber && showCurrentHand}
                        isActive={activeRound && currentTurnSeat === seat.seatNumber}
                        folded={foldedSeats.includes(seat.seatNumber)}
                        winner={resultDeclared && winningSeats.includes(seat.seatNumber)}
                        isBlind={seat.isBlind}
                        isDealer={seat.seatNumber === DEALER_SEAT}
                    />
                ))}
            </div>
            <div className="table-actions">
                {!activeRound && (
                    <>
                        <button onClick={addPlayer} disabled={setupLocked || playingSeats.length >= MAX_PLAYERS}>
                            Add Player ({playingSeats.length}/{MAX_PLAYERS})
                        </button>
                        <button onClick={removePlayer} disabled={setupLocked || playingSeats.length <= MIN_PLAYERS}>
                            Remove Player
                        </button>
                        <button onClick={placeBet} disabled={potAmount > 0 || playingSeats.some((seat) => seat.chips < BET_AMOUNT)}>
                            Place Ante ({BET_AMOUNT} each)
                        </button>
                    </>
                )}
                {!activeRound && (
                    <button onClick={dealCards} disabled={potAmount <= 0 || isDealing}>
                        {isDealing ? 'Dealing...' : 'Deal Cards'}
                    </button>
                )}
                {activeRound && currentTurnSeat !== null && !isDealing && (
                    <>
                        <p className="turn-status">
                            {currentPlayer?.playerName}'s turn ({currentPlayer?.isBlind ? 'blind' : 'seen'})
                        </p>
                        <button onClick={showCurrentHand ? () => setShowCurrentHand(false) : revealCurrentHand}>
                            {showCurrentHand ? 'Hide Cards' : 'See Cards'}
                        </button>
                        <button
                            onClick={() => betOrCall(turnBetAmount)}
                            disabled={(currentPlayer?.chips ?? 0) < turnBetAmount}
                        >
                            Bet {currentPlayer?.isBlind ? 'Blind' : 'Seen'} (₹{turnBetAmount})
                        </button>
                        {lastBetAmount > 0 && (
                            <button
                                onClick={() => betOrCall(lastBetAmount)}
                                disabled={(currentPlayer?.chips ?? 0) < lastBetAmount}
                            >
                                Call ₹{lastBetAmount}
                            </button>
                        )}
                        <button onClick={foldCurrentPlayer}>Fold</button>
                        <button onClick={showDown}>Show</button>
                    </>
                )}
                {resultDeclared && (
                    <button onClick={resetGame}>Reset Game</button>
                )}
            </div>
        </div>
    )
}

export default Table