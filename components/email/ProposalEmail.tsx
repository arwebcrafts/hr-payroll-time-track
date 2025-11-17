import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Row,
  Column,
} from '@react-email/components';
import * as React from 'react';

interface ProposalEmailProps {
  proposalNumber: string;
  clientName: string;
  companyName: string;
  totalAmount: string;
  validUntil: string;
  proposalUrl: string;
  companyEmail?: string;
  companyPhone?: string;
  message?: string;
}

export const ProposalEmail = ({
  proposalNumber = 'PROP-2025-0001',
  clientName = 'John Doe',
  companyName = 'Your Company',
  totalAmount = '$5,000.00',
  validUntil = 'February 15, 2025',
  proposalUrl = 'https://yourdomain.com/proposals/view/123',
  companyEmail = 'hello@yourcompany.com',
  companyPhone = '+1 (555) 123-4567',
  message,
}: ProposalEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>
        New Proposal from {companyName} - {proposalNumber}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={heading}>{companyName}</Heading>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Heading style={h1}>New Proposal</Heading>
            <Text style={text}>Dear {clientName},</Text>

            {message && (
              <Text style={text}>{message}</Text>
            )}

            {!message && (
              <Text style={text}>
                Thank you for the opportunity to work with you. I&apos;m excited to
                present this proposal for your review.
              </Text>
            )}

            {/* Proposal Details Box */}
            <Section style={proposalBox}>
              <Row>
                <Column style={proposalBoxLabel}>
                  <Text style={proposalBoxLabelText}>Proposal Number</Text>
                </Column>
                <Column style={proposalBoxValue}>
                  <Text style={proposalBoxValueText}>{proposalNumber}</Text>
                </Column>
              </Row>
              <Row>
                <Column style={proposalBoxLabel}>
                  <Text style={proposalBoxLabelText}>Total Amount</Text>
                </Column>
                <Column style={proposalBoxValue}>
                  <Text style={proposalBoxAmountText}>{totalAmount}</Text>
                </Column>
              </Row>
              <Row>
                <Column style={proposalBoxLabel}>
                  <Text style={proposalBoxLabelText}>Valid Until</Text>
                </Column>
                <Column style={proposalBoxValue}>
                  <Text style={proposalBoxValueText}>{validUntil}</Text>
                </Column>
              </Row>
            </Section>

            {/* CTA Button */}
            <Section style={buttonContainer}>
              <Button style={button} href={proposalUrl}>
                View Proposal
              </Button>
            </Section>

            <Text style={text}>
              Please review the proposal at your convenience. If you have any
              questions or need clarification on any details, feel free to reach
              out.
            </Text>

            <Text style={text}>
              Looking forward to working with you!
            </Text>

            <Hr style={hr} />

            {/* Footer */}
            <Section style={footer}>
              <Text style={footerText}>
                Best regards,
                <br />
                <strong>{companyName}</strong>
              </Text>
              {companyEmail && (
                <Text style={footerContact}>
                  Email: <Link href={`mailto:${companyEmail}`} style={link}>{companyEmail}</Link>
                </Text>
              )}
              {companyPhone && (
                <Text style={footerContact}>
                  Phone: {companyPhone}
                </Text>
              )}
              <Text style={footerSmall}>
                This is an automated email from {companyName}. This proposal is
                confidential and intended solely for the use of the individual to
                whom it is addressed.
              </Text>
            </Section>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default ProposalEmail;

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
};

const header = {
  padding: '32px 48px',
  backgroundColor: '#2563eb',
};

const heading = {
  fontSize: '32px',
  fontWeight: 'bold',
  color: '#ffffff',
  margin: '0',
  padding: '0',
  textAlign: 'center' as const,
};

const content = {
  padding: '0 48px',
};

const h1 = {
  color: '#1e293b',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0 20px',
  padding: '0',
};

const text = {
  color: '#475569',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 0',
};

const proposalBox = {
  backgroundColor: '#f8fafc',
  border: '2px solid #2563eb',
  borderRadius: '8px',
  padding: '24px',
  margin: '32px 0',
};

const proposalBoxLabel = {
  verticalAlign: 'top',
  paddingBottom: '12px',
};

const proposalBoxLabelText = {
  fontSize: '14px',
  color: '#64748b',
  margin: '0',
  fontWeight: '500',
};

const proposalBoxValue = {
  verticalAlign: 'top',
  textAlign: 'right' as const,
  paddingBottom: '12px',
};

const proposalBoxValueText = {
  fontSize: '16px',
  color: '#1e293b',
  margin: '0',
  fontWeight: '600',
};

const proposalBoxAmountText = {
  fontSize: '20px',
  color: '#2563eb',
  margin: '0',
  fontWeight: 'bold',
};

const buttonContainer = {
  margin: '32px 0',
  textAlign: 'center' as const,
};

const button = {
  backgroundColor: '#2563eb',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 32px',
};

const hr = {
  borderColor: '#e2e8f0',
  margin: '32px 0',
};

const footer = {
  marginTop: '32px',
};

const footerText = {
  color: '#475569',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '0 0 12px',
};

const footerContact = {
  color: '#64748b',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '4px 0',
};

const footerSmall = {
  color: '#94a3b8',
  fontSize: '12px',
  lineHeight: '18px',
  marginTop: '24px',
};

const link = {
  color: '#2563eb',
  textDecoration: 'underline',
};
