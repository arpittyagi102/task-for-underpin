"use client";

import React, { useState, FormEvent } from 'react';
import { Berkshire_Swash } from "next/font/google";
import { showToast } from '@/utils/toast';
import { useRouter } from 'next/navigation';
import { login } from '@/services/auth';

const berkshire_swash = Berkshire_Swash({ subsets: ["latin"], weight: ["400"]});

export default function Home(): React.JSX.Element {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [inProgress, setInProgress] = useState(false);

    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const router = useRouter();

    async function handleLogin(e: FormEvent<HTMLFormElement>): Promise<void> {
        setInProgress(true);
        e.preventDefault();
        if (!email) {
            setEmailError(true);
            showToast('Email is required', 'error');
            setInProgress(false);
            return;
        }
        if (!password) {
            setPasswordError(true);
            showToast('Password is required', 'error');
            setInProgress(false);
            return;
        }
        
        const response = await login(email, password);
        
        if (!response.success) {
            showToast(response.message || 'Something went wrong', 'error');

        } else {
            showToast('Sign up successful! Redirecting...', 'success');
            localStorage.setItem('token', response.token);
            router.push('/');
        }
        
        setInProgress(false);
    }

    return (
        <div className="min-h-screen flex items-stretch text-white">
            <div className="lg:flex grow hidden bg-gray-500 bg-no-repeat bg-cover relative items-center backdrop-blur" style={{backgroundImage: `url(/login-bg.jpg)`}}>
                <div className="absolute bg-black opacity-60 inset-0 z-0"></div>
                <div className="w-full px-24 z-10">
                    <h1 className="text-5xl font-bold text-left tracking-wide">Keep it special</h1>
                    <p className="text-3xl my-4">Find the comfort here that you deserve</p>
                </div>
                <div className="bottom-0 absolute p-4 text-center right-0 left-0 flex justify-center space-x-4">
                    {/* Social icons */}
                </div>
            </div>
            <div className="w-full lg:max-w-[600px] flex items-center justify-center text-center px-auto lg:px-36 z-0 bg-white text-black">
                <div className="py-6 z-20 w-[400px]">
                    <h1 className={`logo my-6 text-5xl ${berkshire_swash.className}`}>
                        Project_Name
                    </h1>

                    <form className="w-full px-4 lg:px-0" onSubmit={handleLogin}>
                        <div className="pb-2 pt-4">
                            <input className={`block w-full p-4 text-lg rounded-xl bg-neutral-300 focus:outline-none ${emailError ? 'border-2 border-red-500' : ''}`} type="email" name="email" id="email" placeholder="Email" value={email} onChange={(e) => {setEmail(e.target.value); e.target.style.border = "none"}}/>
                        </div>
                        <div className="pb-2 pt-4">
                            <input className={`block w-full p-4 text-lg rounded-xl bg-neutral-300 focus:outline-none ${passwordError ? 'border-2 border-red-500' : ''}`} type="password" name="password" id="password" placeholder="Password" value={password} onChange={(e) => {setPassword(e.target.value);  e.target.style.border = "none"}}/>
                        </div>

                        <div className="px-4 pb-2 pt-4 text-white flex justify-center">
                            <button type="submit" disabled={inProgress} className="w-full p-3 text-lg rounded-full bg-indigo-500 hover:bg-indigo-600 flex justify-center focus:outline-none">
                                {inProgress ? (
                                    <span className='block w-min'>
                                        <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="28px" height="28px" viewBox="0 0 24 24" fill="none" stroke="#FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                                            <g id="SVGRepo_iconCarrier"> 
                                                <path d="M21 12a9 9 0 11-6.219-8.56"></path> 
                                            </g>
                                        </svg>
                                    </span>
                                ) : (
                                    <span>LOG IN</span>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
