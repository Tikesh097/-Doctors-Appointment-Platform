import Image from 'next/image';
import Link from 'next/link';
import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import React from 'react'
import { checkUser } from '@/lib/checkUser';

import { Calendar, ShieldCheck, Stethoscope, User } from 'lucide-react';
import { Button } from './ui/button';

const Header = async () => {
    const user = await checkUser();

    return (
        <header className='fixed top-0 w-full border-b bg-background/80 backdrop-blur-md z-10 supports-backdrop-filter:bg-background/60'>
            <nav className='container mx-auto px-4 h-16 flex items-center justify-between'>
                <Link href="/">
                    <Image
                        src="/logo-single.png"
                        alt="Medimeeet Logo"
                        width={200}
                        height={60}
                        className="h-10 w-auto object-contain"
                    />
                </Link>

                <div className='flex items-center space-x-2'>

                    {/*ADMIN */}
                    {user?.role === "ADMIN" && (
                        <Link href="/admin">
                            <Button
                                variant="outline"
                                className="hidden md:inline-flex items-center gap-2"
                            >
                                <ShieldCheck className="h-4 w-4" />
                                Admin Dashboard
                            </Button>

                            <Button
                                variant="ghost"
                                className="md:hidden w-10 h-10 p-0"
                            >
                                <ShieldCheck className="h-4 w-4" />
                            </Button>
                        </Link>
                    )}

                    {/*DOCTOR */}
                    {user?.role === "DOCTOR" && (
                        <Link href="/doctor">
                            <Button
                                variant="outline"
                                className="hidden md:inline-flex items-center gap-2"
                            >
                                <Stethoscope className="h-4 w-4" />
                                Doctor Dashboard
                            </Button>

                            <Button
                                variant="ghost"
                                className="md:hidden w-10 h-10 p-0"
                            >
                                <Stethoscope className="h-4 w-4" />
                            </Button>
                        </Link>
                    )}

                    {/*PATIENT */}
                    {user?.role === "PATIENT" && (
                        <Link href="/appointments">
                            <Button
                                variant="outline"
                                className="hidden md:inline-flex items-center gap-2"
                            >
                                <Calendar className="h-4 w-4" />
                                My Appointments
                            </Button>

                            <Button
                                variant="ghost"
                                className="md:hidden w-10 h-10 p-0"
                            >
                                <Calendar className="h-4 w-4" />
                            </Button>
                        </Link>
                    )}

                    {/* UNASSIGNED ROLE  */}
                    <Show when="signed-in">
                        {user?.role === "UNASSIGNED" && (
                            <Link href="/onboarding">
                                {/* Desktop */}
                                <Button
                                    variant="outline"
                                    className="hidden md:inline-flex items-center gap-2"
                                >
                                    <User className="h-4 w-4" />
                                    Complete Profile
                                </Button>

                                {/* Mobile */}
                                <Button
                                    variant="ghost"
                                    className="md:hidden w-10 h-10 p-0"
                                >
                                    <User className="h-4 w-4" />
                                </Button>
                            </Link>
                        )}
                    </Show>

                    {/* Sign-in / Signout logic  */}
                    <Show when="signed-in">
                        <UserButton />
                    </Show>

                    <Show when="signed-out">
                        <SignInButton />
                        <SignUpButton />
                    </Show>

                </div>
            </nav>
        </header>
    );
}

export default Header;