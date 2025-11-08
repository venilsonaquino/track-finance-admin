import PageBreadcrumbNav from "@/components/BreadcrumbNav";

const PlanningPage = () => {
	return (
    <div className="flex justify-between items-center">
      <PageBreadcrumbNav items={[{ label: "Transações" }, { label: "Planejamento", href: "/transacoes/planejamento" }]} />
		</div>
	);
};

export default PlanningPage;
