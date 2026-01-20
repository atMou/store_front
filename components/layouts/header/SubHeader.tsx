import CarouselBar from "@/features/category/components/Carousel";
import { useState } from "react";
import SearchBar from "./SearchBar";

function SubHeader() {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-9 relative flex justify-between items-center">
      <div
        className={`transition-all duration-500 ${
          isSearchFocused
            ? "opacity-50 blur-sm pointer-events-none"
            : "opacity-100 blur-0"
        }`}
      >
        <CarouselBar />
      </div>
      <SearchBar onFocusChange={setIsSearchFocused} />
    </div>
  );
}

export default SubHeader;
