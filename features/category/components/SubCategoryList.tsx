import SubCategoryItem, { CategoryItemProps } from "./SubCategoryItem";

type CategorySectionProps = {
  title: string;
  items: CategoryItemProps[];
};

const SubCategoryList = ({ title, items }: CategorySectionProps) => (
  <div className="py-1">
    <h2 className="font-semibold mb-2">{title}</h2>
    <ul className="space-y-2">
      {items.map((item, index) => (
        <SubCategoryItem
          key={index}
          icon={item.icon}
          text={item.text}
          newTag={item.newTag}
          filters={item.filters}
        />
      ))}
    </ul>
  </div>
);

export default SubCategoryList;
