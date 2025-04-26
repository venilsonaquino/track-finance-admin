export type MenuItemType = {
	key: string
	label: string
	isTitle?: boolean
	icon?: any
	url?: string
	parentKey?: string
	target?: string
	badge?: {
		variant: string
		text: string
	}
	children?: MenuItemType[]
}

export const VERTICAL_MENU_ITEMS: MenuItemType[] = [
	// {
	// 	key: 'main',
	// 	label: 'Main',
	// 	isTitle: true,
	// },
	{
		key: 'dashboard',
		icon: '',
		label: 'Dashboard',
		isTitle: false,
		children: [
			{
				key: 'ds-analytics',
				label: 'Analytics',
				url: '/dashboards/analytics',
				parentKey: 'dashboard',
			}
		],
	},
	{
		key: 'work-time-expenses',
		icon: '',
		label: 'Gastos em Tempo',
		isTitle: false,
		url: '/work-time-expenses',
	},
	{
		key: 'transactions',
		label: 'Transações',
		isTitle: false,
		url: '/transactions',
		icon: '',
	},
	{
		key: 'import-files',
		label: 'Importar Arquivos',
		isTitle: false,
		url: '/import-files',
		icon: '',
	},
	{
		key: 'categories',
		label: 'Categorias',
		isTitle: false,
		url: '/categories',
		icon: '',
	},
	{
		key: 'wallets',
		label: 'Carteiras',
		isTitle: false,
		url: '/wallets',
		icon: '',
	},
	{
		key: 'pages',
		icon: '',
		label: 'Pages',
		isTitle: false,
		children: [
			{
				key: 'pages-blogs',
				label: 'Blogs',
				url: '/pages/blogs',
				parentKey: 'pages',
			},
			{
				key: 'pages-faqs',
				label: 'FAQs',
				url: '/pages/faqs',
				parentKey: 'pages',
			},
			{
				key: 'pages-pricing',
				label: 'Pricing',
				url: '/pages/pricing',
				parentKey: 'pages',
			},
			{
				key: 'pages-profile',
				label: 'Profile',
				url: '/pages/profile',
				parentKey: 'pages',
			},
			{
				key: 'pages-starter-page',
				label: 'Starter Page',
				url: '/pages/starter',
				parentKey: 'pages',
			},
			{
				key: 'pages-timeline',
				label: 'Timeline',
				url: '/pages/timeline',
				parentKey: 'pages',
			},
			{
				key: 'pages-tree-view',
				label: 'Treeview',
				url: '/pages/treeview',
				parentKey: 'pages',
			},
		],
	},
]
