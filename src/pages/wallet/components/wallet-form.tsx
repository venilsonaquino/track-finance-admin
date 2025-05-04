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
import { WalletResponse } from "@/api/dtos/wallet/wallet-response";
import * as yup from "yup";
import { WalletRequest } from "@/api/dtos/wallet/wallet-request";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

const schema = yup.object().shape({
  name: yup.string().required("Nome é obrigatório"),
  description: yup.string().required("Descrição é obrigatória"),
  color: yup.string().required("Cor é obrigatória"),
  walletType: yup.string().required("Tipo é obrigatório"),
  balance: yup.number().required("Saldo inicial é obrigatório"),
  icon: yup.string().default("wallet"),
});

interface WalletFormProps {
  initialData?: Partial<WalletResponse>;
  onSubmit: (data: WalletRequest) => void;
  onInputChange: (field: string | number | symbol, value: string | number) => void;
  onCancel?: () => void;
}

export const WalletForm = ({
  initialData,
  onSubmit,
}: WalletFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WalletRequest>({
    resolver: yupResolver(schema),
    defaultValues: initialData,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="name">Nome</label>
        <Input
          id="name"
          {...register("name")}
        />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <label htmlFor="description">Descrição</label>
        <Textarea
          id="description"
          {...register("description")}
        />
        {errors.description && <p className="text-red-500">{errors.description.message}</p>}
      </div>

      <div className="space-y-2">
        <label htmlFor="color">Cor</label>
        <Input
          type="color"
          id="color"
          {...register("color")}
        />
        {errors.color && <p className="text-red-500">{errors.color.message}</p>}
      </div>

      <div className="space-y-2">
        <label htmlFor="type">Tipo</label>
        <Select
          {...register("walletType")}
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
          {...register("balance")}
        />
        {errors.balance && <p className="text-red-500">{errors.balance.message}</p>}
      </div>

      <Button type="submit" className="w-full">
        {initialData ? "Salvar Alterações" : "Criar Carteira"}
      </Button>
    </form>
  );
}; 