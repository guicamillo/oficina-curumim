# Oficina Curumim Website

This is the new website for Oficina Curumim, built with [Astro](https://astro.build) and [Tailwind CSS](https://tailwindcss.com).

## Features

- **Modern Design**: Clean, responsive, and institutional theme.
- **Internationalization (i18n)**: Support for Portuguese (pt-BR) and English (en-CA).
- **Blog**: Managed via Markdown files in `src/content/blog`.
- **Tech Stack**: Astro, React, Tailwind CSS, i18next.

## Project Structure

- `src/pages`: Routes for the website.
  - `index.astro`: Home page (Portuguese).
  - `en-CA/`: English version of pages.
  - `blog/`: Blog listing and post pages.
- `src/content/blog`: Markdown files for blog posts.
  - `pt-BR/`: Portuguese posts.
  - `en-CA/`: English posts.
- `src/components`: Reusable UI components (Header, etc.).
- `src/layouts`: Page layouts.
- `src/locales`: Translation files (JSON).

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

## Adding Content

To add a new blog post, create a markdown file in `src/content/blog/[lang]/[slug].md`.
Ensure the frontmatter includes:
```yaml
---
title: "Post Title"
description: "Short description"
pubDate: 2023-10-27
author: "Author Name"
image: "/path/to/image.jpg" # Optional
tags: ["tag1", "tag2"]
---
```
