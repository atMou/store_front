// import { Button } from "@/shared/ui";
// import { useTranslation } from "react-i18next";
import Image from "next/image";

import LogoIcon from "@/public/assets/icons/Logo.svg";

function HeaderLogo() {
  return <Image src={LogoIcon} alt="Store Logo" width={150} height={50} />;
}

export default HeaderLogo;
