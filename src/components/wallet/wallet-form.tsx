import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Wallet } from "@/types/wallet";

interface WalletFormProps {
  formData: Partial<Wallet>;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onInputChange: (field: keyof Wallet, value: string | number) => void;
  isEditing: boolean;
}

export const WalletForm = ({
  formData,
  onSubmit,
  onInputChange,
  isEditing,
}: WalletFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="name">Nome</label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => onInputChange("name", e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="description">Descrição</label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => onInputChange("description", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="color">Cor</label>
        <Input
          type="color"
          id="color"
          value={formData.color}
          onChange={(e) => onInputChange("color", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="type">Tipo</label>
        <Select
          value={formData.type}
          onValueChange={(value: string) => onInputChange("type", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="personal">Pessoal</SelectItem>
            <SelectItem value="business">Empresarial</SelectItem>
            <SelectItem value="savings">Poupança</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label htmlFor="initialBalance">Saldo Inicial</label>
        <Input
          type="number"
          id="initialBalance"
          value={formData.initialBalance}
          onChange={(e) => onInputChange("initialBalance", Number(e.target.value))}
          required
        />
      </div>

      <Button type="submit" className="w-full">
        {isEditing ? "Salvar Alterações" : "Criar Carteira"}
      </Button>
    </form>
  );
}; 