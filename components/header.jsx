import Image from "next/image";
import Link from "next/link";
import {
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

import React from "react";

import { checkUser } from "@/lib/checkUser";

import {
  Calendar,
  CreditCard,
  ShieldCheck,
  Stethoscope,
  User,
} from "lucide-react";

import { Button } from "./ui/button";
import { checkAndAllocateCredits } from "@/actions/credits";
import { Badge } from "./ui/badge";

const Header = async () => {
  const user = await checkUser();

  if (user?.role === "PATIENT") {
    await checkAndAllocateCredits(user);
  }

  return (
    <header className="fixed top-0 w-full border-b bg-background/80 backdrop-blur-md z-10 supports-backdrop-filter:bg-background/60">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <Image
            src="/logo-single.png"
            alt="Medimeeet Logo"
            width={200}
            height={60}
            className="h-10 w-auto object-contain"
          />
        </Link>

        {/* Right Section */}
        <div className="flex items-center space-x-2">
          {/* ADMIN */}
          {user?.role === "ADMIN" && (
            <>
              {/* Desktop */}
              <Button
                asChild
                variant="outline"
                className="hidden md:inline-flex items-center gap-2"
              >
                <Link href="/admin">
                  <ShieldCheck className="h-4 w-4" />
                  Admin Dashboard
                </Link>
              </Button>

              {/* Mobile */}
              <Button
                asChild
                variant="ghost"
                className="md:hidden w-10 h-10 p-0"
              >
                <Link href="/admin">
                  <ShieldCheck className="h-4 w-4" />
                </Link>
              </Button>
            </>
          )}

          {/* DOCTOR */}
          {user?.role === "DOCTOR" && (
            <>
              {/* Desktop */}
              <Button
                asChild
                variant="outline"
                className="hidden md:inline-flex items-center gap-2"
              >
                <Link href="/doctor">
                  <Stethoscope className="h-4 w-4" />
                  Doctor Dashboard
                </Link>
              </Button>

              {/* Mobile */}
              <Button
                asChild
                variant="ghost"
                className="md:hidden w-10 h-10 p-0"
              >
                <Link href="/doctor">
                  <Stethoscope className="h-4 w-4" />
                </Link>
              </Button>
            </>
          )}

          {/* PATIENT */}
          {user?.role === "PATIENT" && (
            <>
              {/* Desktop */}
              <Button
                asChild
                variant="outline"
                className="hidden md:inline-flex items-center gap-2"
              >
                <Link href="/appointments">
                  <Calendar className="h-4 w-4" />
                  My Appointments
                </Link>
              </Button>

              {/* Mobile */}
              <Button
                asChild
                variant="ghost"
                className="md:hidden w-10 h-10 p-0"
              >
                <Link href="/appointments">
                  <Calendar className="h-4 w-4" />
                </Link>
              </Button>
            </>
          )}

          {/* UNASSIGNED ROLE */}
          <Show when="signed-in">
            {user?.role === "UNASSIGNED" && (
              <>
                {/* Desktop */}
                <Button
                  asChild
                  variant="outline"
                  className="hidden md:inline-flex items-center gap-2"
                >
                  <Link href="/onboarding">
                    <User className="h-4 w-4" />
                    Complete Profile
                  </Link>
                </Button>

                {/* Mobile */}
                <Button
                  asChild
                  variant="ghost"
                  className="md:hidden w-10 h-10 p-0"
                >
                  <Link href="/onboarding">
                    <User className="h-4 w-4" />
                  </Link>
                </Button>
              </>
            )}
          </Show>

          {/* Pricing / Credits */}
          {(!user || user?.role === "PATIENT") && (
            <Link href="/pricing">
              <Badge
                variant="outline"
                className="h-9 bg-emerald-900/20 border-emerald-700/30 px-3 py-1 flex items-center gap-2 cursor-pointer"
              >
                <CreditCard className="h-3.5 w-3.5 text-emerald-400" />

                <span className="text-emerald-400">
                  {user && user?.role === "PATIENT" ? (
                    <>
                      {user?.credits}{" "}
                      <span className="hidden md:inline">
                        Credits
                      </span>
                    </>
                  ) : (
                    <>Pricing</>
                  )}
                </span>
              </Badge>
            </Link>
          )}

          {/* Auth Buttons */}
          <Show when="signed-in">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                  userButtonPopoverCard: "shadow-xl",
                  userPreviewMainIdentifier: "font-semibold",
                },
              }}
              afterSignOutUrl="/"
             />
          </Show>

          <Show when="signed-out">
            <SignInButton />
            <SignUpButton />
          </Show>
        </div>
      </nav>
    </header>
  );
};

export default Header;