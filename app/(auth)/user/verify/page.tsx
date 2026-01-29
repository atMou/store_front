"use client";

import { Button, Input } from "@/shared/ui";
import Link from "next/link";
import { useState } from "react";

function EmailVerificationPage() {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-12">
      <div className="w-full max-w-sm">
        {}
        <div className="flex justify-center mb-10">
          <div className="w-14 h-14 bg-orange-500 rounded-full flex items-center justify-center shadow-sm overflow-hidden">
            <div className="w-0 h-0 border-t-10 border-t-transparent border-l-16 border-l-white border-b-10 border-b-transparent ml-0.5 animate-[slideInSpin_1s_ease-in-out]"></div>
          </div>
        </div>

        {}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Verify your email
          </h1>
          <p className="text-sm text-gray-600">
            We sent a verification code to your email
          </p>
        </div>

        {}
        <div className="space-y-5">
          {}
          <div>
            <label
              htmlFor="code"
              className={`${
                isFocused
                  ? "bg-black text-white border-2 border-black"
                  : "text-gray-900"
              } text-xs font-medium border border-b-0 p-0.5 `}
            >
              Verification code
            </label>
            <Input
              id="code"
              type="text"
              placeholder={`${isFocused ? "" : "Enter verification code"}`}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className={`w-full h-11 px-3 text-sm border border-black rounded-none bg-transparent! -mt-0.5`}
            />
          </div>

          {}
          <Button
            className={`w-full h-11 bg-black  hover:text-black hover:bg-gray-300  hover:border hover:border-black  font-bold`}
          >
            Verify Email
          </Button>

          {}
          <p className="text-xs text-center text-gray-600 pt-1">
            Didn&apos;t receive the code?{" "}
            <Link
              href="#"
              className="text-gray-900 font-medium hover:underline"
            >
              Resend code
            </Link>
          </p>

          {}
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-white text-gray-500 font-medium">
                OR
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full h-11 flex items-center justify-center gap-2.5 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="text-gray-900 text-sm font-medium">
                Continue with Google
              </span>
            </Button>
          </div>

          {}
          <div className="flex justify-center gap-6 text-xs text-gray-600 pt-6">
            <Link href="#" className="hover:text-gray-900 hover:underline">
              Legal notice
            </Link>
            <Link href="#" className="hover:text-gray-900 hover:underline">
              Privacy notice
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmailVerificationPage;
