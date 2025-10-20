import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Contact } from './Contact';
import { Header } from './Header';

import axios from 'axios'; // ADDED

interface LoginPageProps {
  onNavigate: (page: 'student' | 'login' | 'admin' | 'reset') => void;
}

function PasswordReset({onNavigate }: LoginPageProps) {
  const backend = 'https://pgcqm-backend.onrender.com'
  const [password, setPassword] = useState('');
  const host = "http://localhost:3000/"

  // ADDED
  const [stat, setStat] = useState('');

  const changePassword = async() => {
        const res = await axios (`${backend}/editAdmin`, {
            headers: { 'Content-Type': 'application/json'},
            method: "GET",
            params: {
            password: password
            },
            })
            .then(res => {
                console.log(res.data)
                setStat(res.data)
            })
            .catch(err => console.log(err));

            setTimeout(()=>{window.location.href = host}, 5000)
    };
  

  return (
    <div className="min-h-screen bg-gray-50 resetPasswordContainer">
      {/* Header */}
      {/* <Header onNavigate={onNavigate} currentPage="login" /> */}

      {/* password reset Form Section */}
      <section className="py-16">
        <div className="max-w-md mx-auto px-6">
          <Card className="p-8 bg-white shadow-lg">
            <h3 className="text-2xl font-semibold text-gray-900 text-center mb-8">
              Password Reset
            </h3>
            {/* <form onSubmit={changePassword} className="space-y-6"> */}
            {stat == String(200)?   <p className='text-center'>Successfuly reset! Please wait 5 seconds while we redirect you to the homepage.</p>:
                                    <div>
                                        <div className="space-y-2">
                                            <Label htmlFor="password" className="text-gray-700">Enter new password</Label>
                                            <Input
                                            id="password"
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full"
                                            placeholder="Enter your new password"
                                            />
                                        </div>

                                        <Button
                                            type="submit"
                                            className="w-full py-3"
                                            onClick={()=>{changePassword();}}>
                                            Change password
                                        </Button>
                                    </div>
            }       
            {/* </form> */}
          </Card>
        </div>
      </section>

      {/* Contact Section */}
      <div className="max-w-7xl mx-auto px-6 pb-6">
        <Contact />
      </div>
    </div>
  );
}

export default PasswordReset;