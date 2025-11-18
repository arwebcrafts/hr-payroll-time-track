import React from 'react';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { renderToBuffer } from '@react-pdf/renderer';
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
            businessLogoUrl: true,
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
      createdAt: proposal.createdAt.toISOString(),
      validUntil: (proposal.validUntil || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)).toISOString(),
      companyName: proposal.user?.businessName || 'Your Company',
      companyEmail: proposal.user?.email || undefined,
      companyPhone: proposal.user?.businessPhone || undefined,
      companyAddress: proposal.user?.businessAddress || undefined,
      companyLogo: proposal.user?.businessLogoUrl || undefined,
      clientName: proposal.client?.name || 'Client',
      clientCompany: proposal.client?.company || undefined,
      clientEmail: proposal.client?.email || undefined,
      clientPhone: proposal.client?.phone || undefined,
      clientAddress: proposal.client?.address || undefined,
      title: proposal.title || 'Project Proposal',
      description: proposal.description || undefined,
      lineItems: lineItems.map((item: any) => ({
        description: item.description || '',
        quantity: item.quantity || 1,
        rate: item.unitPrice || 0,
        amount: (item.quantity || 1) * (item.unitPrice || 0),
      })),
      subtotal: Number(proposal.subtotal || 0),
      taxRate: Number(proposal.taxRate || 0),
      taxAmount: Number(proposal.taxAmount || 0),
      discount: Number(proposal.discount || 0),
      total: Number(proposal.totalAmount || 0),
      currency: proposal.currency || 'USD',
      terms: proposal.terms || 'Payment is due within 30 days of proposal acceptance. 50% deposit required to begin work.',
      notes: proposal.notes || undefined,
    };

    // Generate PDF buffer
    const buffer = await renderToBuffer(
      <ProposalPDFTemplate data={pdfData} />
    );

    // Return PDF as response
    return new NextResponse(buffer as unknown as BodyInit, {
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
