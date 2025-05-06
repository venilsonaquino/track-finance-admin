import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CategoryRequest } from "@/api/dtos/category/category-request";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const schema = yup.object().shape({
  name: yup.string().required("Nome é obrigatório"),
  description: yup.string().required("Descrição é obrigatória"),
  color: yup.string().required("Cor é obrigatória"),
  icon: yup.string().required("Ícone é obrigatório"),
});

interface CategoryFormProps {
  initialData?: Partial<CategoryRequest>;
  onSubmit: (data: CategoryRequest) => void;
  onCancel: () => void;
}

const colors = [
  { value: "#FF0000", label: "Vermelho" },
  { value: "#0000FF", label: "Azul" },
  { value: "#008000", label: "Verde" },
  { value: "#FFFF00", label: "Amarelo" },
  { value: "#800080", label: "Roxo" },
  { value: "#FFC0CB", label: "Rosa" },
  { value: "#FFA500", label: "Laranja" },
];

const icons = [
  { value: "shopping-cart", label: "Carrinho" },
  { value: "home", label: "Casa" },
  { value: "utensils", label: "Comida" },
  { value: "car", label: "Carro" },
  { value: "heart", label: "Coração" },
  { value: "gift", label: "Presente" },
  { value: "briefcase", label: "Maleta" },
];

export const CategoryForm = ({
  initialData,
  onSubmit,
  onCancel,
}: CategoryFormProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CategoryRequest>({
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
          placeholder="Digite o nome da categoria"
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="description">Descrição</label>
        <Input
          id="description"
          {...register("description")}
          placeholder="Digite a descrição da categoria"
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="color">Cor</label>
        <Select
          defaultValue={initialData?.color}
          onValueChange={(value) => setValue("color", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione uma cor" />
          </SelectTrigger>
          <SelectContent>
            {colors.map((color) => (
              <SelectItem key={color.value} value={color.value}>
                {color.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.color && (
          <p className="text-sm text-red-500">{errors.color.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="icon">Ícone</label>
        <Select
          defaultValue={initialData?.icon}
          onValueChange={(value) => setValue("icon", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione um ícone" />
          </SelectTrigger>
          <SelectContent>
            {icons.map((icon) => (
              <SelectItem key={icon.value} value={icon.value}>
                {icon.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.icon && (
          <p className="text-sm text-red-500">{errors.icon.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">Salvar</Button>
      </div>
    </form>
  );
}; 