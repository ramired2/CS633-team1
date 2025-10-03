import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Contact } from './Contact';
import { Header } from './Header';

interface LoginPageProps {
  onLogin: () => void;
  onNavigate: (page: 'student' | 'login' | 'admin') => void;
}

export function LoginPage({ onLogin, onNavigate }: LoginPageProps) {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple mock validation - accept any non-empty credentials
    if (userId.trim() && password.trim()) {
      onLogin();
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
        <div className="max-w-md mx-auto px-6">
          <Card className="p-8 bg-white shadow-lg">
            <h3 className="text-2xl font-semibold text-gray-900 text-center mb-8">
              Admin Login
            </h3>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="userId" className="text-gray-700">User ID</Label>
                <Input
                  id="userId"
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="w-full"
                  placeholder="Enter your user ID"
                />
              </div>

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
            </form>
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