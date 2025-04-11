import { ISession } from '@/server/models/Session';

export function getStats(
  sessions: ISession[],
  timeInterval?: {
    startTimeISO: string;
    endTimeISO: string;
  }
): { sum: number; avg: number } {
  let sum = 0;
  let count = 0;
  for (let i = 0; i < sessions.length; ++i) {
    if (!timeInterval) {
      sum += sessions[i].length;
      ++count;
    } else {
      const present = new Date(sessions[i].startTime).getTime();
      const endTime = new Date(timeInterval.endTimeISO).getTime();
      const startTime = new Date(timeInterval.startTimeISO).getTime();

      if (present < endTime && present > startTime) {
        sum += sessions[i].length;
        ++count;
      }
    }
  }

  const avg = count != 0 ? sum / count : 0;

  return { sum: sum, avg: avg };
}
