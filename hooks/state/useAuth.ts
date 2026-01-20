import { selectAccessToken, selectUser } from "@/features/user/slice";
import { useAppSelector } from "@/store/hooks";

export function useAuth() {
  const user = useAppSelector(selectUser);
  const accessToken = useAppSelector(selectAccessToken);
  // console.log("Access Token in useAuth:", accessToken);
  return {
    user,
    isAuthenticated: !!user && !!accessToken,
    isLoading: false,
  };
}
