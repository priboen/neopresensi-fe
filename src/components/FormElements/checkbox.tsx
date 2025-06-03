import { CheckIcon, XIcon } from "@/assets/icons";
import { cn } from "@/lib/utils";
import { useId } from "react";

type PropsType = {
  withIcon?: "check" | "x";
  withBg?: boolean;
  label: string;
  name?: string;
  minimal?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  radius?: "default" | "md";
  checked?: boolean;
  disabled?: boolean;
};

export function Checkbox({
  withIcon,
  label,
  name,
  withBg,
  minimal,
  onChange,
  radius,
  checked,
  disabled,
}: PropsType) {
  const id = useId();

  return (
    <div>
      <label
        htmlFor={id}
        className={cn(
          "flex cursor-pointer select-none items-center",
          !minimal && "text-body-sm font-medium",
          disabled && "cursor-not-allowed opacity-60"
        )}
      >
        <div className="relative">
          <input
            type="checkbox"
            onChange={onChange}
            name={name}
            id={id}
            className="peer sr-only"
            checked={checked}
            disabled={disabled}
          />

          <div
            className={cn(
              "mr-2 flex size-5 items-center justify-center rounded border border-dark-5 peer-checked:border-primary dark:border-dark-6 peer-checked:[&>*]:block",
              withBg
                ? "peer-checked:bg-primary [&>*]:text-white"
                : "peer-checked:bg-gray-2 dark:peer-checked:bg-transparent",
              minimal && "mr-3 border-stroke dark:border-dark-3",
              radius === "md" && "rounded-md",
              disabled &&
                "border-dark-4 bg-dark-2 opacity-50 dark:border-dark-5 dark:bg-dark-3"
            )}
          >
            {!withIcon && (
              <span
                className={cn(
                  "hidden size-2.5 rounded-sm bg-primary",
                  checked && "block"
                )}
              />
            )}

            {withIcon === "check" && (
              <CheckIcon
                className={cn("hidden text-primary", checked && "block")}
              />
            )}

            {withIcon === "x" && (
              <XIcon
                className={cn("hidden text-primary", checked && "block")}
              />
            )}
          </div>
        </div>
        <span>{label}</span>
      </label>
    </div>
  );
}
