import callApi from '../helpers/apiHelper';

class FighterService {
    #endpoint = 'fighters.json';

    #infoEndpoint = 'details/fighter';

    async getFighters() {
        try {
            const apiResult = await callApi(this.#endpoint);
            return apiResult;
        } catch (error) {
            throw error;
        }
    }

    async getFighterDetails(id) {
        // todo: implement this method
        // endpoint - `details/fighter/${id}.json`;
        const fighterInfo = await callApi(`${this.#infoEndpoint}/${id}.json`);
        return fighterInfo;
    }
}

const fighterService = new FighterService();

export default fighterService;
