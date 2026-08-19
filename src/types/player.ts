import { Card } from "./card"

export type Player = {
    seatNumber: number,
    playerName: string,
    chips:number,
    avatar: string,
    cards: Array<Card>
    winner: boolean

}