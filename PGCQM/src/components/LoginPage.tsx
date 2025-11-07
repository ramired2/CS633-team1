import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Contact } from './Contact';
import { Header } from './Header';
import 'toastr/build/toastr.min.css';
import toastr from "toastr";

import axios from 'axios'; // ADDED
import { Link } from 'react-router-dom';

interface LoginPageProps {
  onLogin: () => void;
  onNavigate: (page: 'student' | 'login' | 'admin' | 'reset') => void;
}

export function LoginPage({ onLogin, onNavigate }: LoginPageProps) {
  const backend = 'https://pgcqm-backend.onrender.com'
  const [password, setPassword] = useState('');
  const [bForgot, setBForgot] = useState(false)

  // ADDED
  const [stat, setStat] = useState();
  const [securityQ, setSecurityQ] = useState('');
  const [answer, setAnswer] = useState('')
  useEffect(() => {
      getQ()   // api call for security question
  
  }, []);

  /*****************************************************************************
   * 
   * Desc:    Will check if input password was correct  
   * 
   * Params:  NONE
   * 
   * Return:  200 --> was correct and allows user to log in
   *          300 --> password was incorrect and does not allow user to login
   * 
  *****************************************************************************/
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

  /*****************************************************************************
   * 
   * Desc:    Will get the security question 
   * 
   * Params:  NONE
   * 
   * Return:  NONE
   * 
  *****************************************************************************/
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

  /*****************************************************************************
   * 
   * Desc:    Will check if security question answer was correct 
   * 
   * Params:  NONE
   * 
   * Return:  NONE
   * 
  *****************************************************************************/
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

            if(res.data == 200) {
              toastr["success"]("Security question was correct.", "Answer was Correct")
            }
            else {
              toastr["error"]("Answer was incorrect. If this continues, look at the documentation packet for further instructions.", "Try again")
            }
        })
        .catch(err => console.log(err));
        
  };

  /*****************************************************************************
   * 
   * Desc:    Will handle user login and calls api to double check user is allowed
   *          to login 
   * 
   * Params:  NONE
   * 
   * Return:  NONE
   * 
  *****************************************************************************/
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple mock validation - accept any non-empty credentials
    if (password.trim()) {
      // ADDED
      verifyCredentials();
      //
      
    } else {
      alert('Please enter a Password');
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
                className="w-full py-3 hover:bg-[#302f2d]"
              >
                Login
              </Button>

              <Label htmlFor="forgot" className="text-gray-700 passwordForget underlign forgotText" onClick={()=>{setBForgot(true)}}>Forgot password?</Label>
            </form>
          </Card>
        </div>:
        
        <div className='max-w-md mx-auto px-6'>
                  <div className='p-8 bg-white shadow-lg'>
                    <h3 className="text-2xl font-semibold text-gray-900 text-center mb-8">Answer Question Correctly to Change Password</h3>

                    <p className='mt-6 flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 text-gray-700'>{securityQ['question']}?</p>
                    <Input
                    id="answer"
                    type="answer"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    className="w-full mt-6"
                    placeholder="Enter your response"
                    />
                    {stat != 200? <div className='mt-6 twoBtns'>
                                    <Button className="py-3 w-45p hover:bg-[#302f2d]" onClick={()=>{verifyQ();}}>check</Button>
                                    <Button className="py-3 w-45p hover:bg-[#302f2d]" onClick={()=>{setBForgot(false)}}>cancel</Button>
                                  </div>: ""}
                    {stat == 200? <Link to="/resetPassword"><Button className="py-3 mt-6 hover:bg-[#302f2d]">Go to change password</Button></Link>: ""}
                                  {/* <Button className="py-3 space">Go to change password</Button>} */}
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