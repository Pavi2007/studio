'use client';

import { FileUp, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

export function DocUploadButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-start text-muted-foreground hover:text-accent-foreground">
          <FileUp className="mr-2 h-4 w-4" />
          <span>Upload PDF</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogDescription>
            Select a PDF file to index. The document will be processed and made available for querying.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input id="pdf-file" type="file" accept="application/pdf" />
        </div>
        <DialogFooter>
          <Button type="submit" variant="default" className="bg-accent hover:bg-accent/90">
            <Upload className="mr-2 h-4 w-4" />
            Upload and Index
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
