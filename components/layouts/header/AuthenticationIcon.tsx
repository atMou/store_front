import { AppRoutes } from "@/constants";
import { useLogoutMutation } from "@/features/auth/api";
import { useAuth } from "@/hooks/state";
import useToast from "@/hooks/ui/useToast";
import { TryAsync } from "@/shared";
import { Button } from "@/shared/ui";
import { UserIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

function AuthenticationIcon() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();

  const handleLoginClick = () => {
    router.push(AppRoutes.LOGIN);
  };

  const handleLogoutClick = async () => {
    if (isLoggingOut) return;

    const { error } = await TryAsync(
      async () => await logout({ email: user?.email || "" }).unwrap()
    );

    if (!error) {
      showToast({ message: "Logged out successfully", type: "success" });
      router.push(AppRoutes.HOME);
    } else {
      showToast({
        message: error.errors?.join(", ") || "Logout failed. Please try again.",
        type: "error",
      });
      router.push(AppRoutes.HOME);
    }
  };

  return (
    <div className="relative inline-block z-100 group">
      <Button
        variant="plain"
        className="
          px-4 text-gray-800 flex items-center 
          border-transparent border-2 border-b-0
          group-hover:border-gray-800
          group-hover:bg-white
          relative z-70
          transition-colors duration-100 rounded-none
        "
      >
        <UserIcon strokeWidth={1} size={20} />
        <span className="sr-only">User Account</span>
      </Button>

      <div className="absolute right-0  w-[350px] bg-white border-2 border-black  opacity-0  pointer-events-none group-hover:opacity-100 -translate-y-0.5 group-hover:pointer-events-auto transition-all duration-100 ease-in-out z-50">
        {!isAuthenticated && (
          <div className="p-3">
            <Button
              variant="plain"
              className="bg-neutral-900 rounded-none text-accent-foreground  w-full text-center"
              onClick={handleLoginClick}
            >
              Sign in
            </Button>
            <div className="text-sm mt-2">
              <Link
                className="font-bold underline  underline-offset-2 hover:opacity-70"
                href={AppRoutes.REGISTER}
              >
                Register
              </Link>
              <span>- in a Snap</span>
            </div>
          </div>
        )}

        <ul
          className="flex flex-col  border-gray-800   space-y-1 text-sm text-gray-600"
          role="none"
        >
          {[
            { label: "Your account", to: AppRoutes.USER },
            { label: "Orders", to: AppRoutes.USER_ORDERS },
            { label: "Returned items", to: AppRoutes.USER_ORDERS },
            { label: "Help & FAQ", to: AppRoutes.SUPPORT },
          ].map((item) => (
            <li
              key={item.label}
              className="transition-all duration-100 ease-in-out   hover:bg-gray-200 hover:text-gray-900 active:translate-y-px"
              role="menuitem"
            >
              <Link
                href={item.to}
                className="block w-full px-3 py-2 rounded-md transition-all duration-100"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {isAuthenticated && (
          <div className="border-t border-gray-800 px-3 py-2 text-sm">
            <span className="text-sm">Not {user?.firstName}? </span>
            <button
              onClick={handleLogoutClick}
              disabled={isLoggingOut}
              className="underline underline-offset-2 cursor-pointer hover:opacity-70 font-bold text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoggingOut ? "Signing out..." : "Sign out"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AuthenticationIcon;
