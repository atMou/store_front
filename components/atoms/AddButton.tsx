import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui";
import { Plus } from "lucide-react";

type AddButtonProps = {
  onClick: () => void;
  tooltipText?: string;
};
function AddButton({ onClick, tooltipText }: AddButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={onClick}
          className="mt-3  cursor-pointer flex items-center justify-center p-2 border border-dashed border-gray-400 rounded-none hover:border-gray-600 hover:bg-gray-50 transition-colors"
        >
          <Plus size={16} className="text-gray-600" />
        </button>
      </TooltipTrigger>
      <TooltipContent className="rounded-none bg-black">
        {tooltipText || "Add Item"}
      </TooltipContent>
    </Tooltip>
  );
}

export default AddButton;
