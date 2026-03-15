// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
    site: "https://guicamillo.github.io",
    base: "/oficina-curumim",
    vite: {
        plugins: [tailwindcss()],
    },

    integrations: [react()],

    i18n: {
        defaultLocale: "pt-BR",
        locales: ["pt-BR"],
        routing: {
            prefixDefaultLocale: false,
        },
    },
});
