import mongoose from 'mongoose';
import { isConnected } from '@/utils/mymg';

const volunteerSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  age: { type: Number, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
});

isConnected;

const Volunteer =
  mongoose.models.Volunteer || mongoose.model('Volunteer', volunteerSchema);
export { Volunteer };
