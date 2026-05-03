import i18next, { type TOptions } from "i18next";
import ptBR from "../locales/pt-BR/translation.json";
import enCA from "../locales/en-CA/translation.json";

export const defaultLang = "pt-BR";

export const resources = {
  "pt-BR": {
    translation: ptBR,
  },
  "en-CA": {
    translation: enCA,
  },
} as const;

export type Lang = keyof typeof resources;

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
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");
  const pathname = url.pathname.startsWith(basePath)
    ? url.pathname.slice(basePath.length)
    : url.pathname;
  const [, maybeLang] = pathname.split("/");

  if (maybeLang in resources) return maybeLang as Lang;
  return defaultLang;
}

export function isLang(value: string): value is Lang {
  return value in resources;
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
