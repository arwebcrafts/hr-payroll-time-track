import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Simple HTML email template (works without react-email)
const createProposalEmailHTML = (data: {
  proposalNumber: string;
  clientName: string;
  companyName: string;
  totalAmount: string;
  validUntil: string;
  proposalUrl: string;
  companyEmail?: string;
  companyPhone?: string;
  message?: string;
}) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Proposal from ${data.companyName}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f6f9fc;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f6f9fc; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; max-width: 600px;">
          <!-- Header -->
          <tr>
            <td style="background-color: #2563eb; padding: 32px 48px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold;">${data.companyName}</h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 48px;">
              <h2 style="margin: 0 0 20px; color: #1e293b; font-size: 24px; font-weight: bold;">New Proposal</h2>

              <p style="margin: 16px 0; color: #475569; font-size: 16px; line-height: 26px;">Dear ${data.clientName},</p>

              ${data.message ? `<p style="margin: 16px 0; color: #475569; font-size: 16px; line-height: 26px;">${data.message}</p>` : `<p style="margin: 16px 0; color: #475569; font-size: 16px; line-height: 26px;">Thank you for the opportunity to work with you. I'm excited to present this proposal for your review.</p>`}

              <!-- Proposal Details Box -->
              <table width="100%" cellpadding="24" cellspacing="0" style="margin: 32px 0; background-color: #f8fafc; border: 2px solid #2563eb; border-radius: 8px;">
                <tr>
                  <td width="50%" style="padding-bottom: 12px;">
                    <p style="margin: 0; font-size: 14px; color: #64748b; font-weight: 500;">Proposal Number</p>
                  </td>
                  <td width="50%" style="text-align: right; padding-bottom: 12px;">
                    <p style="margin: 0; font-size: 16px; color: #1e293b; font-weight: 600;">${data.proposalNumber}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom: 12px;">
                    <p style="margin: 0; font-size: 14px; color: #64748b; font-weight: 500;">Total Amount</p>
                  </td>
                  <td style="text-align: right; padding-bottom: 12px;">
                    <p style="margin: 0; font-size: 20px; color: #2563eb; font-weight: bold;">${data.totalAmount}</p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p style="margin: 0; font-size: 14px; color: #64748b; font-weight: 500;">Valid Until</p>
                  </td>
                  <td style="text-align: right;">
                    <p style="margin: 0; font-size: 16px; color: #1e293b; font-weight: 600;">${data.validUntil}</p>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 32px 0;">
                <tr>
                  <td align="center">
                    <a href="${data.proposalUrl}" style="display: inline-block; padding: 14px 32px; background-color: #2563eb; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: bold; border-radius: 6px;">View Proposal</a>
                  </td>
                </tr>
              </table>

              <p style="margin: 16px 0; color: #475569; font-size: 16px; line-height: 26px;">Please review the proposal at your convenience. If you have any questions or need clarification on any details, feel free to reach out.</p>

              <p style="margin: 16px 0; color: #475569; font-size: 16px; line-height: 26px;">Looking forward to working with you!</p>

              <!-- Footer -->
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0;">

              <p style="margin: 0 0 12px; color: #475569; font-size: 14px; line-height: 24px;">
                Best regards,<br>
                <strong>${data.companyName}</strong>
              </p>
              ${data.companyEmail ? `<p style="margin: 4px 0; color: #64748b; font-size: 14px;">Email: <a href="mailto:${data.companyEmail}" style="color: #2563eb; text-decoration: underline;">${data.companyEmail}</a></p>` : ''}
              ${data.companyPhone ? `<p style="margin: 4px 0; color: #64748b; font-size: 14px;">Phone: ${data.companyPhone}</p>` : ''}

              <p style="margin: 24px 0 0; color: #94a3b8; font-size: 12px; line-height: 18px;">
                This is an automated email from ${data.companyName}. This proposal is confidential and intended solely for the use of the individual to whom it is addressed.
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

    const { id: proposalId } = await params;
    const body = await request.json();
    const { recipientEmail, message, ccEmail } = body;

    // Validate recipient email
    if (!recipientEmail) {
      return NextResponse.json(
        { error: 'Recipient email is required' },
        { status: 400 }
      );
    }

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

    if (!proposal) {
      return NextResponse.json({ error: 'Proposal not found' }, { status: 404 });
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

    // Prepare email data
    const emailData = {
      proposalNumber: proposal.proposalNumber || `PROP-${proposal.id.slice(0, 8)}`,
      clientName: proposal.client?.name || 'Client',
      companyName: proposal.user?.businessName || 'Your Company',
      totalAmount: formatCurrency(proposal.totalAmount, proposal.user?.defaultCurrency || 'USD'),
      validUntil: formatDate(proposal.validUntil || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()),
      proposalUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://yourdomain.com'}/proposals/view/${proposal.id}`,
      companyEmail: proposal.user?.email,
      companyPhone: proposal.user?.businessPhone,
      message: message,
    };

    // Send email using Resend
    const emailOptions: any = {
      from: process.env.RESEND_FROM_EMAIL || `${emailData.companyName} <noreply@yourdomain.com>`,
      to: recipientEmail,
      subject: `New Proposal from ${emailData.companyName} - ${emailData.proposalNumber}`,
      html: createProposalEmailHTML(emailData),
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

    // Update proposal status to 'sent'
    await prisma.proposal.update({
      where: { id: proposalId },
      data: {
        status: 'sent',
        sentAt: new Date(),
      },
    });

    // Log email in database (if email_logs table exists)
    try {
      await prisma.emailLog.create({
        data: {
          userId: session.user.id,
          proposalId: proposalId,
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
      message: 'Proposal sent successfully',
      emailId: emailResult?.id,
    });
  } catch (error) {
    console.error('Error sending proposal email:', error);
    return NextResponse.json(
      { error: 'Failed to send proposal email' },
      { status: 500 }
    );
  }
}
