import axios, { AxiosRequestConfig, AxiosInstance } from 'axios';

const instance = axios.create({});

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

    return instance.request(config)
        .then(response => {
            return response.data;
        }).catch((error) => {
            throw new Error(`fail loading url: ${url}`);
        });
}

export default fetchTranslation;
export {
    instance,
};
