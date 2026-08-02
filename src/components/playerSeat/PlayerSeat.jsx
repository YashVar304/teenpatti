import './playerSeat.css'
import Avtar from '../../assets/hacker.png'
function PlayerSeat({ seatNumber , playerName = `Player ${seatNumber}`, chips = 1000, avatar = Avtar }) {
    return (
        <div className={`player-seat seat-${seatNumber}`}>
            <div className="player-info">
                <img className="player-avatar" src={avatar} alt={`Player ${seatNumber}`} />
                <p className="player-name">{playerName}</p>
                {playerName !== 'Dealer' && <p className="player-chips">Chips: {chips}</p>} 
            </div>
        </div>
    )
}
export default PlayerSeat