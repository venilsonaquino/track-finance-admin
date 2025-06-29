import HttpClient from "@/api/httpClient"
import { useSearchParams } from "react-router-dom"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { useAuthContext } from "@/context/useAuthContext"
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'


export default function useLogin() {
	const [loading, setLoading] = useState(false)
	const navigate = useNavigate()
	const [searchParams] = useSearchParams()

	const { isAuthenticated, saveSession } = useAuthContext()

	const schemaResolver = yup.object().shape({
		email: yup
			.string()
			.email('Por favor, insira um e-mail válido')
			.required('Por favor, insira seu e-mail'),
		password: yup.string().required('Por favor, insira sua senha'),
	})

	const { control, handleSubmit } = useForm({
		resolver: yupResolver(schemaResolver),
		defaultValues: {
			email: '',
			password: '',
		},
	})

	type LoginFormFields = yup.InferType<typeof schemaResolver>

	const redirectUrl = searchParams.get('next') ?? '/'

	const login = handleSubmit(async function (values: LoginFormFields) {
		setLoading(true)
		try {
			const res = await HttpClient.post('auth/login', {
				'email': values.email,
				'password': values.password,
			})
			if (res.data.token) {
				saveSession({
					...(res.data ?? {}),
					token: res.data.token,
				})
				toast.success('Login efetuado com sucesso, redirecionando...', {
					position: 'top-right',
					duration: 5000,
				})
				navigate(redirectUrl)
			}
		} catch (e: any) {
			if (e.response?.data?.error) {
				toast.error(e.response?.data?.message, {
					position: 'top-right',
					duration: 5000,
				})
        return
			}
			toast.error('Erro ao efetuar login, por favor tente novamente mais tarde', {
				position: 'top-right',
				duration: 5000,
			})
		} finally {
			setLoading(false)
		}
	})

	return { loading, login, redirectUrl, isAuthenticated, control }
}