export type AuthUser = {
	token: string
	user: {
		id: number
		email?: string
		fullName?: string
		plan?: string
	}
}

export type AuthContextType = {
	authenticatedUser: AuthUser | undefined
	isAuthenticated: boolean
	saveSession: (session: AuthUser) => void
	removeSession: () => void
}
