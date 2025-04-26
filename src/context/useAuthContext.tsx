import { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { deleteCookie, hasCookie, setCookie } from 'cookies-next'
import { LoginResponse } from '@/api/dtos/auth/login/loginResponse'


export type AuthContextType = {
	authenticatedUser: LoginResponse | undefined
	isAuthenticated: boolean
	saveSession: (session: LoginResponse) => void
	removeSession: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuthContext() {
	const context = useContext(AuthContext)
	if (context === undefined) {
		throw new Error('useAuthContext must be used within an AuthProvider')
	}
	return context
}

const authSessionKey = '_TRACK_FINANCE_TOKEN_'

export function AuthProvider({ children }: { children: ReactNode }) {
	const [authenticatedUser, setAuthenticatedUser] = useState<LoginResponse | undefined>(undefined)
	const [isAuthenticated, setIsAuthenticated] = useState(false)

	useEffect(() => {
		const checkAuth = async () => {
			const hasAuth = await hasCookie(authSessionKey)
			setIsAuthenticated(hasAuth)
		}
		checkAuth()
	}, [])

	const saveSession = (authenticatedUser: LoginResponse) => {
		setCookie(authSessionKey, JSON.stringify(authenticatedUser))
		setAuthenticatedUser(authenticatedUser)
		setIsAuthenticated(true)
	}

	const removeSession = () => {
		deleteCookie(authSessionKey)
		setAuthenticatedUser(undefined)
		setIsAuthenticated(false)
	}

	return (
		<AuthContext.Provider
			value={{
				authenticatedUser,
				isAuthenticated,
				saveSession,
				removeSession,
			}}
		>
			{children}
		</AuthContext.Provider>
	)
}