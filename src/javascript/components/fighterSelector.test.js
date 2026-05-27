import { describe, it, expect, vi, beforeEach } from 'vitest';

import fighterService from '../services/fightersService';
import { getFighterInfo } from './fighterSelector';

vi.mock('../services/fightersService', () => ({
    default: {
        getFighterInfo: vi.fn()
    }
}));

describe('getFighterInfo (fighterSelector)', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('loads fighter details from the service and caches them', async () => {
        const fighter = { _id: '2', name: 'Dhalsim', health: 60, attack: 3, defense: 1 };
        fighterService.getFighterInfo.mockResolvedValue(fighter);

        const first = await getFighterInfo('2');
        const second = await getFighterInfo('2');

        expect(first).toEqual(fighter);
        expect(second).toEqual(fighter);
        expect(fighterService.getFighterInfo).toHaveBeenCalledTimes(1);
    });
});
