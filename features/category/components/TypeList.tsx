import { PanelItemProps } from "../types";
import TypeItem from "./TypeItem";

type CategorySectionProps = {
  title: string;
  items: PanelItemProps[];
};

const TypeList = ({ title, items }: CategorySectionProps) => (
  <div className="flex-1 ">
    <h3 className="font-semibold mb-2 text-gray-500">{title}</h3>
    <ul className="space-y-2.5">
      {items.map((item, index) => (
        <TypeItem
          key={index}
          icon={item.icon}
          text={item.sub}
          type={item.type}
          sub={item.sub}
          newTag={item.newTag}
        />
      ))}
    </ul>
  </div>
);

export default TypeList;
