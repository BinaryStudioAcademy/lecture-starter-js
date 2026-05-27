import { describe, it, expect, vi, beforeEach } from 'vitest';

import callApi from '../helpers/apiHelper';
import fighterService from './fightersService';

vi.mock('../helpers/apiHelper', () => ({
    default: vi.fn()
}));

describe('FighterService.getFighterInfo', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('fetches fighter details by id from the API helper', async () => {
        const details = { _id: '1', name: 'Ryu', health: 45, attack: 4, defense: 3 };
        callApi.mockResolvedValue(details);

        const result = await fighterService.getFighterInfo('1');

        expect(callApi).toHaveBeenCalledWith('details/fighter/1.json');
        expect(result).toEqual(details);
    });

    it('throws when id is missing', async () => {
        await expect(fighterService.getFighterInfo()).rejects.toThrow('Fighter id is required');
    });
});
