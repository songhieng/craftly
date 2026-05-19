import { PrototypeDocument } from '@/components/PrototypeDocument';
import { readPrototypeHtml } from '@/lib/prototype-html';

export default function AdminPage() {
  return <PrototypeDocument html={readPrototypeHtml('sprint-board.html')} />;
}
