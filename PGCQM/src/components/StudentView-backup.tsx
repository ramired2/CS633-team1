import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { ImageViewer } from './ImageViewer';
import { Contact } from './Contact';
import { Header } from './Header';
import { AboutSection } from './AboutSection';
import { Maximize } from 'lucide-react';

interface StudentViewProps {
  onNavigate: (page: 'student' | 'login' | 'professor') => void;
}

const moduleImages = [
  "https://images.unsplash.com/photo-1758691736545-5c33b6255dca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVzZW50YXRpb24lMjBzbGlkZSUyMHF1YWxpdHklMjBtYW5hZ2VtZW50fGVufDF8fHx8MTc1OTEwMDQ2Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1664526937033-fe2c11f1be25?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2Z0d2FyZSUyMGRldmVsb3BtZW50JTIwbGlmZWN5Y2xlJTIwZGlhZ3JhbXxlbnwxfHx8fDE3NTkxMDA0NjZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1743385779347-1549dabf1320?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHByb2Nlc3MlMjBmbG93Y2hhcnR8ZW58MXx8fHwxNzU5MTAwNDY5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
];

export function StudentView({ onNavigate }: StudentViewProps) {
  const [selectedModule, setSelectedModule] = useState(1);
  const [selectedContent, setSelectedContent] = useState('key-concepts');
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  const contentButtons = [
    { id: 'key-concepts', label: 'Key Concepts' },
    { id: 'summary', label: 'Summary' },
    { id: 'principles', label: 'Principles' },
    { id: 'do-notes', label: 'Do-Notes' },
    { id: 'quiz', label: 'Quiz' }
  ];

  const getCurrentImage = () => {
    return moduleImages[(selectedModule - 1) % moduleImages.length];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header onNavigate={onNavigate} currentPage="student" />

      {/* About Section */}
      <AboutSection />

      {/* Module Navigation */}
      <section className="bg-[#E6E6E7] py-8 border-b">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-[#2D2926] mb-2">Course Modules</h3>
            <p className="text-[#2D2926]">Select a module to explore its content</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map((module) => (
              <Card
                key={module}
                className={`p-4 cursor-pointer transition-all border-2 ${
                  selectedModule === module 
                    ? 'bg-[#CC0000] text-white border-[#CC0000] shadow-lg' 
                    : 'bg-white hover:bg-[#CC0000] hover:text-white border-[#2D2926] shadow-sm'
                }`}
                onClick={() => setSelectedModule(module)}
              >
                <div className="text-center">
                  <div className="text-2xl font-bold mb-1">
                    {module}
                  </div>
                  <div className="text-sm font-medium">
                    Module
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Content Navigation */}
        <Card className="p-6 mb-6 bg-white shadow-lg border-2 border-[#E6E6E7]">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-[#CC0000] text-white p-3 rounded-lg">
              <div className="text-lg font-bold">{selectedModule}</div>
            </div>
            <div>
              <h4 className="text-xl font-bold text-[#2D2926]">Module {selectedModule} Content</h4>
              <p className="text-[#2D2926]">Choose a section to explore</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {contentButtons.map((button) => (
              <Button
                key={button.id}
                onClick={() => setSelectedContent(button.id)}
                className={`px-4 py-2 h-auto transition-all ${
                  selectedContent === button.id 
                    ? 'bg-[#CC0000] text-white shadow-lg hover:bg-[#CC0000]' 
                    : 'bg-white hover:bg-[#CC0000] hover:text-white text-[#2D2926] border-2 border-[#2D2926]'
                }`}
                variant={selectedContent === button.id ? "default" : "outline"}
              >
                <div className="font-semibold text-sm">{button.label}</div>
              </Button>
            ))}
          </div>
        </Card>

        {/* Image Display Area */}
        <Card className="p-6 mb-6">
          <div className="relative">
            <img 
              src={getCurrentImage()} 
              alt={`Module ${selectedModule} - ${selectedContent}`}
              className="w-full h-96 object-cover rounded-lg"
            />
            <div className="absolute top-4 left-4 bg-black bg-opacity-75 text-white px-3 py-2 rounded text-sm">
              Images coming from Database. It will be size of PPT slide
            </div>
            <Button
              onClick={() => setFullscreenImage(getCurrentImage())}
              className="absolute top-4 right-4 p-2"
              size="sm"
              variant="secondary"
            >
              <Maximize className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-4 text-center text-sm text-gray-600">
            Click the maximize button for full screen view
          </div>
        </Card>

        {/* Contact Section */}
        <Contact />
      </div>

      {/* Fullscreen Image Viewer */}
      {fullscreenImage && (
        <ImageViewer 
          src={fullscreenImage} 
          alt="Fullscreen view"
          onClose={() => setFullscreenImage(null)} 
        />
      )}
    </div>
  );
}