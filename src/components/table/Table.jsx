import './table.css'
import PlayerSeat from '../playerSeat/PlayerSeat'
import avatar from '../../assets/hacker.png'
import { useState } from 'react'
import Pot from '../Pot/Pot'

function Table() {
    function generateCards() {
        const suits = ['hearts', 'diamonds', 'clubs', 'spades']
        const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']
        const cards = []

        for (const suit of suits) {
            for (const rank of ranks) {
                cards.push({ suit, rank })
            }
        }

        return cards
    }

    const [deck, setDeck] = useState(generateCards())
     const [seats,setSeats] = useState([
        { seatNumber: 1, playerName: 'Dealer', chips: 0, avatar: avatar },
        { seatNumber: 4, playerName: 'Player 4', chips: 2500, avatar: avatar }
    ])
    const [resultDeclared, setResultDeclared] = useState(false)
    const [winner, setWinner] = useState(null)
    const [potAmount, setPotAmount] = useState(0)
    const [activeRound, setActiveRound] = useState(false)
    const [isDealing, setIsDealing] = useState(false)
    const [playerCards, setPlayerCards] = useState({
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
        const nextPlayerCards = {
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
                    determineWinner(nextPlayerCards)
                }
            }, index * 400)
        })
    }

   
    const winingCombinationPriority = ['Trail', 'Pure Sequence', 'Sequence', 'Color', 'Pair', 'High Card'];
    function determineCombination(cards) {
        // Implement the logic to determine the combination of the given cards
        // Return the combination as a string (e.g., 'Trail', 'Pure Sequence', etc.)
        if(cards.length === 3) {
            const ranks = cards.map(card => card.rank);
            const suits = cards.map(card => card.suit);

            // Check for Trail (Three of a Kind)
            if (ranks[0] === ranks[1] && ranks[1] === ranks[2]) {
                return 'Trail';
            }

            // Check for Pure Sequence (Straight Flush)
            const rankValues = ranks.map(rank => {
                if (rank === 'A') return 14;
                if (rank === 'K') return 13;
                if (rank === 'Q') return 12;
                if (rank === 'J') return 11;
                return parseInt(rank);
            }).sort((a, b) => a - b);

            const isSequence = rankValues[2] - rankValues[1] === 1 && rankValues[1] - rankValues[0] === 1 && new Set(suits).size === 1;
            if (isSequence) {
                return 'Pure Sequence';
            }

            // Check for Sequence (Straight)
            const isStraight = rankValues[2] - rankValues[1] === 1 && rankValues[1] - rankValues[0] === 1 && new Set(suits).size > 1;
            if (isStraight) {
                return 'Sequence';
            }

            // Check for Color (Flush)
            if (new Set(suits).size === 1) {
                return 'Color';
            }

            // Check for Pair
            if (ranks[0] === ranks[1] || ranks[1] === ranks[2] || ranks[0] === ranks[2]) {
                return 'Pair';
            }

            // If none of the above, it's a High Card
            return 'High Card';
        }
        return null;    
    }

    function determineWinner(cardsByPlayer = playerCards) {
        const player1Cards = cardsByPlayer[1] || []
        const player4Cards = cardsByPlayer[4] || []

        if (player1Cards.length === 3 && player4Cards.length === 3) {
            const player1Combination = determineCombination(player1Cards)
            const player4Combination = determineCombination(player4Cards)
            console.log("Player 1 Combination:", player1Combination)
            console.log("Player 4 Combination:", player4Combination)

            const player1Priority = winingCombinationPriority.indexOf(player1Combination)
            const player4Priority = winingCombinationPriority.indexOf(player4Combination)
            console.log("Player 1 Priority:", player1Priority)
            console.log("Player 4 Priority:", player4Priority)

            if (player1Priority < player4Priority) {
                setResultDeclared(true);
                console.log("Dealer wins!")
                setWinner("Dealer wins!")
                setWinningAmount(0)
            } else if (player1Priority > player4Priority) {
                setResultDeclared(true);
                console.log("Player 4 wins!")
                setWinner("Player 4 wins!")
                setWinningAmount(potAmount*2)
                setSeats((prevSeats) =>
                        prevSeats.map((seat) =>
                            seat.seatNumber === 4 ? { ...seat, chips: seat.chips + potAmount*2 } : seat
                        )
                    )
            } else {
                // If both players have the same combination, compare the highest card
                const player1HighestCard = Math.max(...player1Cards.map(card => {
                    if (card.rank === 'A') return 14
                    if (card.rank === 'K') return 13
                    if (card.rank === 'Q') return 12
                    if (card.rank === 'J') return 11
                    return parseInt(card.rank)
                }))

                const player4HighestCard = Math.max(...player4Cards.map(card => {
                    if (card.rank === 'A') return 14
                    if (card.rank === 'K') return 13
                    if (card.rank === 'Q') return 12
                    if (card.rank === 'J') return 11
                    return parseInt(card.rank)
                }))
                setResultDeclared(true);

                if (player1HighestCard > player4HighestCard) {
                    console.log("Dealer wins!")
                    setWinner("Dealer wins!")
                    setWinningAmount(0)
                } else if (player1HighestCard < player4HighestCard) {
                    setWinner("Player 4 wins!")
                    console.log("Player 4 wins!")
                    setWinningAmount(potAmount*2) 
                    setSeats((prevSeats) =>
                        prevSeats.map((seat) =>
                            seat.seatNumber === 4 ? { ...seat, chips: seat.chips + potAmount*2 } : seat
                        )
                    )
                } else {
                    setWinner("It's a tie!")
                    console.log("It's a tie!") 
                }
            }
        }
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
                        <h2>{winner}</h2>
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