import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Receipt, UserPlus, Clock, TrendingUp, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect('/auth/login');
  }

  const userId = session.user.id;

  // Fetch user profile
  const userProfile = await prisma.user.findUnique({
    where: { id: userId },
    select: { businessName: true },
  });

  // Fetch metrics
  const totalProposals = await prisma.proposal.count({
    where: { userId },
  });

  const totalInvoices = await prisma.invoice.count({
    where: { userId },
  });

  const totalClients = await prisma.client.count({
    where: { userId },
  });

  const pendingInvoices = await prisma.invoice.count({
    where: {
      userId,
      status: { in: ['sent', 'viewed'] },
    },
  });

  const overdueInvoices = await prisma.invoice.count({
    where: {
      userId,
      status: 'overdue',
    },
  });

  const signedProposals = await prisma.proposal.count({
    where: {
      userId,
      status: 'signed',
    },
  });

  const businessName = userProfile?.businessName || 'there';

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Welcome back, {businessName}!</h1>
        <p className="text-muted-foreground">Here&apos;s what&apos;s happening with your business today.</p>
      </div>

      {/* Metrics Cards */}
      <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Proposals</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProposals || 0}</div>
            <p className="text-xs text-muted-foreground">
              {signedProposals || 0} signed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalInvoices || 0}</div>
            <p className="text-xs text-muted-foreground">
              {pendingInvoices || 0} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClients || 0}</div>
            <p className="text-xs text-muted-foreground">
              Total clients
            </p>
          </CardContent>
        </Card>

        <Card className={overdueInvoices && overdueInvoices > 0 ? 'border-destructive' : ''}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Invoices</CardTitle>
            <AlertCircle className={`h-4 w-4 ${overdueInvoices && overdueInvoices > 0 ? 'text-destructive' : 'text-muted-foreground'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${overdueInvoices && overdueInvoices > 0 ? 'text-destructive' : ''}`}>
              {overdueInvoices || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Requires attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Link href="/proposals/new">
            <Button className="w-full" size="lg">
              <FileText className="mr-2 h-5 w-5" />
              New Proposal
            </Button>
          </Link>
          <Link href="/invoices/new">
            <Button className="w-full" variant="outline" size="lg">
              <Receipt className="mr-2 h-5 w-5" />
              New Invoice
            </Button>
          </Link>
          <Link href="/clients/new">
            <Button className="w-full" variant="outline" size="lg">
              <UserPlus className="mr-2 h-5 w-5" />
              Add Client
            </Button>
          </Link>
          <Link href="/time-tracking">
            <Button className="w-full" variant="outline" size="lg">
              <Clock className="mr-2 h-5 w-5" />
              Track Time
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {(totalProposals === 0 && totalInvoices === 0) ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-6 mb-4">
                <TrendingUp className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No activity yet</h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                Get started by creating your first proposal or invoice. It only takes a few minutes!
              </p>
              <div className="flex gap-4">
                <Link href="/proposals/new">
                  <Button>Create Proposal</Button>
                </Link>
                <Link href="/invoices/new">
                  <Button variant="outline">Create Invoice</Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Recent activity will appear here</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
