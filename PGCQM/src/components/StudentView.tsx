import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { ImageViewer } from './ImageViewer';
import { Contact } from './Contact';
import { Header } from './Header';
import { Maximize, BookOpen, FileText, Target, PenTool, HelpCircle, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios'; // ADDED

interface StudentViewProps {
  onNavigate: (page: 'student' | 'login' | 'admin') => void;
  aboutText?: string;
}

export function StudentView({ onNavigate, aboutText }: StudentViewProps) {
  const backend = 'https://pgcqm-backend.onrender.com'
  const [selectedModule, setSelectedModule] = useState("1");
  const [selectedContent, setSelectedContent] = useState('key-concepts');
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [modIds, setModIds] = useState([])

  const contentButtons = [
    { id: 'key-concepts', label: 'Key Concepts', icon: BookOpen },
    { id: 'summary', label: 'Summary', icon: FileText },
    { id: 'principles', label: 'Principles', icon: Target },
    { id: 'do-notes', label: 'Do-Notes', icon: PenTool },
    { id: 'quiz', label: 'Quiz', icon: HelpCircle },
    { id: 'faq', label: 'FAQ', icon: MessageCircle }
  ];

  const getIds = async() => {
    // let temp = "module1"
    const res = await axios (`${backend}/getModNameID`, {
        headers: { 'Content-Type': 'application/json'},
        method: "GET",
        })
        .then(res => {
            console.log(res.data)

            setModIds(res.data)

        })
        .catch(err => console.log(err));
    }

  // added/ edited
  const [moduleImages, setModuleImages] = useState({// Module 1: Software Quality Fundamentals
  "1": {
    "key-concepts": "https://images.unsplash.com/photo-1621361753831-e972c09ceec9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2Z0d2FyZSUyMHF1YWxpdHklMjBjb25jZXB0c3xlbnwxfHx8fDE3NTkxMTM1Mzd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "summary": "https://images.unsplash.com/photo-1743385779347-1549dabf1320?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZXN0aW5nJTIwc3VtbWFyeSUyMGRpYWdyYW18ZW58MXx8fHwxNzU5MTEzNTM5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "principles": "https://images.unsplash.com/photo-1722080826167-4ea87368cbc5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2Z0d2FyZSUyMHByaW5jaXBsZXMlMjBmcmFtZXdvcmt8ZW58MXx8fHwxNzU5MTEzNTQyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "do-notes": "https://images.unsplash.com/photo-1758874384555-37d50c0ee81a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXZlbG9wbWVudCUyMG5vdGVzJTIwZG9jdW1lbnRhdGlvbnxlbnwxfHx8fDE3NTkxMTM1NDV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "quiz": "https://images.unsplash.com/photo-1556374149-b05b813beef0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2Z0d2FyZSUyMHF1aXolMjBhc3Nlc3NtZW50fGVufDF8fHx8MTc1OTExMzU0OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "faq": "https://images.unsplash.com/photo-1633613286848-e6f43bbafb8d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVxdWVudGx5JTIwYXNrZWQlMjBxdWVzdGlvbnMlMjBzb2Z0d2FyZXxlbnwxfHx8fDE3NTkxNDk2NjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  // Module 2: Quality Assurance Process
  "2": {
    "key-concepts": "https://images.unsplash.com/photo-1758873263563-5ba4aa330799?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxxdWFsaXR5JTIwYXNzdXJhbmNlJTIwcHJvY2Vzc3xlbnwxfHx8fDE3NTkxMTM1NTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "summary": "https://images.unsplash.com/photo-1669441797953-7acda19ee9a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2Z0d2FyZSUyMHRlc3RpbmclMjBsaWZlY3ljbGV8ZW58MXx8fHwxNzU5MTEzNTU1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "principles": "https://images.unsplash.com/photo-1704209684373-4f9ec6f3c5a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZXJpZmljYXRpb24lMjB2YWxpZGF0aW9uJTIwbWV0aG9kc3xlbnwxfHx8fDE3NTkxMTM1NTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "do-notes": "https://images.unsplash.com/photo-1554350747-ec45fd24f51b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZXN0JTIwZGVzaWduJTIwY292ZXJhZ2V8ZW58MXx8fHwxNzU5MTEzNTYxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "quiz": "https://images.unsplash.com/photo-1740908900906-a51032597559?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWN1cml0eSUyMHByYWN0aWNlcyUyMGZyYW1ld29ya3xlbnwxfHx8fDE3NTkxMTM1NjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "faq": "https://images.unsplash.com/photo-1688126507367-b7cb61e19f30?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWxwJTIwY2VudGVyJTIwY3VzdG9tZXIlMjBzdXBwb3J0fGVufDF8fHx8MTc1OTE0OTY2OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  // Module 3: Testing Methodologies
  "3": {
    "key-concepts": "https://images.unsplash.com/photo-1686061594183-8c864f508b00?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkeW5hbWljJTIwYW5hbHlzaXMlMjB0b29sc3xlbnwxfHx8fDE3NTkxMTM1Njh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "summary": "https://images.unsplash.com/photo-1564865878688-9a244444042a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2RlJTIwcmV2aWV3JTIwcHJvY2Vzc3xlbnwxfHx8fDE3NTkxMTM1NzJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "principles": "https://images.unsplash.com/photo-1630442923896-244dd3717b35?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWJ1Z2dpbmclMjB0ZWNobmlxdWVzfGVufDF8fHx8MTc1OTExMzU3NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "do-notes": "https://images.unsplash.com/photo-1554350747-ec45fd24f51b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJmb3JtYW5jZSUyMHRlc3RpbmclMjBtZXRyaWNzfGVufDF8fHx8MTc1OTExMzU3OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "quiz": "https://images.unsplash.com/photo-1554350747-ec45fd24f51b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXRvbWF0ZWQlMjB0ZXN0aW5nJTIwd29ya2Zsb3d8ZW58MXx8fHwxNzU5MTEzNTgxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "faq": "https://images.unsplash.com/photo-1738707636811-195106749217?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxxdWVzdGlvbnMlMjBhbnN3ZXJzJTIwdHJvdWJsZXNob290aW5nfGVufDF8fHx8MTc1OTE0OTY3NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  // Module 4: Test Design & Coverage
  "4": {
    "key-concepts": "https://images.unsplash.com/photo-1641891847722-7ca2a0df0879?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbnRlZ3JhdGlvbiUyMHRlc3RpbmclMjBzdHJhdGVneXxlbnwxfHx8fDE3NTkxMTM1ODR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "summary": "https://images.unsplash.com/photo-1554350747-ec45fd24f51b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml0JTIwdGVzdGluZyUyMGZyYW1ld29ya3xlbnwxfHx8fDE3NTkxMTM1ODh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "principles": "https://images.unsplash.com/photo-1526907647581-931d6e8518e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxxdWFsaXR5JTIwY29udHJvbCUyMHN0YW5kYXJkc3xlbnwxfHx8fDE3NTkxMTM1OTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "do-notes": "https://images.unsplash.com/photo-1693045181254-08462917f681?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2Z0d2FyZSUyMGRvY3VtZW50YXRpb24lMjBndWlkZXxlbnwxfHx8fDE3NTkxMTM1OTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "quiz": "https://images.unsplash.com/photo-1625465329894-9cfaf8a63332?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZXN0JTIwY2FzZSUyMGRlc2lnbnxlbnwxfHx8fDE3NTkxMTM1OTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "faq": "https://images.unsplash.com/photo-1693045181254-08462917f681?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXBwb3J0JTIwZG9jdW1lbnRhdGlvbiUyMGd1aWRlfGVufDF8fHx8MTc1OTE0OTY4M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  // Module 5: Security Practices
  "5": {
    "key-concepts": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2Z0d2FyZSUyMG1ldHJpY3MlMjBhbmFseXNpc3xlbnwxfHx8fDE3NTkxMTM2MDF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "summary": "https://images.unsplash.com/photo-1685839061205-a3ea35b7b804?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXZlbG9wbWVudCUyMGxpZmVjeWNsZSUyMGRpYWdyYW18ZW58MXx8fHwxNzU5MTEzNjA0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "principles": "https://images.unsplash.com/photo-1554350747-ec45fd24f51b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzeXN0ZW0lMjB0ZXN0aW5nJTIwYXBwcm9hY2h8ZW58MXx8fHwxNzU5MTEzNjA3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "do-notes": "https://images.unsplash.com/photo-1554350747-ec45fd24f51b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhY2NlcHRhbmNlJTIwdGVzdGluZyUyMGNyaXRlcmlhfGVufDF8fHx8MTc1OTExMzYxMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "quiz": "https://images.unsplash.com/photo-1554350747-ec45fd24f51b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWdyZXNzaW9uJTIwdGVzdGluZyUyMHByb2Nlc3N8ZW58MXx8fHwxNzU5MTEzNjE0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "faq": "https://images.unsplash.com/photo-1724632824319-4b43e74e000c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrbm93bGVkZ2UlMjBiYXNlJTIwaGVscCUyMGNlbnRlcnxlbnwxfHx8fDE3NTkxNDk2ODl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  // Module 6: Advanced Quality Management
  "6": {
    "key-concepts": "https://images.unsplash.com/photo-1554350747-ec45fd24f51b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1c2VyJTIwYWNjZXB0YW5jZSUyMHRlc3Rpbmd8ZW58MXx8fHwxNzU5MTEzNjE3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "summary": "https://images.unsplash.com/photo-1591381287254-b3349c60bf9b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZXN0JTIwZXhlY3V0aW9uJTIwd29ya2Zsb3d8ZW58MXx8fHwxNzU5MTEzNjIwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "principles": "https://images.unsplash.com/photo-1620784889144-68359280d20e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWZlY3QlMjB0cmFja2luZyUyMHN5c3RlbXxlbnwxfHx8fDE3NTkxMTM2MjN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "do-notes": "https://images.unsplash.com/photo-1591492835122-79ae33cd19f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyaXNrJTIwYXNzZXNzbWVudCUyMGZyYW1ld29ya3xlbnwxfHx8fDE3NTkxMTM2MjZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "quiz": "https://images.unsplash.com/photo-1758691736545-5c33b6255dca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVzZW50YXRpb24lMjBzbGlkZSUyMHF1YWxpdHklMjBtYW5hZ2VtZW50fGVufDF8fHx8MTc1OTEwMDQ2Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "faq": "https://images.unsplash.com/photo-1669023414171-56f0740e34cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNobmljYWwlMjBzdXBwb3J0JTIwZ3VpZGVsaW5lc3xlbnwxfHx8fDE3NTkxNDk2OTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  }});
  const [isEmpty, setIsEmpty] = useState(true);

   useEffect(() => {
    getMods()   // api call for getting module imgs
    getIds()

  }, []);

  /*****************************************************************************
  * Desc: function to get info for desired slide to view
  * 
  * params: NONE
  * 
  * return: if moduleImgaes empty --> return link to image
  *         else return link of specific tab user clicked from desired module
  *****************************************************************************/
  const getCurrentImage = () => {
    // if module imgs did not load for some reason
    if (moduleImages == null || moduleImages == undefined) {
      return "https://images.unsplash.com/photo-1621361753831-e972c09ceec9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2Z0d2FyZSUyMHF1YWxpdHklMjBjb25jZXB0c3xlbnwxfHx8fDE3NTkxMTM1Mzd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    }
    else {
      // user clicked on module 'selectedModule' and wants to see tab 'selected content
      return moduleImages[selectedModule]?.[selectedContent]
    }
  };

  
  /***************************************************************************** 
  * Desc: function to get the images for all modules
  * 
  * params: NONE
  * 
  * return NONE 
  * ***************************************************************************/
  const getMods = async() => {
    const res = await axios (`http://127.0.0.1:5000/getMods`, {
        headers: { 'Content-Type': 'application/json'},
        method: "GET",
        })
        .then(res => {
            console.log(res.data)

            setModuleImages(res.data)
            setIsEmpty(false)

        })
        .catch(err => console.log(err));
  };

  // 

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header onNavigate={onNavigate} currentPage="student" />

      {/* Interactive Module Navigation - Two Column Layout */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          
          {/* Left Column: Collapsible Module Sidebar */}
          <div className={`${sidebarCollapsed ? 'w-16' : 'w-48'} flex-shrink-0 transition-all duration-300 relative`}>
            
            {/* Toggle Button */}
            <Button
              onClick={() => {setSidebarCollapsed(!sidebarCollapsed);}}
              className="absolute top-0 -right-4 z-10 w-8 h-8 p-0 bg-[#CC0000] hover:bg-[#AA0000] text-white rounded-full shadow-lg"
              size="sm"
            >
              {sidebarCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>

            {/* Sidebar Header */}
            <div className={`flex items-center gap-2 mb-4 ${sidebarCollapsed ? 'justify-center' : ''}`}>
              <div className="bg-[#CC0000] p-2 rounded-lg">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              {!sidebarCollapsed && (
                <div>
                  <h3 className="text-lg font-bold text-[#2D2926]">Modules</h3>
                  <p className="text-xs text-[#2D2926]">Select module</p>
                </div>
              )}
            </div>
            
            {/* Module Buttons */}
            <div className="space-y-2">
              {modIds.map((num) => (
                <Button
                  key={num['_id']}
                  onClick={() => {setSelectedModule(num['modName'].substr(-1)); setSelectedContent('key-concepts');console.log(selectedModule)}}
                  className={`w-full ${sidebarCollapsed ? 'p-2 justify-center' : 'p-3'} h-auto flex items-center gap-2 transition-all ${
                    selectedModule === num['modName'].substr(-1)
                      ? 'bg-[#CC0000] text-white shadow-lg hover:bg-[#CC0000]'
                      : 'bg-white hover:bg-[#CC0000] hover:text-white text-[#2D2926] border-2 border-[#2D2926]'
                  }`}
                  variant={selectedModule === num['modName'].substr(-1) ? "default" : "outline"}
                >
                  {sidebarCollapsed? <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                    selectedModule === num['modName'].substr(-1) 
                      ? 'bg-white text-[#CC0000]' 
                      : 'bg-[#CC0000] text-white'
                  }`}>
                    {num['modName'].substr(-1)}
                  </div>: ""}
                  {!sidebarCollapsed && (
                    <span className="font-medium text-sm">Module {num['modName'].substr(-1)}</span>
                  )}
                </Button>
              ))}
            </div>
          </div>

          {/* Right Column: Content Sections and Images */}
          <div className="flex-1">
            <Tabs value={selectedContent} onValueChange={setSelectedContent} className="w-full">
              
              {/* Content Section Tabs */}
              <div className="mb-6">
                
                <TabsList className="grid w-full grid-cols-6 bg-[#E6E6E7] p-1 rounded-lg">
                  {contentButtons.map((button) => (
                    <TabsTrigger 
                      key={button.id} 
                      value={button.id}
                      className="data-[state=active]:bg-[#CC0000] data-[state=active]:text-white text-[#2D2926] font-medium transition-all flex items-center gap-2"
                    >
                      <button.icon className="h-4 w-4" />
                      <span className="hidden sm:inline">{button.label}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              {/* Tab Content for each Content Section */}
              {contentButtons.map((button) => (
                <TabsContent key={button.id} value={button.id}>
                  
                  {/* Image Display Area - PPT Slide Size (16:9 aspect ratio) */}
                  <Card className="p-6 mb-6">
                    <div className="relative">
                      <div className="w-full aspect-video bg-gray-100 rounded-lg overflow-hidden">
                        { // added if statement
                        isEmpty == false?
                        <img 
                          src={getCurrentImage()} 
                          alt={`Module ${selectedModule} - ${button.label}`}
                          className="w-full h-full object-cover"
                        />:"loading"
                        }
                      </div>
                      {/* <div className="absolute top-4 left-4 bg-black bg-opacity-75 text-white px-3 py-2 rounded text-sm">
                        Images coming from Database. PPT Slide Size (16:9)
                      </div> */}
                      {/* <div className="absolute top-4 right-14 bg-[#CC0000] text-white px-3 py-2 rounded text-sm font-medium">
                        {button.label}
                      </div> BLOCKS SOME OF TEXT ON SCREEN*/}
                      { // added if statement
                        isEmpty == false?
                      <Button
                        onClick={() => setFullscreenImage(getCurrentImage())}
                        className="absolute top-4 right-4 p-2"
                        size="sm"
                        variant="secondary"
                      >
                        <Maximize className="h-4 w-4" />
                      </Button>:""
                      }
                    </div>
                    <div className="mt-4 text-center text-sm text-gray-600">
                      • Click maximize for full screen view •
                    </div>
                  </Card>
                  
                </TabsContent>
              ))}
              
            </Tabs>
          </div>
          
        </div>
        
        {/* About Section - Content from Database */}
        {aboutText && (
          <Card className="p-6 my-8 bg-white border-2 border-[#E6E6E7]">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-[#CC0000] p-2 rounded-lg">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-[#2D2926]">About - CS 633</h2>
              <Badge className="bg-[#CC0000] text-white">6 Modules</Badge>
            </div>
            
            <div className="text-[#2D2926] whitespace-pre-wrap max-w-5xl">
              {aboutText}
            </div>
          </Card>
        )}
        
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