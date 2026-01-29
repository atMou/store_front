"use client";

import { AppRoutes } from "@/constants";
import { Button } from "@/shared/ui";
import { ArrowRight, Gift, PartyPopper, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

function CompletedStep() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center space-y-8 w-full max-w-md p-6 text-center">
        {}
        <div className="relative">
          {}
          <div className="w-24 h-24 bg-black rounded-full flex items-center justify-center animate-bounce">
            <PartyPopper className="w-12 h-12 text-white" />
          </div>

          {}
          <Sparkles className="w-8 h-8 text-yellow-400 absolute -top-2 -right-2 animate-pulse" />
          <Sparkles className="w-6 h-6 text-yellow-400 absolute -bottom-1 -left-3 animate-pulse delay-150" />
          <Gift className="w-7 h-7 text-orange-500 absolute top-0 -left-4 animate-bounce delay-300" />
        </div>

        {}
        <div className="space-y-3">
          <h1 className="text-4xl font-bold text-black">Congratulations! 🎉</h1>
          <p className="text-xl font-semibold text-gray-800">
            Welcome on Board!
          </p>
        </div>

        {}
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            Your account has been successfully created.
          </p>
          <p className="text-sm text-gray-600">
            Get ready to explore amazing products and exclusive deals!
          </p>
        </div>

        {}
        <div className="w-full bg-linear-to-r from-orange-50 to-yellow-50 border-2 border-dashed border-orange-300 rounded-lg p-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Gift className="w-5 h-5 text-orange-600" />
            <span className="text-sm font-bold text-orange-600">
              WELCOME GIFT
            </span>
          </div>
          <p className="text-xs text-gray-600 mb-3">
            Use this code on your first purchase
          </p>
          <div className="bg-white border border-orange-300 rounded px-4 py-2">
            <code className="text-lg font-bold text-orange-600">WELCOME10</code>
          </div>
          <p className="text-xs text-gray-500 mt-2">10% off your first order</p>
        </div>

        {}
        <Button
          onClick={() => router.push(AppRoutes.HOME)}
          className="w-full h-11 bg-black hover:bg-gray-800 text-white font-bold rounded-none transition-colors group"
        >
          Start Shopping
          <ArrowRight className="ml-2 transition-transform duration-300 ease-in-out group-hover:translate-x-2" />
        </Button>

        {}
        <div className="text-4xl animate-pulse">🎊 🎈 🎉 🎁 ✨</div>
      </div>
    </div>
  );
}

export default CompletedStep;
