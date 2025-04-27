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
	{
		key: 'dashboard',
		icon: '',
		label: 'Dashboard',
		isTitle: false,
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
]