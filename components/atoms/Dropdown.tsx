"use client";
import LoadingDots from "@/components/feedback/LoadingDots";
import { useClickOutside } from "@/hooks";
import { Check, ChevronDown, X } from "lucide-react";
import { useState } from "react";

interface DropdownOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  color?: string;
  disabled?: boolean;
}

interface DropdownProps {
  label?: string;
  placeholder?: string;
  options: DropdownOption[];
  value?: string | string[];
  onChange: (value: string | string[]) => void;
  isLoading?: boolean;
  multiSelect?: boolean;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  renderOption?: (
    option: DropdownOption,
    isSelected: boolean
  ) => React.ReactNode;
  renderValue?: (selectedOptions: DropdownOption[]) => React.ReactNode;
}

function Dropdown({
  label,
  placeholder = "Select an option",
  options = [],
  value,
  onChange,
  isLoading = false,
  multiSelect = false,
  required = false,
  disabled = false,
  error,
  renderOption,
  renderValue,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useClickOutside<HTMLDivElement>(() => setIsOpen(false));

  const selectedValues: string[] = multiSelect
    ? Array.isArray(value)
      ? value
      : []
    : value
      ? [value as string]
      : [];

  const selectedOptions = options.filter((opt) =>
    selectedValues.includes(opt.value)
  );

  const handleSelect = (optionValue: string, isDisabled?: boolean) => {
    if (isDisabled) return;

    if (multiSelect) {
      const newValues = selectedValues.includes(optionValue)
        ? selectedValues.filter((v) => v !== optionValue)
        : [...selectedValues, optionValue];
      onChange(newValues);
    } else {
      onChange(optionValue);
      setIsOpen(false);
    }
  };

  const handleRemove = (optionValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newValues = selectedValues.filter((v) => v !== optionValue);
    onChange(multiSelect ? newValues : "");
  };

  const defaultRenderValue = () => {
    if (multiSelect && selectedOptions.length > 0) {
      return (
        <div className="flex flex-wrap gap-1 min-w-60  ">
          {selectedOptions.map((opt) => (
            <span
              key={opt.value}
              className="inline-flex items-center gap-1 px-2 py-0.5 bg-black text-white text-sm"
            >
              {opt.label}
              <button
                type="button"
                onClick={(e) => handleRemove(opt.value, e)}
                className="hover:bg-gray-700 rounded-full"
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      );
    }

    if (!multiSelect && selectedOptions.length > 0) {
      const opt = selectedOptions[0];
      return (
        <div className="flex items-center min-w-30  gap-2">
          {opt.icon}
          {opt.color && (
            <span
              className="w-4 h-4 border border-gray-300 inline-block"
              style={{ backgroundColor: opt.color }}
            />
          )}
          <span>{opt.label}</span>
        </div>
      );
    }

    return (
      <span className="text-gray-400">
        {isLoading ? <LoadingDots size="sm" color="black" /> : placeholder}
      </span>
    );
  };

  const defaultRenderOption = (option: DropdownOption, isSelected: boolean) => {
    return (
      <div
        className={`px-3 py-2 flex items-center ${
          multiSelect ? "justify-between" : "gap-2"
        } ${isSelected && multiSelect ? "bg-gray-50" : ""} ${
          option.disabled
            ? "cursor-not-allowed text-gray-400 bg-gray-50"
            : "hover:bg-gray-100 cursor-pointer"
        }`}
      >
        <div className="flex items-center gap-2">
          {option.icon}
          {option.color && (
            <span
              className="w-4 h-4 border border-gray-300 inline-block"
              style={{ backgroundColor: option.color }}
            />
          )}
          <span>{option.label}</span>
        </div>
        {multiSelect && isSelected && (
          <Check size={16} className="text-black" />
        )}
      </div>
    );
  };

  return (
    <div ref={ref} className="relative">
      {label && (
        <label className="block text-sm mb-2">
          {label} {required && <span className="text-red-600">*</span>}
        </label>
      )}
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full ${multiSelect ? "min-h-8 py-2" : "h-11"} px-3 border border-black text-sm flex items-center justify-between gap-2 ${
          disabled
            ? "bg-gray-100 cursor-not-allowed opacity-60"
            : "bg-white cursor-pointer"
        }`}
      >
        {renderValue ? renderValue(selectedOptions) : defaultRenderValue()}
        <ChevronDown
          className={`w-4 h-4 text-gray-500 shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>
      <div
        className={`absolute z-10 w-full  bg-white border border-t-0 border-black max-h-60 overflow-y-auto transition-all duration-200 origin-top ${
          isOpen
            ? "opacity-100 scale-y-100 visible"
            : "opacity-0 scale-y-0 invisible"
        }`}
      >
        {options.map((option, index) => {
          const isSelected = selectedValues.includes(option.value);
          return (
            <div
              key={`${option.value}-${index}`}
              onClick={(e) => {
                // Don't select if clicking inside a child element (like button)
                if ((e.target as HTMLElement).closest("button")) {
                  return;
                }
                handleSelect(option.value, option.disabled);
              }}
            >
              {renderOption
                ? renderOption(option, isSelected)
                : defaultRenderOption(option, isSelected)}
            </div>
          );
        })}
      </div>
      {error && <p className="text-sm pl-2 mt-1 text-red-600">{error}</p>}
    </div>
  );
}

export default Dropdown;
