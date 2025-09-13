'use client';

import { useState, useRef, FormEvent, useEffect } from 'react';
import Image from 'next/image';
import { CornerDownLeft, Loader2, User, Bot, FileText } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { askQuestion } from '@/app/actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { DocList } from './doc-list';
import { DocUploadButton } from './doc-upload-button';
import { Logo } from './logo';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';
import { useToast } from '@/hooks/use-toast';

type Message = {
  role: 'user' | 'assistant';
  content: string;
  highlights?: string[];
};

export function ChatPanel() {
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const emptyStateImage = PlaceHolderImages.find((img) => img.id === 'empty-state');

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading || !selectedDocumentId) return;

    const formData = new FormData(e.currentTarget);
    const query = formData.get('query') as string;

    if (!query) return;

    setIsLoading(true);
    setMessages((prev) => [...prev, { role: 'user', content: query }]);

    const result = await askQuestion(formData);
    
    if (result.success) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: result.answer, highlights: result.highlightedPassages },
      ]);
    } else {
       toast({
        variant: "destructive",
        title: "An Error Occurred",
        description: result.error ?? 'Sorry, an unknown error occurred.',
      });
       setMessages((prev) => prev.slice(0, -1)); // Remove the user message if submission failed
    }
    
    setIsLoading(false);
    formRef.current?.reset();
    inputRef.current?.focus();
  };
  
  const handleSelectDocument = (id: string) => {
    setSelectedDocumentId(id);
    setMessages([]); // Clear chat when new doc is selected
    inputRef.current?.focus();
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Logo />
        </SidebarHeader>
        <SidebarContent>
          <DocList selectedDocumentId={selectedDocumentId} onSelectDocument={handleSelectDocument} />
        </SidebarContent>
        <SidebarFooter>
          <DocUploadButton />
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="flex max-h-screen flex-col">
        <div ref={scrollAreaRef} className="flex-1 overflow-y-auto p-4 md:p-6">
          {messages.length === 0 && !isLoading ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              {emptyStateImage && (
                <Image
                  src={emptyStateImage.imageUrl}
                  alt={emptyStateImage.description}
                  width={300}
                  height={300}
                  className="mb-6 rounded-lg shadow-lg opacity-80"
                  data-ai-hint={emptyStateImage.imageHint}
                />
              )}
              <h2 className="text-2xl font-bold tracking-tight">Welcome to DocuBrain</h2>
              <p className="max-w-md text-muted-foreground">
                {selectedDocumentId ? 'Now, ask a question about the selected document below.' : 'Select a document from the sidebar to get started.'}
              </p>
            </div>
          ) : (
            <div className="space-y-8 max-w-3xl mx-auto">
              {messages.map((message, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    {message.role === 'user' ? <User /> : <Bot />}
                  </div>
                  <div className="flex-1 space-y-4">
                    <p className="leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    {message.role === 'assistant' && message.highlights && message.highlights.length > 0 && (
                      <Card className="bg-secondary/50">
                        <CardHeader>
                          <CardTitle className="flex items-center text-base">
                            <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                            Source Passages
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm text-muted-foreground">
                          {message.highlights.map((highlight, i) => (
                            <p key={i} className="border-l-2 border-accent pl-3 italic">
                              "{highlight}"
                            </p>
                          ))}
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                 <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Bot />
                  </div>
                  <div className="flex-1 space-y-4 pt-2 w-full">
                    <Skeleton className="h-4 w-4/5" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />

                     <Card className="bg-secondary/50">
                        <CardHeader>
                          <CardTitle className="flex items-center text-base">
                             <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                            Source Passages
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <Skeleton className="h-10 w-full" />
                          <Skeleton className="h-10 w-full" />
                        </CardContent>
                      </Card>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="sticky bottom-0 border-t bg-background/80 p-4 backdrop-blur-sm md:p-6">
          <form
            ref={formRef}
            onSubmit={handleFormSubmit}
            className="relative max-w-3xl mx-auto"
          >
            <Label htmlFor="query" className="sr-only">
              Ask a question
            </Label>
            <Input
              id="query"
              name="query"
              ref={inputRef}
              placeholder={
                selectedDocumentId ? 'Ask anything...' : 'Please select a document first'
              }
              className="pr-12"
              disabled={isLoading || !selectedDocumentId}
            />
            <input type="hidden" name="documentId" value={selectedDocumentId || ''} />
            <Button
              type="submit"
              size="icon"
              variant="ghost"
              className="absolute right-1.5 top-1/2 h-8 w-8 -translate-y-1/2 text-accent hover:text-accent"
              disabled={isLoading || !selectedDocumentId}
              aria-label="Submit question"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : <CornerDownLeft />}
            </Button>
          </form>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
