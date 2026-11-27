# Oficina Curumim

The Oficina Curumim website has information about classes, events, and registration in Vancouver. It is built with Astro and Tailwind CSS. Brazilian Portuguese is the default language. The Canadian English pages are under `/en-CA/`. [Live site on GitHub Pages](https://guicamillo.github.io/oficina-curumim/).

## Run locally

Use Node.js 22.23.4 or later and Bun. The commands below were tested with Bun 1.3.14.

```sh
bun install --frozen-lockfile
bun run dev
```

Open `http://localhost:4321/oficina-curumim/` for Portuguese or `http://localhost:4321/oficina-curumim/en-CA/` for English.

## Validate and build the site

```sh
bun run validate
bun run build
bun run preview
```

- `bun run validate` checks for hardcoded text, updates the Portuguese translation catalog, checks formatting, runs the linter, and compiles the site.
- `bun run build` generates the static site in `dist/`. It also runs Knip in fix mode, which can modify or remove files it identifies as unused.
- `bun run preview` serves the generated site at `http://localhost:4321/oficina-curumim/`.

## Edit pages and translations

- Edit pages in `src/pages/` and English routes in `src/pages/en-CA/`. Shared components live in `src/components/`, and the page layout lives in `src/layouts/`.
- To add or change translatable text, update the `t({ key, message })` call in the page or component. Run `bun run i18n:extract` to update `src/locales/pt-BR/translation.json`. Edit `src/locales/en-CA/translation.json` to add or update the matching English translation.

## Deploy

GitHub Actions builds and deploys the merge commit to GitHub Pages when `guicamillo` merges a pull request into `main`. The base path `/oficina-curumim` is set in `astro.config.mjs`.

## Configure contact and newsletter forms

Create a Web3Forms access key for the inbox that should receive both forms. Set these repository variables under **Settings → Secrets and variables → Actions → Variables**, or put them in `.env` for a local build.

| Variable                      | Value                                                                  |
| ----------------------------- | ---------------------------------------------------------------------- |
| `PUBLIC_WEB3FORMS_ACCESS_KEY` | The public Web3Forms access key for the shared inbox.                  |
| `PUBLIC_CONTACT_EMAIL`        | The address shown on the contact page and used for direct email links. |

Both forms use the same key and send different email subjects. The contact form sends the visitor's name, email, and message. The newsletter form forwards the visitor's email to the inbox for collection. Without an access key, the contact page offers a direct email link and the footer hides the signup form. [Web3Forms setup guide](https://docs.web3forms.com/getting-started/installation).
