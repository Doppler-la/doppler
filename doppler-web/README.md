This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

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

## Chat de descubrimiento

La sección de contacto es un chat con un agente (Claude) que releva el problema del cliente y envía un brief por email al equipo. Ver `docs/superpowers/specs/2026-10-08-lead-chat-agent-design.md`.

- Configurar en Vercel: `ANTHROPIC_API_KEY`, `RESEND_API_KEY` y la integración Upstash Redis (rate limit).
- **Medir el consumo de la web:** crear en la consola de la API de Anthropic un *workspace* exclusivo para la web con su propia API key, y usar esa key solo en Vercel. Así el uso y el costo se pueden filtrar por workspace/key y comparar con el resto. Configurar además un límite de gasto mensual en ese workspace.
- Cambiar el modelo con `CHAT_MODEL` (por ejemplo `claude-haiku-5-5` para bajar costos).
