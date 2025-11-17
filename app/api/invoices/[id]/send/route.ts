import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Simple HTML email template for invoices
const createInvoiceEmailHTML = (data: {
  invoiceNumber: string;
  clientName: string;
  companyName: string;
  totalAmount: string;
  amountDue: string;
  dueDate: string;
  invoiceUrl: string;
  companyEmail?: string;
  companyPhone?: string;
  message?: string;
  isOverdue?: boolean;
}) => {
  const borderColor = data.isOverdue ? '#dc2626' : '#16a34a';
  const accentColor = data.isOverdue ? '#dc2626' : '#16a34a';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.isOverdue ? 'OVERDUE ' : ''}Invoice from ${data.companyName}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f6f9fc;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f6f9fc; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; max-width: 600px;">
          <!-- Header -->
          <tr>
            <td style="background-color: ${accentColor}; padding: 32px 48px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold;">${data.companyName}</h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 48px;">
              ${data.isOverdue ? `
              <table width="100%" cellpadding="15" cellspacing="0" style="margin: 0 0 32px; background-color: #fee2e2; border-left: 4px solid #dc2626; border-radius: 4px;">
                <tr>
                  <td>
                    <p style="margin: 0 0 8px; font-size: 14px; color: #991b1b; font-weight: bold;">⚠ PAYMENT OVERDUE</p>
                    <p style="margin: 0; font-size: 12px; color: #7f1d1d; line-height: 18px;">This invoice is past its due date. Please remit payment immediately to avoid late fees or service interruption.</p>
                  </td>
                </tr>
              </table>
              ` : ''}

              <h2 style="margin: 0 0 20px; color: #1e293b; font-size: 24px; font-weight: bold;">${data.isOverdue ? 'Payment Reminder' : 'Invoice'}</h2>

              <p style="margin: 16px 0; color: #475569; font-size: 16px; line-height: 26px;">Dear ${data.clientName},</p>

              ${data.message ? `<p style="margin: 16px 0; color: #475569; font-size: 16px; line-height: 26px;">${data.message}</p>` : `<p style="margin: 16px 0; color: #475569; font-size: 16px; line-height: 26px;">${data.isOverdue ? 'This is a reminder that the following invoice is now overdue. Please process payment at your earliest convenience.' : 'Please find your invoice details below. We appreciate your business!'}</p>`}

              <!-- Invoice Details Box -->
              <table width="100%" cellpadding="24" cellspacing="0" style="margin: 32px 0; background-color: ${data.isOverdue ? '#fef2f2' : '#f0fdf4'}; border: 2px solid ${borderColor}; border-radius: 8px;">
                <tr>
                  <td width="50%" style="padding-bottom: 12px;">
                    <p style="margin: 0; font-size: 14px; color: #64748b; font-weight: 500;">Invoice Number</p>
                  </td>
                  <td width="50%" style="text-align: right; padding-bottom: 12px;">
                    <p style="margin: 0; font-size: 16px; color: #1e293b; font-weight: 600;">${data.invoiceNumber}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom: 12px;">
                    <p style="margin: 0; font-size: 14px; color: #64748b; font-weight: 500;">Total Amount</p>
                  </td>
                  <td style="text-align: right; padding-bottom: 12px;">
                    <p style="margin: 0; font-size: 16px; color: #1e293b; font-weight: 600;">${data.totalAmount}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom: 12px;">
                    <p style="margin: 0; font-size: 14px; color: #64748b; font-weight: 500;">Amount Due</p>
                  </td>
                  <td style="text-align: right; padding-bottom: 12px;">
                    <p style="margin: 0; font-size: 20px; color: ${accentColor}; font-weight: bold;">${data.amountDue}</p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p style="margin: 0; font-size: 14px; color: #64748b; font-weight: 500;">${data.isOverdue ? 'Was Due On' : 'Due Date'}</p>
                  </td>
                  <td style="text-align: right;">
                    <p style="margin: 0; font-size: 16px; color: ${data.isOverdue ? '#dc2626' : '#1e293b'}; font-weight: 600;">${data.dueDate}</p>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 32px 0;">
                <tr>
                  <td align="center">
                    <a href="${data.invoiceUrl}" style="display: inline-block; padding: 14px 32px; background-color: ${accentColor}; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: bold; border-radius: 6px;">${data.isOverdue ? 'Pay Now' : 'View Invoice'}</a>
                  </td>
                </tr>
              </table>

              <!-- Payment Instructions -->
              <table width="100%" cellpadding="15" cellspacing="0" style="margin: 32px 0; background-color: #f0f9ff; border-left: 4px solid #0284c7; border-radius: 4px;">
                <tr>
                  <td>
                    <p style="margin: 0 0 8px; font-size: 14px; color: #0c4a6e; font-weight: bold;">Payment Instructions</p>
                    <p style="margin: 4px 0; font-size: 12px; color: #0c4a6e; line-height: 18px;">• Please make payment by ${data.dueDate}</p>
                    <p style="margin: 4px 0; font-size: 12px; color: #0c4a6e; line-height: 18px;">• Include invoice number ${data.invoiceNumber} with your payment</p>
                    <p style="margin: 4px 0; font-size: 12px; color: #0c4a6e; line-height: 18px;">• Payment can be made via bank transfer, credit card, or check</p>
                  </td>
                </tr>
              </table>

              <p style="margin: 16px 0; color: #475569; font-size: 16px; line-height: 26px;">If you have any questions about this invoice, please don't hesitate to contact us.</p>

              <p style="margin: 16px 0; color: #475569; font-size: 16px; line-height: 26px;">Thank you for your business!</p>

              <!-- Footer -->
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0;">

              <p style="margin: 0 0 12px; color: #475569; font-size: 14px; line-height: 24px;">
                Best regards,<br>
                <strong>${data.companyName}</strong>
              </p>
              ${data.companyEmail ? `<p style="margin: 4px 0; color: #64748b; font-size: 14px;">Email: <a href="mailto:${data.companyEmail}" style="color: #2563eb; text-decoration: underline;">${data.companyEmail}</a></p>` : ''}
              ${data.companyPhone ? `<p style="margin: 4px 0; color: #64748b; font-size: 14px;">Phone: ${data.companyPhone}</p>` : ''}

              <p style="margin: 24px 0 0; color: #94a3b8; font-size: 12px; line-height: 18px;">
                This is an automated email from ${data.companyName}. For questions about this invoice, please contact ${data.companyEmail || data.companyPhone || 'us'}.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check if Resend is configured
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        {
          error: 'Email sending is not configured. Please add RESEND_API_KEY to your environment variables.',
          instructions: 'Get your API key from https://resend.com and add it to .env.local'
        },
        { status: 503 }
      );
    }

    // Get authenticated user
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: invoiceId } = await params;
    const body = await request.json();
    const { recipientEmail, message, ccEmail } = body;

    // Validate recipient email
    if (!recipientEmail) {
      return NextResponse.json(
        { error: 'Recipient email is required' },
        { status: 400 }
      );
    }

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
          },
        },
        user: {
          select: {
            businessName: true,
            email: true,
            businessPhone: true,
            defaultCurrency: true,
          },
        },
      },
    });

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    // Format currency
    const formatCurrency = (amount: number, currency: string = 'USD') => {
      const symbols: { [key: string]: string } = {
        USD: '$',
        EUR: '€',
        GBP: '£',
        CAD: 'CA$',
        AUD: 'AU$',
      };
      const symbol = symbols[currency] || currency;
      return `${symbol}${amount.toFixed(2)}`;
    };

    // Format date
    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    };

    // Calculate amounts
    const amountPaid = invoice.paidAmount || 0;
    const amountDue = invoice.totalAmount - amountPaid;

    // Check if overdue
    const dueDate = new Date(invoice.dueDate);
    const now = new Date();
    const isOverdue = now > dueDate && amountDue > 0 && invoice.status !== 'paid';

    // Prepare email data
    const emailData = {
      invoiceNumber: invoice.invoiceNumber || `INV-${invoice.id.slice(0, 8)}`,
      clientName: invoice.client?.name || 'Client',
      companyName: invoice.user?.businessName || 'Your Company',
      totalAmount: formatCurrency(invoice.totalAmount, invoice.user?.defaultCurrency || 'USD'),
      amountDue: formatCurrency(amountDue, invoice.user?.defaultCurrency || 'USD'),
      dueDate: formatDate(invoice.dueDate),
      invoiceUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://yourdomain.com'}/invoices/view/${invoice.id}`,
      companyEmail: invoice.user?.email,
      companyPhone: invoice.user?.businessPhone,
      message: message,
      isOverdue: isOverdue,
    };

    // Send email using Resend
    const emailOptions: any = {
      from: process.env.RESEND_FROM_EMAIL || `${emailData.companyName} <noreply@yourdomain.com>`,
      to: recipientEmail,
      subject: isOverdue
        ? `OVERDUE: Invoice ${emailData.invoiceNumber} from ${emailData.companyName}`
        : `Invoice ${emailData.invoiceNumber} from ${emailData.companyName}`,
      html: createInvoiceEmailHTML(emailData),
    };

    // Add CC if provided
    if (ccEmail) {
      emailOptions.cc = ccEmail;
    }

    const { data: emailResult, error: emailError } = await resend.emails.send(emailOptions);

    if (emailError) {
      console.error('Resend error:', emailError);
      return NextResponse.json(
        { error: 'Failed to send email', details: emailError },
        { status: 500 }
      );
    }

    // Update invoice status to 'sent' if it was draft
    if (invoice.status === 'draft') {
      await prisma.invoice.update({
        where: { id: invoiceId },
        data: {
          status: 'sent',
          sentAt: new Date(),
        },
      });
    }

    // Log email in database (if email_logs table exists)
    try {
      await prisma.emailLog.create({
        data: {
          userId: session.user.id,
          invoiceId: invoiceId,
          recipientEmail,
          subject: emailOptions.subject,
          status: 'sent',
          sentAt: new Date(),
        },
      });
    } catch (logError) {
      // Email logs table might not exist yet, continue anyway
      console.warn('Could not log email:', logError);
    }

    return NextResponse.json({
      success: true,
      message: 'Invoice sent successfully',
      emailId: emailResult?.id,
    });
  } catch (error) {
    console.error('Error sending invoice email:', error);
    return NextResponse.json(
      { error: 'Failed to send invoice email' },
      { status: 500 }
    );
  }
}
