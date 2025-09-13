import { ChatPanel } from '@/components/chat-panel';
import { Toaster } from "@/components/ui/toaster";

export default function Home() {
  return (
    <>
      <ChatPanel />
      <Toaster />
    </>
  );
}
