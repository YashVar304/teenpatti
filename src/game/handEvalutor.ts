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
                if(player1Combination === 'Trail') {
                    const player1RankValue = player1Cards[0].rank === 'A' ? 14 : player1Cards[0].rank === 'K' ? 13 : player1Cards[0].rank === 'Q' ? 12 : player1Cards[0].rank === 'J' ? 11 : parseInt(player1Cards[0].rank);
                    const player4RankValue = player4Cards[0].rank === 'A' ? 14 : player4Cards[0].rank === 'K' ? 13 : player4Cards[0].rank === 'Q' ? 12 : player4Cards[0].rank === 'J' ? 11 : parseInt(player4Cards[0].rank);

                    if (player1RankValue > player4RankValue) {
                        console.log("Dealer wins!")
                        return { winner: 1, amount: 0 }
                    } else if (player1RankValue < player4RankValue) {
                        console.log("Player 4 wins!")
                        return { winner: 4, amount: 0 }
                    } else {
                        console.log("It's a tie!")
                        return { winner: null, amount: 0 }
                    }
                }
                if(player1Combination === 'Pure Sequence' || player1Combination === 'Sequence') {
                    const player1RankValues = player1Cards.map(card => card.rank === 'A' ? 14 : card.rank === 'K' ? 13 : card.rank === 'Q' ? 12 : card.rank === 'J' ? 11 : parseInt(card.rank)).sort((a, b) => a - b);
                    const player4RankValues = player4Cards.map(card => card.rank === 'A' ? 14 : card.rank === 'K' ? 13 : card.rank === 'Q' ? 12 : card.rank === 'J' ? 11 : parseInt(card.rank)).sort((a, b) => a - b);
                    
                    for (let i = 2; i >= 0; i--) {
                        if (player1RankValues[i] > player4RankValues[i]) {
                            console.log("Dealer wins!")
                            return { winner: 1, amount: 0 }
                        } else if (player1RankValues[i] < player4RankValues[i]) {
                            console.log("Player 4 wins!")
                            return { winner: 4, amount: 0 }
                        }else {
                            continue;
                        }
                    }
                    console.log("It's a tie!")
                    return { winner: null, amount: 0 }
                }
                if(player1Combination === 'Color') {
                    const player1RankValues = player1Cards.map(card => card.rank === 'A' ? 14 : card.rank === 'K' ? 13 : card.rank === 'Q' ? 12 : card.rank === 'J' ? 11 : parseInt(card.rank)).sort((a, b) => a - b);
                    const player4RankValues = player4Cards.map(card => card.rank === 'A' ? 14 : card.rank === 'K' ? 13 : card.rank === 'Q' ? 12 : card.rank === 'J' ? 11 : parseInt(card.rank)).sort((a, b) => a - b);
                    
                    for (let i = 2; i >= 0; i--) {
                        if (player1RankValues[i] > player4RankValues[i]) {
                            console.log("Dealer wins!")
                            return { winner: 1, amount: 0 }
                        } else if (player1RankValues[i] < player4RankValues[i]) {
                            console.log("Player 4 wins!")
                            return { winner: 4, amount: 0 }
                        }else {
                            continue;
                        }
                    }
                    console.log("It's a tie!")
                    return { winner: null, amount: 0 }
                }
            }
            if(player1Combination === 'Pair') {
                const player1PairRank = player1Cards.find(card => player1Cards.filter(c => c.rank === card.rank).length === 2)?.rank;
                const player4PairRank = player4Cards.find(card => player4Cards.filter(c => c.rank === card.rank).length === 2)?.rank;
                
                const player1PairValue = player1PairRank === 'A' ? 14 : player1PairRank === 'K' ? 13 : player1PairRank === 'Q' ? 12 : player1PairRank === 'J' ? 11 : parseInt(player1PairRank || '0');
                const player4PairValue = player4PairRank === 'A' ? 14 : player4PairRank === 'K' ? 13 : player4PairRank === 'Q' ? 12 : player4PairRank === 'J' ? 11 : parseInt(player4PairRank || '0');
                if (player1PairValue > player4PairValue) {
                    console.log("Dealer wins!")
                    return { winner: 1, amount: 0 }
                } else if (player1PairValue < player4PairValue) {
                    console.log("Player 4 wins!")
                    return { winner: 4, amount: 0 }
                } 
                else{
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
                const player1TotalRankValue = player1Cards.reduce((total, card) => {
                    if (card.rank === 'A') return total + 14
                    if (card.rank === 'K') return total + 13
                    if (card.rank === 'Q') return total + 12
                    if (card.rank === 'J') return total + 11
                    return total + parseInt(card.rank)
                }, 0)
                
                const player4TotalRankValue = player4Cards.reduce((total, card) => {
                    if (card.rank === 'A') return total + 14
                    if (card.rank === 'K') return total + 13
                    if (card.rank === 'Q') return total + 12
                    if (card.rank === 'J') return total + 11
                    return total + parseInt(card.rank)
                }, 0)

                if (player1TotalRankValue > player4TotalRankValue) {
                    console.log("Dealer wins!")
                    return { winner: 1, amount: 0 }
                } else if (player1TotalRankValue < player4TotalRankValue) {
                    console.log("Player 4 wins!")
                    return { winner: 4, amount: 0 }
                } else {
                    console.log("It's a tie!")
                    return { winner: null, amount: 0 }
                }
            }
            }
            else{
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