import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Contact } from './Contact';
import { Header } from './Header';
import { Upload, FileText, Trash2, Edit } from 'lucide-react';

import axios from 'axios'; // ADDED

interface AdminViewProps {
  onNavigate: (page: 'student' | 'login' | 'admin') => void;
  onLogout: () => void;
  aboutText: string;
  onUpdateAbout: (text: string) => void;
}

interface ModuleData {
  id: number;
  title: string;
  file: File | null;
  fileName: string;
}

// interface filesAdd {
//     file: File | null;
// }

export function AdminView({ onNavigate, onLogout, aboutText, abtTextID, onUpdateAbout }: AdminViewProps) {
  const backend = 'https://pgcqm-backend.onrender.com'
  const [modules, setModules] = useState<File[]>([
    { id: 1, title: 'Module 1', file: null, fileName: 'File Location' },
    { id: 2, title: 'Module 2', file: null, fileName: 'File Location' },
    { id: 3, title: 'Module 3', file: null, fileName: 'File Location' },
    { id: 4, title: 'Module 4', file: null, fileName: 'File Location' },
    { id: 5, title: 'Module 5', file: null, fileName: 'File Location' },
    { id: 6, title: 'Module 6', file: null, fileName: 'File Location' },
  ]);
  
  const [deleteModule, setDeleteModule] = useState<string>('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tempAboutText, setTempAboutText] = useState(aboutText);

  // added
  const [modIds, setModIds] = useState([])
  const [totMods, setTotMods] = useState([1,2,3,4,5,6])
  const [missingIds, setMissingIds] = useState<Number[]>()
  let [totFiles, setTotFiles] = useState<File[]>();
  const [stat, setStat] = useState(0)

     useEffect(() => {
      // api call for description
      getIds()
    }, [deleteModule, ]);

    const checkAll = (info) => {
      const have = info.map((num) => (Number(num['modName'].substr(-1))))
      console.log(have)

      setMissingIds(totMods.filter(id => !have.includes(id)))
      console.log(missingIds)
      console.log(missingIds?.length)

    }

    const getIds = async() => {
    // let temp = "module1"
    const res = await axios (`${backend}/getModNameID`, {
        headers: { 'Content-Type': 'application/json'},
        method: "GET",
        })
        .then(res => {
            console.log(res.data)

            setModIds(res.data)
            checkAll(res.data);

        })
        .catch(err => console.log(err));
  };

      const deletingMod = async() => {
    const res = await axios (`${backend}/deleteMod/${deleteModule}`, {
        headers: { 'Content-Type': 'application/json'},
        method: "DELETE",
        })
        .then(res => {
            console.log(`deleting ${deleteModule}`)
            console.log(res.data)
            setModIds(res.data)
        })
        .catch(err => console.log(err));
  };

  
    const editDesc = async() => {
    // let temp = "module1"
    const res = await axios (`${backend}/editDesc`, {
        method:'PUT',
        headers: { 'Content-Type': 'application/json'},
        params: {
          id: abtTextID,
          description: tempAboutText
        },
        })
        .then(res => {
            console.log(res.data)
            if (res.data == '200'){
              setStat(200)
              alert('About - CS 633 section updated successfully!');
            }
            else {
              alert('There was an error updating. Please try again later.');
            }
            

        })
        .catch(err => console.log(err));
  };

  //

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

    setTotFiles([...totFiles??[], file])
    console.log(totFiles)
    
  };

  // ADDED
  const addMod = async(formData) => {
    // formData.forEach((value, key) => console.log(key, value))

    let addModLink = `${backend}/upload`
    
    await axios.post(addModLink, formData)
    .then(result => {
      console.log(result.data); 

      // if the file did not send for some reason server sends err msg "empty"
      if(result.data.includes('empty')) {
        alert('Error loading file. Try again later.')
      }

      setLoading(false)
      getIds();

      // reset prev data

    })
    .catch(err => console.log(err));
  }
  // 

  const handleSubmit = () => {
    const hasUploadedFile = modules.some(module => module.file !== null);
    
    if (!hasUploadedFile) {
      alert('Please upload at least one PPT file before submitting');
      return;
    }

    // ADDED api call to send to flask
    const formData = new FormData();
    totFiles?.forEach((indivFile) => formData.append('file', indivFile))
  
    console.log(totFiles)
    console.log(formData)

    // formData.forEach((value, key) => console.log(key, value))
    setLoading(true)

    // api call
    // /upload/<mod>
    addMod(formData);

    setTotFiles([]) // clear out files to b submitted
    setModules([
    { id: 1, title: 'Module 1', file: null, fileName: 'File Location' },
    { id: 2, title: 'Module 2', file: null, fileName: 'File Location' },
    { id: 3, title: 'Module 3', file: null, fileName: 'File Location' },
    { id: 4, title: 'Module 4', file: null, fileName: 'File Location' },
    { id: 5, title: 'Module 5', file: null, fileName: 'File Location' },
    { id: 6, title: 'Module 6', file: null, fileName: 'File Location' },
    ])

    
    // have to renew rest of data
    
    // alert('Files submitted successfully!');
  };

  const handleDelete = () => {
    if (!deleteModule) {
      alert('Please select a module to delete');
      return;
    }
    
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    console.log(deleteModule)
    const moduleNum = parseInt(deleteModule);
    deletingMod()
    setDeleteModule('');
    setShowDeleteConfirm(false);
    // alert(`Module ${tempDelete} file deleted successfully!`);
  };

  const handleUpdateAbout = () => {
    if (!tempAboutText.trim()) {
      alert('Please enter text for the About section');
      return;
    }
    onUpdateAbout(tempAboutText);
    //ADDED
      // api call to update db 
      editDesc();
    //
    
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header onNavigate={onNavigate} currentPage="admin" showLogout onLogout={onLogout} />

      {/* PPT Slide Sequence Section */}
      <section className="bg-[#E6E6E7] py-6 border-b">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-4">
            <h3 className="text-lg font-bold text-[#2D2926] mb-1">Sequence of the PPT Slide</h3>
            <p className="text-sm text-[#2D2926]">Standard structure for each module presentation</p>
            <p className="text-sm text-[#2D2926]">Ensure files end with 'Module #.ppt/pptx'</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { number: "1", text: "A pictorial illustrating a key concept", icon: "🎨" },
              { number: "2", text: "Summary of essential notions", icon: "📝" },
              { number: "3", text: "Guiding principles", icon: "🎯" },
              { number: "4", text: "Common pitfalls (\"do-nots\")", icon: "⚠️" },
              { number: "5", text: "Quiz", icon: "📋" },
              { number: "6", text: "Frequently asked questions raised by students", icon: "❓" }
            ].map((item, index) => (
              <Card key={index} className="p-3 bg-white border border-[#2D2926] hover:shadow-md transition-all hover:bg-[#CC0000] hover:text-white">
                <div className="text-center">
                  <div className="bg-[#CC0000] text-white w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs mx-auto mb-2">
                    {item.number}
                  </div>
                  <div className="text-lg mb-1">{item.icon}</div>
                  <div className="text-xs font-medium leading-snug">{item.text}</div>
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
          {loading == true? <h6>Uploading file(s). Please wait before refreshing or leaving page.</h6>:""}
          {(missingIds?.length > 0 && missingIds?.length != undefined) || (missingIds?.length > 0)? <h4 className='err'>Missing deck for module(s): {missingIds.toString()}</h4>:""}
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
                  {modIds.map((num) => (
                    <SelectItem key={num['_id']} value={num['_id'].toString()}>
                      Module {num['modName'].substr(-1) || "loading"}
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

        {/* Update About - CS 633 Section */}
        <Card className="p-6 mb-6 border-2 border-[#2D2926]">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xl font-semibold text-gray-900">Update About - CS 633</h3>
            <Badge variant="outline" className="text-xs">Database Content</Badge>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Update the about description that appears on the Student View page. 
            This content is stored in the database and can be edited anytime.
          </p>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                About Text Content
              </label>
              <Textarea
                value={tempAboutText}
                onChange={(e) => setTempAboutText(e.target.value)}
                placeholder="Enter the About - CS 633 description text...&#10;&#10;Tip: Use double line breaks to separate paragraphs.&#10;List items will be automatically formatted if they appear in a multi-line section."
                className="min-h-[200px] resize-y font-mono text-sm"
              />
              <p className="text-xs text-gray-500 mt-2">
                Current length: {tempAboutText.length} characters
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={handleUpdateAbout}
                className="flex items-center gap-2 bg-[#CC0000] hover:bg-[#AA0000]"
              >
                <Edit className="h-4 w-4" />
                Save to Database
              </Button>
              <Button
                onClick={() => setTempAboutText(aboutText)}
                variant="outline"
                className="flex items-center gap-2"
              >
                Reset Changes
              </Button>
            </div>
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
              Are you sure you want to delete this module? This action cannot be undone.
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