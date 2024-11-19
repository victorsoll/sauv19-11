import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface MonthYearPickerProps {
  selectedMonth: string | null;
  selectedYear: number;
  onMonthChange: (month: string | null) => void;
  onYearChange: (year: number) => void;
  onReset: () => void;
}

function MonthYearPicker({
  selectedMonth,
  selectedYear,
  onMonthChange,
  onYearChange,
  onReset
}: MonthYearPickerProps) {
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const { t } = useTranslation();

  const months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const years = Array.from({ length: 11 }, (_, i) => 2024 + i);

  return (
    <div className="flex gap-2 items-center justify-center mb-6">
      <div className="relative">
        <button
          onClick={() => setShowMonthDropdown(!showMonthDropdown)}
          className="px-4 py-2 bg-gray-800 rounded-lg flex items-center gap-2 hover:bg-gray-700 transition-colors"
        >
          {selectedMonth || 'Mois'} <ChevronDown className="h-4 w-4" />
        </button>
        {showMonthDropdown && (
          <div className="absolute top-full mt-1 w-48 bg-gray-800 rounded-lg shadow-lg py-1 z-10 max-h-60 overflow-y-auto">
            {months.map(month => (
              <button
                key={month}
                onClick={() => {
                  onMonthChange(month);
                  setShowMonthDropdown(false);
                }}
                className="w-full px-4 py-2 text-left hover:bg-gray-700 transition-colors"
              >
                {month}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="relative">
        <button
          onClick={() => setShowYearDropdown(!showYearDropdown)}
          className="px-4 py-2 bg-gray-800 rounded-lg flex items-center gap-2 hover:bg-gray-700 transition-colors"
        >
          {selectedYear} <ChevronDown className="h-4 w-4" />
        </button>
        {showYearDropdown && (
          <div className="absolute top-full mt-1 w-32 bg-gray-800 rounded-lg shadow-lg py-1 z-10 max-h-60 overflow-y-auto">
            {years.map(year => (
              <button
                key={year}
                onClick={() => {
                  onYearChange(year);
                  setShowYearDropdown(false);
                }}
                className="w-full px-4 py-2 text-left hover:bg-gray-700 transition-colors"
              >
                {year}
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={onReset}
        className="px-4 py-2 bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
      >
        Tout
      </button>
    </div>
  );
}

export default MonthYearPicker;