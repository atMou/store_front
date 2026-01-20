import { useAppDispatch, useAppSelector } from "@/store";
import {
  KidsTabPanels,
  MenTabPanels,
  // NoneTabPanels,
  TabPanel,
  WomenTabPanels,
} from "../data";
import {
  selectCarouselSubCategory,
  selectIsOpen,
  selectMainCategory,
  subCategoryActions,
} from "../slice";

function TabPanelDropdown() {
  const subCategory = useAppSelector(selectCarouselSubCategory);
  const isOpen = useAppSelector(selectIsOpen);
  const mainCategory = useAppSelector(selectMainCategory);

  const dispatch = useAppDispatch();

  const getCurrentPanel = () => {
    if (!subCategory) {
      return null;
    }

    const tabPanels =
      mainCategory === "Men"
        ? MenTabPanels
        : mainCategory === "Women"
          ? WomenTabPanels
          : KidsTabPanels;

    const selectedTab = tabPanels.tabs.find((tab) => tab.group === subCategory);

    if (!selectedTab) {
      return null;
    }

    return <TabPanel data={selectedTab} />;
  };

  return (
    <div className="relative z-40 border-t  border-gray-300">
      <ul
        onMouseLeave={() => {
          dispatch(subCategoryActions.setOpenState(false));
        }}
        className={`absolute w-full bg-gray-100 overflow-hidden transition-all duration-300 ease-in
                    ${isOpen ? "h-60 border-b" : "h-0 border-b-0"}`}
      >
        <div className="pt-2 max-w-5xl mx-auto">{getCurrentPanel()}</div>
      </ul>
    </div>
  );
}

export default TabPanelDropdown;
