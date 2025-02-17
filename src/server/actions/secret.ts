'use server';
import { createCipheriv, createDecipheriv } from 'crypto';

export async function encrypt(src: string): Promise<string> {
  const key = process.env.QR_KEY;
  const iv = process.env.QR_IV;

  if (!key || !iv) {
    throw new Error('QR_KEY and QR_IV must be defined in .env.local!');
  }

  const cipher = createCipheriv(
    'aes-256-cbc',
    Buffer.from(key, 'base64'),
    Buffer.from(iv, 'base64')
  );

  let output = cipher.update(src, 'utf8', 'base64');
  output += cipher.final('base64');

  return output;
}

export async function decrypt(src: string): Promise<string> {
  const key = process.env.QR_KEY;
  const iv = process.env.QR_IV;

  if (!key || !iv) {
    throw new Error('KEY and IV must be defined!');
  }

  const decipher = createDecipheriv(
    'aes-256-cbc',
    Buffer.from(key, 'base64'),
    Buffer.from(iv, 'base64')
  );

  let output = decipher.update(src, 'base64', 'utf8');
  output += decipher.final('utf8');

  return output;
}
