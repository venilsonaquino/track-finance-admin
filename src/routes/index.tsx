import { lazy } from 'react'
import { Navigate, RouteProps } from 'react-router-dom'

const Login = lazy(() => import('@/pages/authentication/Login'))
const Error404 = lazy(() => import('@/pages/authentication/Error404'))
const Error500 = lazy(() => import('@/pages/authentication/Error500'))
const Dashboard = lazy(() => import('@/pages/dashboard'))

const WorkTimeExpense = lazy(() => import('@/pages/work-time-expense'))
const Wallet = lazy(() => import('@/pages/wallet'))
const Transaction = lazy(() => import('@/pages/transaction'))
const Categories = lazy(() => import('@/pages/category'))
const ImportTransactionPage = lazy(() => import('@/pages/transactions/import'))

type RoutesProps = {
    path: RouteProps['path']
    name: string
    element: RouteProps['element']
}

const dashboardRoutes: RoutesProps[] = [
    {
      path: '/',
      name: 'Home',
      element: <Navigate to='/dashboard' />,
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        element: <Dashboard />,
    }
]

const authRoutes: RoutesProps[] = [
	{
		path: '/auth/login',
		name: 'Login',
		element: <Login />,
	},
	{
		path: '/auth/auth-404',
		name: '404 Error',
		element: <Error404 />,
	},
	{
		path: '/auth/auth-500',
		name: '500 Error',
		element: <Error500 />,
	},
	{
		path: '*',
		name: '404 Error',
		element: <Error404 />,
	},
]

const workTimeExpensesRoutes: RoutesProps[] = [
	{
		path: '/horas-e-despesas',
		name: 'Horas e Despesas',
		element: <WorkTimeExpense />,
	},
]

const transactionsRoutes: RoutesProps[] = [
	{
		path: '/transacoes/lancamentos',
		name: 'Transações',
		element: <Transaction />,
	},
	{
		path: '/transacoes/importar',
		name: 'Importar Transações',
		element: <ImportTransactionPage />,
	}
]

const walletsRoutes: RoutesProps[] = [
	{
		path: '/carteiras',
		name: 'Carteiras',
		element: <Wallet />,
	},
]

const categoriesRoutes: RoutesProps[] = [
	{
		path: '/categorias',
		name: 'Categorias',
		element: <Categories />,
	},
]

const allAdminRoutes = [
	...dashboardRoutes,
	...workTimeExpensesRoutes,
	...transactionsRoutes,
	...walletsRoutes,
	...categoriesRoutes,
]
const allBlankRoutes = [...authRoutes]

export { allAdminRoutes, allBlankRoutes }