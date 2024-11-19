import React from 'react';
import { Plus } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  onAdd?: () => void;
}

function PageHeader({ title, onAdd }: PageHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">{title}</h1>
      {onAdd && (
        <button
          onClick={onAdd}
          className="bg-red-500 p-2 rounded-full hover:bg-red-600 transition-colors"
        >
          <Plus className="h-6 w-6" />
        </button>
      )}
    </div>
  );
}

export default PageHeader;