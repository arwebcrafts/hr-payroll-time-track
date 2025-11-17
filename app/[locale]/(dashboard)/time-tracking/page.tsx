import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Play, Square, Plus } from 'lucide-react';

export default function TimeTrackingPage() {
  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Time Tracking</h1>
          <p className="text-muted-foreground">Track your billable hours</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Manual Entry
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Timer Card */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Timer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center justify-center py-8">
              <div className="mb-6 text-5xl font-bold tabular-nums">
                00:00:00
              </div>
              <div className="flex gap-4">
                <Button size="lg" className="w-32">
                  <Play className="mr-2 h-5 w-5" />
                  Start
                </Button>
                <Button size="lg" variant="destructive" className="w-32" disabled>
                  <Square className="mr-2 h-5 w-5" />
                  Stop
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">Task Description</label>
                <input
                  type="text"
                  placeholder="What are you working on?"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  disabled
                />
              </div>
              <div>
                <label className="text-sm font-medium">Client (Optional)</label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  disabled
                >
                  <option>Select client...</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Card */}
        <Card>
          <CardHeader>
            <CardTitle>Today&apos;s Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border p-4">
                  <div className="text-sm text-muted-foreground">Total Hours</div>
                  <div className="text-2xl font-bold">0.00</div>
                </div>
                <div className="rounded-lg border p-4">
                  <div className="text-sm text-muted-foreground">Billable</div>
                  <div className="text-2xl font-bold">$0.00</div>
                </div>
              </div>

              <div>
                <h4 className="mb-3 text-sm font-semibold">Recent Entries</h4>
                <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-12">
                  <Clock className="mb-2 h-12 w-12 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">No time entries yet</p>
                  <p className="text-xs text-muted-foreground">Start the timer or add a manual entry</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Coming Soon Notice */}
      <Card className="mt-6">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <Clock className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">Time Tracking Coming Soon</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Full time tracking functionality with timer, manual entries, reports, and invoice
              integration will be available in the next update.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
