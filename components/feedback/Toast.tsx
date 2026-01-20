"use client";
import { AlertTriangle, Check, Info, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { toastActions } from "../../store/slices/toastSlice";

const toastVariants = {
  success: {
    icon: <Check size={18} />,
    bgColor: "bg-green-500",
    borderColor: "border-green-600",
    textColor: "text-white",
  },
  error: {
    icon: <X size={18} />,
    bgColor: "bg-red-500",
    borderColor: "border-red-600",
    textColor: "text-white",
  },
  warning: {
    icon: <AlertTriangle size={18} />,
    bgColor: "bg-amber-500",
    borderColor: "border-amber-600",
    textColor: "text-white",
  },
  info: {
    icon: <Info size={18} />,
    bgColor: "bg-blue-500",
    borderColor: "border-blue-600",
    textColor: "text-white",
  },
};

import type { RootState } from "../../store/store";

type TimeoutMap = { [id: string]: ReturnType<typeof setTimeout> };

const Toast = () => {
  const dispatch = useAppDispatch();
  const toasts = useAppSelector((state: RootState) => state.toasts.toasts);
  const timeoutRefs = useRef<TimeoutMap>({});

  useEffect(() => {
    toasts.forEach((toast) => {
      if (!timeoutRefs.current[toast.id]) {
        const timeoutId = setTimeout(() => {
          dispatch(toastActions.removeToast(toast.id));
          delete timeoutRefs.current[toast.id];
        }, toast.duration ?? 5000);
        timeoutRefs.current[toast.id] = timeoutId;
      }
    });

    return () => {
      Object.values(timeoutRefs.current).forEach((timeout) =>
        clearTimeout(timeout as ReturnType<typeof setTimeout>)
      );
      timeoutRefs.current = {};
    };
  }, [toasts, dispatch]);

  const handleClose = (id: string) => {
    clearTimeout(timeoutRefs.current[id]);
    delete timeoutRefs.current[id];
    dispatch(toastActions.removeToast(id));
  };

  return (
    <div className="fixed top-4 right-4 flex flex-col gap-3 z-100">
      {toasts.map((toast) => {
        const variant = toastVariants[toast.type] || toastVariants.info;
        return (
          <div
            key={toast.id}
            className={`flex items-center gap-3 w-72 p-3 rounded-lg shadow-lg border-l-4 ${variant.borderColor} bg-white backdrop-blur-md animate-slideIn`}
            style={{
              animation: "slideIn 0.3s ease-out forwards",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
            }}
          >
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full ${variant.bgColor} ${variant.textColor}`}
            >
              {variant.icon}
            </div>
            <div className="flex-1 mr-2">
              {toast.title && (
                <p className="font-medium text-gray-800 text-sm">
                  {toast.title}
                </p>
              )}
              <p className="text-gray-600 text-sm">{toast.message}</p>
            </div>
            <button
              onClick={() => handleClose(toast.id)}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
              aria-label="Close toast"
            >
              <X size={16} />
            </button>
          </div>
        );
      })}

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Toast;
