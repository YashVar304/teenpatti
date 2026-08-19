import './playerSeat.css'
import Avtar from '../../assets/hacker.png'
import PlayingCard from '../playingCard/PlayingCard'
import { Player } from '../../types/player'

function PlayerSeat({ seatNumber, playerName = `Player ${seatNumber}`, chips = 1000, avatar = Avtar, cards = [] ,winner=false}:Player) {
    return (
        <>

        <div className={`player-seat seat-${seatNumber} `}>
            <div className="player-info">
                <img className={`player-avatar ${winner ? 'winner' : ''}`} src={avatar} alt={`Player ${seatNumber}`} />
                
            </div>
            <p className="player-name">{playerName}</p>
                {playerName !== 'Dealer' && <p className="player-chips">Chips: {chips}</p>}
            
            
        </div>
        <div className={`seat-cards seat-${seatNumber}`}>
                {cards.length > 0 && (
                    cards.map((card, index) => (
                        <PlayingCard key={`${card.rank}-${card.suit}-${index}`} rank={card.rank} suit={card.suit} />
                    ))
                ) }
            </div>
            </>
    )
}

export default PlayerSeat