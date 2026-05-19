import type { Metadata } from 'next';
import { BriefForm } from '@/components/BriefForm';

export const metadata: Metadata = {
  title: 'Start a Brief | AI Creative Cambodia',
  description: 'Submit a creative brief for AI Creative Cambodia.',
};

export default function BriefPage() {
  return <BriefForm />;
}
