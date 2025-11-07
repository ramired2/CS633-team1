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
import 'toastr/build/toastr.min.css';
import toastr from "toastr";

// ADDED
import axios from 'axios';
import Spinner from './ui/Spinner';
//

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
  const [whichDelete, setDelete] = useState()
  const [showExamples, setShowExamples] = useState(false)

  useEffect(() => {
    getIds()  // api call for description
  }, [deleteModule, whichDelete]);

  // TOASTR
  const success = (choice) => {
      toastr.options = {
      "closeButton": true,
      "debug": false,
      "newestOnTop": false,
      "progressBar": false,
      "positionClass": "toast-top-right",
      "preventDuplicates": false,
      "onclick": null,
      "showDuration": "300",
      "hideDuration": "1000",
      "timeOut": "5000",
      "extendedTimeOut": "1000",
      "showEasing": "swing",
      "hideEasing": "linear",
      "showMethod": "fadeIn",
      "hideMethod": "fadeOut"
    }
    if(choice == 'file'){
      toastr["success"]("File was successfully uploaded!", "Success")
    }
    else if (choice == 'desc') {
      toastr["success"]("Description was successfully updated!", "Success")
    }
    else if (choice == "delete") {
      toastr["success"]("Module was successfully deleted!", "Success")
    }
  }

  const err = () => {
      toastr.options = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": false,
        "progressBar": false,
        "positionClass": "toast-top-right",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "0",
        "extendedTimeOut": "0",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeIn"
      }
  }
  /***************************************************************************
   * 
   * Desc:  Checks what modules are missing from the six and sets it to 
   *        missingIds that contains a list of numbers
   * 
   * Params:  info --> list of modules from DB
   * 
   * Return:
   * 
  ***************************************************************************/
  const checkAll = (info) => {
    // list of mods from DB
    const have = info.map((num) => (Number(num['modName'].substr(-1))))
    console.log(have)

    // determines which are missing from total mods
    setMissingIds(totMods.filter(id => !have.includes(id)))

  }

  /***************************************************************************
   * 
   * Desc:    Gets the IDs and module names from modules in DB and sets it in
   *          modIds
   * 
   * Params:  NONE
   * 
   * Return:  NONE
   * 
  ***************************************************************************/
  const getIds = async() => {
  const res = await axios (`${backend}/getModNameID`, {
      headers: { 'Content-Type': 'application/json'},
      method: "GET",
      })
      .then(res => {
          console.log(res.data)

          setModIds(res.data)
          checkAll(res.data);

      })
      .catch(err => {
          console.log(err)
          err()
          toastr["error"]("There was an error loading modules for deletion. The backend may have run out of memory on Renders free plan. Try again later.", "Retriving Data")
          setLoading(false)
        });
  };

  /***************************************************************************
   * 
   * Desc:    Deletes the module from the DB given its db id ('_id')
   * 
   * Params:  NONE
   * 
   * Return:  NONE
   * 
  ***************************************************************************/
    const deletingMod = async() => {
      const res = await axios (`${backend}/deleteMod/${deleteModule}`, {
        headers: { 'Content-Type': 'application/json'},
        method: "DELETE",
        })
        .then(res => {
            console.log(`deleting ${deleteModule}`)
            setLoading(false)
            setModIds(res.data)
            success('delete')
        })
        .catch(err => {
            console.log(err)
            err()
            toastr["error"]("There was an error deleting the module. The backend may have run out of memory on Renders free plan. Try again later.", "Deleting Module")
            setLoading(false)
          });
  };

  
  /***************************************************************************
   * 
   * Desc:    Edits the description of the course desc using the desc _id
   * 
   * Params:  NONE
   * 
   * Return:  NONE
   * 
  ***************************************************************************/
  const editDesc = async() => {
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
            setLoading(false)
            success('desc')
          }
          else {
            err()
            toastr["error"]("There was an error updating the description. The backend may have run out of memory on Renders free plan. Try again later.", "Updating Description")
          }
          

      })
      .catch(err => {
          console.log(err)
          err()
          toastr["error"]("There was an error updating the description. The backend may have run out of memory on Renders free plan. Try again later.", "Updating Description")
          setLoading(false)});
  };

  /***************************************************************************
   * 
   * Desc:  Determines if correct ppt types and file name conventions are being 
   *        followed and updates list of modules that will be affected. Adds
   *        current file added to totFiles which solely holds a list of files 
   *        type File that will be uploaded
   * 
   * Params: moduleID --> id of the module [1,6]
   *         file --> the file attempting to add
   * 
   * Return: NONE
   * 
  ***************************************************************************/
  const handleFileUpload = (moduleId: number, file: File) => {
    // Check if file is PPT
    const isPPT = file.name.toLowerCase().endsWith('.ppt') || 
                  file.name.toLowerCase().endsWith('.pptx') ||
                  file.type.includes('presentation');
    
    if (!isPPT) {
      toastr["warning"]("Please upload only PPT or PPTX files", "Check File Type")
      
      return;
    }
    console.log("FILE NAME")
    console.log(file.name)
    var checkName = file.name
    // remove ppt/x
    if (checkName.endsWith(".pptx")){
      // removes .pptx from file name (5) and with mod # 6
      // Patterns of Course QM Module 6.pptx --> Patterns of Course QM Module 6 --> Patterns of Course QM Module 
      checkName = checkName.substring(0, checkName.length - 6)
    }
    else {
      // remove .ppt from file name (4) and with mod # 6
      // Patterns of Course QM Module 6.ppt --> Patterns of Course QM Module 6 --> Patterns of Course QM Module 
      checkName = checkName.substring(0, checkName.length - 5)
    }
    // check ends with "Module "
    if(!checkName.endsWith("Module ")) {
      toastr["warning"]("File name did not end in <br />'Module #'. Fix the file name and try again.", "Check File Name")
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

  /***************************************************************************
   * 
   * Desc:    Will uploads the files to the DB 
   *  
   * Params:  formData --> type FromData that holds the files to be uploaded
   * 
   * Return:  NONE
   * 
  ***************************************************************************/
  const addMod = async(formData) => {
    let addModLink = `${backend}/upload`
    
    await axios.post(addModLink, formData)
    .then(result => {
      console.log(result.data);

      if(result.status != 200) {
        toastr["error"]("The server received a file that did not follow naming conventions. Check your file names and try again.", "Error")
      }

      // if the file did not send for some reason server sends err msg "empty"
      if(result.data.includes('empty')) {
        err()
        toastr["error"]("The server did not receive the file(s). Ensure naming conventions are followed and try again.", "Error")
      }

      setLoading(false)
      getIds();         // will update the list of modules currently in DB
      success('file')
    })
    .catch(err => {console.log(err);
       setLoading(false)
       err()
       toastr["error"]("Error uploading file(s). This may be because of incorrectly named file(s) or the backend may have run out of memory on Renders free plan. Please check file names. If issue persists after fixing file names, then this is a Render memory issue and simply try uploading again later.", "Error")
      });
  }
  // 

  /***************************************************************************
   * 
   * Desc:    Clears out the module file management on admin screen and
   *          adds the list of modules to be uploaded to a FormData that will
   *          be used to send the files to the backend
   * 
   * Params:
   * 
   * Return:
   * 
  ***************************************************************************/
  const handleSubmit = () => {
    const hasUploadedFile = modules.some(module => module.file !== null);
    
    if (!hasUploadedFile) {
      toastr["warning"]("Please upload at least one PPT file before submitting", "Check your file extension")
      return;
    }

    // ADDED api call to send to flask
    const formData = new FormData();
    totFiles?.forEach((indivFile) => formData.append('file', indivFile))

    setLoading(true)

    // api call to add modules
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
  };

  /***************************************************************************
     * 
     * Desc:    var deleteModule holds the _id (id from DB) and need to be able
     *          to deferentiate the ID in terms of module 1--6 for verifyDelete.
     *          will determine the ID to return from the _id
     * 
     * Params:  NONE
     * 
     * Return:  NONE
     * 
  ***************************************************************************/
  const whichID = () => {
    console.log(deleteModule)
    setDelete(modIds.filter(mod => mod["_id"] == deleteModule))
    console.log(whichDelete)
  }

  /***************************************************************************
   * 
   * Desc:    Will determine which ID to delete in terms of 1--6 and sets
   *          show verify delete message to user
   * 
   * Params:  NONE
   * 
   * Return:  NONE
   * 
  ***************************************************************************/
  const handleDelete = () => {
      if (!deleteModule) {
        toastr["warning"]("Please select a module to delete", "Select a Module")
        return;
      }

      whichID();
      
      setShowDeleteConfirm(true);
    };

  /***************************************************************************
   * 
   * Desc:    Will ask user to verify wich to delete said module. and calls api
   *          to delete it. 
   * 
   * Params:  NONE
   * 
   * Return:  NONE
   * 
  ***************************************************************************/
  const confirmDelete = () => {
    console.log(`DELETING: ${deleteModule}`)
    console.log(`DELETING: ${whichDelete}`)

    setLoading(true)
    const moduleNum = parseInt(deleteModule);
    deletingMod()
    setDeleteModule('');
    setShowDeleteConfirm(false);
  };

  /***************************************************************************
   * 
   * Desc:    Will call api to update the course description
   * 
   * Params:  NONE
   * 
   * Return:  NONE
   * 
  ***************************************************************************/
  const handleUpdateAbout = () => {
    if (!tempAboutText.trim()) {
      toastr["warning"]("Please enter text for the About section", "About is empty")
      return;
    }
    onUpdateAbout(tempAboutText);
    //ADDED
      setLoading(true)
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
        <div className='greyOut'>{loading? <Spinner />: ""}</div>

        {/* Upload Table */}
        <Card className="p-6 mb-6">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6">Module File Management</h3>
          <div className='namingList'>
            <h4 className="text-[#2D2926] mb-1">Please ensure each file name ends with "Module #".</h4>
            <p className='text-sm text-[#2D2926] sm-margin'>Some examples below fit the naming criteria</p>
            <ul className='naming'>
              <li className='text-sm'>Patterns of Course QM Module 1</li>
              <li className='text-sm'>Patterns of Course QM Module 3</li>
              <li className='text-sm'>Patterns of Course QM Module 5</li>
              </ul>
            <ul className='naming'>
              <li className='text-sm'>Patterns of Course QM Module 2</li>
              <li className='text-sm'>Patterns of Course QM Module 4</li>
              <li className='text-sm'>Patterns of Course QM Module 6</li>
            </ul>
          </div>
          
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
              className="px-12 py-3 hover:bg-[#AA0000] bg-[#CC0000]"
            >
              Submit All Changes
            </Button>
          </div>
        </Card>

        {/* Delete Module Section */}
        <Card className="p-6 mb-6 mt-6">
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
              className="flex items-center gap-2 hover:bg-[#AA0000]"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </Card>

        {/* Update About - CS 633 Section */}
        <Card className="p-6 mb-6 border-2 border-[#E6E6E7] mt-6">
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
              Are you sure you want to delete module {whichDelete.map(mod => {return mod['modName'].substr(-1)})}? This action cannot be undone.
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