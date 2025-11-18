// Runtime-only wrapper for InvoicePDFTemplate
// This file dynamically imports the actual template to avoid build-time issues

export default async function getInvoicePDFTemplate() {
  // Dynamic import that only executes at runtime
  const module = await import('./InvoicePDFTemplate-impl');
  return module.default;
}
