# Šafy Production — Next.js web

Rebuild of [safyproduction.cz](https://meetoo.elemetor.cz/) from WordPress/Elementor to Next.js (App Router) + Tailwind CSS 4.

## Development

```bash
npm install
npm run dev
```

## Deploy

Deployed on Vercel — every push to `main` triggers a production deploy.

## Structure

- `app/` — pages (home, services, reference, about-us, contact)
- `components/` — Header, Footer, LogoMarquee, Cta
- `lib/data.js` — services, references, brand logos, company info
- `public/images/` — photos, brand logos, tape SVGs

## Design identity

- Font: Roboto (300–900)
- Colors: ink `#373736`, brand green `#79D97C`, dark `#212121`
- Signature "tape" SVG graphics in hero and references sections
