import { lazy } from 'react'
import { Navigate, RouteProps } from 'react-router-dom'

const Login = lazy(() => import('@/pages/authentication/Login'))
const Register = lazy(() => import('@/pages/authentication/Register'))
const Error404 = lazy(() => import('@/pages/authentication/Error404'))
const Error500 = lazy(() => import('@/pages/authentication/Error500'))
const Dashboard = lazy(() => import('@/pages/dashboard'))

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
		path: '/auth/register',
		name: 'Register',
		element: <Register />,
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

const allAdminRoutes = [
	...dashboardRoutes,
]

const allBlankRoutes = [...authRoutes]

export { allAdminRoutes, allBlankRoutes }