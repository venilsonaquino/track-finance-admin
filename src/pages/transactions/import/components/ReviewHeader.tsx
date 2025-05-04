import { Button } from "@/components/ui/button";
import PageBreadcrumbNav from "@/components/BreadcrumbNav";

interface ReviewHeaderProps {
  onCancel: () => void;
  onSaveAll: () => void;
}

export const ReviewHeader = ({ onCancel, onSaveAll }: ReviewHeaderProps) => {
  return (
    <>
      <PageBreadcrumbNav title="Revisar Transações" />
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold">Transações Importadas</h2>
          <p className="text-sm text-gray-500 mt-1">
            Revise e categorize suas transações antes de salvar
          </p>
        </div>
        <div className="space-x-3">
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button onClick={onSaveAll}>
            Salvar Novas
          </Button>
        </div>
      </div>
    </>
  );
}; 