// Runtime-only wrapper for InvoicePDFTemplate
// This file dynamically imports the actual template to avoid build-time issues

export default async function getInvoicePDFTemplate() {
  // Dynamic import that only executes at runtime
  const templateModule = await import('@/lib/pdf-templates/InvoicePDFTemplate-impl');
  return templateModule.default;
}
