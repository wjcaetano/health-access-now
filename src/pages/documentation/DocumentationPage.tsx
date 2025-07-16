
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TechnicalDocs from '@/components/documentation/TechnicalDocs';
import StyleGuide from '@/components/documentation/StyleGuide';
import { FileText, Palette } from 'lucide-react';

export default function DocumentationPage() {
  return (
    <div className="container mx-auto p-6">
      <Tabs defaultValue="technical" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="technical" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Documentação Técnica
          </TabsTrigger>
          <TabsTrigger value="style" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Style Guide
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="technical">
          <TechnicalDocs />
        </TabsContent>
        
        <TabsContent value="style">
          <StyleGuide />
        </TabsContent>
      </Tabs>
    </div>
  );
}
