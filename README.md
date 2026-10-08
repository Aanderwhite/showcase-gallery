# ShowCase - MERN Product Gallery

**Student:** April Mark Sarmiento - INF233

A responsive gallery with image uploads, MongoDB Atlas persistence, and add/edit/delete operations. Search, category filters, and price sorting are included.

## Links

- GitHub: https://github.com/Aanderwhite/showcase-gallery
- Render API: deployment pending
- Vercel website: deployment pending

## Run locally

1. In `server`, run `npm ci`. Copy `.env.example` to `.env` and privately set `MONGO_URI` to your Atlas connection string.
2. Run `npm start` in `server`.
3. In `client`, run `npm ci`. Copy `.env.example` to `.env`; use `VITE_API_URL=http://localhost:5000` for local testing.
4. Run `npm run dev` in `client`.

Never commit `.env` or database passwords. Images are uploaded as base64 data URLs and stored with products in Atlas. JPG, PNG, and WebP uploads up to 1MB are supported.

## Deploy

Render: import this repository, choose a free Node web service in Singapore, root directory `server`, build command `npm ci`, start command `npm start`. Privately set `MONGO_URI`. A `render.yaml` blueprint is included.

Vercel: import this repository, root directory `client`, framework Vite, build `npm run build`, output `dist`. Set `VITE_API_URL` to the actual Render URL without a trailing slash, then deploy.

## API

| Method | Endpoint | Success |
| --- | --- | --- |
| GET | `/` | 200, API health message |
| GET | `/api/products` | 200, product array |
| GET | `/api/products/:id` | 200, one product |
| POST | `/api/products` | 201, saved product |
| PUT | `/api/products/:id` | 200, updated product |
| DELETE | `/api/products/:id` | 200, deletion message |

Missing required data or invalid field values return 400; a valid ID that does not exist returns 404. PUT supports a partial update, including the PDF's price-only test.

## Verification

Client: `npm run build` and `npm run lint`.

Server: `npm run test:api`. To test Render, set `API_URL` to the real Render URL before running. This creates and removes one disposable test product and records six results under `submission/evidence/`. These results supplement the required Thunder Client screenshots.

Submission instructions are in `submission/SUBMISSION-CHECKLIST.md`.
