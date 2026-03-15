export const base = import.meta.env.BASE_URL;

export function withBase(path: string) {
    const normalizedPath = path.startsWith("/") ? path.slice(1) : path;
    const normalizedBase = `${base}${normalizedPath}`;
    return normalizedBase.endsWith("/") ? normalizedBase : normalizedBase + "/";
}
