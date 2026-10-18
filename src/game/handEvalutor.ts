import type { Card } from '../types/card'

export const winingCombinationPriority = ['Trail', 'Pure Sequence', 'Sequence', 'Color', 'Pair', 'High Card']

const rankValue = (rank: Card['rank']): number => {
    if (rank === 'A') return 14
    if (rank === 'K') return 13
    if (rank === 'Q') return 12
    if (rank === 'J') return 11
    return Number(rank)
}

function getHandScore(cards: Card[]): number[] | null {
    if (cards.length !== 3) {
        return null
    }

    const ranks = cards.map((card) => rankValue(card.rank)).sort((a, b) => b - a)
    const isTrail = ranks[0] === ranks[2]
    const isFlush = cards.every((card) => card.suit === cards[0].suit)
    const isWheel = ranks[0] === 14 && ranks[1] === 3 && ranks[2] === 2
    const isSequence = isWheel || ranks[0] - ranks[1] === 1 && ranks[1] - ranks[2] === 1
    const pairRank = ranks[0] === ranks[1] ? ranks[0] : ranks[1] === ranks[2] ? ranks[1] : 0

    if (isTrail) return [6, ranks[0]]
    if (isSequence && isFlush) return [5, isWheel ? 3 : ranks[0]]
    if (isSequence) return [4, isWheel ? 3 : ranks[0]]
    if (isFlush) return [3, ...ranks]
    if (pairRank > 0) return [2, pairRank, ranks.find((rank) => rank !== pairRank) ?? 0]
    return [1, ...ranks]
}

function compareScores(left: number[], right: number[]): number {
    for (let index = 0; index < Math.max(left.length, right.length); index += 1) {
        const difference = (left[index] ?? 0) - (right[index] ?? 0)
        if (difference !== 0) {
            return difference
        }
    }
    return 0
}

export function determineWinner(cardsByPlayer: Record<number, Card[]>) {
    const scoredPlayers = Object.entries(cardsByPlayer)
        .map(([seatNumber, cards]) => ({
            seatNumber: Number(seatNumber),
            score: getHandScore(cards)
        }))
        .filter((player): player is { seatNumber: number; score: number[] } => player.score !== null)

    if (scoredPlayers.length < 2) {
        return null
    }

    let bestScore = scoredPlayers[0].score
    let winners = [scoredPlayers[0].seatNumber]

    for (const player of scoredPlayers.slice(1)) {
        const comparison = compareScores(player.score, bestScore)
        if (comparison > 0) {
            bestScore = player.score
            winners = [player.seatNumber]
        } else if (comparison === 0) {
            winners.push(player.seatNumber)
        }
    }

    return {
        winner: winners.length === 1 ? winners[0] : null,
        winners,
        amount: 0
    }
}
