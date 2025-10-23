import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { StudentView } from './components/StudentView';
import { LoginPage } from './components/LoginPage';
import { AdminView } from './components/AdminView';
import PasswordReset from './components/PasswordReset'
import { BrowserRouter as Router,
          Routes,
          Route,  } from 'react-router-dom';

export default function App() {
  const backend = 'https://pgcqm-backend.onrender.com'
  const [currentPage, setCurrentPage] = useState<'student' | 'login' | 'admin' | 'reset'>('student');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

// added/edited
const [aboutText, setAboutText] = useState([])
const [abtTextID, setAabtTextID] = useState('')

   useEffect(() => {
    
    getDesc() // api call for description

  }, [aboutText]);

  /***************************************************************************** 
  * Desc: gets course description and mongoDB ID for course and sets it to 
  *       aboutText and abtTextID respectively 
  * 
  * params: NONE
  * 
  * return NONE 
  * ***************************************************************************/
  const getDesc = async() => {
    const res = await axios (`${backend}/getDesc/`, {
        headers: { 'Content-Type': 'application/json'},
        method: "GET",
        })
        .then(res => {
          // mongoDB saves endline as "\\n" so replaces any "\\n" to "\n" 
          const temp = res.data['desc'].toString().replace(/\\n/gi, '\n');
          // console.log(temp)
          // console.log(res.data)
          setAboutText(temp)
          setAabtTextID(res.data['_id'].toString())

        })
        .catch(err => console.log(err));
  };
//

  const navigateToPage = (page: 'student' | 'login' | 'admin' | 'reset') => {
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

  const handleUpdateAbout = (newText: Object) => {
    setAboutText(newText);
  };

  return (<Router>
    <div className="min-h-screen bg-gray-50">
            
        <Routes>
          <Route path="/resetPassword" element={<PasswordReset onNavigate={navigateToPage} />}/>
        </Routes>

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
                                            abtTextID={abtTextID} // added description ID for admin edits
                                            onUpdateAbout={handleUpdateAbout}
                                          />
          )}
    

      {/* {currentPage === 'student' && (
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
          abtTextID={abtTextID} // added description ID for admin edits
          onUpdateAbout={handleUpdateAbout}
        />
      )} */}
    </div></Router>
  );
}