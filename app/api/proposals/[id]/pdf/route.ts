import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { renderToStream } from '@react-pdf/renderer';
import ProposalPDFTemplate from '@/components/pdf/ProposalPDFTemplate';

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

    const proposalId = params.id;

    // Fetch proposal with client and user details
    const { data: proposal, error: proposalError } = await supabase
      .from('proposals')
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
      .eq('id', proposalId)
      .eq('user_id', user.id)
      .single();

    if (proposalError || !proposal) {
      return NextResponse.json(
        { error: 'Proposal not found' },
        { status: 404 }
      );
    }

    // Parse line items if stored as JSON
    const lineItems =
      typeof proposal.line_items === 'string'
        ? JSON.parse(proposal.line_items)
        : proposal.line_items || [];

    // Calculate amounts
    const subtotal = lineItems.reduce(
      (sum: number, item: any) => sum + (item.amount || 0),
      0
    );
    const taxAmount = (subtotal * (proposal.tax_rate || 0)) / 100;
    const totalAfterTax = subtotal + taxAmount;
    const total = totalAfterTax - (proposal.discount || 0);

    // Prepare PDF data
    const pdfData = {
      proposalNumber: proposal.proposal_number || `PROP-${proposal.id.slice(0, 8)}`,
      createdAt: proposal.created_at,
      validUntil: proposal.valid_until || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      companyName: proposal.user?.business_name || 'Your Company',
      companyEmail: proposal.user?.email,
      companyPhone: proposal.user?.phone,
      companyAddress: proposal.user?.address,
      companyLogo: proposal.user?.logo_url,
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
        rate: item.rate || 0,
        amount: item.amount || 0,
      })),
      subtotal,
      taxRate: proposal.tax_rate || 0,
      taxAmount,
      discount: proposal.discount || 0,
      total,
      currency: proposal.user?.currency || 'USD',
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
        'Content-Disposition': `attachment; filename="proposal-${proposal.proposal_number || proposalId}.pdf"`,
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
