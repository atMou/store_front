import CategoryList from "@/features/category/components/MainCategoryList";
import AuthenticationIcon from "./AuthenticationIcon";
import CartIcon from "./CartIcon";
import DashboradIcon from "./DashboradIcon";
import HeaderLogo from "./HeaderLogo";
import LanguageToggler from "./LanguageToggler";
import LikedProducts from "./LikedProductsIcon";
import NotificationIcon from "./NotificationIcon";

function Header() {
  return (
    <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between">
      <CategoryList />
      <HeaderLogo />
      <div className="flex justify-center items-center space-x-2 ">
        <LanguageToggler />
        <NotificationIcon />
        <AuthenticationIcon />
        <LikedProducts />
        {/* <RoleGate requiredRoles={["Customer"]}> */}
        <CartIcon />

        {/* </RoleGate> */}
        {/* <RoleGate requiredRoles={["Admin", "Moderator"]}> */}
        <div className="w-5 h-5">
          <DashboradIcon />
        </div>
        {/* </RoleGate> */}
      </div>
    </header>
  );
}

export default Header;
