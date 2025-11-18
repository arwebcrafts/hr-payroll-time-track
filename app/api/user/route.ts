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

    // Fetch user profile
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        businessName: true,
        businessEmail: true,
        businessPhone: true,
        businessAddress: true,
        businessWebsite: true,
        taxId: true,
        vatNumber: true,
        defaultCurrency: true,
        defaultLanguage: true,
        businessLogoUrl: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error fetching user:', error);
    const message = error instanceof Error ? error.message : 'Failed to fetch user';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const {
      businessName,
      businessEmail,
      businessPhone,
      businessAddress,
      businessWebsite,
      taxId,
      vatNumber,
      defaultCurrency,
      defaultLanguage,
    } = body;

    // Update user profile
    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        businessName: businessName || null,
        businessEmail: businessEmail || null,
        businessPhone: businessPhone || null,
        businessAddress: businessAddress || null,
        businessWebsite: businessWebsite || null,
        taxId: taxId || null,
        vatNumber: vatNumber || null,
        defaultCurrency: defaultCurrency || 'USD',
        defaultLanguage: defaultLanguage || 'en',
      },
    });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('Error updating user:', error);
    const message = error instanceof Error ? error.message : 'Failed to update user';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
