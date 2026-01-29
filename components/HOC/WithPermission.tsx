"use client";
import { PermissionName } from "../../features/auth/types";
import { useAuth } from "../../hooks/state/useAuth";

export function WithPermission<P extends Record<string, unknown>>(
  Component: React.ComponentType<P>,
  requiredPermissions: PermissionName[],
  requireAll = false
) {
  return function PermissionWrapper(props: P) {
    const { user, isLoading } = useAuth();

    if (isLoading || !user) {
      return null;
    }

    const userPermissions = user.permissions || [];

    const hasRequiredPermissions = requireAll
      ? requiredPermissions.every((permissionName) =>
          userPermissions.includes(permissionName)
        )
      : requiredPermissions.some((permissionName) =>
          userPermissions.includes(permissionName)
        );

    if (!hasRequiredPermissions) {
      return null;
    }

    return <Component {...props} />;
  };
}
