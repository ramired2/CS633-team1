import React from 'react';
import { Card } from './ui/card';
import { Mail, Linkedin } from 'lucide-react';

export function Contact() {
  return (
    <section className="bg-[#2D2926] text-white py-6 mt-6" id="about">
      <div className="max-w-7xl mx-auto px-6">
        <Card className="p-4 bg-[#2D2926] border-[#E6E6E7]">
          <h3 className="text-lg font-semibold mb-3 text-white">Contact Alex Elenbauh</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-[#CC0000]" />
              <a 
                href="mailto:alelenbauh@aku.edu" 
                className="text-gray-200 hover:text-[#CC0000] hover:underline transition-colors text-sm"
              >
                alelenbauh@aku.edu
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Linkedin className="h-4 w-4 text-[#CC0000]" />
              <a 
                href="https://www.linkedin.com/in/alexelenbauh/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-200 hover:text-[#CC0000] hover:underline transition-colors text-sm"
              >
                https://www.linkedin.com/in/alexelenbauh/
              </a>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}