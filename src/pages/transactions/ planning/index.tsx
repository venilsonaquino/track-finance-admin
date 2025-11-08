import PageBreadcrumbNav from "@/components/BreadcrumbNav";

const PlanningPage = () => {
	return (
    <div className="flex justify-between items-center">
      {/* <PageBreadcrumbNav paths={[{ label: 'Transações', href: '/transacoes/planejamento' }]} /> */}
      <PageBreadcrumbNav title="Planejamento" />
		</div>
	);
};

export default PlanningPage;
