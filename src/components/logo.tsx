import { BrainCircuit } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center gap-2 p-2 font-headline text-lg font-semibold tracking-tight text-primary">
      <BrainCircuit className="h-7 w-7" />
      <span>DocuBrain</span>
    </div>
  );
}
