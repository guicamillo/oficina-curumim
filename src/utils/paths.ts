import { defaultLang, isLang, type Lang } from "./i18n";

const rawBase = import.meta.env.BASE_URL;
export const base = rawBase === "/" ? "" : rawBase.endsWith("/") ? rawBase.slice(0, -1) : rawBase;

function normalizePath(path: string) {
  const normalizedPath = path.startsWith("/") ? path.slice(1) : path;
  return normalizedPath.endsWith("/") ? normalizedPath.slice(0, -1) : normalizedPath;
}

export function withBase(path: string, lang: Lang = defaultLang) {
  const normalizedPath = normalizePath(path);
  const localePrefix = lang === defaultLang ? "" : `/${lang}`;
  const pathSuffix = normalizedPath ? `/${normalizedPath}` : "";

  return `${base}${localePrefix}${pathSuffix}` || "/";
}

export function getPathWithoutLocale(pathname: string) {
  const pathAfterBase = pathname.startsWith(base) ? pathname.slice(base.length) : pathname;
  const segments = pathAfterBase.split("/").filter(Boolean);

  if (segments[0] && isLang(segments[0])) {
    segments.shift();
  }

  return segments.join("/");
}

export function switchLocalePath(pathname: string, lang: Lang) {
  return withBase(getPathWithoutLocale(pathname), lang);
}
