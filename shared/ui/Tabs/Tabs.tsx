"use client";

import React from "react";
import { Button } from "../button";

interface TabsContextType {
  selectedTab: string;
  onSelectTab: (tab: string) => void;
}
const TabsContext = React.createContext<TabsContextType | undefined>(undefined);

interface TabProps {
  defaultSelectedTab: string;
  children: React.ReactNode;
  onTabChange?: (v: string) => void;
}

export const Tabs = (props: TabProps) => {
  const { defaultSelectedTab, children, onTabChange } = props;

  const [selectedTab, setSelectedTab] =
    React.useState<string>(defaultSelectedTab);

  const handleChangeTab = (tab: string) => {
    setSelectedTab(tab);
    onTabChange?.(tab);
  };
  return (
    <TabsContext.Provider value={{ selectedTab, onSelectTab: handleChangeTab }}>
      {children}
    </TabsContext.Provider>
  );
};

interface TabsListProps {
  children: React.ReactNode;
}
export const TabsList = (props: TabsListProps) => {
  const { children } = props;
  return (
    <div className="flex gap-2 mb-6 border-b border-black pb-2">{children}</div>
  );
};
interface TabTriggerProps {
  tab: string;
  children: React.ReactNode;
}
export const TabTrigger = (props: TabTriggerProps) => {
  const { tab, children } = props;
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error("Tab must be used within a Tabs component");
  }
  const { selectedTab, onSelectTab } = context;
  const isActive = selectedTab === tab;
  const handleClick = () => {
    onSelectTab(tab);
  };
  return (
    <Button
      className={`px-4 py-2 text-xs font-medium transition-all ${
        isActive
          ? "bg-black text-white border-b-2 border-black"
          : "bg-transparent text-gray-700 hover:bg-black hover:text-white"
      } `}
      onClick={handleClick}
    >
      {children}
    </Button>
  );
};
interface TabPanelProps {
  tab: string;
  children: React.ReactNode;
}
export const TabPanel = (props: TabPanelProps) => {
  const { tab, children } = props;
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error("TabPanel must be used within a Tabs component");
  }
  const { selectedTab } = context;

  if (selectedTab !== tab) return null;
  return <>{children}</>;
};

Tabs.TabTrigger = TabTrigger;
Tabs.TabsList = TabsList;
Tabs.TabPanel = TabPanel;
export default Tabs;
