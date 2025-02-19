/* eslint-disable @typescript-eslint/no-explicit-any */

'use server';
import { Volunteer, IVolunteer } from '@/server/models/Volunteer';
import { isConnected, ConnectStat } from '@/utils/mymg';
import { FilterQuery } from 'mongoose';

export async function getConnection(): Promise<ConnectStat> {
  return isConnected;
}

export async function findVol(
  filter?: FilterQuery<any>
): Promise<IVolunteer[]> {
  if (isConnected) {
    if (filter) return JSON.parse(JSON.stringify(await Volunteer.find(filter)));
    return JSON.parse(JSON.stringify(await Volunteer.find()));
  }
  return [];
}

export async function addVol(toAdd: FilterQuery<any>): Promise<string> {
  try {
    await Volunteer.create(toAdd);
    return 'Added vol successfully!';
  } catch (e: any) {
    return e.message;
  }
}

export async function delVol(toDel?: FilterQuery<any>): Promise<string> {
  try {
    if (toDel) await Volunteer.deleteOne(toDel);
    else await Volunteer.deleteMany();
    return 'Deleted vol successfully!';
  } catch (e: any) {
    return e.message;
  }
}
