import * as invariant from 'invariant';
import fetchTranslation from './fetchTranslation';

export interface Translation {
    [key: string]: { // language
        [key: string]: { // namespace
            [key: string]: string; // key
        };
    };
}

export interface Options {
    type: 'memory' | 'remote';
    remoteUrl?: string;
    translation?: Translation;
    locale: string;
    defaultNS: string;
    missingPrefix?: string;
}

export class I18nInstance {
    private locale: string;
    private defaultNS: string;
    private translation: Translation;
    private fetchInterval;
    private missingPrefix: string;

    public init(options: Options) {
        const {
            missingPrefix = '@@',
        } = options;

        this.setLocale(options.locale);
        this.defaultNS = options.defaultNS;
        this.missingPrefix = missingPrefix;

        if (options.type === 'remote') {
            invariant(typeof options.remoteUrl === 'string', 'remote type should set remoteUrl');
            return this.fetchTrans(options.remoteUrl);
        } else {
            invariant(options.translation != null, 'memory type should set translation');
            this.setTranslation(options.translation);
            return Promise.resolve();
        }
    }

    public setTranslation(translation) {
        this.translation = translation;
    }

    public setLocale(locale) {
        this.locale = locale;
        return this;
    }

    public getLocale(locale) {
        return this.locale;
    }

    public t(key: string, replacements?: Object);
    public t(ns: string, key: string, replacements?: Object);
    public t(...args) {
        let key;
        let namespace;
        let replacements;
        if (args.length === 1) {
            key = args[0];
            namespace = this.defaultNS;
        } else if (args.length === 2) {
            if (typeof args[1] === 'string') {
                namespace = args[0];
                key = args[1];
            } else {
                namespace = this.defaultNS;
                key = args[0];
                replacements = args[1];
            }
        } else {
            namespace = args[0];
            key = args[1];
            replacements = args[2];
        }
        return this.translate(namespace, key, replacements);
    }

    private translate(namespace: string, key: string, replacements) {
        let trans = '';
        try {
            trans = this.translation[this.locale][namespace][key];
        } catch (err) {
            // TODO: popup a modal to confirm should add a key if locale and namespace is correct
            console.error(`missing translation for locale: ${this.locale}, namespace: ${namespace}, key: ${key}`);
            trans = '';
        }
        if (trans == null || trans === '') {
            // TODO: do simple translate using online service
            return `${this.missingPrefix}${key}`;
        }
        if (replacements) {
            return this.replace(trans, replacements);
        }
        return trans;
    }

    private fetchTrans(url) {
        return fetchTranslation(url).then((data) => {
            this.setTranslation(data);
        });
    }

    private replace(trans: string, replacements) {
        let replaced = trans;
        Object.keys(replacements).forEach((replacement) => {
            replaced = replaced.replace(`%{${replacement}}`, replacements[replacement]);
        });
        return replaced;
    }
}

const I18n = new I18nInstance();

export default I18n;
