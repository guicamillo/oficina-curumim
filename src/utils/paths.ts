export const base = import.meta.env.BASE_URL;

export function withBase(path: string) {
    const normalizedPath = path.startsWith("/") ? path.slice(1) : path;
    return `${base}/${normalizedPath}`;
}

function cycleRandomImage<T>(images: T[]): T {
    return images[Math.floor(Math.random() * images.length)];
}
