import './playerSeat.css'
import Avtar from '../../assets/hacker.png'
import PlayingCard from '../playingCard/PlayingCard'
import type { Player } from '../../types/player'

type PlayerSeatProps = Player & {
    cardsVisible?: boolean
    isActive?: boolean
    folded?: boolean
    isDealer?: boolean
}

function PlayerSeat({
    seatNumber,
    playerName = `Player ${seatNumber}`,
    chips = 1000,
    avatar = Avtar,
    cards = [],
    winner = false,
    isBlind = true,
    cardsVisible = false,
    isActive = false,
    folded = false,
    isDealer = false
}: PlayerSeatProps) {
    return (
        <>
            <div className={`player-seat seat-${seatNumber}${isActive ? ' active' : ''}${folded ? ' folded' : ''}${isDealer ? ' dealer' : ''}`}>
                <div className="player-info">
                    <img className={`player-avatar ${winner ? 'winner' : ''}`} src={avatar} alt={`Player ${seatNumber}`} />
                </div>
                <p className="player-name">{playerName}</p>
                {!isDealer && <p className="player-chips">Chips: {chips}</p>}
                {!isDealer && (folded
                    ? <p className="player-state">Folded</p>
                    : <p className="player-state">{isActive ? 'Your turn' : isBlind ? 'Blind' : 'Seen'}</p>)}
            </div>
            {!isDealer && (
                <div className={`seat-cards seat-${seatNumber}${folded ? ' folded' : ''}`}>
                    {cards.map((card, index) => (
                        <PlayingCard
                            key={`${card.rank}-${card.suit}-${index}`}
                            rank={card.rank}
                            suit={card.suit}
                            isFaceDown={!cardsVisible}
                        />
                    ))}
                </div>
            )}
        </>
    )
}

export default PlayerSeat