import React from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Figma, 
  Layers, 
  Square, 
  Type, 
  Image,
  Grid,
  Palette,
  Zap
} from 'lucide-react';

export function FigmaDesignGuide() {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="bg-[#CC0000] p-3 rounded-lg">
            <Figma className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-[#2D2926]">Figma Content Section Design Guide</h1>
        </div>
        <p className="text-[#2D2926] max-w-2xl mx-auto">
          How to create content sections in Figma that translate perfectly to your React components
        </p>
      </div>

      {/* Design System Colors */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Palette className="h-6 w-6 text-[#CC0000]" />
          <h2 className="text-xl font-bold text-[#2D2926]">Your Color System</h2>
        </div>
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <div className="w-full h-20 bg-[#CC0000] rounded-lg mb-2"></div>
            <p className="text-sm font-mono">#CC0000</p>
            <p className="text-xs text-[#2D2926]">Primary Red</p>
          </div>
          <div className="text-center">
            <div className="w-full h-20 bg-[#2D2926] rounded-lg mb-2"></div>
            <p className="text-sm font-mono">#2D2926</p>
            <p className="text-xs text-[#2D2926]">Dark Gray</p>
          </div>
          <div className="text-center">
            <div className="w-full h-20 bg-[#E6E6E7] rounded-lg mb-2"></div>
            <p className="text-sm font-mono">#E6E6E7</p>
            <p className="text-xs text-[#2D2926]">Light Gray</p>
          </div>
          <div className="text-center">
            <div className="w-full h-20 bg-white border-2 border-[#E6E6E7] rounded-lg mb-2"></div>
            <p className="text-sm font-mono">#FFFFFF</p>
            <p className="text-xs text-[#2D2926]">White</p>
          </div>
        </div>
      </Card>

      {/* Component Structure */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Layers className="h-6 w-6 text-[#CC0000]" />
          <h2 className="text-xl font-bold text-[#2D2926]">Content Section Structure</h2>
        </div>
        
        <div className="space-y-6">
          
          {/* Layer 1: Header */}
          <div className="border-2 border-dashed border-[#CC0000] p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-[#CC0000] text-white">Layer 1</Badge>
              <span className="font-bold text-[#2D2926]">Section Header</span>
            </div>
            <div className="bg-[#E6E6E7] p-4 rounded">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#CC0000] rounded-lg flex items-center justify-center">
                    <Type className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="h-4 bg-[#2D2926] rounded w-32 mb-1"></div>
                    <div className="h-3 bg-gray-400 rounded w-48"></div>
                  </div>
                </div>
                <div className="h-8 bg-[#E6E6E7] rounded w-20"></div>
              </div>
            </div>
            <p className="text-sm text-[#2D2926] mt-2">
              <strong>Figma Tips:</strong> Use auto-layout, set to "Hug contents" horizontally, "Fixed height" 80px
            </p>
          </div>

          {/* Layer 2: Main Content */}
          <div className="border-2 border-dashed border-[#2D2926] p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-[#2D2926] text-white">Layer 2</Badge>
              <span className="font-bold text-[#2D2926]">Main Content (16:9 Aspect)</span>
            </div>
            <div className="w-full aspect-video bg-gradient-to-br from-[#E6E6E7] to-white rounded-lg border-2 border-[#E6E6E7] flex items-center justify-center">
              <div className="text-center">
                <Image className="h-16 w-16 text-[#CC0000] mx-auto mb-2" />
                <p className="text-[#2D2926] font-medium">16:9 Content Area</p>
                <p className="text-sm text-gray-500">1920 × 1080px or similar ratio</p>
              </div>
            </div>
            <p className="text-sm text-[#2D2926] mt-2">
              <strong>Figma Tips:</strong> Create frame with 16:9 constraints, use "Scale" for responsive design
            </p>
          </div>

          {/* Layer 3: Action Bar */}
          <div className="border-2 border-dashed border-[#E6E6E7] p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-[#E6E6E7] text-[#2D2926]">Layer 3</Badge>
              <span className="font-bold text-[#2D2926]">Action Bar</span>
            </div>
            <div className="bg-white p-4 rounded border border-[#E6E6E7]">
              <div className="flex items-center justify-between">
                <div className="h-6 bg-gray-300 rounded w-32"></div>
                <div className="flex gap-2">
                  <div className="h-8 bg-[#E6E6E7] rounded w-24"></div>
                  <div className="h-8 bg-[#CC0000] rounded w-32"></div>
                </div>
              </div>
            </div>
            <p className="text-sm text-[#2D2926] mt-2">
              <strong>Figma Tips:</strong> Use auto-layout with "Space between", padding 16px all sides
            </p>
          </div>

        </div>
      </Card>

      {/* Figma Components */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Square className="h-6 w-6 text-[#CC0000]" />
          <h2 className="text-xl font-bold text-[#2D2926]">Create These Figma Components</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Master Component */}
          <div className="space-y-4">
            <h3 className="font-bold text-[#2D2926]">1. Master Content Section</h3>
            <div className="bg-[#E6E6E7] p-4 rounded-lg space-y-3">
              <div className="text-sm space-y-1">
                <p><strong>Component Name:</strong> ContentSection/Master</p>
                <p><strong>Size:</strong> Width: Fill container, Height: Auto</p>
                <p><strong>Properties:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Icon (Instance swap)</li>
                  <li>Title (Text property)</li>
                  <li>Module number (Text property)</li>
                  <li>Background image (Fill property)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Variants */}
          <div className="space-y-4">
            <h3 className="font-bold text-[#2D2926]">2. Section Type Variants</h3>
            <div className="bg-[#E6E6E7] p-4 rounded-lg space-y-2">
              <div className="text-sm space-y-1">
                <p><strong>Create variants for:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Key Concepts (BookOpen icon)</li>
                  <li>Summary (FileText icon)</li>
                  <li>Principles (Target icon)</li>
                  <li>Do-Notes (PenTool icon)</li>
                  <li>Quiz (HelpCircle icon)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Cards */}
          <div className="space-y-4">
            <h3 className="font-bold text-[#2D2926]">3. Supporting Cards</h3>
            <div className="bg-[#E6E6E7] p-4 rounded-lg space-y-2">
              <div className="text-sm space-y-1">
                <p><strong>Mini-components:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Learning Objectives Card</li>
                  <li>Progress Tracker Card</li>
                  <li>Quiz Question Card</li>
                  <li>Action Button Set</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Layout Grid */}
          <div className="space-y-4">
            <h3 className="font-bold text-[#2D2926]">4. Layout Grid System</h3>
            <div className="bg-[#E6E6E7] p-4 rounded-lg space-y-2">
              <div className="text-sm space-y-1">
                <p><strong>Grid Settings:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>12-column grid</li>
                  <li>24px gutters</li>
                  <li>48px margins</li>
                  <li>8px baseline grid</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Responsive Guidelines */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Grid className="h-6 w-6 text-[#CC0000]" />
          <h2 className="text-xl font-bold text-[#2D2926]">Responsive Breakpoints</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-[#E6E6E7] rounded-lg">
            <h4 className="font-bold text-[#2D2926] mb-2">Desktop</h4>
            <p className="text-sm">1200px+</p>
            <p className="text-xs text-[#2D2926] mt-2">Full sidebar + content</p>
          </div>
          <div className="text-center p-4 bg-[#E6E6E7] rounded-lg">
            <h4 className="font-bold text-[#2D2926] mb-2">Tablet</h4>
            <p className="text-sm">768px - 1199px</p>
            <p className="text-xs text-[#2D2926] mt-2">Collapsed sidebar default</p>
          </div>
          <div className="text-center p-4 bg-[#E6E6E7] rounded-lg">
            <h4 className="font-bold text-[#2D2926] mb-2">Mobile</h4>
            <p className="text-sm">< 768px</p>
            <p className="text-xs text-[#2D2926] mt-2">Stack vertically</p>
          </div>
        </div>
      </Card>

      {/* Quick Tips */}
      <Card className="p-6 bg-[#CC0000] text-white">
        <div className="flex items-center gap-3 mb-4">
          <Zap className="h-6 w-6" />
          <h2 className="text-xl font-bold">Quick Figma Tips</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-bold mb-2">Auto-Layout Settings:</h4>
            <ul className="space-y-1">
              <li>• Vertical direction for main container</li>
              <li>• 24px spacing between sections</li>
              <li>• "Hug contents" for headers</li>
              <li>• "Fill container" for content areas</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-2">Component Properties:</h4>
            <ul className="space-y-1">
              <li>• Text properties for dynamic content</li>
              <li>• Boolean properties for show/hide states</li>
              <li>• Instance swap for icons</li>
              <li>• Fill properties for background images</li>
            </ul>
          </div>
        </div>
      </Card>

    </div>
  );
}