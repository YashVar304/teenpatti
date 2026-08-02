import './table.css'
import PlayerSeat from '../playerSeat/PlayerSeat'
import EmptySeat from '../playerSeat/EmptySeat'
import avatar from '../../assets/hacker.png'
import { useState } from 'react'

function Table() {
    const [seats, setSeats] = useState([
        { seatNumber: 1, playerName: 'Dealer', chips: 0, avatar: avatar },
        { seatNumber: 2, playerName: '', chips: 0, avatar: '' },
        { seatNumber: 3, playerName: 'Player 3', chips: 2000, avatar: avatar },
        { seatNumber: 4, playerName: 'Player 4', chips: 2500, avatar: avatar },
        { seatNumber: 5, playerName: 'Player 5', chips: 3000, avatar: avatar },
        { seatNumber: 6, playerName: 'Player 6', chips: 3500, avatar: avatar },
    ])
    return (
        <div className="table">
        <div className="table-container">
            {seats.map((seat) => (
                seat.playerName ? (
                    <PlayerSeat
                        key={seat.seatNumber}
                        seatNumber={seat.seatNumber}
                        playerName={seat.playerName}
                        chips={seat.chips}
                        avatar={seat.avatar}
                    />
                ) : (
                    <EmptySeat key={seat.seatNumber} seatNumber={seat.seatNumber} />
                )
            ))}
        
        </div>
        </div>
    )
}
export default Table