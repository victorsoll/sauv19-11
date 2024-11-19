import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

function StatsCard({ title, value, icon, trend }: StatsCardProps) {
  return (
    <div className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700/80 transition-colors">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-gray-400 mb-1 text-sm">{title}</h3>
          <p className="text-2xl font-bold">{value}</p>
          {trend && (
            <p className={`text-sm mt-1 ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {trend.isPositive ? '+' : ''}{trend.value}%
            </p>
          )}
        </div>
        <div className="text-gray-400">
          {icon}
        </div>
      </div>
    </div>
  );
}

export default StatsCard;