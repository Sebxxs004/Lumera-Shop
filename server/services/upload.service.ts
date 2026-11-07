import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { SecurityConfig } from '../config/security.config';

const ALLOWED_MIME_EXTENSIONS: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
  'image/svg+xml': 'svg',
};

const UPLOADS_DIR = path.resolve(process.cwd(), 'public', 'uploads');

/**
 * UploadService
 * Single Responsibility: Validates and stores uploaded product/variant images
 * on disk inside `public/uploads/` and returns the public asset URL.
 */
export const UploadService = {
  saveBase64Image(
    dataUrl: string,
    originalName = 'product-image'
  ): { url: string; fileName: string; sizeBytes: number } {
    const match = /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/.exec(dataUrl);
    if (!match) {
      throw new Error(
        'Formato de imagen inválido. Debe ser una imagen codificada en Base64.'
      );
    }

    const mimeType = match[1].toLowerCase();
    const base64Payload = match[2];
    const ext = ALLOWED_MIME_EXTENSIONS[mimeType];

    if (!ext) {
      throw new Error(
        `Tipo de archivo no permitido (${mimeType}). Usa JPG, PNG, WEBP, AVIF o SVG.`
      );
    }

    const buffer = Buffer.from(base64Payload, 'base64');
    if (buffer.byteLength > SecurityConfig.MAX_UPLOAD_BYTES) {
      throw new Error('La imagen supera el límite máximo permitido de 8 MB.');
    }

    if (!fs.existsSync(UPLOADS_DIR)) {
      fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    }

    const sanitizedPrefix = originalName
      .replace(/\.[^/.]+$/, '')
      .toLowerCase()
      .replace(/[^a-z0-9-_]/g, '-')
      .slice(0, 32);

    const hash = crypto
      .createHash('sha1')
      .update(buffer)
      .digest('hex')
      .slice(0, 10);

    const fileName = `${Date.now()}-${sanitizedPrefix || 'lumera'}-${hash}.${ext}`;
    const fullPath = path.join(UPLOADS_DIR, fileName);

    fs.writeFileSync(fullPath, buffer);

    return {
      url: `/uploads/${fileName}`,
      fileName,
      sizeBytes: buffer.byteLength,
    };
  },
};
