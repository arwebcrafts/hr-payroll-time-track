import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Briefcase } from 'lucide-react';

export default function ServicesPage() {
  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Services</h1>
          <p className="text-muted-foreground">Manage your service catalog</p>
        </div>
        <Button disabled>
          <Plus className="mr-2 h-4 w-4" />
          Add Service
        </Button>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="rounded-full bg-muted p-6 mb-4">
            <Briefcase className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Services Catalog Coming Soon</h3>
          <p className="text-muted-foreground mb-6 text-center max-w-md">
            Create reusable service items to speed up proposal and invoice creation. Save your
            frequently offered services with preset pricing.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
