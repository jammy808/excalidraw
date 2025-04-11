"use client"

import { BACKEND_URL } from "@/config";
import { auth } from "../../app/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";

const provider = new GoogleAuthProvider();

export const GoogleBtn = () => {

  const router = useRouter();

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      const res = await fetch(`${BACKEND_URL}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      const data = await res.json();
      if(res.ok){
        console.log(data);
        router.push('/dashboard');
      }
    } catch (err) {
      console.error("Google sign-in error:", err);
    }
  };

  return (
    <button 
        type="button" 
        onClick={handleGoogleSignIn}
        className="w-full flex items-center justify-center gap-3 py-2 px-4 border border-gray-700 rounded-lg bg-[#1a1a1a] hover:bg-[#222222] transition-colors"
        style={{
          transition: 'all 0.2s ease'
        }}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.4867 9.20063C17.4867 8.56875 17.43 8.01563 17.325 7.47188H9V10.8984H13.8442C13.635 12.0141 13.0009 12.9187 12.0106 13.5225V15.7734H14.8959C16.5942 14.2359 17.4867 11.9437 17.4867 9.20063Z" fill="#4285F4"/>
          <path d="M9 18C11.43 18 13.4675 17.1941 14.896 15.7734L12.0106 13.5225C11.2134 14.0566 10.2042 14.3906 9 14.3906C6.65625 14.3906 4.67812 12.7875 3.96375 10.575H0.975V12.9C2.39062 15.9609 5.4825 18 9 18Z" fill="#34A853"/>
          <path d="M3.96375 10.575C3.78 10.0688 3.67875 9.5325 3.67875 9C3.67875 8.4675 3.78 7.93125 3.96375 7.425V5.1H0.975C0.354375 6.30938 0 7.6575 0 9C0 10.3425 0.354375 11.6906 0.975 12.9L3.96375 10.575Z" fill="#FBBC05"/>
          <path d="M9 3.60938C10.3219 3.60938 11.5084 4.09688 12.4403 4.98375L15.0217 2.40188C13.4626 0.945 11.4253 0 9 0C5.4825 0 2.39062 2.03906 0.975 5.1L3.96375 7.425C4.67812 5.2125 6.65625 3.60938 9 3.60938Z" fill="#EA4335"/>
        </svg>
        <span className="text-gray-300">Google</span>
      </button>
  );
};
