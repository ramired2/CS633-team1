import React, { useState } from 'react';
import { ContentSection, QuizSection } from './ContentSections';
import { FigmaDesignGuide } from './FigmaDesignGuide';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card } from './ui/card';
import { 
  BookOpen, 
  FileText, 
  Target, 
  PenTool, 
  HelpCircle,
  Figma,
  Code,
  Eye
} from 'lucide-react';

// Sample images for the demo
const sampleImages = {
  'key-concepts': 'https://images.unsplash.com/photo-1621361753831-e972c09ceec9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2Z0d2FyZSUyMHF1YWxpdHklMjBjb25jZXB0c3xlbnwxfHx8fDE3NTkxMTM1Mzd8MA&ixlib=rb-4.1.0&q=80&w=1080',
  'summary': 'https://images.unsplash.com/photo-1743385779347-1549dabf1320?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZXN0aW5nJTIwc3VtbWFyeSUyMGRpYWdyYW18ZW58MXx8fHwxNzU5MTEzNTM5fDA&ixlib=rb-4.1.0&q=80&w=1080',
  'principles': 'https://images.unsplash.com/photo-1722080826167-4ea87368cbc5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2Z0d2FyZSUyMHByaW5jaXBsZXMlMjBmcmFtZXdvcmt8ZW58MXx8fHwxNzU5MTEzNTQyfDA&ixlib=rb-4.1.0&q=80&w=1080',
  'do-notes': 'https://images.unsplash.com/photo-1758874384555-37d50c0ee81a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXZlbG9wbWVudCUyMG5vdGVzJTIwZG9jdW1lbnRhdGlvbnxlbnwxfHx8fDE3NTkxMTM1NDV8MA&ixlib=rb-4.1.0&q=80&w=1080',
  'quiz': 'https://images.unsplash.com/photo-1556374149-b05b813beef0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2Z0d2FyZSUyMHF1aXolMjBhc3Nlc3NtZW50fGVufDF8fHx8MTc1OTExMzU0OXww&ixlib=rb-4.1.0&q=80&w=1080'
};

export function ContentSectionDemo() {
  const [selectedSection, setSelectedSection] = useState<'key-concepts' | 'summary' | 'principles' | 'do-notes' | 'quiz'>('key-concepts');
  const [currentView, setCurrentView] = useState<'demo' | 'guide'>('demo');

  const contentTypes = [
    { id: 'key-concepts', label: 'Key Concepts', icon: BookOpen },
    { id: 'summary', label: 'Summary', icon: FileText },
    { id: 'principles', label: 'Principles', icon: Target },
    { id: 'do-notes', label: 'Do-Notes', icon: PenTool },
    { id: 'quiz', label: 'Quiz', icon: HelpCircle }
  ] as const;

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Header Navigation */}
      <div className="bg-white border-b border-[#E6E6E7] sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-[#CC0000] p-2 rounded-lg">
                <Figma className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#2D2926]">Content Section Design Demo</h1>
                <p className="text-sm text-[#2D2926]">See how Figma designs translate to React components</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setCurrentView('demo')}
                variant={currentView === 'demo' ? 'default' : 'outline'}
                className={currentView === 'demo' ? 'bg-[#CC0000] hover:bg-[#AA0000]' : 'border-[#2D2926] text-[#2D2926]'}
              >
                <Eye className="h-4 w-4 mr-2" />
                Live Demo
              </Button>
              <Button
                onClick={() => setCurrentView('guide')}
                variant={currentView === 'guide' ? 'default' : 'outline'}
                className={currentView === 'guide' ? 'bg-[#CC0000] hover:bg-[#AA0000]' : 'border-[#2D2926] text-[#2D2926]'}
              >
                <Code className="h-4 w-4 mr-2" />
                Figma Guide
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {currentView === 'guide' ? (
          <FigmaDesignGuide />
        ) : (
          <div className="space-y-8">
            
            {/* Demo Introduction */}
            <Card className="p-6 border-l-4 border-l-[#CC0000]">
              <div className="flex items-start gap-4">
                <div className="bg-[#CC0000] p-3 rounded-lg">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-[#2D2926] mb-2">Enhanced Content Sections</h2>
                  <p className="text-[#2D2926] mb-4">
                    These components show how your Figma designs can translate into rich, interactive educational content. 
                    Each section maintains your clean design while adding educational functionality.
                  </p>
                  <div className="flex items-center gap-4 text-sm text-[#2D2926]">
                    <span>✅ Your exact color scheme (#CC0000, #2D2926, #E6E6E7)</span>
                    <span>✅ Simple Tailwind classes only</span>
                    <span>✅ Junior developer friendly</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Section Type Selector */}
            <div className="bg-white p-6 rounded-lg border border-[#E6E6E7]">
              <h3 className="text-lg font-bold text-[#2D2926] mb-4">Select Content Section Type:</h3>
              
              <Tabs value={selectedSection} onValueChange={(value) => setSelectedSection(value as any)} className="w-full">
                <TabsList className="grid w-full grid-cols-5 bg-[#E6E6E7] p-1 rounded-lg">
                  {contentTypes.map((type) => (
                    <TabsTrigger 
                      key={type.id} 
                      value={type.id}
                      className="data-[state=active]:bg-[#CC0000] data-[state=active]:text-white text-[#2D2926] font-medium transition-all flex items-center gap-2"
                    >
                      <type.icon className="h-4 w-4" />
                      <span className="hidden sm:inline">{type.label}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            {/* Content Section Display */}
            <div className="bg-white p-6 rounded-lg border border-[#E6E6E7]">
              <div className="mb-4 flex items-center gap-2">
                <div className="w-3 h-3 bg-[#CC0000] rounded-full"></div>
                <span className="text-sm font-medium text-[#2D2926]">Live Component Preview:</span>
              </div>
              
              {selectedSection === 'quiz' ? (
                <QuizSection 
                  module="1" 
                  imageUrl={sampleImages[selectedSection]} 
                />
              ) : (
                <ContentSection 
                  module="1" 
                  sectionType={selectedSection} 
                  imageUrl={sampleImages[selectedSection]} 
                />
              )}
            </div>

            {/* Implementation Notes */}
            <Card className="p-6 bg-[#E6E6E7]">
              <h3 className="text-lg font-bold text-[#2D2926] mb-4">Implementation Notes</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div>
                  <h4 className="font-bold text-[#2D2926] mb-2">Figma to React Process:</h4>
                  <ul className="space-y-1 text-sm text-[#2D2926]">
                    <li>1. Design components in Figma using your color system</li>
                    <li>2. Create variants for each content type</li>
                    <li>3. Export assets and copy component structure</li>
                    <li>4. Implement with simple Tailwind utilities</li>
                    <li>5. Add interactivity with basic React state</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-[#2D2926] mb-2">Key Benefits:</h4>
                  <ul className="space-y-1 text-sm text-[#2D2926]">
                    <li>• Consistent with your existing design</li>
                    <li>• Educational content structure</li>
                    <li>• Responsive 16:9 aspect ratio</li>
                    <li>• Progress tracking capability</li>
                    <li>• Interactive quiz functionality</li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* Integration Guide */}
            <Card className="p-6 border-l-4 border-l-[#2D2926]">
              <h3 className="text-lg font-bold text-[#2D2926] mb-4">How to Integrate with Your Current App</h3>
              <div className="space-y-4 text-sm text-[#2D2926]">
                <div className="bg-gray-100 p-4 rounded font-mono">
                  <p>// In your StudentView.tsx, replace the simple image display with:</p>
                  <p className="text-[#CC0000]">
                    {`{selectedContent === 'quiz' ? (`}<br/>
                    {`  <QuizSection module={selectedModule} imageUrl={getCurrentImage()} />`}<br/>
                    {`) : (`}<br/>
                    {`  <ContentSection module={selectedModule} sectionType={selectedContent} imageUrl={getCurrentImage()} />`}<br/>
                    {`)}`}
                  </p>
                </div>
                <p>
                  This maintains your current navigation structure while dramatically enhancing the content presentation.
                  All components use your existing color scheme and simple Tailwind classes.
                </p>
              </div>
            </Card>

          </div>
        )}

      </div>
    </div>
  );
}