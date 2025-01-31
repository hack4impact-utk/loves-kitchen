import mongoose from 'mongoose';
export interface Session {
  _id: string,
  workedBy: string;
  startTime: string;
  length: number;
}

const sessionSchema = new mongoose.Schema(
  {
    workedBy: String,
    startTime: {
      type: Date,
      default: () => Date.now(),
    },
    length: Number,
  },
  { collection: 'sessions' }
);

const sessionModel = mongoose.models.Session ?? mongoose.model('Session', sessionSchema);
export {sessionModel};
