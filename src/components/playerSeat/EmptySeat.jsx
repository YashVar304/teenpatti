import './playerSeat.css'
import { UserRoundPlus } from 'lucide-react'
function EmptySeat({ seatNumber }) {
    return (
        <div className={`empty-seat seat-${seatNumber}`}>
            <UserRoundPlus />
        </div>
    )
}
export default EmptySeat