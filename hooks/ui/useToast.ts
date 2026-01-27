import { useAppDispatch } from "@/store";
import { Toast, toastActions } from "@/store/slices/toastSlice";

const useToast = () => {
  const dispatch = useAppDispatch();

  const showToast = (toast: Omit<Toast, "id">) => {
    dispatch(toastActions.addToast({ duration: 5000, ...toast }));
  };

  const dismissToast = (id: string) => {
    dispatch(toastActions.removeToast(id));
  };

  return { showToast, dismissToast };
};

export default useToast;
