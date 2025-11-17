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
      invoiceNumber,
      templateId,
      language,
      items,
      subtotal,
      taxRate,
      taxAmount,
      discountAmount,
      totalAmount,
      currency,
      status,
      paymentTerms,
      issueDate,
      dueDate,
      notes,
    } = body;

    // Validate required fields
    if (!clientId) {
      return NextResponse.json({ error: 'Client is required' }, { status: 400 });
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

    // Create invoice in database
    const invoice = await prisma.invoice.create({
      data: {
        userId: session.user.id,
        clientId,
        invoiceNumber,
        templateId: templateId || 'clean',
        language: language || 'en',
        items: items || [],
        subtotal: subtotal || 0,
        taxRate: taxRate || 0,
        taxAmount: taxAmount || 0,
        discountAmount: discountAmount || 0,
        totalAmount: totalAmount || 0,
        paidAmount: 0,
        currency: currency || 'USD',
        status: status || 'draft',
        paymentTerms: paymentTerms || 'Net 30',
        issueDate: issueDate ? new Date(issueDate) : new Date(),
        dueDate: dueDate ? new Date(dueDate) : null,
        notes: notes || null,
      },
    });

    return NextResponse.json({ success: true, invoice }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating invoice:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create invoice' },
      { status: 500 }
    );
  }
}
