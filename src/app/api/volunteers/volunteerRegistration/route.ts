import { Volunteer } from '@/server/models/Volunteer';
import { NextResponse } from 'next/server';

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
