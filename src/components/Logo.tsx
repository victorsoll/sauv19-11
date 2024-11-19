import React from 'react';
import { ShoppingBag } from 'lucide-react';

function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="bg-red-500 p-2 rounded-lg">
        <ShoppingBag className="h-6 w-6 text-white" />
      </div>
      <span className="text-xl font-bold">Stocktor</span>
    </div>
  );
}

export default Logo;