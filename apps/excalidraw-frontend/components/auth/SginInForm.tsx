'use client'
import React, { useState } from 'react';
import Link from 'next/Link';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { BACKEND_URL } from "@/config";
import { auth } from "@/app/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { GoogleBtn } from './GoogleBtn';
import { useRouter } from 'next/navigation';
//import { useToast } from "@/hooks/use-toast";

const signin = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user.getIdToken();
};


const SignInForm = () => {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{email?: string; password?: string}>({});

  //const { toast } = useToast();
  
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset errors
    setErrors({});
    
    const newErrors: {email?: string; password?: string} = {};
    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Please enter a valid email";
    if (!password) newErrors.password = "Password is required";
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsLoading(true);
    
    try {
      const token = await signin(email, password);
      
      const res = await fetch(`${BACKEND_URL}/signin`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      const data = await res.json();
      const id = await auth.currentUser?.getIdToken();
      if(res.ok){
        console.log(data);
        router.push('/dashboard');
      }
    } catch (err) {
      console.error("Signin failed", err);
    } finally {
      setIsLoading(false);
    }
   
  };

  return (
    <div className="text-white">
      <form onSubmit={handleSignIn} className="space-y-4">
        <div className="space-y-1">
          <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Mail className="h-5 w-5 text-gray-500" />
            </div>
            <input 
              id="email"
              type="email" 
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`pl-10 w-full py-2 bg-[#1a1a1a] border rounded-lg focus:outline-none transition-colors ${
                errors.email 
                  ? "border-red-500 focus:border-red-600" 
                  : "border-gray-700 focus:border-purple-500"
              } text-white placeholder-gray-500`}
            />
            {errors.email && (
              <div className="flex items-center mt-1 text-sm text-red-500 gap-1">
                <AlertCircle className="h-4 w-4" />
                <span>{errors.email}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
            <Link href="/forgot-password" className="text-sm text-purple-400 hover:text-purple-300 hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Lock className="h-5 w-5 text-gray-500" />
            </div>
            <input 
              id="password"
              type={showPassword ? "text" : "password"} 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`pl-10 w-full py-2 bg-[#1a1a1a] border rounded-lg focus:outline-none transition-colors ${
                errors.password 
                  ? "border-red-500 focus:border-red-600" 
                  : "border-gray-700 focus:border-purple-500"
              } text-white placeholder-gray-500`}
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-300 cursor-pointer"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {errors.password && (
              <div className="flex items-center mt-1 text-sm text-red-500 gap-1">
                <AlertCircle className="h-4 w-4" />
                <span>{errors.password}</span>
              </div>
            )}
          </div>
        </div>
        
        <button 
          type="submit" 
          className={`w-full py-2 px-4 rounded-lg text-white font-medium transition-colors 
            ${isLoading ? "bg-purple-800 cursor-not-allowed" : "bg-purple-700 hover:bg-purple-800"}`}
          disabled={isLoading}
          style={{
            transition: 'all 0.2s ease'
          }}
        >
          {isLoading ? (
            <div className="flex justify-center items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing in...
            </div>
          ) : "Sign in"}
        </button>
      </form>
      
      <div className="flex items-center my-6">
        <div className="flex-grow h-px bg-gray-800"></div>
        <span className="px-4 text-sm text-gray-500">or continue with</span>
        <div className="flex-grow h-px bg-gray-800"></div>
      </div>
      
      <GoogleBtn />
      
      <p className="text-center mt-8 text-gray-400">
        Don't have an account?{' '}
        <Link href="/signup" className="text-purple-400 hover:text-purple-300 hover:underline font-medium">
          Sign up
        </Link>
      </p>
      
      <style jsx global>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>

    </div>
  );
};

export default SignInForm;