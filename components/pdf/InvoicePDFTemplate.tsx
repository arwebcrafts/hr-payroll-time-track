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
    borderBottom: '2 solid #16a34a',
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
    color: '#15803d',
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
  invoiceNumber: {
    fontSize: 11,
    color: '#64748b',
    marginBottom: 5,
  },
  statusBadge: {
    backgroundColor: '#dcfce7',
    color: '#15803d',
    padding: '4 10',
    borderRadius: 4,
    fontSize: 9,
    fontWeight: 700,
    textTransform: 'uppercase',
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  statusBadgePaid: {
    backgroundColor: '#dcfce7',
    color: '#15803d',
  },
  statusBadgePending: {
    backgroundColor: '#fef9c3',
    color: '#854d0e',
  },
  statusBadgeOverdue: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
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
  infoTextBold: {
    fontSize: 10,
    fontWeight: 700,
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
    backgroundColor: '#16a34a',
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
    backgroundColor: '#f0fdf4',
    padding: 15,
    borderRadius: 4,
    border: '1 solid #16a34a',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingBottom: 8,
  },
  summaryRowBorder: {
    borderBottom: '1 solid #d1fae5',
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
    borderTop: '2 solid #16a34a',
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: 700,
    color: '#1e293b',
  },
  totalValue: {
    fontSize: 14,
    fontWeight: 700,
    color: '#16a34a',
  },
  paymentInfo: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#f0f9ff',
    borderLeft: '4 solid #0284c7',
    borderRadius: 4,
  },
  paymentTitle: {
    fontSize: 11,
    fontWeight: 700,
    color: '#0c4a6e',
    marginBottom: 8,
  },
  paymentText: {
    fontSize: 9,
    color: '#0c4a6e',
    lineHeight: 1.5,
    marginBottom: 4,
  },
  notesSection: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#fef3c7',
    borderRadius: 4,
  },
  notesTitle: {
    fontSize: 11,
    fontWeight: 700,
    color: '#92400e',
    marginBottom: 8,
  },
  notesText: {
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
  overdueNotice: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#fee2e2',
    borderLeft: '4 solid #dc2626',
    borderRadius: 4,
  },
  overdueTitle: {
    fontSize: 11,
    fontWeight: 700,
    color: '#991b1b',
    marginBottom: 8,
  },
  overdueText: {
    fontSize: 9,
    color: '#7f1d1d',
    lineHeight: 1.5,
  },
    });
  }
  return stylesCache;
}

interface InvoiceLineItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface InvoicePDFData {
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  paymentTerms: string;
  companyName: string;
  companyEmail?: string;
  companyPhone?: string;
  companyAddress?: string;
  companyTaxId?: string;
  companyLogo?: string;
  clientName: string;
  clientCompany?: string;
  clientEmail?: string;
  clientPhone?: string;
  clientAddress?: string;
  clientVatNumber?: string;
  lineItems: InvoiceLineItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discount: number;
  total: number;
  amountPaid: number;
  amountDue: number;
  currency: string;
  notes?: string;
  paymentInstructions?: string;
}

interface InvoicePDFTemplateProps {
  data: InvoicePDFData;
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

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'paid':
      return styles.statusBadgePaid;
    case 'overdue':
      return styles.statusBadgeOverdue;
    default:
      return styles.statusBadgePending;
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'paid':
      return 'PAID';
    case 'overdue':
      return 'OVERDUE';
    case 'sent':
      return 'AWAITING PAYMENT';
    case 'cancelled':
      return 'CANCELLED';
    default:
      return 'DRAFT';
  }
};

const InvoicePDFTemplate: React.FC<InvoicePDFTemplateProps> = ({ data }) => {
  // Register fonts lazily on first use
  registerFonts();
  const styles = getStyles();

  const isOverdue = data.status === 'overdue';
  const isPaid = data.status === 'paid';

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
              {data.companyTaxId && (
                <Text style={styles.companyDetail}>
                  Tax ID: {data.companyTaxId}
                </Text>
              )}
            </View>
          </View>
          <Text style={styles.title}>INVOICE</Text>
          <Text style={styles.invoiceNumber}>
            Invoice #{data.invoiceNumber}
          </Text>
          <Text style={[styles.statusBadge, getStatusStyle(data.status)]}>
            {getStatusLabel(data.status)}
          </Text>
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Bill To:</Text>
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
            {data.clientVatNumber && (
              <Text style={styles.infoText}>VAT: {data.clientVatNumber}</Text>
            )}
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Invoice Details:</Text>
            <Text style={styles.infoText}>
              Issue Date: {formatDate(data.issueDate)}
            </Text>
            <Text style={styles.infoTextBold}>
              Due Date: {formatDate(data.dueDate)}
            </Text>
            <Text style={styles.infoText}>
              Payment Terms: {data.paymentTerms}
            </Text>
            <Text style={styles.infoTextBold}>
              Amount Due: {formatCurrency(data.amountDue, data.currency)}
            </Text>
          </View>
        </View>

        {/* Overdue Notice */}
        {isOverdue && (
          <View style={styles.overdueNotice}>
            <Text style={styles.overdueTitle}>⚠ PAYMENT OVERDUE</Text>
            <Text style={styles.overdueText}>
              This invoice is past its due date. Please remit payment
              immediately to avoid late fees or service interruption.
            </Text>
          </View>
        )}

        {/* Line Items Table */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Items</Text>
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
            <View style={[styles.summaryRow, styles.summaryRowBorder]}>
              <Text style={styles.summaryLabel}>Total</Text>
              <Text style={styles.summaryValue}>
                {formatCurrency(data.total, data.currency)}
              </Text>
            </View>
            {data.amountPaid > 0 && (
              <View style={[styles.summaryRow, styles.summaryRowBorder]}>
                <Text style={styles.summaryLabel}>Amount Paid</Text>
                <Text style={styles.summaryValue}>
                  -{formatCurrency(data.amountPaid, data.currency)}
                </Text>
              </View>
            )}
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Amount Due</Text>
              <Text style={styles.totalValue}>
                {formatCurrency(data.amountDue, data.currency)}
              </Text>
            </View>
          </View>
        </View>

        {/* Payment Instructions */}
        {!isPaid && (
          <View style={styles.paymentInfo}>
            <Text style={styles.paymentTitle}>Payment Instructions</Text>
            {data.paymentInstructions ? (
              <Text style={styles.paymentText}>
                {data.paymentInstructions}
              </Text>
            ) : (
              <>
                <Text style={styles.paymentText}>
                  Please make payment by {formatDate(data.dueDate)}.
                </Text>
                <Text style={styles.paymentText}>
                  Payment can be made via bank transfer, credit card, or check.
                </Text>
                <Text style={styles.paymentText}>
                  Include invoice number {data.invoiceNumber} with your
                  payment.
                </Text>
              </>
            )}
          </View>
        )}

        {/* Notes */}
        {data.notes && (
          <View style={styles.notesSection}>
            <Text style={styles.notesTitle}>Notes</Text>
            <Text style={styles.notesText}>{data.notes}</Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Thank you for your business!
          </Text>
          {!isPaid && (
            <Text style={styles.footerText}>
              For questions about this invoice, please contact {data.companyEmail ||data.companyPhone}
            </Text>
          )}
        </View>
      </Page>
    </Document>
  );
};

export default InvoicePDFTemplate;
