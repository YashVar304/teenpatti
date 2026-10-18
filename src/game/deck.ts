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

    export function shuffleDeck(deck: Card[]): Card[] {
        const shuffledDeck = [...deck]
        for (let i = shuffledDeck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
            ;[shuffledDeck[i], shuffledDeck[j]] = [shuffledDeck[j], shuffledDeck[i]]
        }
        return shuffledDeck
    }
    export function drawCard(deck: Card[]): { card: Card; newDeck: Card[] } {
        if (deck.length === 0) {
            throw new Error('Deck is empty')
        }
        const card = deck[0]
        const newDeck = deck.slice(1)
        return { card, newDeck }
    }

