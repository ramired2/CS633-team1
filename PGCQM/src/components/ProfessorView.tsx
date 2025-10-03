import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Contact } from './Contact';
import { Header } from './Header';
import { AboutSection } from './AboutSection';
import { Upload, FileText, Trash2 } from 'lucide-react';

interface ProfessorViewProps {
  onNavigate: (page: 'student' | 'login' | 'professor') => void;
  onLogout: () => void;
}

interface ModuleData {
  id: number;
  title: string;
  file: File | null;
  fileName: string;
}

export function ProfessorView({ onNavigate, onLogout }: ProfessorViewProps) {
  const [modules, setModules] = useState<ModuleData[]>([
    { id: 1, title: 'Module 1', file: null, fileName: 'File Location' },
    { id: 2, title: 'Module 2', file: null, fileName: 'File Location' },
    { id: 3, title: 'Module 3', file: null, fileName: 'File Location' },
    { id: 4, title: 'Module 4', file: null, fileName: 'File Location' },
    { id: 5, title: 'Module 5', file: null, fileName: 'File Location' },
    { id: 6, title: 'Module 6', file: null, fileName: 'File Location' },
  ]);
  
  const [deleteModule, setDeleteModule] = useState<string>('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleFileUpload = (moduleId: number, file: File) => {
    // Check if file is PPT
    const isPPT = file.name.toLowerCase().endsWith('.ppt') || 
                  file.name.toLowerCase().endsWith('.pptx') ||
                  file.type.includes('presentation');
    
    if (!isPPT) {
      alert('Please upload only PPT or PPTX files');
      return;
    }

    setModules(prev => prev.map(module => 
      module.id === moduleId 
        ? { ...module, file, fileName: file.name }
        : module
    ));
  };

  const handleSubmit = () => {
    const hasUploadedFile = modules.some(module => module.file !== null);
    
    if (!hasUploadedFile) {
      alert('Please upload at least one PPT file before submitting');
      return;
    }
    
    alert('Files submitted successfully!');
  };

  const handleDelete = () => {
    if (!deleteModule) {
      alert('Please select a module to delete');
      return;
    }
    
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    const moduleNum = parseInt(deleteModule);
    setModules(prev => prev.map(module => 
      module.id === moduleNum 
        ? { ...module, file: null, fileName: 'File Location' }
        : module
    ));
    setDeleteModule('');
    setShowDeleteConfirm(false);
    alert(`Module ${moduleNum} file deleted successfully!`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header onNavigate={onNavigate} currentPage="professor" showLogout onLogout={onLogout} />

      {/* About Section */}
      <AboutSection />

      {/* PPT Slide Sequence Section */}
      <section className="bg-[#E6E6E7] py-8 border-b">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-[#2D2926] mb-2">Sequence of the PPT Slide</h3>
            <p className="text-[#2D2926]">Standard structure for each module presentation</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { number: "1", text: "A pictorial illustrating a concept", icon: "🎨" },
              { number: "2", text: "Summary of essential points", icon: "📝" },
              { number: "3", text: "Guiding principles", icon: "🎯" },
              { number: "4", text: "Common trends", icon: "📈" },
              { number: "5", text: "FAQ section", icon: "❓" }
            ].map((item, index) => (
              <Card key={index} className="p-4 bg-white border-2 border-[#2D2926] hover:shadow-lg transition-all hover:bg-[#CC0000] hover:text-white">
                <div className="text-center">
                  <div className="bg-[#CC0000] text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mx-auto mb-2">
                    {item.number}
                  </div>
                  <div className="text-2xl mb-2">{item.icon}</div>
                  <div className="text-sm font-medium leading-relaxed">{item.text}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto p-6">

        {/* Upload Table */}
        <Card className="p-6 mb-6">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6">Module File Management</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="text-left py-4 px-4 text-gray-700 font-semibold">Module</th>
                  <th className="text-left py-4 px-4 text-gray-700 font-semibold">File Location</th>
                  <th className="text-left py-4 px-4 text-gray-700 font-semibold">Upload / Update</th>
                </tr>
              </thead>
              <tbody>
                {modules.map((module) => (
                  <tr key={module.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-4 px-4 text-gray-900 font-medium">{module.title}</td>
                    <td className="py-4 px-4 text-gray-700">
                      {module.file ? (
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-green-600" />
                          <span className="text-green-700">{module.fileName}</span>
                        </div>
                      ) : (
                        <span className="text-gray-500">{module.fileName}</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <div className="relative">
                        <Input
                          type="file"
                          accept=".ppt,.pptx,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(module.id, file);
                          }}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex items-center gap-2 hover:bg-blue-50"
                        >
                          <Upload className="h-4 w-4" />
                          Upload / Update
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-center mt-8">
            <Button
              onClick={handleSubmit}
              size="lg"
              className="px-12 py-3"
            >
              Submit All Changes
            </Button>
          </div>
        </Card>

        {/* Delete Module Section */}
        <Card className="p-6 mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Delete Module Content</h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <label className="text-gray-700 font-medium">Select Module Number:</label>
              <Select value={deleteModule} onValueChange={setDeleteModule}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Choose" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      Module {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={handleDelete}
              disabled={!deleteModule}
              variant="destructive"
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </Card>

        {/* Contact Section */}
        <Contact />
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="p-6 bg-white max-w-md w-full mx-4 shadow-xl">
            <h3 className="text-xl font-semibold mb-4 text-gray-900">
              Confirm Delete
            </h3>
            <p className="mb-6 text-gray-700">
              Are you sure you want to delete Module {deleteModule}? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                onClick={() => setShowDeleteConfirm(false)}
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmDelete}
                variant="destructive"
              >
                Yes, Delete
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}