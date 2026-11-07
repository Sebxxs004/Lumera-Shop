import type { IncomingMessage, ServerResponse } from 'node:http';
import { ApiRouter } from '../server/router/api.router';

/**
 * Vercel Serverless Function Entrypoint (`/api/v1/*`)
 * Single Responsibility: Forwards all `/api/v1/*` requests on Vercel to `ApiRouter`.
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
