import type { IncomingMessage, ServerResponse } from 'node:http';
import { ApiRouter } from './router/api.router';

/**
 * Vercel Serverless Function Source Entrypoint (`/api/v1/*`)
 * Bundled into `api/index.js` so Vercel executes a self-contained ESM module.
 */
export default async function handler(
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> {
  const handled = await ApiRouter.handle(req, res);
  if (!handled) {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({ error: 'Endpoint no encontrado.' }));
  }
}
