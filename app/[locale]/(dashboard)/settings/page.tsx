'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings2, Building2, FileText, Mail, CreditCard } from 'lucide-react';

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('business');

  const [formData, setFormData] = useState({
    businessName: '',
    businessEmail: '',
    businessPhone: '',
    businessAddress: '',
    businessWebsite: '',
    taxId: '',
    vatNumber: '',
    defaultCurrency: 'USD',
    defaultLanguage: 'en',
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('/api/user');
      const data = await response.json();

      if (response.ok && data.user) {
        setFormData({
          businessName: data.user.businessName || '',
          businessEmail: data.user.businessEmail || '',
          businessPhone: data.user.businessPhone || '',
          businessAddress: data.user.businessAddress || '',
          businessWebsite: data.user.businessWebsite || '',
          taxId: data.user.taxId || '',
          vatNumber: data.user.vatNumber || '',
          defaultCurrency: data.user.defaultCurrency || 'USD',
          defaultLanguage: data.user.defaultLanguage || 'en',
        });
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('/api/user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update settings');
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update settings';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'business', label: 'Business', icon: Building2 },
    { id: 'invoice', label: 'Invoice', icon: FileText },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'payment', label: 'Payment', icon: CreditCard },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-64 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex w-full items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                <Icon className="h-5 w-5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === 'business' && (
            <Card>
              <CardHeader>
                <CardTitle>Business Information</CardTitle>
                <CardDescription>
                  Update your business details that appear on proposals and invoices
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {success && (
                    <div className="rounded-md bg-green-50 p-3 text-sm text-green-800">
                      Settings updated successfully!
                    </div>
                  )}
                  {error && (
                    <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">{error}</div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name</Label>
                    <Input
                      id="businessName"
                      value={formData.businessName}
                      onChange={(e) => updateField('businessName', e.target.value)}
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="businessEmail">Business Email</Label>
                      <Input
                        id="businessEmail"
                        type="email"
                        value={formData.businessEmail}
                        onChange={(e) => updateField('businessEmail', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="businessPhone">Business Phone</Label>
                      <Input
                        id="businessPhone"
                        type="tel"
                        value={formData.businessPhone}
                        onChange={(e) => updateField('businessPhone', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="businessAddress">Business Address</Label>
                    <Input
                      id="businessAddress"
                      value={formData.businessAddress}
                      onChange={(e) => updateField('businessAddress', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="businessWebsite">Website</Label>
                    <Input
                      id="businessWebsite"
                      type="url"
                      value={formData.businessWebsite}
                      onChange={(e) => updateField('businessWebsite', e.target.value)}
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="taxId">Tax ID / EIN</Label>
                      <Input
                        id="taxId"
                        value={formData.taxId}
                        onChange={(e) => updateField('taxId', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="vatNumber">VAT Number</Label>
                      <Input
                        id="vatNumber"
                        value={formData.vatNumber}
                        onChange={(e) => updateField('vatNumber', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="defaultCurrency">Default Currency</Label>
                      <select
                        id="defaultCurrency"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={formData.defaultCurrency}
                        onChange={(e) => updateField('defaultCurrency', e.target.value)}
                      >
                        <option value="USD">USD - US Dollar</option>
                        <option value="EUR">EUR - Euro</option>
                        <option value="GBP">GBP - British Pound</option>
                        <option value="CAD">CAD - Canadian Dollar</option>
                        <option value="AUD">AUD - Australian Dollar</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="defaultLanguage">Default Language</Label>
                      <select
                        id="defaultLanguage"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={formData.defaultLanguage}
                        onChange={(e) => updateField('defaultLanguage', e.target.value)}
                      >
                        <option value="en">English</option>
                        <option value="de">German (Deutsch)</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button type="submit" disabled={loading}>
                      {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {activeTab !== 'business' && (
            <Card>
              <CardHeader>
                <CardTitle>{tabs.find((t) => t.id === activeTab)?.label} Settings</CardTitle>
                <CardDescription>
                  This section is coming soon. Configure your{' '}
                  {tabs.find((t) => t.id === activeTab)?.label.toLowerCase()} settings here.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-12">
                  <Settings2 className="mb-4 h-16 w-16 text-muted-foreground" />
                  <p className="text-center text-muted-foreground">
                    Additional settings will be available in future updates.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
