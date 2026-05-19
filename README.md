# AI Creative Cambodia

Next.js wrapper for the two approved AI Creative Cambodia prototypes.

## Routes

- `/` renders `Web - AI Creative Cambodia.html`
- `/admin` renders `Sprint Board.html`
- `/admin/board` renders `Sprint Board.html`

The prototype HTML is stored in `public/prototypes` and mounted directly into the Next app by `components/PrototypeDocument.tsx`, including the Sprint Board drawer script.

## Tech stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```
