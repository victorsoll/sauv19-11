import React from 'react';
import { Package } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

function EmptyState({ title, description, icon = <Package className="h-12 w-12" /> }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="text-gray-400 mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-medium text-gray-300 mb-2">{title}</h3>
      <p className="text-gray-400 text-center max-w-sm">{description}</p>
    </div>
  );
}

export default EmptyState;