import { cn } from "@/shared/lib/utils";

interface PriceDisplayProps {
  label: string;
  amount: number;
  currency?: string;
  note?: string;
  variant?: "small" | "medium" | "large" | "summary";
  showBorder?: boolean;
  className?: string;
  labelClassName?: string;
  amountClassName?: string;
  noteClassName?: string;
}

const variantStyles = {
  small: {
    container: "py-2",
    label: "text-sm font-medium text-gray-600",
    amount: "text-sm font-semibold text-gray-900",
    note: "text-xs text-gray-500",
  },
  medium: {
    container: "py-3",
    label: "text-base font-semibold text-gray-800",
    amount: "text-lg font-bold text-gray-900",
    note: "text-xs text-gray-600",
  },
  large: {
    container: "pt-4 pb-3",
    label: "text-xl font-bold text-gray-900",
    amount: "text-3xl font-bold text-gray-900",
    note: "text-sm text-gray-600",
  },
  summary: {
    container: "pt-4 pb-0 mb-4",
    label: "text-lg font-bold text-gray-900",
    amount: "text-2xl font-bold text-gray-900",
    note: "text-xs text-gray-600",
  },
};

const PriceDisplay = ({
  label,
  amount,
  currency = "€",
  note,
  variant = "medium",
  showBorder = false,
  className,
  labelClassName,
  amountClassName,
  noteClassName,
}: PriceDisplayProps) => {
  const styles = variantStyles[variant];

  return (
    <div
      className={cn(
        "flex justify-between items-baseline",
        styles.container,
        showBorder && "border-t border-gray-300",
        className
      )}
    >
      <span className={cn(styles.label, labelClassName)}>{label}</span>
      <div className="text-right">
        <span className={cn(styles.amount, amountClassName)}>
          {amount.toFixed(2)} {currency}
        </span>
        {note && (
          <p className={cn(styles.note, "mt-0.5", noteClassName)}>{note}</p>
        )}
      </div>
    </div>
  );
};

export default PriceDisplay;
