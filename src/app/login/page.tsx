'use client';
import { useState } from 'react';
import Image from 'next/image';
import login from '../loginImage.png';
import logo from '../icon2.png';
import { useRouter } from 'next/navigation';
import { Camera } from 'lucide-react';
import LoginButton from '@/components/loginButton/loginButtons';
import { FaEye, FaEyeSlash } from "react-icons/fa";
export default function Login() {
    const router = useRouter();
    const [phone, setPhone] = useState('');
    // const [register, setRegister] = useState('');
    const [start, setStart] = useState('');
    const [password, setPassword] = useState('');
    const [step, setStep] = useState<'phone' | 'otp' | 'register' | 'start'>('phone');
    const [show, setShow] = useState(false);
    const handlePhoneSubmit = () => setStep('otp');
    const handleOtpSubmit = () => setStep('register');
    const handleRegisterSubmit = () => setStep('start');
    const handleStartSubmit = () => router.push('/country');
    const handleEdit = () => setStep('phone');
    return (
        <div className="flex flex-col md:flex-row min-h-screen">
            <div className="w-full md:w-3/5 h-64 md:h-screen relative">
                <Image
                    src={login}
                    alt="Login Preview"
                    fill
                    style={{ objectFit: 'cover' }}
                    priority
                />
                <div className="absolute inset-0 bg-black bg-opacity-60 z-10" />
            </div>

            <div className="w-full md:w-2/5 flex items-center justify-center bg-white px-4 py-10">
                <div className="w-full max-w-md">
                    {/* <Image
                        src={logo}
                        alt="Login Preview"
                        style={{
                            width: '50px',
                        }}
                    /> */}
                    <div className="w-6 h-6 bg-yellow-400 mb-4" />
                    {step === 'phone' && (
                        <>
                            <h2 className="text-center text-xl font-semibold mb-2">Instant booking in a few clicks</h2>
                            <p className="text-center text-sm text-gray-500 mb-4">
                                Get offers, agent chat & trip updates.
                            </p>
                            <input
                                type="tel"
                                placeholder="Phone Number"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-200 rounded-xl mb-4 focus:outline-none "
                            />

                            <p className="text-xs text-gray-500 mb-4">New user’s OTP will be sent to your WhatsApp.</p>
                            <div className="flex justify-center items-center bg-gray-50">
                                <LoginButton onClick={handlePhoneSubmit}>Sign In/Sign Up</LoginButton>
                            </div>
                            <p className="text-[10px] text-gray-400 mt-6 text-center">
                                By continuing, you agree with our{' '}
                                <a href="#" className="underline">Privacy Policy</a> and{' '}
                                <a href="#" className="underline">Terms and Conditions</a>.
                            </p>
                        </>
                    )}
                    {step === 'otp' && (
                        <>
                            <h2 className="text-center text-xl font-semibold mb-2">Instant booking in a few clicks</h2>
                            <p className="text-center text-sm text-gray-500 mb-4">Get offers, agent chat & trip updates.</p>
                            <div className="relative w-full">
                                <input
                                    type={show ? "text" : "password"}
                                    placeholder="Enter Your Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl mb-4 focus:outline-none"
                                />
                                <span
                                    onClick={() => setShow(!show)}
                                    className="absolute right-3 top-1/2 top-[40%] transform -translate-y-1/2 cursor-pointer"
                                >
                                    {show ? (
                                        <FaEyeSlash size={20} style={{ color: "#B0B0B0" }} />
                                    ) : (
                                        <FaEye size={20} style={{ color: "#B0B0B0" }} />
                                    )}
                                </span>
                            </div>
                            <p className="text-xs text-gray-500 mb-4">Forgot my password!</p>

                            <div className="flex justify-center items-center bg-gray-50">
                                <LoginButton onClick={handleOtpSubmit}>Sign In</LoginButton>
                            </div>
                        </>
                    )}
                    {step === 'register' && (
                        <>
                            <h2 className="text-center text-xl font-semibold mb-2">Instant booking in a few clicks</h2>
                            <p className="text-center text-sm text-gray-500 mb-4">Get offers, agent chat & trip updates.</p>
                            <p className="text-center text-xs text-gray-500 mb-4">
                                We dropped your OTP on Whatsapp <a className="underline ml-1 cursor-pointer" onClick={handleEdit}>Edit Number</a>
                            </p>
                            <div className="flex justify-between mb-4 gap-2">
                                {[...Array(4)].map((_, i) => (
                                    <input
                                        key={i}
                                        type={show ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none"
                                    />
                                ))}
                            </div>
                            <span className="text-sm mb-4 block mt-2">Send Again</span>
                            <div className="relative w-full">
                                <input
                                    type={show ? 'text' : 'password'}
                                    placeholder="Set up a password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl mb-4 focus:outline-none"
                                />
                                <span
                                    onClick={() => setShow(!show)}
                                    className="absolute right-3 top-1/2 top-[40%] transform -translate-y-1/2 cursor-pointer"
                                >
                                    {show ? (
                                        <FaEyeSlash size={20} style={{ color: "#B0B0B0" }} />
                                    ) : (
                                        <FaEye size={20} style={{ color: "#B0B0B0" }} />
                                    )}
                                </span>
                            </div>
                            <p className="text-xs text-gray-500 mb-4">Enter a password of at least 4 characters long</p>
                            <div className="flex justify-center items-center bg-gray-50">
                                <LoginButton onClick={handleRegisterSubmit}>Register</LoginButton>
                            </div>
                        </>
                    )}
                    {step === 'start' && (
                        <>
                            <h2 className="text-center text-xl font-semibold mb-2">Welcome to Ride.Rent</h2>
                            <p className="text-center text-sm text-gray-500 mb-4">
                                Let's ride in style, time to set up your profile.
                            </p>
                            <div className="flex items-center justify-center flex-col mb-4">
                                <div className="w-24 h-24 border-2 border-gray-300 rounded-xl flex items-center justify-center mb-2">
                                    <Camera className="text-gray-400" size={32} />
                                </div>
                                <p className="text-xs text-gray-400">Optional</p>
                            </div>
                            <input
                                type="text"
                                placeholder="Enter Your Name"
                                value={start}
                                onChange={(e) => setStart(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-200 rounded-xl mb-4 focus:outline-none"
                            />
                            <div className="flex justify-center items-center">
                                <LoginButton onClick={handleStartSubmit}> Start Booking</LoginButton>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
