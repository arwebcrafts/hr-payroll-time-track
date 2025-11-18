import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image,
} from '@react-pdf/renderer';

// Lazy font registration - only runs when component is first used
let fontsRegistered = false;
function registerFonts() {
  if (!fontsRegistered) {
    Font.register({
      family: 'Roboto',
      fonts: [
        {
          src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf',
          fontWeight: 300,
        },
        {
          src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf',
          fontWeight: 400,
        },
        {
          src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf',
          fontWeight: 500,
        },
        {
          src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf',
          fontWeight: 700,
        },
      ],
    });
    fontsRegistered = true;
  }
}

// Lazy styles creation - only runs when component is first used
let stylesCache: ReturnType<typeof StyleSheet.create> | null = null;
function getStyles() {
  if (!stylesCache) {
    stylesCache = StyleSheet.create({
  page: {
    fontFamily: 'Roboto',
    fontSize: 10,
    paddingTop: 40,
    paddingBottom: 60,
    paddingHorizontal: 40,
    backgroundColor: '#ffffff',
  },
  header: {
    marginBottom: 30,
    borderBottom: '2 solid #2563eb',
    paddingBottom: 15,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  logo: {
    width: 60,
    height: 60,
    objectFit: 'contain',
  },
  companyInfo: {
    textAlign: 'right',
  },
  companyName: {
    fontSize: 18,
    fontWeight: 700,
    color: '#1e40af',
    marginBottom: 4,
  },
  companyDetail: {
    fontSize: 9,
    color: '#64748b',
    marginBottom: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: 700,
    color: '#1e293b',
    marginTop: 20,
    marginBottom: 10,
  },
  proposalNumber: {
    fontSize: 11,
    color: '#64748b',
    marginBottom: 5,
  },
  infoSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    gap: 20,
  },
  infoBox: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 15,
    borderRadius: 4,
  },
  infoLabel: {
    fontSize: 9,
    fontWeight: 700,
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 10,
    color: '#1e293b',
    marginBottom: 3,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: '#1e293b',
    marginBottom: 10,
    borderBottom: '1 solid #e2e8f0',
    paddingBottom: 5,
  },
  description: {
    fontSize: 10,
    color: '#475569',
    lineHeight: 1.6,
    marginBottom: 20,
  },
  table: {
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#2563eb',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  tableHeaderText: {
    fontSize: 9,
    fontWeight: 700,
    color: '#ffffff',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1 solid #e2e8f0',
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  tableRowAlt: {
    backgroundColor: '#f8fafc',
  },
  colDescription: {
    width: '45%',
  },
  colQuantity: {
    width: '15%',
    textAlign: 'center',
  },
  colRate: {
    width: '20%',
    textAlign: 'right',
  },
  colAmount: {
    width: '20%',
    textAlign: 'right',
  },
  cellText: {
    fontSize: 10,
    color: '#1e293b',
  },
  cellTextBold: {
    fontSize: 10,
    fontWeight: 700,
    color: '#1e293b',
  },
  summarySection: {
    marginTop: 20,
    marginLeft: 'auto',
    width: '50%',
    backgroundColor: '#f8fafc',
    padding: 15,
    borderRadius: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingBottom: 8,
  },
  summaryRowBorder: {
    borderBottom: '1 solid #e2e8f0',
  },
  summaryLabel: {
    fontSize: 10,
    color: '#475569',
  },
  summaryValue: {
    fontSize: 10,
    fontWeight: 500,
    color: '#1e293b',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 12,
    borderTop: '2 solid #2563eb',
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: 700,
    color: '#1e293b',
  },
  totalValue: {
    fontSize: 14,
    fontWeight: 700,
    color: '#2563eb',
  },
  termsSection: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#fef3c7',
    borderLeft: '4 solid #f59e0b',
    borderRadius: 4,
  },
  termsTitle: {
    fontSize: 11,
    fontWeight: 700,
    color: '#92400e',
    marginBottom: 8,
  },
  termsText: {
    fontSize: 9,
    color: '#78350f',
    lineHeight: 1.5,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    borderTop: '1 solid #e2e8f0',
    paddingTop: 15,
  },
  footerText: {
    fontSize: 8,
    color: '#94a3b8',
    textAlign: 'center',
  },
  signatureSection: {
    marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 30,
  },
  signatureBox: {
    flex: 1,
  },
  signatureLine: {
    borderTop: '1 solid #cbd5e1',
    marginTop: 50,
    paddingTop: 8,
  },
  signatureLabel: {
    fontSize: 9,
    color: '#64748b',
    textAlign: 'center',
  },
    });
  }
  return stylesCache;
}

interface ProposalLineItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface ProposalPDFData {
  proposalNumber: string;
  createdAt: string;
  validUntil: string;
  companyName: string;
  companyEmail?: string;
  companyPhone?: string;
  companyAddress?: string;
  companyLogo?: string;
  clientName: string;
  clientCompany?: string;
  clientEmail?: string;
  clientPhone?: string;
  clientAddress?: string;
  title: string;
  description?: string;
  lineItems: ProposalLineItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discount: number;
  total: number;
  currency: string;
  terms?: string;
  notes?: string;
}

interface ProposalPDFTemplateProps {
  data: ProposalPDFData;
}

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

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const ProposalPDFTemplate: React.FC<ProposalPDFTemplateProps> = ({ data }) => {
  // Register fonts lazily on first use
  registerFonts();
  const styles = getStyles();

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              {data.companyLogo && (
                // eslint-disable-next-line jsx-a11y/alt-text
                <Image src={data.companyLogo} style={styles.logo} />
              )}
            </View>
            <View style={styles.companyInfo}>
              <Text style={styles.companyName}>{data.companyName}</Text>
              {data.companyEmail && (
                <Text style={styles.companyDetail}>{data.companyEmail}</Text>
              )}
              {data.companyPhone && (
                <Text style={styles.companyDetail}>{data.companyPhone}</Text>
              )}
              {data.companyAddress && (
                <Text style={styles.companyDetail}>{data.companyAddress}</Text>
              )}
            </View>
          </View>
          <Text style={styles.title}>PROPOSAL</Text>
          <Text style={styles.proposalNumber}>
            Proposal #{data.proposalNumber}
          </Text>
          <Text style={styles.proposalNumber}>
            Date: {formatDate(data.createdAt)}
          </Text>
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Prepared For:</Text>
            <Text style={styles.infoText}>{data.clientName}</Text>
            {data.clientCompany && (
              <Text style={styles.infoText}>{data.clientCompany}</Text>
            )}
            {data.clientEmail && (
              <Text style={styles.infoText}>{data.clientEmail}</Text>
            )}
            {data.clientPhone && (
              <Text style={styles.infoText}>{data.clientPhone}</Text>
            )}
            {data.clientAddress && (
              <Text style={styles.infoText}>{data.clientAddress}</Text>
            )}
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Proposal Details:</Text>
            <Text style={styles.infoText}>
              Valid Until: {formatDate(data.validUntil)}
            </Text>
            <Text style={styles.infoText}>
              Total Amount: {formatCurrency(data.total, data.currency)}
            </Text>
          </View>
        </View>

        {/* Project Description */}
        {data.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Project Overview</Text>
            <Text style={styles.description}>{data.description}</Text>
          </View>
        )}

        {/* Line Items Table */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Project Breakdown</Text>
          <View style={styles.table}>
            {/* Table Header */}
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, styles.colDescription]}>
                Description
              </Text>
              <Text style={[styles.tableHeaderText, styles.colQuantity]}>
                Qty
              </Text>
              <Text style={[styles.tableHeaderText, styles.colRate]}>
                Rate
              </Text>
              <Text style={[styles.tableHeaderText, styles.colAmount]}>
                Amount
              </Text>
            </View>

            {/* Table Rows */}
            {data.lineItems.map((item, index) => (
              <View
                key={index}
                style={[
                  styles.tableRow,
                  index % 2 === 1 ? styles.tableRowAlt : {},
                ]}
              >
                <Text style={[styles.cellText, styles.colDescription]}>
                  {item.description}
                </Text>
                <Text style={[styles.cellText, styles.colQuantity]}>
                  {item.quantity}
                </Text>
                <Text style={[styles.cellText, styles.colRate]}>
                  {formatCurrency(item.rate, data.currency)}
                </Text>
                <Text style={[styles.cellTextBold, styles.colAmount]}>
                  {formatCurrency(item.amount, data.currency)}
                </Text>
              </View>
            ))}
          </View>

          {/* Summary */}
          <View style={styles.summarySection}>
            <View style={[styles.summaryRow, styles.summaryRowBorder]}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>
                {formatCurrency(data.subtotal, data.currency)}
              </Text>
            </View>
            {data.discount > 0 && (
              <View style={[styles.summaryRow, styles.summaryRowBorder]}>
                <Text style={styles.summaryLabel}>Discount</Text>
                <Text style={styles.summaryValue}>
                  -{formatCurrency(data.discount, data.currency)}
                </Text>
              </View>
            )}
            {data.taxRate > 0 && (
              <View style={[styles.summaryRow, styles.summaryRowBorder]}>
                <Text style={styles.summaryLabel}>
                  Tax ({data.taxRate}%)
                </Text>
                <Text style={styles.summaryValue}>
                  {formatCurrency(data.taxAmount, data.currency)}
                </Text>
              </View>
            )}
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>
                {formatCurrency(data.total, data.currency)}
              </Text>
            </View>
          </View>
        </View>

        {/* Terms & Conditions */}
        {data.terms && (
          <View style={styles.termsSection}>
            <Text style={styles.termsTitle}>Terms & Conditions</Text>
            <Text style={styles.termsText}>{data.terms}</Text>
          </View>
        )}

        {/* Notes */}
        {data.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Notes</Text>
            <Text style={styles.description}>{data.notes}</Text>
          </View>
        )}

        {/* Signature Section */}
        <View style={styles.signatureSection}>
          <View style={styles.signatureBox}>
            <View style={styles.signatureLine}>
              <Text style={styles.signatureLabel}>Client Signature</Text>
            </View>
          </View>
          <View style={styles.signatureBox}>
            <View style={styles.signatureLine}>
              <Text style={styles.signatureLabel}>Date</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            This proposal is valid until {formatDate(data.validUntil)}. Please
            sign and return to accept.
          </Text>
          <Text style={styles.footerText}>
            Thank you for considering {data.companyName} for your project.
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default ProposalPDFTemplate;
