import axios from 'axios';

function fetchTranslation(url) {
    return axios.get(url, { withCredentials: true })
        .then(response => {
            return response.data;
        }).catch((error) => {
            throw new Error(`fail loading url: ${url}`);
        });
}

export default fetchTranslation;
