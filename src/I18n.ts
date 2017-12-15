import invariant from 'invariant';
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
    /**
     * fetch interval(second) if use remote type, default 60s
     */
    fetchInterval: number;
}

export class I18nInstance {
    private locale: string;
    private defaultNS: string;
    private translation: Translation;
    private fetchInterval;

    public init(options: Options) {
        const {
            fetchInterval = 60,
        } = options;

        if (options.type === 'remote') {
            invariant(typeof options.remoteUrl === 'string', 'remote type should set remoteUrl');
        } else {
            invariant(options.translation !== null, 'memory type should set translation');
            this.setTranslation(options.translation);
        }
        this.setLocale(options.locale);
        this.defaultNS = options.defaultNS;
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

    public t(namespace: string = this.defaultNS, key: string, replacements) {
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
            return key;
        }
        if (replacements) {
            return this.replace(trans, replacements);
        }
        return trans;
    }

    private fecthTranslationByInterval(url, interval) {
        this.fetchInterval = setInterval(() => {
            fetchTranslation(url, (data) => {
                this.setTranslation(data);
            });
        }, interval);
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
