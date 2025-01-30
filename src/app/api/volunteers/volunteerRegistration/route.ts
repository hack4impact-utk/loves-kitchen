import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

/* Define the Volunteer schema */
const volunteerSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  age: { type: Number, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
});

const Volunteer =
  mongoose.models.Volunteer || mongoose.model('Volunteer', volunteerSchema);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { firstName, lastName, age, address, phone, email } = body;

    if (!firstName || !lastName || !age || !address || !phone || !email) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    await mongoose.connect(process.env.MONGODB_URI!);

    const volunteer = new Volunteer({
      firstName,
      lastName,
      age,
      address,
      phone,
      email,
    });
    await volunteer.save();

    return NextResponse.json(
      { message: 'Volunteer registered successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error saving volunteer:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
