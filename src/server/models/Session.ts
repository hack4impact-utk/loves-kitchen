import mongoose from 'mongoose';

export interface ISession {
  _id: string;
  workedBy: string;
  startTime: string;
  length: number;
  checked_out: boolean;
}

const sessionSchema = new mongoose.Schema(
  {
    workedBy: String,
    startTime: {
      type: Date,
      default: () => Date.now(),
    },
    length: Number,
    checked_out: Boolean,
  },
  { collection: 'sessions' }
);

const sessionModel =
  mongoose.models.Session ?? mongoose.model('Session', sessionSchema);
export { sessionModel };
