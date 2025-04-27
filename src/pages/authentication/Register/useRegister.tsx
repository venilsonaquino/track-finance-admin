import { useState } from "react"
import { AuthService } from "@/api/services/authService"
import { toast } from "sonner"
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

interface UseRegisterProps {
    onShowLogin: () => void
}

export function useRegister({ onShowLogin }: UseRegisterProps) {
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const schemaResolver = yup.object().shape({
        fullName: yup.string().required('Nome completo é obrigatório'),
        email: yup
            .string()
            .email('Por favor, insira um e-mail válido')
            .required('Email é obrigatório'),
        password: yup
            .string()
            .min(6, 'Senha deve ter pelo menos 6 caracteres')
            .required('Senha é obrigatória'),
        confirmPassword: yup
            .string()
            .oneOf([yup.ref('password')], 'Senhas não conferem')
            .required('Confirmação de senha é obrigatória'),
        termsAccepted: yup
            .boolean()
            .oneOf([true], 'Você precisa aceitar os termos de uso')
            .required('Você precisa aceitar os termos de uso')
    })

    const { control, handleSubmit } = useForm({
        resolver: yupResolver(schemaResolver),
        defaultValues: {
            fullName: '',
            email: '',
            password: '',
            confirmPassword: '',
            termsAccepted: false
        },
    })

    type RegisterFormFields = yup.InferType<typeof schemaResolver>

    const register = handleSubmit(async (values: RegisterFormFields) => {
        setLoading(true)
        
        try {
            await AuthService.register({
                fullName: values.fullName,
                email: values.email,
                password: values.password,
                termsAccepted: values.termsAccepted
            })
            
            toast.success('Cadastro realizado com sucesso!', {
                description: 'Você já pode fazer login no sistema.',
                position: 'top-right',
                duration: 5000
            })
            
            onShowLogin()
        } catch (error: any) {
            toast.error('Erro ao cadastrar', {
                description: error.response?.data?.message || 'Ocorreu um erro ao processar o cadastro.',
                position: 'top-right',
                duration: 5000
            })
        } finally {
            setLoading(false)
        }
    })

    const toggleShowPassword = () => setShowPassword(prev => !prev)
    const toggleShowConfirmPassword = () => setShowConfirmPassword(prev => !prev)

    return {
        loading,
        control,
        register,
        showPassword,
        showConfirmPassword,
        toggleShowPassword,
        toggleShowConfirmPassword
    }
} 