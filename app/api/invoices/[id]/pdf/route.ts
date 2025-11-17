import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { renderToStream } from '@react-pdf/renderer';
import InvoicePDFTemplate from '@/components/pdf/InvoicePDFTemplate';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const invoiceId = params.id;

    // Fetch invoice with client and user details
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .select(
        `
        *,
        client:clients(
          name,
          company,
          email,
          phone,
          address,
          vat_number
        ),
        user:users(
          business_name,
          email,
          phone,
          address,
          tax_id,
          logo_url,
          currency,
          language
        )
      `
      )
      .eq('id', invoiceId)
      .eq('user_id', user.id)
      .single();

    if (invoiceError || !invoice) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }

    // Parse line items if stored as JSON
    const lineItems =
      typeof invoice.line_items === 'string'
        ? JSON.parse(invoice.line_items)
        : invoice.line_items || [];

    // Calculate amounts
    const subtotal = lineItems.reduce(
      (sum: number, item: any) => sum + (item.amount || 0),
      0
    );
    const taxAmount = (subtotal * (invoice.tax_rate || 0)) / 100;
    const totalAfterTax = subtotal + taxAmount;
    const total = totalAfterTax - (invoice.discount || 0);
    const amountPaid = invoice.amount_paid || 0;
    const amountDue = total - amountPaid;

    // Determine status based on due date and payment
    let status = invoice.status;
    if (status === 'sent' && invoice.due_date) {
      const dueDate = new Date(invoice.due_date);
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
      invoiceNumber: invoice.invoice_number || `INV-${invoice.id.slice(0, 8)}`,
      issueDate: invoice.issue_date || invoice.created_at,
      dueDate: invoice.due_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: status as 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled',
      paymentTerms: invoice.payment_terms || 'Net 30',
      companyName: invoice.user?.business_name || 'Your Company',
      companyEmail: invoice.user?.email,
      companyPhone: invoice.user?.phone,
      companyAddress: invoice.user?.address,
      companyTaxId: invoice.user?.tax_id,
      companyLogo: invoice.user?.logo_url,
      clientName: invoice.client?.name || 'Client',
      clientCompany: invoice.client?.company,
      clientEmail: invoice.client?.email,
      clientPhone: invoice.client?.phone,
      clientAddress: invoice.client?.address,
      clientVatNumber: invoice.client?.vat_number,
      lineItems: lineItems.map((item: any) => ({
        description: item.description || '',
        quantity: item.quantity || 1,
        rate: item.rate || 0,
        amount: item.amount || 0,
      })),
      subtotal,
      taxRate: invoice.tax_rate || 0,
      taxAmount,
      discount: invoice.discount || 0,
      total,
      amountPaid,
      amountDue,
      currency: invoice.user?.currency || 'USD',
      notes: invoice.notes,
      paymentInstructions: invoice.payment_instructions,
    };

    // Generate PDF stream
    const stream = await renderToStream(
      <InvoicePDFTemplate data={pdfData} />
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
