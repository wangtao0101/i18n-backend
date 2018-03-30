import I18n from 'i18n-backend';
import axios from 'axios';
import * as MockAdapter from 'axios-mock-adapter';
import { instance } from '../src/fetchTranslation';

const translation = {
    en: {
        ns: {
            hello: 'hello',
            ['hello name']: 'hello, %{name}',
        },
    },
    zh: {
        ns: {
            hello: '你好',
            ['hello name']: '你好, %{name}',
        },
    },
};

describe('I18n init', () => {
    test('remote type should set remoteUrl', () => {
        expect(() => {
            I18n.init({
                type: 'remote',
                locale: 'en',
                defaultNS: 'common',
            });
        }).toThrow(/remote type should set remoteUrl/);
    });

    test('memory type should set translation', () => {
        expect(() => {
            I18n.init({
                type: 'memory',
                locale: 'en',
                defaultNS: 'common',
            });
        }).toThrow(/memory type should set translation/);
    });
});

describe('I18n memory type', () => {
    beforeEach(() => {
        I18n.init({
            type: 'memory',
            locale: 'en',
            defaultNS: 'ns',
            translation: translation,
        });
    });

    test('t translate with ns correct', () => {
        expect(I18n.t('ns', 'hello')).toEqual('hello');
    });

    test('t translate with default ns correct', () => {
        expect(I18n.t('hello')).toEqual('hello');
    });

    test('t translate with default ns and replacement correct', () => {
        expect(I18n.t('hello name', { name: 'wt' })).toEqual('hello, wt');
    });

    test('t translate with replacement correct', () => {
        expect(I18n.t('ns', 'hello name', { name: 'wt' })).toEqual('hello, wt');
    });

    test('t translate change locale correct', () => {
        I18n.setLocale('zh');
        expect(I18n.t('hello')).toEqual('你好');
    });

    test('t translate missing namespace correct', () => {
        expect(I18n.t('zh-cn', 'hello')).toEqual('@@hello');
    });

    test('t translate null key correct', () => {
        expect(I18n.t('hel')).toEqual('@@hel');
    });
});

describe('I18n remote type', () => {
    beforeAll(() => {
        const mockAdapter = new MockAdapter(instance);
        mockAdapter.onGet('http://192.168.1.1/data').reply(200, {
            data: {
                en: {
                    ns: {
                        he: 'he',
                    },
                },
            },
        });
    });

    beforeEach(() => {
        return I18n.init({
            type: 'remote',
            locale: 'en',
            defaultNS: 'ns',
            remoteUrl: 'http://192.168.1.1/data',
        });
    });

    test('t translate with ns correct', () => {
        expect(I18n.t('ns', 'he')).toEqual('he');
    });
});

describe('I18n remote type, fetch error', () => {
    beforeAll(() => {
        const mockAdapter = new MockAdapter(instance);
        mockAdapter.onGet('http://192.168.1.1/data').reply(400);
    });

    test('fetch error', async () => {
        await expect(I18n.init({
                type: 'remote',
                locale: 'en',
                defaultNS: 'ns',
                remoteUrl: 'http://192.168.1.1/data',
        })).rejects.toHaveProperty('message', 'fail loading url: http://192.168.1.1/data');
    });
});
