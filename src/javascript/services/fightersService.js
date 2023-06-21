import callApi from '../helpers/apiHelper';

class FighterService {
    #endpoint = 'fighters.json';

    constructor() {
        this.getFighterDetails = this.getFighterDetails.bind(this);
    }

    async getFighters() {
        try {
            const apiResult = await callApi(this.#endpoint);
            return apiResult;
        } catch (error) {
            throw error;
        }
    }

    // eslint-disable-next-line class-methods-use-this
    async getFighterDetails(id) {
        try {
            const apiResult = await callApi(`details/fighter/${id}.json`);
            return apiResult;
        } catch (error) {
            throw error;
        }
        // todo: implement this method
        // endpoint - `details/fighter/${id}.json`;
    }
}

const fighterService = new FighterService();
fighterService.getFighterDetails();
export default fighterService;
