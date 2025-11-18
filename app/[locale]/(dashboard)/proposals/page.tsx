import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, FileText, Eye, CheckCircle, XCircle, Clock } from 'lucide-react';
import Link from 'next/link';
import { formatCurrency, formatDate } from '@/lib/utils';
import { DownloadProposalButton } from '@/components/DownloadProposalButton';
import { setRequestLocale } from 'next-intl/server';

const statusConfig = {
  draft: { label: 'Draft', variant: 'outline' as const, icon: Clock },
  sent: { label: 'Sent', variant: 'default' as const, icon: FileText },
  viewed: { label: 'Viewed', variant: 'secondary' as const, icon: Eye },
  signed: { label: 'Signed', variant: 'success' as const, icon: CheckCircle },
  rejected: { label: 'Rejected', variant: 'destructive' as const, icon: XCircle },
  expired: { label: 'Expired', variant: 'outline' as const, icon: Clock },
};

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function ProposalsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect('/auth/login');
  }

  const proposals = await prisma.proposal.findMany({
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
          <h1 className="text-3xl font-bold">Proposals</h1>
          <p className="text-muted-foreground">Create and manage your business proposals</p>
        </div>
        <Link href="/proposals/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Proposal
          </Button>
        </Link>
      </div>

      {!proposals || proposals.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="rounded-full bg-muted p-6 mb-4">
              <FileText className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No proposals yet</h3>
            <p className="text-muted-foreground mb-6 text-center max-w-md">
              Create your first proposal to send to clients. It only takes a few minutes!
            </p>
            <Link href="/proposals/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Proposal
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {proposals.map((proposal) => {
            const status = statusConfig[proposal.status as keyof typeof statusConfig];
            const StatusIcon = status.icon;
            const client = proposal.client;

            return (
              <Card key={proposal.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-xl">{proposal.title}</CardTitle>
                        <Badge variant={status.variant}>
                          <StatusIcon className="mr-1 h-3 w-3" />
                          {status.label}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p>
                          <span className="font-medium">Client:</span>{' '}
                          {client?.name || 'Unknown'}
                          {client?.company && ` (${client.company})`}
                        </p>
                        <p>
                          <span className="font-medium">Number:</span> {proposal.proposalNumber}
                        </p>
                        <p>
                          <span className="font-medium">Created:</span>{' '}
                          {formatDate(proposal.createdAt)}
                        </p>
                        {proposal.validUntil && (
                          <p>
                            <span className="font-medium">Valid Until:</span>{' '}
                            {formatDate(proposal.validUntil)}
                          </p>
                        )}
                        {proposal.viewCount > 0 && (
                          <p>
                            <Eye className="inline h-3 w-3 mr-1" />
                            Viewed {proposal.viewCount} time{proposal.viewCount !== 1 ? 's' : ''}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">
                        {formatCurrency(proposal.totalAmount, proposal.currency)}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                    <DownloadProposalButton
                      proposalId={proposal.id}
                      proposalNumber={proposal.proposalNumber}
                    />
                    {proposal.status === 'draft' && (
                      <>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button variant="default" size="sm">
                          Send
                        </Button>
                      </>
                    )}
                    {proposal.status === 'signed' && (
                      <Button variant="default" size="sm">
                        Create Invoice
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
