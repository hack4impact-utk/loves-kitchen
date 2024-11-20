import mongoose from 'mongoose';

export interface Flag {
  description: string;
  color: string;
}

export interface Session {
  date: string;
  length: number;
}

export interface Volunteer {
  _id: string;
  name: string;
  age: number;
  createdAt: string;
  flags?: Flag[];
  sessions?: Session[];
}

const volSchema = new mongoose.Schema(
  {
    name: String,
    age: Number,
    createdAt: {
      type: Date,
      default: () => Date.now(),
    },
    flags: [
      {
        description: String,
        color: String,
      },
    ],
  },
  { collection: 'vols' }
);

const volModel = mongoose.models.Vol ?? mongoose.model('Vol', volSchema);
export { volModel };
