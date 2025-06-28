import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { BANKS } from "@/utils/banks";

interface BankSelectorProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function BankSelector({
  value,
  onValueChange,
  placeholder = "Selecione um banco...",
  disabled = false,
}: BankSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const selectedBank = value ? BANKS.find(bank => bank.id === value) : undefined;

  const filteredBanks = BANKS.filter(bank =>
    bank.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bank.code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-2">
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger className="w-full">
          {selectedBank ? (
            <div className="flex items-center gap-2">
              <img
                src={selectedBank.logo}
                alt={selectedBank.name}
                className="w-6 h-6 object-contain"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <span className="truncate">{selectedBank.name}</span>
            </div>
          ) : (
            <SelectValue placeholder={placeholder} />
          )}
        </SelectTrigger>
        <SelectContent>
          <div className="p-2">
            <div className="flex items-center border rounded-md px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <Input
                placeholder="Buscar banco..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-0 focus:ring-0 p-0 h-8"
              />
            </div>
          </div>
          <div className="max-h-[300px] overflow-y-auto">
            {filteredBanks.length === 0 ? (
              <div className="p-2 text-sm text-muted-foreground text-center">
                Nenhum banco encontrado.
              </div>
            ) : (
              filteredBanks.map((bank) => (
                <SelectItem key={bank.id} value={bank.id}>
                  <div className="flex items-center gap-3 w-full">
                    <img
                      src={bank.logo}
                      alt={bank.name}
                      className="w-6 h-6 object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{bank.name}</div>
                      {bank.code && (
                        <div className="text-sm text-muted-foreground truncate">
                          {bank.code}
                        </div>
                      )}
                    </div>
                  </div>
                </SelectItem>
              ))
            )}
          </div>
        </SelectContent>
      </Select>
    </div>
  );
} 