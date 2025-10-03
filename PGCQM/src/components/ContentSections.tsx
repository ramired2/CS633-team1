import React from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  BookOpen, 
  FileText, 
  Target, 
  PenTool, 
  HelpCircle, 
  CheckCircle,
  ArrowRight,
  Clock,
  Star
} from 'lucide-react';

interface ContentSectionProps {
  module: string;
  sectionType: 'key-concepts' | 'summary' | 'principles' | 'do-notes' | 'quiz';
  imageUrl: string;
}

// Content section data structure for Figma design
const sectionContent = {
  'key-concepts': {
    icon: BookOpen,
    title: 'Key Concepts',
    description: 'Essential learning points and definitions',
    color: '#CC0000',
    textContent: [
      'Core software quality principles',
      'Industry standard definitions', 
      'Fundamental terminology',
      'Best practice guidelines'
    ]
  },
  'summary': {
    icon: FileText,
    title: 'Summary',
    description: 'Overview and main takeaways',
    color: '#2D2926',
    textContent: [
      'Chapter overview and objectives',
      'Key learning outcomes',
      'Important highlights',
      'Connection to previous modules'
    ]
  },
  'principles': {
    icon: Target,
    title: 'Principles',
    description: 'Fundamental rules and frameworks',
    color: '#CC0000',
    textContent: [
      'Governing principles explained',
      'Framework methodologies',
      'Rule-based approaches',
      'Systematic procedures'
    ]
  },
  'do-notes': {
    icon: PenTool,
    title: 'Do-Notes',
    description: 'Practical application and exercises',
    color: '#2D2926',
    textContent: [
      'Hands-on exercises',
      'Practical examples',
      'Real-world applications',
      'Step-by-step guidance'
    ]
  },
  'quiz': {
    icon: HelpCircle,
    title: 'Quiz',
    description: 'Assessment and knowledge check',
    color: '#CC0000',
    textContent: [
      'Multiple choice questions',
      'Knowledge validation',
      'Progress assessment',
      'Learning reinforcement'
    ]
  }
};

export function ContentSection({ module, sectionType, imageUrl }: ContentSectionProps) {
  const section = sectionContent[sectionType];
  const SectionIcon = section.icon;

  return (
    <div className="space-y-6">
      
      {/* Section Header - Perfect for Figma Component */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="bg-[#CC0000] p-3 rounded-lg">
            <SectionIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#2D2926]">{section.title}</h2>
            <p className="text-[#2D2926]">{section.description}</p>
          </div>
        </div>
        <Badge variant="secondary" className="bg-[#E6E6E7] text-[#2D2926] px-4 py-2">
          Module {module}
        </Badge>
      </div>

      {/* Main Content Area - 16:9 Ratio for Figma Design */}
      <Card className="p-0 overflow-hidden">
        
        {/* Visual Content Area */}
        <div className="relative w-full aspect-video bg-gradient-to-br from-[#E6E6E7] to-white">
          <img 
            src={imageUrl} 
            alt={`Module ${module} - ${section.title}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-white bg-opacity-95 p-4 rounded-lg">
              <h3 className="font-bold text-[#2D2926] mb-2">Learning Focus</h3>
              <div className="grid grid-cols-2 gap-2">
                {section.textContent.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-[#2D2926]">
                    <CheckCircle className="h-4 w-4 text-[#CC0000]" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="p-4 bg-white border-t border-[#E6E6E7]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-[#2D2926]">
              <Clock className="h-4 w-4" />
              <span>Estimated time: 15 minutes</span>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="border-[#2D2926] text-[#2D2926] hover:bg-[#E6E6E7]">
                Save Progress
              </Button>
              <Button className="bg-[#CC0000] hover:bg-[#AA0000] text-white">
                Continue Learning
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>

      </Card>

      {/* Additional Content Cards - Stackable in Figma */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Learning Objectives Card */}
        <Card className="p-4 border-l-4 border-l-[#CC0000]">
          <div className="flex items-center gap-2 mb-3">
            <Target className="h-5 w-5 text-[#CC0000]" />
            <h4 className="font-bold text-[#2D2926]">Learning Objectives</h4>
          </div>
          <ul className="space-y-2 text-sm text-[#2D2926]">
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 bg-[#CC0000] rounded-full mt-2 flex-shrink-0"></span>
              <span>Understand core {section.title.toLowerCase()} concepts</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 bg-[#CC0000] rounded-full mt-2 flex-shrink-0"></span>
              <span>Apply knowledge to practical scenarios</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 bg-[#CC0000] rounded-full mt-2 flex-shrink-0"></span>
              <span>Demonstrate mastery through assessment</span>
            </li>
          </ul>
        </Card>

        {/* Progress Tracker Card */}
        <Card className="p-4 border-l-4 border-l-[#2D2926]">
          <div className="flex items-center gap-2 mb-3">
            <Star className="h-5 w-5 text-[#CC0000]" />
            <h4 className="font-bold text-[#2D2926]">Your Progress</h4>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#2D2926]">Section Completion</span>
              <span className="font-bold text-[#CC0000]">75%</span>
            </div>
            <div className="w-full bg-[#E6E6E7] rounded-full h-2">
              <div className="bg-[#CC0000] h-2 rounded-full w-3/4"></div>
            </div>
            <div className="text-xs text-[#2D2926]">
              3 of 4 learning objectives completed
            </div>
          </div>
        </Card>
        
      </div>
    </div>
  );
}

// Quiz-specific component for Figma design
export function QuizSection({ module, imageUrl }: { module: string; imageUrl: string }) {
  return (
    <div className="space-y-6">
      
      {/* Quiz Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="bg-[#CC0000] p-3 rounded-lg">
            <HelpCircle className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#2D2926]">Knowledge Check</h2>
            <p className="text-[#2D2926]">Test your understanding of Module {module}</p>
          </div>
        </div>
        <Badge variant="secondary" className="bg-[#E6E6E7] text-[#2D2926] px-4 py-2">
          5 Questions
        </Badge>
      </div>

      {/* Quiz Card */}
      <Card className="p-6">
        <div className="space-y-6">
          
          {/* Question */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Badge className="bg-[#CC0000] text-white">Question 1 of 5</Badge>
            </div>
            <h3 className="text-lg font-bold text-[#2D2926] mb-4">
              Which of the following best describes software quality assurance?
            </h3>
          </div>

          {/* Answer Options */}
          <div className="space-y-3">
            {[
              'A systematic process for ensuring software meets requirements',
              'Only testing the final product before release',
              'Writing documentation after development',
              'Fixing bugs found by users'
            ].map((option, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full p-4 h-auto text-left justify-start border-[#E6E6E7] hover:border-[#CC0000] hover:bg-[#E6E6E7]"
              >
                <span className="mr-3 w-6 h-6 rounded-full border-2 border-[#CC0000] flex items-center justify-center text-sm font-bold text-[#CC0000]">
                  {String.fromCharCode(65 + index)}
                </span>
                {option}
              </Button>
            ))}
          </div>

          {/* Quiz Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-[#E6E6E7]">
            <Button variant="outline" className="border-[#2D2926] text-[#2D2926]">
              Previous Question
            </Button>
            <div className="flex items-center gap-2 text-sm text-[#2D2926]">
              <Clock className="h-4 w-4" />
              <span>2:30 remaining</span>
            </div>
            <Button className="bg-[#CC0000] hover:bg-[#AA0000] text-white">
              Next Question
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}