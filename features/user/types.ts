import { Address } from "@/types";
import { Role } from "../auth/types";

export interface User {
  id: string;
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  age?: number;
  avatar?: string;
  gender?: string;
  isVerified: boolean;
  cartId?: string;
  addresses: Address[];
  roles: Role[];
  permissions: string[];
  likedProductIds: string[];
  productSubscriptions: string[]; // Format: "{productId}_{color}_{size}"
}
