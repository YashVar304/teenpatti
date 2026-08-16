import { Card, Rank, Suit } from '../types/card'

export function generateCards(): Card[] {
        const suits: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'] 
        const ranks: Rank[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'] 
        const cards: Card[] = []

        for (const suit of suits) {
            for (const rank of ranks) {
                cards.push({ suit, rank })
            }
        }

        return cards;
    }

