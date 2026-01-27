import { LayoutDashboard } from "lucide-react";
import React from "react";
import { useRouter } from "next/navigation";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/tooltip";
import { WithPermission } from "@/components/HOC";

function DashboradIcon() {
  const router = useRouter();

  return (
    <Tooltip>
      <TooltipTrigger
        onClick={() => router.push("/dashboard")}
        className="w-5 h-5 shrink-0"
      >
        <LayoutDashboard className="w-5 h-5 cursor-pointer text-gray-600 hover:text-gray-800 transition-colors duration-200" />
      </TooltipTrigger>
      <TooltipContent className="rounded-none">
        <p>Dashboard</p>
      </TooltipContent>
    </Tooltip>
  );
}

export default WithPermission(DashboradIcon, ["ViewDashboard"]);
