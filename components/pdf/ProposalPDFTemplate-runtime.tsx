// Runtime-only wrapper for ProposalPDFTemplate
// This file dynamically imports the actual template to avoid build-time issues

export default async function getProposalPDFTemplate() {
  // Dynamic import that only executes at runtime
  const templateModule = await import('@/lib/pdf-templates/ProposalPDFTemplate-impl');
  return templateModule.default;
}
