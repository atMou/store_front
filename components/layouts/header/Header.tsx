import CategoryList from "@/features/category/components/MainCategoryList";
import AuthenticationIcon from "../../../features/auth/components/AuthenticationIcon";
import LikedProducts from "../../../features/product/components/LikedProductsIcon";
import CartIcon from "./CartIcon";
import DashboradIcon from "./DashboradIcon";
import HeaderLogo from "./HeaderLogo";
import LanguageToggler from "./LanguageToggler";
import NotificationIcon from "../../../features/notifications/components/NotificationIcon";

function Header() {
  return (
    <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between">
      <CategoryList />
      <HeaderLogo />
      <div className="flex justify-center items-center">
        <LanguageToggler />
        <NotificationIcon />
        <AuthenticationIcon />
        <LikedProducts />
        <CartIcon />
        <DashboradIcon />
      </div>
    </header>
  );
}

export default Header;
