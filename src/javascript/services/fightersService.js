import callApi from '../helpers/apiHelper';

class FighterService {
    #endpoint = 'fighters.json';
    #detailsEndpoint = id => `details/fighter/${id}.json`;

    async getFighters() {
        try {
            const apiResult = await callApi(this.#endpoint);
            return apiResult;
        } catch (error) {
            throw error;
        }
    }

    async getFighterInfo(id) {
        if (!id) {
            throw Error('Fighter id is required');
        }

        const endpoint = this.#detailsEndpoint(id);
        return await callApi(endpoint);
    }

    async getFighterDetails(id) {
        return await this.getFighterInfo(id);
    }
}

const fighterService = new FighterService();

export default fighterService;
