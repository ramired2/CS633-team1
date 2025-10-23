import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Contact } from './Contact';
import { Header } from './Header';

import axios from 'axios'; // ADDED
import { Link } from 'react-router-dom';

interface LoginPageProps {
  onLogin: () => void;
  onNavigate: (page: 'student' | 'login' | 'admin' | 'reset') => void;
}

export function LoginPage({ onLogin, onNavigate }: LoginPageProps) {
  const backend = 'https://pgcqm-backend.onrender.com'
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [bForgot, setBForgot] = useState(false)

  // ADDED
  const [stat, setStat] = useState();
  const [securityQ, setSecurityQ] = useState('');
  const [answer, setAnswer] = useState('')
  useEffect(() => {
      getQ()   // api call for getting module imgs
  
    }, []);

  const verifyCredentials = async() => {
    const res = await axios (`${backend}/getAdmin/${password.trim()}`, {
        headers: { 'Content-Type': 'application/json'},
        method: "GET",
        })
        .then(res => {
            console.log(res.data)
            setStat(res.data)

            if(res.data == '200'){
              console.log("stat was: ", res.data)
              onLogin();
            }
            else {
              console.log("stat was: ", res.data)
              alert('Password was incorrect. Please try again.');
            }
        })
        .catch(err => console.log(err));
  };

  const getQ = async() => {
    const res = await axios (`${backend}/getSecureQ`, {
        headers: { 'Content-Type': 'application/json'},
        method: "GET",
        })
        .then(res => {
            console.log(res.data[0])
            setSecurityQ(res.data[0])
        })
        .catch(err => console.log(err));
        
  };

  const verifyQ = async() => {
    const res = await axios (`${backend}/verify`, {
        headers: { 'Content-Type': 'application/json'},
        method: "GET",
        params: {
          answer: answer,
          id: securityQ['_id']
        },
        })
        .then(res => {
            console.log(res.data)
            setStat(res.data)
        })
        .catch(err => console.log(err));
        
  };
    //

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple mock validation - accept any non-empty credentials
    if (userId.trim() && password.trim()) {
      // ADDED
      verifyCredentials();
      //
      
    } else {
      alert('Please enter both User ID and Password');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header onNavigate={onNavigate} currentPage="login" />

      {/* Login Form Section */}
      <section className="py-16">
        {bForgot == false?<div className="max-w-md mx-auto px-6">
          <Card className="p-8 bg-white shadow-lg">
            <h3 className="text-2xl font-semibold text-gray-900 text-center mb-8">
              Admin Login
            </h3>
            <form onSubmit={handleLogin} className="space-y-6">

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full"
                  placeholder="Enter your password"
                />
              </div>

              <Button
                type="submit"
                className="w-full py-3"
              >
                Login
              </Button>

              <Label htmlFor="forgot" className="text-gray-700 passwordForget underlign forgotText" onClick={()=>{setBForgot(true)}}>Forgot password?</Label>
            </form>
          </Card>
        </div>:
        
        <div className='max-w-md mx-auto px-6'>
                  <div className='p-8 bg-white shadow-lg'>
                    <p className='text-2xl font-semibold text-gray-900 text-center mb-8'>Answer question correctly to change password.</p>

                    <p className='forgotText text-gray-700'>{securityQ['question']}?</p>
                    <Input
                    id="answer"
                    type="answer"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    className="w-full"
                    placeholder="Enter your response"
                    />
                    {stat == 400? <div>
                                    <p>Answer was incorrect. Try again or look at your code documentation packet for further instructions.</p>
                                  </div>:""}
                    {stat != 200? <div>
                                    <Button className="py-3 space topMargin" onClick={()=>{verifyQ();}}>check</Button>
                                    <Button className="py-3 space topMargin" onClick={()=>{setBForgot(false)}}>cancel</Button>
                                  </div>: ""}
                    {stat == 200? <Link to="/resetPassword"><Button className="py-3 space topMargin">Go to change password</Button></Link>: ""}
                                  {/* <Button className="py-3 space topMargin">Go to change password</Button>} */}
                  </div>
                </div>}
      </section>

      {/* Contact Section */}
      <div className="max-w-7xl mx-auto px-6 pb-6">
        <Contact />
      </div>
    </div>
  );
}