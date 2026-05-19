import type { Metadata } from 'next';
import { SignInForm } from '@/components/SignInForm';

export const metadata: Metadata = {
  title: 'Sign In | AI Creative Cambodia',
  description: 'Sign in to your AI Creative Cambodia client account to submit and track creative briefs.',
};

export default function SignInPage() {
  return <SignInForm />;
}
