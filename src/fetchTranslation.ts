import axios, { AxiosRequestConfig } from 'axios';

function fetchTranslation(url, host?, port?) {
    const config: AxiosRequestConfig = {
        url,
        method: 'get',
    };
    if (host) {
        config.proxy = {
            host,
            port,
        };
    }

    return axios.request(config)
        .then(response => {
            return response.data;
        }).catch((error) => {
            throw new Error(`fail loading url: ${url}`);
        });
}

export default fetchTranslation;
