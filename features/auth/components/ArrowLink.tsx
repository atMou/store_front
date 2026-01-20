import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";

interface ArrowLinkProps {
  direction?: "left" | "right";

  leftText?: string;

  rightText?: string;
  onClickRight?: () => void;
  onClickLeft?: () => void;
  disabled?: boolean;
}

function ArrowLink({
  direction = "right",
  leftText,
  rightText,
  onClickLeft,
  onClickRight,
  disabled,
}: ArrowLinkProps) {
  const baseClass = "flex items-center transition-colors";
  const enabledClass = "cursor-pointer hover:text-gray-600";
  const disabledClass = "text-gray-400 cursor-not-allowed";
  const justifyClass =
    direction === "right"
      ? "justify-end"
      : direction === "left"
        ? "justify-start"
        : "";

  const rightIconClass = `w-4 h-4 transition-transform duration-200 ease-in-out${
    disabled ? "" : " group-hover:translate-x-1"
  }`;
  const leftIconClass = `w-4 h-4 transition-transform duration-200 ease-in-out${
    disabled ? "" : " group-hover:-translate-x-1"
  }`;

  return (
    <div
      onClick={disabled ? undefined : onClickRight}
      className={`${baseClass} ${justifyClass} ${
        disabled ? disabledClass : enabledClass
      }`}
    >
      {direction === "right" ? (
        <div
          className={`flex items-center group ${disabled ? "" : enabledClass}`}
        >
          {rightText && (
            <span className="mr-1 text-xs tracking-wide">{rightText}</span>
          )}
          <ArrowRightIcon className={rightIconClass} />
        </div>
      ) : (
        <div
          onClick={disabled ? undefined : onClickLeft}
          className={`flex items-center ${
            disabled ? disabledClass : enabledClass
          } ${justifyClass}`}
        >
          <div className="flex items-center">
            <ArrowLeftIcon className={leftIconClass} />
            {leftText && (
              <span className="ml-2 text-xs tracking-wide">{leftText}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ArrowLink;
