'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Building2, Upload, CreditCard, Settings2, Sparkles } from 'lucide-react';

const steps = [
  { number: 1, title: 'Business Information', icon: Building2 },
  { number: 2, title: 'Upload Logo', icon: Upload },
  { number: 3, title: 'Tax & Banking', icon: CreditCard },
  { number: 4, title: 'Preferences', icon: Settings2 },
  { number: 5, title: 'All Set!', icon: Sparkles },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    businessName: '',
    businessEmail: '',
    businessPhone: '',
    businessAddress: '',
    businessWebsite: '',
    logoFile: null as File | null,
    taxId: '',
    vatNumber: '',
    bankName: '',
    accountNumber: '',
    routingNumber: '',
    defaultCurrency: 'USD',
    defaultLanguage: 'en',
    timezone: 'UTC',
  });

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error('No user found');

      // Upload logo if provided
      let logoUrl = null;
      if (formData.logoFile) {
        const fileExt = formData.logoFile.name.split('.').pop();
        const fileName = `${user.id}/logo.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('logos')
          .upload(fileName, formData.logoFile, { upsert: true });

        if (!uploadError) {
          const {
            data: { publicUrl },
          } = supabase.storage.from('logos').getPublicUrl(fileName);
          logoUrl = publicUrl;
        }
      }

      // Update user profile
      const { error } = await supabase.from('users').upsert({
        id: user.id,
        business_name: formData.businessName,
        business_email: formData.businessEmail,
        business_phone: formData.businessPhone,
        business_address: formData.businessAddress,
        business_website: formData.businessWebsite,
        business_logo_url: logoUrl,
        tax_id: formData.taxId,
        vat_number: formData.vatNumber,
        bank_details: {
          bank_name: formData.bankName,
          account_number: formData.accountNumber,
          routing_number: formData.routingNumber,
        },
        default_currency: formData.defaultCurrency,
        default_language: formData.defaultLanguage,
      });

      if (error) throw error;

      // Redirect to dashboard
      router.push('/dashboard');
      router.refresh();
    } catch (error: any) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-12">
      <div className="w-full max-w-4xl">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex flex-1 items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full border-2 ${
                      currentStep >= step.number
                        ? 'border-primary bg-primary text-white'
                        : 'border-gray-300 bg-white text-gray-400'
                    }`}
                  >
                    {currentStep > step.number ? (
                      <CheckCircle2 className="h-6 w-6" />
                    ) : (
                      <step.icon className="h-6 w-6" />
                    )}
                  </div>
                  <span
                    className={`mt-2 text-xs font-medium ${
                      currentStep >= step.number ? 'text-primary' : 'text-gray-400'
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`mx-2 h-0.5 flex-1 ${
                      currentStep > step.number ? 'bg-primary' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {currentStep === 1 && 'Tell us about your business'}
              {currentStep === 2 && 'Upload your logo'}
              {currentStep === 3 && 'Tax & Banking Details'}
              {currentStep === 4 && 'Set your preferences'}
              {currentStep === 5 && 'You are all set!'}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && 'This information will appear on your proposals and invoices'}
              {currentStep === 2 && 'Add your business logo (optional - you can add this later)'}
              {currentStep === 3 && 'Add tax and banking information (optional)'}
              {currentStep === 4 && 'Choose your default settings'}
              {currentStep === 5 && 'Start creating proposals and invoices!'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Step 1: Business Information */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="businessName">
                    Business Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="businessName"
                    placeholder="Acme Corporation"
                    value={formData.businessName}
                    onChange={(e) => updateFormData('businessName', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessEmail">Business Email</Label>
                  <Input
                    id="businessEmail"
                    type="email"
                    placeholder="hello@acme.com"
                    value={formData.businessEmail}
                    onChange={(e) => updateFormData('businessEmail', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessPhone">Business Phone</Label>
                  <Input
                    id="businessPhone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={formData.businessPhone}
                    onChange={(e) => updateFormData('businessPhone', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessAddress">Business Address</Label>
                  <Input
                    id="businessAddress"
                    placeholder="123 Main St, City, State, ZIP"
                    value={formData.businessAddress}
                    onChange={(e) => updateFormData('businessAddress', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessWebsite">Website</Label>
                  <Input
                    id="businessWebsite"
                    type="url"
                    placeholder="https://acme.com"
                    value={formData.businessWebsite}
                    onChange={(e) => updateFormData('businessWebsite', e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Logo Upload */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-12">
                  {formData.logoFile ? (
                    <div className="text-center">
                      <img
                        src={URL.createObjectURL(formData.logoFile)}
                        alt="Logo preview"
                        className="mx-auto mb-4 h-32 w-32 object-contain"
                      />
                      <p className="text-sm text-gray-600">{formData.logoFile.name}</p>
                      <Button
                        variant="outline"
                        onClick={() => updateFormData('logoFile', null)}
                        className="mt-4"
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Upload className="mb-4 h-12 w-12 text-gray-400" />
                      <Label
                        htmlFor="logoUpload"
                        className="cursor-pointer text-sm font-medium text-primary hover:underline"
                      >
                        Click to upload logo
                      </Label>
                      <Input
                        id="logoUpload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) updateFormData('logoFile', file);
                        }}
                      />
                      <p className="mt-2 text-xs text-gray-500">PNG, JPG up to 5MB</p>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Tax & Banking */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="taxId">Tax ID / EIN</Label>
                  <Input
                    id="taxId"
                    placeholder="12-3456789"
                    value={formData.taxId}
                    onChange={(e) => updateFormData('taxId', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vatNumber">VAT Number (EU)</Label>
                  <Input
                    id="vatNumber"
                    placeholder="DE123456789"
                    value={formData.vatNumber}
                    onChange={(e) => updateFormData('vatNumber', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Input
                    id="bankName"
                    placeholder="Bank of America"
                    value={formData.bankName}
                    onChange={(e) => updateFormData('bankName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input
                    id="accountNumber"
                    placeholder="123456789"
                    value={formData.accountNumber}
                    onChange={(e) => updateFormData('accountNumber', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="routingNumber">Routing Number / SWIFT</Label>
                  <Input
                    id="routingNumber"
                    placeholder="021000021"
                    value={formData.routingNumber}
                    onChange={(e) => updateFormData('routingNumber', e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Step 4: Preferences */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="defaultCurrency">Default Currency</Label>
                  <select
                    id="defaultCurrency"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={formData.defaultCurrency}
                    onChange={(e) => updateFormData('defaultCurrency', e.target.value)}
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
                    onChange={(e) => updateFormData('defaultLanguage', e.target.value)}
                  >
                    <option value="en">English</option>
                    <option value="de">German (Deutsch)</option>
                  </select>
                </div>
              </div>
            )}

            {/* Step 5: Completion */}
            {currentStep === 5 && (
              <div className="py-8 text-center">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle2 className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="mb-2 text-2xl font-bold">Welcome to Das Program!</h3>
                <p className="mb-8 text-gray-600">
                  Your account is ready. You can now create proposals, send invoices, and manage
                  your clients.
                </p>
                <div className="mx-auto max-w-md space-y-3 text-left">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <span className="text-sm">Business profile completed</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <span className="text-sm">Database ready</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <span className="text-sm">Templates available</span>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="mt-8 flex items-center justify-between">
              <div>
                {currentStep > 1 && currentStep < 5 && (
                  <Button variant="outline" onClick={handleBack}>
                    Back
                  </Button>
                )}
              </div>
              <div className="flex gap-2">
                {currentStep < 4 && currentStep > 1 && (
                  <Button variant="ghost" onClick={handleSkip}>
                    Skip
                  </Button>
                )}
                {currentStep < 4 && (
                  <Button
                    onClick={handleNext}
                    disabled={currentStep === 1 && !formData.businessName}
                  >
                    Continue
                  </Button>
                )}
                {currentStep === 4 && (
                  <Button onClick={handleNext}>Finish Setup</Button>
                )}
                {currentStep === 5 && (
                  <Button onClick={handleFinish} disabled={loading}>
                    {loading ? 'Setting up...' : 'Go to Dashboard'}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
