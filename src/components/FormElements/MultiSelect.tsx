"use client";

import React, { useEffect, useRef, useState } from "react";

export interface MultiSelectOption {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  label?: string;
  placeholder?: string;
  onChange?: (selectedValues: string[]) => void;
  defaultSelected?: string[];
}

export function MultiSelect({
  options,
  label = "Multiselect Dropdown",
  placeholder = "Select an option",
  onChange,
  defaultSelected = [],
}: MultiSelectProps) {
  const [show, setShow] = useState(false);
  const [selectedValues, setSelectedValues] = useState<string[]>(defaultSelected);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const toggleOption = (value: string) => {
    const newSelected = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];
    setSelectedValues(newSelected);
    onChange?.(newSelected);
  };

  const removeSelected = (value: string) => {
    const updated = selectedValues.filter((v) => v !== value);
    setSelectedValues(updated);
    onChange?.(updated);
  };

  const isSelected = (value: string) => selectedValues.includes(value);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        !triggerRef.current?.contains(e.target as Node)
      ) {
        setShow(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative z-50">
      {label && (
        <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
          {label}
        </label>
      )}

      <div className="relative">
        <div
          ref={triggerRef}
          onClick={() => setShow((prev) => !prev)}
          className="mb-2 flex cursor-pointer rounded-[7px] border-[1.5px] border-stroke py-[9px] pl-3 pr-3 outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2"
        >
          <div className="flex flex-auto flex-wrap gap-2">
            {selectedValues.length > 0 ? (
              selectedValues.map((val) => {
                const label = options.find((o) => o.value === val)?.label ?? val;
                return (
                  <div
                    key={val}
                    className="flex items-center justify-center rounded-[5px] border-[.5px] border-stroke bg-gray-2 px-2.5 py-[3px] text-body-sm font-medium dark:border-dark-3 dark:bg-dark"
                  >
                    <div className="max-w-full flex-initial">{label}</div>
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        removeSelected(val);
                      }}
                      className="ml-2 cursor-pointer text-sm text-red hover:text-red-600"
                    >
                      ✕
                    </div>
                  </div>
                );
              })
            ) : (
              <span className="text-dark-5 dark:text-dark-6">{placeholder}</span>
            )}
          </div>

          <div className="ml-auto">
            <svg
              className="h-5 w-5 text-dark-4 dark:text-dark-6"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M7 7l3 3 3-3" />
            </svg>
          </div>
        </div>

        {/* Dropdown Options */}
        {show && (
          <div
            ref={dropdownRef}
            className="absolute top-full mt-1 max-h-60 w-full overflow-y-auto rounded bg-white shadow-1 dark:bg-dark-2 dark:shadow-card z-50"
          >
            {options.map((option) => (
              <div
                key={option.value}
                onClick={() => toggleOption(option.value)}
                className={`cursor-pointer px-4 py-2 hover:bg-primary/5 ${
                  isSelected(option.value) ? "bg-primary/10 font-semibold text-primary" : ""
                }`}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
