"use client";

import { AppRoutes } from "@/constants";
import NotFoundIcon from "@/public/assets/icons/NotFound.svg";
import { Button } from "@/shared/ui";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

function NotFoundPage() {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center text-gray-700">
      <Image
        src={NotFoundIcon}
        alt="Page not found"
        className="w-32 h-32 mb-4 text-gray-400"
      />

      <h1 className="text-2xl font-bold mb-2">Page Not Found</h1>

      <p className="text-sm text-gray-500">
        The page you are looking for does not exist.
      </p>

      <div className="flex gap-4 mt-4">
        <Button onClick={handleGoBack} className="px-4 py-2 rounded-3xl">
          Go Back
        </Button>
        <Link href={AppRoutes.HOME}>
          <Button className="px-4 py-2 rounded-3xl">Go Home</Button>
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;
