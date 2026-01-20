"use client";
import { AlertTriangle, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { Role, RoleName } from "../../features/auth/types";
import { useAuth } from "../../hooks/state/useAuth";

// Simple gate component that returns null if role not met
interface RoleGateProps {
  children: ReactNode;
  requiredRoles: RoleName[];
  requireAll?: boolean;
}

export const RoleGate: React.FC<RoleGateProps> = ({
  children,
  requiredRoles,
  requireAll = false,
}) => {
  const { user, isLoading } = useAuth();

  if (isLoading || !user) {
    return null;
  }

  const userRoleNames = user.roles?.map((role: Role) => role.name) || [];

  const hasRequiredRoles = requireAll
    ? requiredRoles.every((roleName) => userRoleNames.includes(roleName))
    : requiredRoles.some((roleName) => userRoleNames.includes(roleName));

  if (!hasRequiredRoles) {
    return null;
  }

  return <>{children}</>;
};

interface RoleGuardProps {
  children: ReactNode;
  requiredRoles: RoleName[];
  requireAll?: boolean; // If true, user must have ALL roles. If false, user needs at least one
  fallback?: ReactNode;
  showFallback?: boolean;
}

const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  requiredRoles,
  requireAll = false,
  fallback,
  showFallback = true,
}) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return showFallback ? (
      <div className="flex items-center justify-center p-6 bg-red-50 rounded-lg border border-red-200">
        <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
        <span className="text-red-700 text-sm">Authentication required</span>
      </div>
    ) : null;
  }

  // Check if user has required roles
  const userRoleNames = user.roles?.map((role: Role) => role.name) || [];

  const hasRequiredRoles = requireAll
    ? requiredRoles.every((roleName) => userRoleNames.includes(roleName))
    : requiredRoles.some((roleName) => userRoleNames.includes(roleName));

  if (!hasRequiredRoles) {
    return showFallback
      ? fallback || (
          <div className="flex items-center justify-center p-6 bg-yellow-50 rounded-lg border border-yellow-200">
            <Shield className="w-5 h-5 text-yellow-500 mr-2" />
            <span className="text-yellow-700 text-sm">
              Insufficient role access. Required role
              {requiredRoles.length > 1 ? "s" : ""}: {requiredRoles.join(", ")}
            </span>
          </div>
        )
      : null;
  }

  return <>{children}</>;
};

export default RoleGuard;

// HOC version
interface RoleGuardOptions {
  requiredRoles: RoleName[];
  requireAll?: boolean; // If true, user must have ALL roles. If false, user needs at least one
  fallback?: ReactNode;
  showFallback?: boolean;
  redirectTo?: string;
}

export function withRoleGuard<P extends Record<string, unknown>>(
  Component: React.ComponentType<P>,
  options: RoleGuardOptions
) {
  return function RoleGuardWrapper(props: P) {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const {
      requiredRoles,
      requireAll = false,
      fallback,
      showFallback = true,
      redirectTo = "/login",
    } = options;

    useEffect(() => {
      if (!isLoading && !user && redirectTo) {
        router.push(redirectTo);
      }
    }, [isLoading, user, router, redirectTo]);

    if (isLoading) {
      return (
        <div className="flex items-center justify-center p-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
        </div>
      );
    }

    if (!user) {
      return showFallback ? (
        <div className="flex items-center justify-center p-6 bg-red-50 rounded-lg border border-red-200">
          <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
          <span className="text-red-700 text-sm">Authentication required</span>
        </div>
      ) : null;
    }

    // Check if user has required roles
    const userRoleNames = user.roles?.map((role: Role) => role.name) || [];

    const hasRequiredRoles = requireAll
      ? requiredRoles.every((roleName) => userRoleNames.includes(roleName))
      : requiredRoles.some((roleName) => userRoleNames.includes(roleName));

    if (!hasRequiredRoles) {
      return showFallback
        ? fallback || (
            <div className="flex items-center justify-center p-6 bg-yellow-50 rounded-lg border border-yellow-200">
              <Shield className="w-5 h-5 text-yellow-500 mr-2" />
              <span className="text-yellow-700 text-sm">
                Insufficient role access. Required role
                {requiredRoles.length > 1 ? "s" : ""}:{" "}
                {requiredRoles.join(", ")}
              </span>
            </div>
          )
        : null;
    }

    return <Component {...props} />;
  };
}
