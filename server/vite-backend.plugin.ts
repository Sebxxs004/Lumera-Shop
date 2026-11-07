import type { Plugin } from 'vite';
import { DatabaseRepository } from './database/database.repository';
import { ApiRouter } from './router/api.router';

/**
 * lumeraBackendPlugin
 * Single Responsibility: Mounts the LUMÉRA `/api/v1/*` backend router directly into
 * Vite's dev and preview HTTP servers and ensures the server-side database is seeded.
 */
export function lumeraBackendPlugin(): Plugin {
  return {
    name: 'lumera-atelier-backend',
    configureServer(server) {
      DatabaseRepository.ensureInitialized();
      server.middlewares.use(async (req, res, next) => {
        const handled = await ApiRouter.handle(req, res);
        if (!handled) {
          next();
        }
      });
    },
    configurePreviewServer(server) {
      DatabaseRepository.ensureInitialized();
      server.middlewares.use(async (req, res, next) => {
        const handled = await ApiRouter.handle(req, res);
        if (!handled) {
          next();
        }
      });
    },
  };
}
