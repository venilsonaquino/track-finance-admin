import { lazy } from 'react'
import { Navigate, RouteProps } from 'react-router-dom'

const Login = lazy(() => import('@/pages/authentication/Login'))
const Error404 = lazy(() => import('@/pages/authentication/Error404'))
const Error500 = lazy(() => import('@/pages/authentication/Error500'))
const Dashboard = lazy(() => import('@/pages/dashboard'))

const ImportFile = lazy(() => import('@/pages/import-file'))
const WorkTimeExpense = lazy(() => import('@/pages/work-time-expense'))
const Wallet = lazy(() => import('@/pages/wallet'))
const Transaction = lazy(() => import('@/pages/transaction'))
const Categories = lazy(() => import('@/pages/category'))

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
		path: '/work-time-expenses',
		name: 'Work Time Expenses',
		element: <WorkTimeExpense />,
	},
]

const transactionsRoutes: RoutesProps[] = [
	{
		path: '/transactions',
		name: 'Transactions',
		element: <Transaction />,
	},
]

const importFilesRoutes: RoutesProps[] = [
	{
		path: '/import-files',
		name: 'Import Files',
		element: <ImportFile />,
	},
]

const walletsRoutes: RoutesProps[] = [
	{
		path: '/wallets',
		name: 'Wallets',
		element: <Wallet />,
	},
]

const categoriesRoutes: RoutesProps[] = [
	{
		path: '/categories',
		name: 'Categories',
		element: <Categories />,
	},
]

const allAdminRoutes = [
	...dashboardRoutes,
	...workTimeExpensesRoutes,
	...transactionsRoutes,
	...importFilesRoutes,
	...walletsRoutes,
	...categoriesRoutes,
]
const allBlankRoutes = [...authRoutes]

export { allAdminRoutes, allBlankRoutes }