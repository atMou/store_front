"use client";

import { useClickOutside } from "@/hooks";
import { Check, ChevronDown, X } from "lucide-react";
import { useState } from "react";

interface DropdownOption {
  label: string;
  value: string;
}

interface DropdownMultiSelectProps {
  label?: string;
  options: DropdownOption[];
  value: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  closeOnSelect?: boolean;
}

const DropdownMultiSelect: React.FC<DropdownMultiSelectProps> = ({
  label,
  options,
  value,
  onChange,
  placeholder = "Select...",
  className,
  disabled,
  closeOnSelect = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useClickOutside<HTMLDivElement>(() => setIsOpen(false));

  const selectedValues = Array.isArray(value) ? value : [];

  const toggleValue = (optionValue: string) => {
    const newValues = selectedValues.includes(optionValue)
      ? selectedValues.filter((v) => v !== optionValue)
      : [...selectedValues, optionValue];
    onChange(newValues);
    if (closeOnSelect) {
      setIsOpen(false);
    }
  };

  const removeValue = (optionValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newValues = selectedValues.filter((v) => v !== optionValue);
    onChange(newValues);
  };

  return (
    <div className="relative" ref={ref}>
      <div
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        className={`w-full min-h-11 px-3 py-2 border border-black rounded-none text-sm bg-white cursor-pointer flex items-center justify-between gap-2 ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        } ${className}`}
      >
        <div className="flex flex-wrap gap-1 flex-1">
          {selectedValues.length > 0 ? (
            selectedValues.map((val) => {
              const option = options.find((opt) => opt.value === val);
              return (
                <span
                  key={val}
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-black text-white text-xs"
                >
                  {option?.label || val}
                  <button
                    type="button"
                    onClick={(e) => removeValue(val, e)}
                    className="hover:bg-gray-700 rounded-full"
                  >
                    <X size={12} />
                  </button>
                </span>
              );
            })
          ) : (
            <span className="text-gray-400">{label || placeholder}</span>
          )}
        </div>
        <ChevronDown className="w-4 h-4 text-gray-500 shrink-0" />
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-black max-h-60 overflow-y-auto">
          {options.map((option) => {
            const isSelected = selectedValues.includes(option.value);
            return (
              <div
                key={option.value}
                onClick={() => toggleValue(option.value)}
                className={`px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between ${
                  isSelected ? "bg-gray-50" : ""
                }`}
              >
                <span>{option.label}</span>
                {isSelected && <Check size={16} className="text-black" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DropdownMultiSelect;
