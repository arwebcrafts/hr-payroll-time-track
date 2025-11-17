# Contributing to Das Program

Thank you for your interest in contributing to Das Program! This document provides guidelines and instructions for contributing to the project.

## 🎯 Areas to Contribute

### High Priority Features

These are the core features that need implementation:

1. **AI Proposal Generator** - Using Anthropic Claude API
2. **Invoice Generator** - With line items, tax calculation, and PDF export
3. **Payment Integration** - Stripe and PayPal
4. **Email Automation** - Using Resend for sending proposals/invoices
5. **PDF Generation** - Professional templates for proposals and invoices
6. **Time Tracking** - Timer functionality and manual entry

### Medium Priority Features

7. Proposal Templates (6 designs)
8. Invoice Templates (4 designs)
9. Reports & Analytics Dashboard
10. Settings Pages (Business, Invoice, Payment, Email)

### Nice to Have

11. Services Catalog
12. Dark Mode Support
13. Global Search (Cmd+K)
14. Automated Follow-ups
15. Onboarding Wizard

## 🛠️ Development Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/das-program.git
   cd das-program
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Follow SETUP_GUIDE.md for environment setup
5. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 📋 Code Standards

### TypeScript

- Use strict TypeScript mode
- Define proper types for all props and data structures
- Avoid `any` types when possible
- Use the database types from `types/database.ts`

### React Components

- Use functional components with hooks
- Keep components small and focused (< 200 lines)
- Use Server Components by default (add 'use client' only when needed)
- Follow the existing component structure

### Naming Conventions

- **Components:** PascalCase (`UserProfile.tsx`)
- **Files:** kebab-case (`user-profile.ts`)
- **Functions:** camelCase (`getUserProfile()`)
- **Constants:** UPPER_SNAKE_CASE (`MAX_FILE_SIZE`)
- **Types/Interfaces:** PascalCase (`interface UserProfile {}`)

### File Organization

```
feature/
├── page.tsx           # Main page component (Server Component)
├── components/        # Feature-specific components
│   ├── feature-form.tsx
│   └── feature-list.tsx
├── actions.ts         # Server actions
└── types.ts           # Feature-specific types
```

### Code Style

- Use Prettier for formatting (run `npm run format`)
- Use ESLint for linting (run `npm run lint`)
- Maximum line length: 100 characters
- Use single quotes for strings
- Add trailing commas in objects/arrays
- Use meaningful variable names

**Example:**

```typescript
// ❌ Bad
const d = new Date();
const u = await getUser(d);

// ✅ Good
const currentDate = new Date();
const userData = await getUserByDate(currentDate);
```

## 🌐 Internationalization

All new features must support both English and German:

1. Add translations to `messages/en.json` and `messages/de.json`
2. Use the `useTranslations` hook in components:

```typescript
import { useTranslations } from 'next-intl';

export default function Component() {
  const t = useTranslations('yourFeature');
  return <h1>{t('title')}</h1>;
}
```

3. For AI-generated content, pass the locale to the API

## 🎨 UI/UX Guidelines

### Use Shadcn UI Components

Always use Shadcn UI components when available:

```bash
# Install new components as needed
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add table
```

### Design System

- **Colors:** Use Tailwind color classes
  - Primary: `bg-primary`, `text-primary`
  - Success: `bg-green-500`
  - Warning: `bg-yellow-500`
  - Error: `bg-red-500`

- **Spacing:** Use Tailwind's spacing scale (4, 8, 16, 24, 32, 48, 64px)

- **Typography:**
  - Headings: `text-2xl font-bold`, `text-xl font-semibold`
  - Body: `text-sm` or `text-base`

### Responsive Design

Always make features responsive:

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Content */}
</div>
```

## 🧪 Testing

Before submitting:

1. **Test authentication flows** - Login, signup, logout
2. **Test with real data** - Create clients, proposals, invoices
3. **Test responsiveness** - Check on mobile, tablet, desktop
4. **Test both languages** - English and German
5. **Run linter:** `npm run lint`
6. **Check types:** `npx tsc --noEmit`

## 📝 Commit Messages

Follow conventional commits:

```
feat: add AI proposal generator
fix: resolve invoice calculation bug
docs: update setup guide
style: format code with prettier
refactor: simplify client list component
test: add tests for invoice generation
chore: update dependencies
```

## 🔀 Pull Request Process

1. **Create a descriptive PR title:**
   - ✅ "Add AI proposal generator with Claude integration"
   - ❌ "Updates"

2. **Fill out the PR template:**
   - What does this PR do?
   - What issue does it solve?
   - How to test it?
   - Screenshots (if UI changes)

3. **Ensure all checks pass:**
   - Linting
   - Type checking
   - Build succeeds

4. **Link related issues:**
   - "Closes #123"
   - "Related to #456"

5. **Request review from maintainers**

## 🔒 Security

- Never commit API keys or secrets
- Always use environment variables
- Validate all user inputs
- Use Supabase RLS policies
- Sanitize data before displaying

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Shadcn UI Components](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Anthropic API Docs](https://docs.anthropic.com)

## 💬 Getting Help

- Read the README.md and SETUP_GUIDE.md
- Check existing issues for similar problems
- Ask questions in discussions
- Join our Discord (if available)

## 🏆 Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Credited in release notes
- Given a shoutout on social media

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Das Program! 🎉
