import { FileText } from 'lucide-react';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';

const documents = [
  { id: 'doc-1', name: 'Quantum_Computing_Review.pdf' },
  { id: 'doc-2', name: 'Annual_Financial_Report_2023.pdf' },
  { id: 'doc-3', name: 'Clinical_Trial_Results_XYZ.pdf' },
];

export function DocList({
  selectedDocumentId,
  onSelectDocument,
}: {
  selectedDocumentId: string | null;
  onSelectDocument: (id: string) => void;
}) {
  return (
    <SidebarMenu>
      {documents.map((doc) => (
        <SidebarMenuItem key={doc.id}>
          <SidebarMenuButton
            onClick={() => onSelectDocument(doc.id)}
            isActive={selectedDocumentId === doc.id}
            className="w-full justify-start text-sm"
            tooltip={{
              children: doc.name,
              side: 'right',
            }}
          >
            <FileText className="h-4 w-4 shrink-0" />
            <span className="truncate">{doc.name}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
