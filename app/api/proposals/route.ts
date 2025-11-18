import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const {
      clientId,
      proposalNumber,
      title,
      templateId,
      language,
      description,
      items,
      subtotal,
      taxRate,
      taxAmount,
      discountAmount,
      totalAmount,
      currency,
      status,
      validUntil,
    } = body;

    // Validate required fields
    if (!clientId || !title) {
      return NextResponse.json(
        { error: 'Client and title are required' },
        { status: 400 }
      );
    }

    // Verify client belongs to user
    const client = await prisma.client.findFirst({
      where: {
        id: clientId,
        userId: session.user.id,
      },
    });

    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    // Create proposal in database
    const proposal = await prisma.proposal.create({
      data: {
        userId: session.user.id,
        clientId,
        proposalNumber,
        title,
        templateId: templateId || 'professional',
        language: language || 'en',
        description: description || null,
        lineItems: items || [],
        subtotal: subtotal || 0,
        taxRate: taxRate || 0,
        taxAmount: taxAmount || 0,
        discount: discountAmount || 0,
        totalAmount: totalAmount || 0,
        currency: currency || 'USD',
        status: status || 'draft',
        validUntil: validUntil ? new Date(validUntil) : null,
      },
    });

    return NextResponse.json({ success: true, proposal }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating proposal:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create proposal' },
      { status: 500 }
    );
  }
}
