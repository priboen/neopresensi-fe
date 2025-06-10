"use client";

import { ChevronUpIcon } from "@/assets/icons";
import { cn } from "@/lib/utils";
import { useId, useState, useEffect } from "react";

type PropsType = {
  name: string;
  label: string;
  items: { value: string; label: string }[];
  value?: string;
  onChange?: (value: string) => void;
  prefixIcon?: React.ReactNode;
  className?: string;
  placeholder?: string;
  defaultValue?: string;
};

export function Select({
  name,
  label,
  items,
  value,
  onChange,
  defaultValue,
  placeholder = "Pilih opsi",
  prefixIcon,
  className,
}: PropsType) {
  const id = useId();
  const isControlled = value !== undefined;

  const [internalValue, setInternalValue] = useState(defaultValue ?? "");

  const currentValue = isControlled ? value : internalValue;

  useEffect(() => {
    if (!isControlled && defaultValue) {
      setInternalValue(defaultValue);
    }
  }, [defaultValue]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (!isControlled) {
      setInternalValue(val);
    }
    onChange?.(val);
  };

  return (
    <div className={cn("space-y-3", className)}>
      <label
        htmlFor={id}
        className="block text-body-sm font-medium text-dark dark:text-white"
      >
        {label}
      </label>

      <div className="relative">
        {prefixIcon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            {prefixIcon}
          </div>
        )}

        <select
          id={id}
          name={name}
          value={currentValue}
          onChange={handleChange}
          className={cn(
            "w-full appearance-none rounded-lg border border-stroke bg-transparent px-5.5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary [&>option]:text-dark-5 dark:[&>option]:text-dark-6",
            currentValue && "text-dark dark:text-white",
            prefixIcon && "pl-11.5"
          )}
        >
          {placeholder && (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          )}
          {items.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>

        <ChevronUpIcon className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 rotate-180" />
      </div>
    </div>
  );
}
