import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Fetch all clients for the authenticated user
    const clients = await prisma.client.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ clients });
  } catch (error) {
    console.error('Error fetching clients:', error);
    const message = error instanceof Error ? error.message : 'Failed to fetch clients';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      company,
      email,
      phone,
      address,
      city,
      postalCode,
      country,
      vatNumber,
      languagePreference,
    } = body;

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    // Create client in database
    const client = await prisma.client.create({
      data: {
        userId: session.user.id,
        name,
        company: company || null,
        email,
        phone: phone || null,
        address: address || null,
        city: city || null,
        postalCode: postalCode || null,
        country: country || null,
        vatNumber: vatNumber || null,
        languagePreference: languagePreference || 'en',
      },
    });

    return NextResponse.json({ success: true, client }, { status: 201 });
  } catch (error) {
    console.error('Error creating client:', error);
    const message = error instanceof Error ? error.message : 'Failed to create client';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
