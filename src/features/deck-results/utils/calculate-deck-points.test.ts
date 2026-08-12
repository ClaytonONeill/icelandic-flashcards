import { describe, expect, it } from 'vitest'
import { calculateDeckPoints } from './calculate-deck-points'

describe('calculateDeckPoints', () => {
  it('awards 5 points per correct answer', () => {
    expect(calculateDeckPoints(10, 20)).toBe(50)
  })

  it('adds a 25 point bonus for a perfect deck', () => {
    expect(calculateDeckPoints(20, 20)).toBe(125)
  })

  it('awards zero points for zero correct answers', () => {
    expect(calculateDeckPoints(0, 20)).toBe(0)
  })

  it('does not award the perfect bonus for an empty deck', () => {
    expect(calculateDeckPoints(0, 0)).toBe(0)
  })
})
