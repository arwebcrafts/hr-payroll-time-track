'use client';

import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface DownloadInvoiceButtonProps {
  invoiceId: string;
  invoiceNumber: string;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  variant?: 'default' | 'outline' | 'ghost' | 'destructive' | 'secondary' | 'link';
}

export function DownloadInvoiceButton({
  invoiceId,
  invoiceNumber,
  size = 'sm',
  variant = 'outline',
}: DownloadInvoiceButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      toast.info('Generating PDF...');

      const response = await fetch(`/api/invoices/${invoiceId}/pdf`);

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      // Create blob from response
      const blob = await response.blob();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${invoiceNumber}.pdf`;
      document.body.appendChild(a);
      a.click();

      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success('PDF downloaded successfully');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download PDF');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleDownload}
      disabled={isDownloading}
    >
      <Download className="mr-2 h-4 w-4" />
      {isDownloading ? 'Generating...' : 'Download PDF'}
    </Button>
  );
}
