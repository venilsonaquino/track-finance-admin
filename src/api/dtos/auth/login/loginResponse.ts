export type LoginResponse = {
	token: string
	user: {
		id: number
		email?: string
		fullName?: string
		plan?: string
	}
}