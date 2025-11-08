import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const months = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

interface MonthYearPickerProps {
  date: Date;
  onChange: (date: Date) => void;
}

export function MonthYearPicker({ date, onChange }: MonthYearPickerProps) {
  const [showSelect, setShowSelect] = useState(false);

  const handleMonthChange = (increment: number) => {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() + increment);
    onChange(newDate);
  };

  const handleMonthSelect = (monthIndex: number) => {
    const newDate = new Date(date);
    newDate.setMonth(monthIndex);
    onChange(newDate);
    setShowSelect(false);
  };

  const handleYearSelect = (year: number) => {
    const newDate = new Date(date);
    newDate.setFullYear(year);
    onChange(newDate);
    setShowSelect(false);
  };

  return (
    <div className="flex items-center justify-center gap-4 py-6 relative">
      <button
        className="rounded-full p-2 hover:bg-accent transition"
        onClick={() => handleMonthChange(-1)}
        aria-label="Mês anterior"
      >
        <ChevronLeft className="text-primary" />
      </button>
      <button
        className="border border-primary text-primary px-6 py-2 rounded-full font-semibold hover:bg-primary/10 transition"
        onClick={() => setShowSelect((v) => !v)}
      >
        {months[date.getMonth()]} {date.getFullYear()}
      </button>
      <button
        className="rounded-full p-2 hover:bg-accent transition"
        onClick={() => handleMonthChange(1)}
        aria-label="Próximo mês"
      >
        <ChevronRight className="text-primary" />
      </button>

      {/* Popover responsivo */}
      {showSelect && (
        <div className="absolute left-1/2 top-16 -translate-x-1/2 z-20 bg-white dark:bg-zinc-900 border rounded-lg shadow-lg p-4 w-[90vw] max-w-xs sm:max-w-md">
          {/* Anos */}
          <div className="flex justify-center gap-2 mb-4">
            {[date.getFullYear() - 1, date.getFullYear(), date.getFullYear() + 1].map((y) => (
              <button
                key={y}
                className={`px-3 py-1 rounded ${y === date.getFullYear() ? "bg-primary text-white" : "hover:bg-accent"}`}
                onClick={() => handleYearSelect(y)}
              >
                {y}
              </button>
            ))}
          </div>
          {/* Meses em grid */}
          <div className="grid grid-cols-3 gap-2">
            {months.map((m, i) => (
              <button
                key={m}
                className={`px-2 py-2 rounded text-sm ${i === date.getMonth() ? "bg-primary text-white" : "hover:bg-accent"}`}
                onClick={() => handleMonthSelect(i)}
              >
                {m.slice(0, 3)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}