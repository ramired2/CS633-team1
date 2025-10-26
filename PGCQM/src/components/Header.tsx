import React from 'react';
import { Button } from './ui/button';
import { GraduationCap, User, LogOut } from 'lucide-react';

interface HeaderProps {
  onNavigate: (page: 'student' | 'login' | 'admin') => void;
  currentPage: 'student' | 'login' | 'admin';
  showLogout?: boolean;
  onLogout?: () => void;
}

export function Header({ onNavigate, currentPage, showLogout, onLogout }: HeaderProps) {
  const backend = 'https://pgcqm-backend.onrender.com'
  const local = "http://localhost:5173/"
  const host = "https://pgcqm.onrender.com/"
  return (
    <header className="bg-white shadow-lg border-b-2 border-[#E6E6E7]">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4 home" onClick={()=>{window.location.href=`${local}`}}>
            <div className="bg-[#CC0000] text-white p-3 rounded-lg shadow-lg">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#2D2926]">PGCQM</h1>
              <p className="text-sm text-[#CC0000] mt-1 font-medium">
                Patterns of a Graduate Course on Quality Management
              </p>
            </div>
          </div>
          <div className="flex gap-3 items-center">
            {/* BTN FOR ABOUT SECTION */}
            <a href="#about"><Button onClick={()=>{if (currentPage === 'admin' || currentPage === 'login') {onNavigate('student')}}}
              className={`px-6 py-2 flex items-center gap-2 transition-all ${
                currentPage === 'student' 
                  ? 'bg-[#CC0000] text-white hover:bg-[#CC0000]' 
                  : 'border-[#CC0000] text-[#CC0000] hover:bg-[#CC0000] hover:text-white white'
              }`}
              >
                About
                </Button>
            </a>
            <Button 
              onClick={() => {onNavigate('student'); console.log("clicked stud"); window.location.href = host;}}
              variant={currentPage === 'student' ? "default" : "outline"}
              className={`px-6 py-2 flex items-center gap-2 transition-all ${
                currentPage === 'student' 
                  ? 'bg-[#CC0000] text-white hover:bg-[#CC0000]' 
                  : 'border-[#CC0000] text-[#CC0000] hover:bg-[#CC0000] hover:text-white'
              }`}
            >
              <User className="h-4 w-4" />
              Student View
            </Button>
            <Button 
              onClick={() => {onNavigate('admin'); console.log("clicked admin"); console.log(currentPage); console.log(window.location.href)}}
              variant={currentPage === 'admin' ? "default" : "outline"}
              className={`px-6 py-2 flex items-center gap-2 transition-all ${
                currentPage === 'admin' || window.location.href == `${host}#about`
                  ? 'bg-[#CC0000] text-white hover:bg-[#CC0000]' 
                  : 'border-[#CC0000] text-[#CC0000] hover:bg-[#CC0000] hover:text-white'
              }`}
            >
              <GraduationCap className="h-4 w-4" />
              Admin View
            </Button>
            {showLogout && onLogout && (
              <Button 
                onClick={onLogout}
                variant="outline"
                className="px-6 py-2 flex items-center gap-2 border-[#2D2926] text-[#2D2926] hover:bg-[#2D2926] hover:text-white transition-all"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}