import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Receipt, Eye, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { formatCurrency, formatDate } from '@/lib/utils';
import { DownloadInvoiceButton } from '@/components/DownloadInvoiceButton';

const statusConfig = {
  draft: { label: 'Draft', variant: 'outline' as const, icon: Clock },
  sent: { label: 'Sent', variant: 'default' as const, icon: Receipt },
  viewed: { label: 'Viewed', variant: 'secondary' as const, icon: Eye },
  paid: { label: 'Paid', variant: 'success' as const, icon: CheckCircle },
  partially_paid: { label: 'Partially Paid', variant: 'warning' as const, icon: Clock },
  overdue: { label: 'Overdue', variant: 'destructive' as const, icon: AlertCircle },
  cancelled: { label: 'Cancelled', variant: 'outline' as const, icon: Clock },
};

export default async function InvoicesPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect('/auth/login');
  }

  const invoices = await prisma.invoice.findMany({
    where: { userId: session.user.id },
    include: {
      client: {
        select: {
          name: true,
          company: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Invoices</h1>
          <p className="text-muted-foreground">Create and manage your invoices</p>
        </div>
        <Link href="/invoices/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Invoice
          </Button>
        </Link>
      </div>

      {!invoices || invoices.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="rounded-full bg-muted p-6 mb-4">
              <Receipt className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No invoices yet</h3>
            <p className="text-muted-foreground mb-6 text-center max-w-md">
              Create your first invoice to get paid faster!
            </p>
            <Link href="/invoices/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Invoice
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {invoices.map((invoice) => {
            const status = statusConfig[invoice.status as keyof typeof statusConfig];
            const StatusIcon = status.icon;
            const client = invoice.client;
            const isOverdue =
              invoice.status !== 'paid' &&
              invoice.dueDate &&
              new Date(invoice.dueDate) < new Date();

            return (
              <Card
                key={invoice.id}
                className={`hover:shadow-md transition-shadow ${
                  isOverdue ? 'border-destructive' : ''
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-xl">Invoice {invoice.invoiceNumber}</CardTitle>
                        <Badge variant={isOverdue ? 'destructive' : status.variant}>
                          <StatusIcon className="mr-1 h-3 w-3" />
                          {isOverdue ? 'Overdue' : status.label}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p>
                          <span className="font-medium">Client:</span>{' '}
                          {client?.name || 'Unknown'}
                          {client?.company && ` (${client.company})`}
                        </p>
                        <p>
                          <span className="font-medium">Issue Date:</span>{' '}
                          {formatDate(invoice.issueDate)}
                        </p>
                        <p>
                          <span className="font-medium">Due Date:</span>{' '}
                          {formatDate(invoice.dueDate)}
                          {isOverdue && (
                            <span className="ml-2 text-destructive font-medium">
                              (
                              {Math.floor(
                                (new Date().getTime() - new Date(invoice.dueDate).getTime()) /
                                  (1000 * 60 * 60 * 24)
                              )}{' '}
                              days overdue)
                            </span>
                          )}
                        </p>
                        {invoice.viewCount > 0 && (
                          <p>
                            <Eye className="inline h-3 w-3 mr-1" />
                            Viewed {invoice.viewCount} time{invoice.viewCount !== 1 ? 's' : ''}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">
                        {formatCurrency(invoice.totalAmount, invoice.currency)}
                      </div>
                      {Number(invoice.amountPaid) > 0 && invoice.status !== 'paid' && (
                        <div className="text-sm text-muted-foreground">
                          {formatCurrency(invoice.amountPaid, invoice.currency)} paid
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                    <DownloadInvoiceButton
                      invoiceId={invoice.id}
                      invoiceNumber={invoice.invoiceNumber}
                    />
                    {invoice.status === 'draft' && (
                      <>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button variant="default" size="sm">
                          Send
                        </Button>
                      </>
                    )}
                    {invoice.status !== 'paid' && invoice.status !== 'cancelled' && (
                      <Button variant="default" size="sm">
                        Record Payment
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
