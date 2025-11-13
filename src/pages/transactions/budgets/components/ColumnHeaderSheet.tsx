import { CardHeader, CardTitle } from "@/components/ui/card";

type ColumnHeaderProps = {
  icon: React.ReactNode;
  title: string;
};

export default function ColumnHeader({ icon, title }: ColumnHeaderProps) {
  return (
    <CardHeader className="flex-row items-center justify-between border-b">
      <CardTitle className="flex items-center gap-2">
        {icon} {title}
      </CardTitle>
    </CardHeader>
  );
}