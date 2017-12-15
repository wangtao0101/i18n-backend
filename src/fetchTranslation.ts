import axios from 'axios';

function fetchTranslation(url, cb) {
    axios.get(url, { withCredentials: true })
        .then(response => {
            if (response.status >= 400) {
                console.error(`fail loading ${url}`);
            } else {
                cb(response.data);
            }
        }).catch((e) => {
            console.error(e);
        });
}

export default fetchTranslation;
