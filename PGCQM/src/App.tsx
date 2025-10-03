import React, { useState } from 'react';
import { StudentView } from './components/StudentView';
import { LoginPage } from './components/LoginPage';
import { AdminView } from './components/AdminView';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'student' | 'login' | 'admin'>('student');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // About text - In production, this would be fetched from database
  // Admin can update this content through the Admin View
  const [aboutText, setAboutText] = useState(
    `This site serves two main purposes:
For students who have already taken the class, it offers a chance to refresh their memory and explore new perspectives on the material.
For those considering the course, it provides a preview—a "trailer," much like a three-minute glimpse that sparks interest before a three-hour movie.

The aim is to highlight the underlying patterns of the course design. Modules are not assembled at random; each follows a deliberate structure that balances consistency with variation. Every module contains six parts:
A pictorial illustrating a key concept
A concise text summary of essential notions
A set of guiding principles
Common pitfalls ("do-nots")
A quiz
Frequently asked questions raised by students—sometimes surprising even the professor, who wonders, "What are they really asking?"

Each of these elements plays an important role, and the absence of even one can create a noticeable gap.
We invite you to explore the design and rhythm of the course through this site.`
  );

  const navigateToPage = (page: 'student' | 'login' | 'admin') => {
    if (page === 'admin' && !isLoggedIn) {
      setCurrentPage('login');
    } else {
      setCurrentPage(page);
    }
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentPage('admin');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage('student');
  };

  const handleUpdateAbout = (newText: string) => {
    setAboutText(newText);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {currentPage === 'student' && (
        <StudentView onNavigate={navigateToPage} aboutText={aboutText} />
      )}
      {currentPage === 'login' && (
        <LoginPage onLogin={handleLogin} onNavigate={navigateToPage} />
      )}
      {currentPage === 'admin' && (
        <AdminView 
          onNavigate={navigateToPage} 
          onLogout={handleLogout} 
          aboutText={aboutText}
          onUpdateAbout={handleUpdateAbout}
        />
      )}
    </div>
  );
}