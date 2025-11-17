'use client';

import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface DownloadProposalButtonProps {
  proposalId: string;
  proposalNumber: string;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  variant?: 'default' | 'outline' | 'ghost' | 'destructive' | 'secondary' | 'link';
}

export function DownloadProposalButton({
  proposalId,
  proposalNumber,
  size = 'sm',
  variant = 'outline',
}: DownloadProposalButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      toast.info('Generating PDF...');

      const response = await fetch(`/api/proposals/${proposalId}/pdf`);

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      // Create blob from response
      const blob = await response.blob();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `proposal-${proposalNumber}.pdf`;
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
