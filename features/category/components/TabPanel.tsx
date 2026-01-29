import Image from "next/image";
import { KidsGroupedItems, MenGroupedItems, WomenGroupedItems } from "..";
import SubCategoryList from "./SubCategoryList";

interface TabPanelProps {
  data: MenGroupedItems | WomenGroupedItems | KidsGroupedItems;

  imageUrl?: string;
}

function TabPanel({ data, imageUrl = "/panel1.jpg" }: TabPanelProps) {
  return (
    <div className="flex justify-between items-start max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {data.items.map((section) => (
        <SubCategoryList
          key={section.title}
          title={section.title}
          items={section.items}
        />
      ))}
      <div
        className="w-70 h-48 overflow-hidden shrink-0 border-l-30 border-b-30"
        style={{
          borderLeftColor: data.borderLeftColor || "#f59e0b",
          borderBottomColor: data.borderBottomColor || "#60a5fa",
        }}
      >
        <Image
          src={data.imageUrl ? "/" + data.imageUrl : imageUrl}
          alt="Promotional"
          width={600}
          height={400}
          className="object-cover w-full h-full"
        />
      </div>
    </div>
  );
}

export default TabPanel;
