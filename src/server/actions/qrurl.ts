'use server';

import { ISession } from '../models/Session';
import { encrypt } from './secret';

export async function getQRCode(qrSesh: ISession): Promise<string> {
  const seshEncrypted = await encrypt(JSON.stringify(qrSesh));
  const baseURL = process.env.AUTH0_BASE_URL;

  if (baseURL == undefined) {
    throw new Error('Invalid base URL for QR code generation.');
  }

  console.log('encrypted session:', seshEncrypted);
  const output = baseURL + '/user/checkin/' + encodeURIComponent(seshEncrypted);

  return output;
}
