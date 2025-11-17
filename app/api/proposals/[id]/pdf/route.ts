import React from 'react';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { renderToStream } from '@react-pdf/renderer';
import ProposalPDFTemplate from '@/components/pdf/ProposalPDFTemplate';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get authenticated user
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: proposalId } = await params;

    // Fetch proposal with client and user details
    const proposal = await prisma.proposal.findFirst({
      where: {
        id: proposalId,
        userId: session.user.id,
      },
      include: {
        client: {
          select: {
            name: true,
            company: true,
            email: true,
            phone: true,
            address: true,
            vatNumber: true,
          },
        },
        user: {
          select: {
            businessName: true,
            email: true,
            businessPhone: true,
            businessAddress: true,
            taxId: true,
            logoUrl: true,
            defaultCurrency: true,
            defaultLanguage: true,
          },
        },
      },
    });

    if (!proposal) {
      return NextResponse.json({ error: 'Proposal not found' }, { status: 404 });
    }

    // Parse line items
    const lineItems = Array.isArray(proposal.lineItems) ? proposal.lineItems : [];

    // Prepare PDF data
    const pdfData = {
      proposalNumber: proposal.proposalNumber || `PROP-${proposal.id.slice(0, 8)}`,
      createdAt: proposal.createdAt,
      validUntil: proposal.validUntil || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      companyName: proposal.user?.businessName || 'Your Company',
      companyEmail: proposal.user?.email,
      companyPhone: proposal.user?.businessPhone,
      companyAddress: proposal.user?.businessAddress,
      companyLogo: proposal.user?.businessLogoUrl,
      clientName: proposal.client?.name || 'Client',
      clientCompany: proposal.client?.company,
      clientEmail: proposal.client?.email,
      clientPhone: proposal.client?.phone,
      clientAddress: proposal.client?.address,
      title: proposal.title || 'Project Proposal',
      description: proposal.description,
      lineItems: lineItems.map((item: any) => ({
        description: item.description || '',
        quantity: item.quantity || 1,
        rate: item.unitPrice || 0,
        amount: (item.quantity || 1) * (item.unitPrice || 0),
      })),
      subtotal: proposal.subtotal,
      taxRate: proposal.taxRate || 0,
      taxAmount: proposal.taxAmount,
      discount: proposal.discount || 0,
      total: proposal.totalAmount,
      currency: proposal.currency || 'USD',
      terms: proposal.terms || 'Payment is due within 30 days of proposal acceptance. 50% deposit required to begin work.',
      notes: proposal.notes,
    };

    // Generate PDF stream
    const stream = await renderToStream(
      <ProposalPDFTemplate data={pdfData} />
    );

    // Convert stream to buffer
    const chunks: Uint8Array[] = [];
    const reader = stream.getReader();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) chunks.push(value);
    }

    const buffer = Buffer.concat(chunks);

    // Return PDF as response
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="proposal-${proposal.proposalNumber || proposalId}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Error generating proposal PDF:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}
