import { selectAccessToken, selectUser } from "@/features/user/slice";
import { useAppSelector } from "@/store/hooks";

export function useAuth() {
  const user = useAppSelector(selectUser);
  const accessToken = useAppSelector(selectAccessToken);

  return {
    user,
    isAuthenticated: !!user && !!accessToken,
    isLoading: false,
  };
}
