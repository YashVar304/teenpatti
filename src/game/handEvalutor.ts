import { Card } from '../types/card';
export const winingCombinationPriority = ['Trail', 'Pure Sequence', 'Sequence', 'Color', 'Pair', 'High Card'];
    function determineCombination(cards: Card[]): string | null {
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

    export function determineWinner(cardsByPlayer: Record<number, Card[]> ) {
        const player1Cards = cardsByPlayer[1] || []
        const player4Cards = cardsByPlayer[4] || []

        if (player1Cards.length === 3 && player4Cards.length === 3) {
            const player1Combination: string | null = determineCombination(player1Cards)
            const player4Combination: string | null = determineCombination(player4Cards)
            console.log("Player 1 Combination:", player1Combination)
            console.log("Player 4 Combination:", player4Combination)

            const player1Priority = winingCombinationPriority.indexOf(player1Combination)
            const player4Priority = winingCombinationPriority.indexOf(player4Combination)
            console.log("Player 1 Priority:", player1Priority)
            console.log("Player 4 Priority:", player4Priority)

            if (player1Priority < player4Priority) {
                console.log("Dealer wins!")
                return { winner: 1, amount: 0 }
            } else if (player1Priority > player4Priority) {
                console.log("Player 4 wins!")
                return { winner: 4, amount: 0 }
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

                if (player1HighestCard > player4HighestCard) {
                    console.log("Dealer wins!")
                    return { winner: 1, amount: 0 }
                } else if (player1HighestCard < player4HighestCard) {
                    console.log("Player 4 wins!")
                    return { winner: 4, amount: 0 }
                } else {
                    console.log("It's a tie!")
                    return { winner: null, amount: 0 }
                }
            }
        }
    }