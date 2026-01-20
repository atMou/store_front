import { useClickOutside } from "@/hooks/dom";
import { Button, Input } from "@/shared/ui";
import CategoryIcon from "@/shared/ui/icons/CategoryIcon";
import ClothesHangerIcon from "@/shared/ui/icons/ClothesHangerIcon";
import { ChevronDown, SearchIcon } from "lucide-react";
import { useState } from "react";

type SearchBarProps = {
  onChange?: (value: string) => void;
  onFocusChange?: (focused: boolean) => void;
};

function SearchBar({ onChange, onFocusChange }: SearchBarProps) {
  const [focused, setFocused] = useState(false);
  const [opened, setOpened] = useState(false);
  const [selectedSearch, setSelectedSearch] = useState<"All" | "Preowned">(
    "All"
  );
  const ref = useClickOutside<HTMLDivElement>(() => {
    setOpened(false);
    setFocused(false);
    onFocusChange?.(false);
  });

  const handletoggle = () => {
    setOpened((prev) => !prev);
  };
  return (
    <div
      ref={ref}
      style={{
        width: focused ? "clamp(320px, 34vw, 560px)" : "300px",
        right: focused ? "50%" : undefined,
        transform: focused ? "translate(50%, -50%)" : "translate(0, -50%)",
        transition:
          "width 400ms cubic-bezier(0.4, 0, 0.2, 1), right 400ms cubic-bezier(0.4, 0, 0.2, 1), transform 400ms cubic-bezier(0.4, 0, 0.2, 1)",
      }}
      className="bg-white flex border border-gray-300 z-50 absolute top-1/2 right-4 sm:right-6 lg:right-8"
    >
      {focused && (
        <div className="group">
          <Button
            variant="plain"
            className="text-gray-800 flex items-center border border-r-0 duration-300 rounded-none"
            onClick={handletoggle}
            onMouseDown={(e) => e.preventDefault()}
          >
            {selectedSearch === "All" ? (
              <CategoryIcon />
            ) : (
              <ClothesHangerIcon />
            )}
            <ChevronDown
              className={`transition-transform duration-300 ease-in-out ${
                opened ? "rotate-180" : "rotate-0"
              }`}
            />
          </Button>
          <div
            className={`absolute w-full top-full 
              left-0 transition-all duration-300 ease-in-out
              bg-white   shadow-md border  border-t-0 ${
                opened
                  ? "opacity-100 translate-y-0 pointer-events-auto"
                  : "opacity-0 -translate-y-2 pointer-events-none"
              }`}
          >
            <ul className="flex flex-col border-gray-800 space-y-1 text-sm text-gray-600">
              {[{ label: "All" }, { label: "PreOwned" }].map((item) => (
                <li
                  key={item.label}
                  className="transition-all duration-100 ease-in-out hover:bg-gray-200 hover:text-gray-900 "
                >
                  <div
                    onClick={() => {
                      setSelectedSearch(
                        item.label === "All" ? "All" : "Preowned"
                      );
                    }}
                    onMouseDown={(e) => e.preventDefault()}
                    className="block w-full px-3 py-2 rounded-md transition-all duration-300"
                  >
                    {item.label === "PreOwned" ? (
                      <div className="flex space-x-2">
                        {" "}
                        <ClothesHangerIcon size="18" />{" "}
                        <div>Pre-owned</div>{" "}
                      </div>
                    ) : (
                      <div className="flex space-x-2">
                        {" "}
                        <CategoryIcon size="18" /> <div>All</div>{" "}
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <Input
        className="placeholder:text-gray-600 bg-gray-50!  rounded-none focus:ring-0 focus:outline-none border border-black shadow-none"
        style={{ paddingLeft: focused ? "1rem" : "2.5rem" }}
        placeholder={
          selectedSearch === "Preowned" ? "Search in 'Pre-owned'" : "Search"
        }
        onChange={(e) => onChange?.(e.target.value)}
        onFocus={() => {
          setFocused(true);
          onFocusChange?.(true);
        }}
      />
      {!focused && (
        <div className="absolute top-1/2 -translate-y-1/2 left-3 pointer-events-none">
          <SearchIcon strokeWidth={1.5} className="size-4 text-gray-500" />
        </div>
      )}
    </div>
  );
}

export default SearchBar;
