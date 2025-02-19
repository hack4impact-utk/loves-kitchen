import mongoose from 'mongoose';
import { isConnected } from '@/utils/mymg';

export interface IFlag {
  description: string;
  color: string;
}

export interface IVolunteer {
  _id: string;
  authID: string;
  firstName: string;
  lastName: string;
  age: number;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
  flags?: IFlag[];
}

const volunteerSchema = new mongoose.Schema({
  authID: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  age: { type: Number, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },

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
});

isConnected;

const Volunteer =
  mongoose.models.Volunteer || mongoose.model('Volunteer', volunteerSchema);
export { Volunteer };
