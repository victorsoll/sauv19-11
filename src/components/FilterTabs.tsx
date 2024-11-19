import React from 'react';

interface Tab {
  id: string;
  label: string;
}

interface FilterTabsProps {
  tabs: Tab[];
  selectedTab: string;
  onChange: (id: string) => void;
}

function FilterTabs({ tabs, selectedTab, onChange }: FilterTabsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`px-4 py-2 rounded-full whitespace-nowrap transition-all duration-200 ${
            selectedTab === tab.id 
              ? 'bg-red-500 scale-105' 
              : 'bg-gray-800 hover:bg-gray-700'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export default FilterTabs;