import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getDamage, getHitPower, getBlockPower } from './fight';

const fighter = {
    _id: '1',
    name: 'Ryu',
    health: 45,
    attack: 4,
    defense: 3
};

describe('getHitPower', () => {
    beforeEach(() => {
        vi.spyOn(Math, 'random');
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('returns attack multiplied by criticalHitChance (1 + random)', () => {
        Math.random.mockReturnValue(0);
        expect(getHitPower(fighter)).toBe(4);

        Math.random.mockReturnValue(1);
        expect(getHitPower(fighter)).toBe(8);
    });

    it('does not round the result', () => {
        Math.random.mockReturnValue(0.333);
        expect(getHitPower(fighter)).toBeCloseTo(4 * 1.333, 5);
    });
});

describe('getBlockPower', () => {
    beforeEach(() => {
        vi.spyOn(Math, 'random');
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('returns defense multiplied by dodgeChance (1 + random)', () => {
        Math.random.mockReturnValue(0);
        expect(getBlockPower(fighter)).toBe(3);

        Math.random.mockReturnValue(1);
        expect(getBlockPower(fighter)).toBe(6);
    });
});

describe('getDamage', () => {
    beforeEach(() => {
        vi.spyOn(Math, 'random');
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('returns hitPower minus blockPower when hit is stronger', () => {
        Math.random
            .mockReturnValueOnce(0) // hit: 4 * 1
            .mockReturnValueOnce(0); // block: 3 * 1
        expect(getDamage(fighter, fighter)).toBe(1);
    });

    it('returns 0 when block power is greater than or equal to hit power', () => {
        Math.random
            .mockReturnValueOnce(0) // hit: 4
            .mockReturnValueOnce(1); // block: 6
        expect(getDamage(fighter, fighter)).toBe(0);
    });

    it('never returns negative damage', () => {
        Math.random.mockReturnValue(1); // both max
        expect(getDamage(fighter, fighter)).toBeGreaterThanOrEqual(0);
    });
});
