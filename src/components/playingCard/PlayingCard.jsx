import './playingCard.css'
import {Heart, Diamond, Club, Spade} from 'lucide-react'
function PlayingCard({ rank, suit , isFaceDown=true}) {
    if(isFaceDown){
        return(<>
        <div className='playing-card card-back'>
            <div className='card-back-design'>
                 <span>♠ ♥ ♣ ♦</span>
            </div>
        </div>
        </>)
    }
    return (
        <div className={`playing-card ${suit}`}>
            <div className="rank">{rank}</div>
            <div className="suit">
                {suit === 'hearts' && <Heart />}
                {suit === 'diamonds' && <Diamond />}
                {suit === 'clubs' && <Club />}
                {suit === 'spades' && <Spade />}
            </div>
        </div>
    )
}
export default PlayingCard;