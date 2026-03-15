import ptBR from '../locales/pt-BR/translation.json';

export const languages = {
  'pt-BR': 'Português',
};

export const defaultLang = 'pt-BR';

export const ui = {
  'pt-BR': ptBR,
} as const;

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split('/');
  if (lang in ui) return lang as keyof typeof ui;
  return defaultLang;
}

export function useTranslations(lang: keyof typeof ui) {
  return function t(key: string) {
      const keys = key.split('.');
      let current: any = ui[lang];
      for (const k of keys) {
          if (current === undefined || current[k] === undefined) return key;
          current = current[k];
      }
      return current;
  }
}
