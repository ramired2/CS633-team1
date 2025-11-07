import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Contact } from './Contact';
import { Header } from './Header';

import 'toastr/build/toastr.min.css';
import toastr from "toastr";

import axios from 'axios'; // ADDED

interface LoginPageProps {
  onNavigate: (page: 'student' | 'login' | 'admin' | 'reset') => void;
}

function PasswordReset({onNavigate }: LoginPageProps) {
  const backend = 'https://pgcqm-backend.onrender.com'
  const [password, setPassword] = useState('');
  const host = "https://pgcqm.onrender.com/"

  // ADDED
  const [stat, setStat] = useState('');

  /*****************************************************************************
   * 
   * Desc:    API call to change old password to new password and redirects user
   *          to main page after 5 seconds
   * 
   * Params:  NONE
   * 
   * Return:  NONE
   * 
  *****************************************************************************/
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

            if(res.data == 200) {
              toastr["success"]("Password was successfully changed. You will be redirected to the student view within five seconds.", "Success")
              setTimeout(()=>{window.location.href = '/'}, 5000)
            }
            else {
              toastr["error"]("The backend may have run out of memory on Renders free plan. Wait a few minutes before re-attempting to reset password.", "Server Issue")
            }

        })
        .catch(err => {
          console.log(err)
          toastr["error"]("The backend may have run out of memory on Renders free plan. Wait a few minutes before attempting to reset password.", "Server Issue")
        });
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
            {stat == String(200)?   <p className='text-center flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 text-gray-700'>Successfuly reset! Please wait 5 seconds while we redirect you to the homepage.</p>:
                                    <div>
                                        <div className="space-y-2">
                                            <Label htmlFor="password" className="text-gray-700">Change Password</Label>
                                            <Input
                                            id="password"
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full border-input mt-6"
                                            placeholder="Enter your new password"
                                            />
                                        </div>

                                        <Button
                                            type="submit"
                                            className="w-full py-3 mt-6 hover:bg-[#302f2d]"
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
      {/* <div className="max-w-7xl mx-auto px-6 pb-6">
        <Contact />
      </div> */}
    </div>
  );
}

export default PasswordReset;