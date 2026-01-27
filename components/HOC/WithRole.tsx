"use client";
import { Role, RoleName } from "../../features/auth/types";
import { useAuth } from "../../hooks/state/useAuth";

// HOC that returns null if user doesn't have required roles
export function WithRole<P extends Record<string, unknown>>(
  Component: React.ComponentType<P>,
  requiredRoles: RoleName[],
  requireAll = false
) {
  return function RoleWrapper(props: P) {
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

    return <Component {...props} />;
  };
}
