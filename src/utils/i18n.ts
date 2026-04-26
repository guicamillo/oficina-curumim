import i18next, { type TOptions } from "i18next";
import ptBR from "../locales/pt-BR/translation.json";

const defaultLang = "pt-BR";

const resources = {
  "pt-BR": {
    translation: ptBR,
  },
} as const;

type Lang = keyof typeof resources;

type MessageDescriptor = {
  key: string;
  message: string;
};

const instances = new Map<Lang, i18next.i18n>();

function getInstance(lang: Lang) {
  let instance = instances.get(lang);
  if (instance) return instance;

  instance = i18next.createInstance();
  instance.init({
    lng: lang,
    fallbackLng: defaultLang,
    resources,
    interpolation: {
      escapeValue: false,
    },
    initAsync: false,
  });

  instances.set(lang, instance);
  return instance;
}

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split("/");
  if (lang in resources) return lang as Lang;
  return defaultLang;
}

export function useTranslations(lang: Lang) {
  const instance = getInstance(lang);

  return function t(input: string | MessageDescriptor, options?: TOptions) {
    if (typeof input === "string") {
      return instance.t(input, options);
    }

    return instance.t(input.key, {
      defaultValue: input.message,
      ...options,
    });
  };
}
