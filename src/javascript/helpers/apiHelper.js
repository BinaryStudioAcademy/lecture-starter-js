import { fightersDetails, fighters } from './mockData';

const BASE_API_URL =
    'https://api.github.com/repos/binary-studio-academy/stage-2-es6-for-everyone/contents/resources/api/';
const SECURITY_HEADERS = {
    headers: {
        /*
         * For the development, you shouldn't use the remote data source, but set useMockAPI=true.
         * To test the application against the real dataset set useMockAPI=false.
         * But to test the application you don't need to extend the GitHub REST API rate limit to 5000 requests with the token
         */
        // authorization: 'token %github_token%'
    }
};

const useMockAPI = true;

function getFighterById(endpoint) {
    const start = endpoint.lastIndexOf('/');
    const end = endpoint.lastIndexOf('.json');
    const id = endpoint.substring(start + 1, end);
    return fightersDetails.find(it => it._id === id);
}

async function fakeCallApi(endpoint) {
    const response = endpoint === 'fighters.json' ? fighters : getFighterById(endpoint);
    return new Promise((resolve, reject) => {
        setTimeout(() => (response ? resolve(response) : reject(Error('Failed to load'))), 500);
    });
}

export default async function callApi(endpoint, method = 'GET') {
    const url = BASE_API_URL + endpoint;
    const options = { method, ...SECURITY_HEADERS };

    return useMockAPI
        ? fakeCallApi(endpoint)
        : fetch(url, options)
              .then(response => (response.ok ? response.json() : Promise.reject(Error('Failed to load'))))
              .then(result => JSON.parse(atob(result.content)))
              .catch(error => {
                  throw error;
              });
}
