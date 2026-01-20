import { useFilters } from "@/features/product";
import { Badge } from "@/shared/ui";

export type CategoryItemProps = {
  icon: React.ReactNode;
  text: string;
  type: string;
  sub: string;
  newTag?: boolean;
};

const TypeItem = ({ icon, text, newTag, type, sub }: CategoryItemProps) => {
  const { updateFilters } = useFilters();

  return (
    <li className="flex items-center space-x-2">
      <span
        onClick={() => updateFilters({ type, sub })}
        className="flex items-center space-x-2 text-sm hover:underline cursor-pointer text-gray-700 hover:text-gray-900 transition-colors group"
      >
        <div className="text-gray-600 group-hover:text-gray-800 transition-colors shrink-0 [&>svg]:transition-all [&>svg]:group-hover:fill-gray-800">
          {icon}
        </div>
        <span className="whitespace-nowrap">{text}</span>
      </span>
      {newTag && (
        <Badge variant="avaliable" className="text-xs">
          new
        </Badge>
      )}
    </li>
  );
};
export default TypeItem;
