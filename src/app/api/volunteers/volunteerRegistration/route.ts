import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';

/* Define the Volunteer schema */
const volunteerSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  age: { type: Number, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
});

const Volunteer = mongoose.models.Volunteer || mongoose.model('Volunteer', volunteerSchema);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { firstName, lastName, age, address, phone, email } = req.body;

      /* Validate incoming data */
      if (!firstName || !lastName || !age || !address || !phone || !email) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      /* Connect to MongoDB */
      await mongoose.connect(process.env.MONGODB_URI);

      /* Save the new volunteer to the database */
      const volunteer = new Volunteer({ firstName, lastName, age, address, phone, email });
      await volunteer.save();

      res.status(201).json({ message: 'Volunteer registered successfully' });
    } catch (error) {
      console.error('Error saving volunteer:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}