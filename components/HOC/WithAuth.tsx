import { useAuth } from "@/hooks/state/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import CustomLoader from "../feedback/CustomLoader";

export function withAuth<P extends Record<string, unknown>>(
  Component: React.ComponentType<P>
) {
  return function AuthWrapper(props: P) {
    const { isAuthenticated, isLoading } = useAuth();

    const router = useRouter();

    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        router.push("/login");
      }
    }, [isLoading, isAuthenticated, router]);

    if (isLoading) return <CustomLoader />;

    return <Component {...props} />;
  };
}
