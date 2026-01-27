export type LoginFormData = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export type RegisterFormData = {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  age?: number;
  password?: string;
  passwordConfirm?: string;
  city?: string;
  street?: string;
  postalCode?: number;
  houseNumber?: number;
  extraDetails?: string;
  gender?: "male" | "female" | "other";
  rememberMe?: boolean;
  code?: string;
  step: FormStepsType;
  profileImage?: File;
};

export const FormSteps = {
  CREDENTIALS: 1,
  PROFILE: 2,
  VERIFICATION: 3,
  COMPLETED: 4,
} as const;

export type FormStepsType = (typeof FormSteps)[keyof typeof FormSteps];

export const AuthProviders = {
  GOOGLE: "GOOGLE",
  LOCAL: "LOCAL",
} as const;

export type AuthProvidersType =
  (typeof AuthProviders)[keyof typeof AuthProviders];

export const AuthMethod = {
  EMAIL: "EMAIL",
  PHONE: "PHONE",
} as const;
export type AuthMethodType = (typeof AuthMethod)[keyof typeof AuthMethod];

export const LOCAL_STORAGE_USER_KEY = "user";
export const LOCAL_STORAGE_REFRESH_TOKEM_KEY = "refreshToken";
export const LOCAL_STORAGE_ACCESS_TOKEM_KEY = "accessToken";

export interface RegisterRequest {
  email: string;
  phone?: string | null;
  image?: File | null;
  firstName: string;
  lastName: string;
  age?: number | null;
  password: string;
  gender?: string | null;
  city: string;
  street: string;
  postalCode: number;
  houseNumber: number;
  extraDetails?: string | null;
}
export type RegisterResponse = {
  email?: string;
  phone?: string;
  provider: AuthProvidersType;
};

export type VerificationCodeRequest = {
  email: string;
  code: string;
};

// Permission enum matching backend
export enum PermissionCode {
  BrowseProducts = 1,
  AddToCart = 2,
  PlaceOrder = 3,
  CancelOrder = 4,
  WriteReview = 5,
  ViewOrderHistory = 6,
  CreateProduct = 7,
  EditProduct = 8,
  DeleteProduct = 9,
  ManageOrders = 10,
  ViewPayouts = 11,
  ManageUsers = 12,
  ManageAllProducts = 13,
  ManageAllOrders = 14,
  AccessAnalytics = 15,
  ConfigurePlatform = 16,
  ViewSupportTickets = 17,
  RespondToTickets = 18,
  ResolveDisputes = 19,
  CreateCoupon = 20,
  ViewDashboard = 21,
}

// export type Permission = {
//   code: number;
//   name: string;
//   description: string;
// };

// Role enum matching backend
export enum RoleCode {
  Default = 0,
  Customer = 1,
  Seller = 2,
  Admin = 3,
  Support = 4,
  Moderator = 5,
}

export type Role = {
  code: number;
  name: string;
  description: string;
  permissions: string[];
};

export type PermissionName = keyof typeof PermissionCode;
export type RoleName = keyof typeof RoleCode;
