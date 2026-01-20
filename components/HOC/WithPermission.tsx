"use client";
import { AlertTriangle, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import {
  PermissionName,
  Role,
  RoleCode,
  RoleName,
} from "../../features/auth/types";
import { useAuth } from "../../hooks/state/useAuth";

// Simple gate component that returns null if permission not met
interface PermissionGateProps {
  children: ReactNode;
  requiredPermissions: PermissionName[];
}

export const PermissionGate: React.FC<PermissionGateProps> = ({
  children,
  requiredPermissions,
}) => {
  const { user, isLoading } = useAuth();

  if (isLoading || !user) {
    return null;
  }

  const hasPermission = requiredPermissions.some((permissionName) =>
    user.permissions?.some((p: string) => p === permissionName)
  );

  if (!hasPermission) {
    return null;
  }

  return <>{children}</>;
};

interface PermissionGuardProps {
  children: ReactNode;
  requiredPermissions: PermissionName[];
  targetUserId?: string;
  targetUserRole?: RoleName;
  fallback?: ReactNode;
  showFallback?: boolean;
}

const PermissionGuard: React.FC<PermissionGuardProps> = ({
  children,
  requiredPermissions,
  targetUserId,
  targetUserRole,
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

  // Check if user is trying to modify themselves (optional check)
  if (targetUserId && user.id === targetUserId) {
    return showFallback
      ? fallback || (
          <div className="flex items-center justify-center p-6 bg-orange-50 rounded-lg border border-orange-200">
            <Shield className="w-5 h-5 text-orange-500 mr-2" />
            <span className="text-orange-700 text-sm">
              You cannot modify your own account from this interface
            </span>
          </div>
        )
      : null;
  }

  if (targetUserRole) {
    const getRoleHierarchy = (roleName: RoleName): number => {
      return RoleCode[roleName];
    };

    const currentUserHighestRole =
      user.roles?.reduce((highest: number, role: Role) => {
        const roleLevel = getRoleHierarchy(role.name as RoleName);
        return roleLevel > highest ? roleLevel : highest;
      }, 0) || 0;

    const targetUserHierarchy = getRoleHierarchy(targetUserRole);

    if (currentUserHighestRole <= targetUserHierarchy) {
      return showFallback
        ? fallback || (
            <div className="flex items-center justify-center p-6 bg-yellow-50 rounded-lg border border-yellow-200">
              <Shield className="w-5 h-5 text-yellow-500 mr-2" />
              <span className="text-yellow-700 text-sm">
                Cannot modify users with equal or higher privileges
              </span>
            </div>
          )
        : null;
    }
  }

  // Check if user has required permissions
  const hasPermission = requiredPermissions.some((permissionName) =>
    user.permissions?.some((p: string) => p === permissionName)
  );

  if (!hasPermission) {
    return showFallback
      ? fallback || (
          <div className="flex items-center justify-center p-6 bg-yellow-50 rounded-lg border border-yellow-200">
            <Shield className="w-5 h-5 text-yellow-500 mr-2" />
            <span className="text-yellow-700 text-sm">
              Insufficient permissions. Required permissions:{" "}
              {requiredPermissions.join(", ")}
            </span>
          </div>
        )
      : null;
  }

  return <>{children}</>;
};

export default PermissionGuard;

// HOC version
interface PermissionGuardOptions {
  requiredPermissions: PermissionName[];
  targetUserId?: string;
  targetUserRole?: RoleName;
  fallback?: ReactNode;
  showFallback?: boolean;
  redirectTo?: string;
}

export function WithPermissionGuard<P extends Record<string, unknown>>(
  Component: React.ComponentType<P>,
  options: PermissionGuardOptions
) {
  return function PermissionGuardWrapper(props: P) {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const {
      requiredPermissions,
      targetUserId,
      targetUserRole,
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

    // Check if user is trying to modify themselves (optional check)
    if (targetUserId && user.id === targetUserId) {
      return showFallback
        ? fallback || (
            <div className="flex items-center justify-center p-6 bg-orange-50 rounded-lg border border-orange-200">
              <Shield className="w-5 h-5 text-orange-500 mr-2" />
              <span className="text-orange-700 text-sm">
                You cannot modify your own account from this interface
              </span>
            </div>
          )
        : null;
    }

    // Role hierarchy check: Admin > Moderator > Support > Seller > Customer > Default
    if (targetUserRole) {
      const getRoleHierarchy = (roleName: RoleName): number => {
        return RoleCode[roleName];
      };

      const currentUserHighestRole =
        user.roles?.reduce((highest: number, role: Role) => {
          const roleLevel = getRoleHierarchy(role.name as RoleName);
          return roleLevel > highest ? roleLevel : highest;
        }, 0) || 0;

      const targetUserHierarchy = getRoleHierarchy(targetUserRole);

      if (currentUserHighestRole <= targetUserHierarchy) {
        return showFallback
          ? fallback || (
              <div className="flex items-center justify-center p-6 bg-yellow-50 rounded-lg border border-yellow-200">
                <Shield className="w-5 h-5 text-yellow-500 mr-2" />
                <span className="text-yellow-700 text-sm">
                  Cannot modify users with equal or higher privileges
                </span>
              </div>
            )
          : null;
      }
    }

    // Check if user has required permissions
    const hasPermission = requiredPermissions.some((permissionName) =>
      user.permissions?.some((p: string) => p === permissionName)
    );

    if (!hasPermission) {
      return showFallback
        ? fallback || (
            <div className="flex items-center justify-center p-6 bg-yellow-50 rounded-lg border border-yellow-200">
              <Shield className="w-5 h-5 text-yellow-500 mr-2" />
              <span className="text-yellow-700 text-sm">
                Insufficient permissions. Required permissions:{" "}
                {requiredPermissions.join(", ")}
              </span>
            </div>
          )
        : null;
    }

    return <Component {...props} />;
  };
}
