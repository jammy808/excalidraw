"use client"

import React from 'react';
import { Brush } from 'lucide-react';
import Link from 'next/Link';

type AuthLayoutProps = {
  children: React.ReactNode;
  title: string;
  description: string;
};

const AuthLayout = ({ children, title, description }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#121212]">
      {/* Left section - Branding */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-purple-900 to-indigo-950 p-12 flex-col justify-between">
        <div>
          <Link href="/" className="flex items-center gap-2 text-white">
            <Brush size={32} />
            <span className="text-2xl font-bold">DoodleSync</span>
          </Link>
          
          <div className="mt-24" style={{
            animation: 'fadeIn 0.5s ease-out forwards'
          }}>
            <h1 className="text-4xl font-bold text-white mb-6">
              Create together in real-time
            </h1>
            <p className="text-xl text-white/80">
              Join thousands of artists and teams collaborating on the most intuitive drawing platform.
            </p>
          </div>
        </div>
        
        <div className="text-white/60 text-sm">
          © {new Date().getFullYear()} DoodleSync. All rights reserved.
        </div>
      </div>
      
      {/* Right section - Auth form */}
      <div className="w-full md:w-1/2 flex justify-center items-center p-6 bg-[#121212]">
        <div className="w-full max-w-md" style={{
          animation: 'fadeIn 0.5s ease-out forwards'
        }}>
          {/* Mobile logo */}
          <div className="flex justify-center md:hidden mb-8">
            <Link href="/" className="flex items-center gap-2 text-purple-400">
              <Brush size={28} />
              <span className="text-xl font-bold">DoodleSync</span>
            </Link>
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
          <p className="text-gray-400 mb-8">{description}</p>
          
          {children}
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default AuthLayout;