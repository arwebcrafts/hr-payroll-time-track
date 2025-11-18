import React from 'react';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { renderToBuffer } from '@react-pdf/renderer';
import InvoicePDFTemplate from '@/components/pdf/InvoicePDFTemplate';

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

    const { id: invoiceId } = await params;

    // Fetch invoice with client and user details
    const invoice = await prisma.invoice.findFirst({
      where: {
        id: invoiceId,
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

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    // Parse line items if stored as JSON
    const lineItems =
      typeof invoice.lineItems === 'string'
        ? JSON.parse(invoice.lineItems)
        : invoice.lineItems || [];

    // Calculate amounts
    const subtotal = lineItems.reduce(
      (sum: number, item: any) => sum + (item.amount || 0),
      0
    );
    const taxAmount = (subtotal * Number(invoice.taxRate || 0)) / 100;
    const totalAfterTax = subtotal + taxAmount;
    const total = totalAfterTax - Number(invoice.discount || 0);
    const amountPaid = Number(invoice.amountPaid || 0);
    const amountDue = total - amountPaid;

    // Determine status based on due date and payment
    let status = invoice.status;
    if (status === 'sent' && invoice.dueDate) {
      const dueDate = new Date(invoice.dueDate);
      const now = new Date();
      if (now > dueDate && amountDue > 0) {
        status = 'overdue';
      }
    }
    if (amountDue <= 0) {
      status = 'paid';
    }

    // Prepare PDF data
    const pdfData = {
      invoiceNumber: invoice.invoiceNumber || `INV-${invoice.id.slice(0, 8)}`,
      issueDate: (invoice.issueDate || invoice.createdAt).toISOString(),
      dueDate: (invoice.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)).toISOString(),
      status: status as 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled',
      paymentTerms: invoice.paymentTerms || 'Net 30',
      companyName: invoice.user?.businessName || 'Your Company',
      companyEmail: invoice.user?.email || undefined,
      companyPhone: invoice.user?.businessPhone || undefined,
      companyAddress: invoice.user?.businessAddress || undefined,
      companyTaxId: invoice.user?.taxId || undefined,
      companyLogo: invoice.user?.businessLogoUrl || undefined,
      clientName: invoice.client?.name || 'Client',
      clientCompany: invoice.client?.company || undefined,
      clientEmail: invoice.client?.email || undefined,
      clientPhone: invoice.client?.phone || undefined,
      clientAddress: invoice.client?.address || undefined,
      clientVatNumber: invoice.client?.vatNumber || undefined,
      lineItems: lineItems.map((item: any) => ({
        description: item.description || '',
        quantity: item.quantity || 1,
        rate: item.rate || 0,
        amount: item.amount || 0,
      })),
      subtotal,
      taxRate: Number(invoice.taxRate || 0),
      taxAmount,
      discount: Number(invoice.discount || 0),
      total,
      amountPaid,
      amountDue,
      currency: invoice.user?.defaultCurrency || 'USD',
      notes: invoice.notes || undefined,
      paymentInstructions: invoice.paymentInstructions || undefined,
    };

    // Generate PDF buffer
    const buffer = await renderToBuffer(
      <InvoicePDFTemplate data={pdfData} />
    );

    // Return PDF as response
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="invoice-${invoice.invoice_number || invoiceId}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Error generating invoice PDF:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}
