// Runtime-only wrapper for ProposalPDFTemplate
// This file dynamically imports the actual template to avoid build-time issues

export default async function getProposalPDFTemplate() {
  // Dynamic import that only executes at runtime
  const module = await import('./ProposalPDFTemplate-impl');
  return module.default;
}
