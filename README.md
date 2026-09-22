This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Database (Neon Postgres)

All store data (products, categories, reviews, FAQs, orders, media uploads, business
content) lives in Postgres and is the source of truth. The old `.data/store.json`
file store is legacy only.

1. Copy `.env.example` to `.env.local` and set `DATABASE_URL` to your Neon connection
   string (also set it in Vercel project settings for production).
2. First request auto-creates tables and seeds catalog content from `src/data/business.ts`.
3. To import existing local data (`.data/store.json` + `.data/uploads`):

```bash
npm run migrate:neon
```

Image URL rules: product image fields accept local paths (`/images/...`) or direct
image URLs from hosts allowed in `next.config.ts` (`picsum.photos`,
`graph.facebook.com`, `images.unsplash.com`, `ui-avatars.com`, `*.fbcdn.net`).
Facebook post/page links are not images and are rejected.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
