import { ISession } from '@/server/models/Session';

export function getStats(sessions: ISession[]): { sum: number; avg: number } {
  let sum = 0;
  for (let i = 0; i < sessions.length; ++i) {
    sum += sessions[i].length;
  }

  const avg = sessions.length != 0 ? sum / sessions.length : 0;

  return { sum: sum, avg: avg };
}
