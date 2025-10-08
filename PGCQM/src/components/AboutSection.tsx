import { Card } from './ui/card';
import { BookOpen, Award, Shield, Target } from 'lucide-react';

// ADDED
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // ADDED
//

interface AboutSectionProps {
  aboutText?: string;
}

export function AboutSection({ aboutText }: AboutSectionProps) {

  // ADDED
  const [tempAboutText1, setTempAboutText1] = useState([])

   useEffect(() => {
    getDesc() // api call for description
    console.log("abtSection")

  }, [tempAboutText1]);

  /***************************************************************************** 
  * Desc: gets the course description from DB and sets it to tempAboutText1 and
  *       aboutText
  * 
  * params: NONE
  * 
  * return NONE 
  * ***************************************************************************/
  const getDesc = async() => {
    const res = await axios (`http://localhost:5000/getDesc/`, {
        headers: { 'Content-Type': 'application/json'},
        method: "GET",
        })
        .then(res => {
          const temp = res.data['desc'].toString().replace(/\\n/gi, '\n');
          console.log(temp)
            console.log(res.data)
            setTempAboutText1(temp)
            aboutText = res.data

        })
        .catch(err => console.log(err));
  };
  //

//   const defaultText = `This site serves two main purposes:
// For students who have already taken the class, it offers a chance to refresh their memory and explore new perspectives on the material.
// For those considering the course, it provides a preview—a "trailer," much like a three-minute glimpse that sparks interest before a three-hour movie.

// The aim is to highlight the underlying patterns of the course design. Modules are not assembled at random; each follows a deliberate structure that balances consistency with variation. Every module contains six parts:
// A pictorial illustrating a key concept
// A concise text summary of essential notions
// A set of guiding principles
// Common pitfalls ("do-nots")
// A quiz
// Frequently asked questions raised by students—sometimes surprising even the professor, who wonders, "What are they really asking?"

// Each of these elements plays an important role, and the absence of even one can create a noticeable gap.
// We invite you to explore the design and rhythm of the course through this site.`;

  const defaultText = `default`
  
  const text = aboutText || defaultText;
  const paragraphs = text.split('\n\n');

  console.log(text)
  
  return (
    <section className="bg-[#2D2926] text-white py-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-[#CC0000] p-3 rounded-lg">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold">About - CS 633</h2>
            <div className="flex gap-3">
              <span className="bg-[#CC0000] text-white px-3 py-1 rounded-full text-sm font-medium">6 Modules</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-4 max-w-5xl">
          {paragraphs.map((paragraph, index) => {
            const lines = paragraph.split('\n');
            
            // Check if this paragraph contains the list of six parts
            if (lines.length > 5 && lines.some(line => line.includes('A pictorial'))) {
              return (
                <div key={index}>
                  <p className="text-base leading-relaxed text-gray-200 mb-3">
                    {lines[0]}
                  </p>
                  <div className="bg-[#CC0000] bg-opacity-10 rounded-lg p-4 border-l-4 border-[#CC0000]">
                    {lines.slice(1).map((line, lineIndex) => (
                      <div key={lineIndex} className="text-sm leading-relaxed text-gray-200 py-1">
                        {line}
                      </div>
                    ))}
                  </div>
                </div>
              );
            }
            
            return (
              <p key={index} className="text-base leading-relaxed text-gray-200">
                {paragraph}
              </p>
            );
          })}
        </div>
        
        <div className="flex items-center gap-2 text-gray-300 mt-6">
          <Target className="h-5 w-5 text-[#CC0000]" />
          <span className="text-sm font-medium">Plan Quality • Perform Quality Assurance • Quality Control</span>
        </div>
      </div>
    </section>
  );
}