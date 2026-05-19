import { PrototypeDocument } from '@/components/PrototypeDocument';
import { readPrototypeHtml } from '@/lib/prototype-html';

export default function HomePage() {
  return <PrototypeDocument html={readPrototypeHtml('ai-creative-cambodia.html')} />;
}
