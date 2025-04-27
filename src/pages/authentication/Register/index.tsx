import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, LogIn } from "lucide-react"
import { useRegister } from "./useRegister"
import { Controller } from "react-hook-form"

interface RegisterProps {
    onShowLogin: () => void
}

const Register = ({ onShowLogin }: RegisterProps) => {
    const {
        loading,
        control,
        register,
        showPassword,
        showConfirmPassword,
        toggleShowPassword,
        toggleShowConfirmPassword
    } = useRegister({ onShowLogin })

    return (
        <div className="w-full lg:w-1/2 flex flex-col p-8">
            <div className="flex justify-end space-x-4 mb-8">
                <Button variant="outline" onClick={onShowLogin}>Entrar</Button>
                <Button variant="outline" className="bg-white">Cadastrar</Button>
            </div>

            <div className="flex-1 flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-2xl">Criar uma conta</CardTitle>
                        <CardDescription>
                            Preencha os campos abaixo para se cadastrar
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form className="space-y-4" onSubmit={register}>
                            <div className="space-y-2">
                                <Label htmlFor="fullName">Nome completo</Label>
                                <Controller
                                    name="fullName"
                                    control={control}
                                    render={({ field, fieldState: { error } }) => (
                                        <>
                                            <Input 
                                                {...field}
                                                id="fullName" 
                                                type="text" 
                                                placeholder="Seu nome completo" 
                                                className={error ? "border-red-500" : ""}
                                            />
                                            {error && <p className="text-sm text-red-500">{error.message}</p>}
                                        </>
                                    )}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Controller
                                    name="email"
                                    control={control}
                                    render={({ field, fieldState: { error } }) => (
                                        <>
                                            <Input 
                                                {...field}
                                                id="email" 
                                                type="email" 
                                                placeholder="seu@email.com" 
                                                className={error ? "border-red-500" : ""}
                                            />
                                            {error && <p className="text-sm text-red-500">{error.message}</p>}
                                        </>
                                    )}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Senha</Label>
                                <Controller
                                    name="password"
                                    control={control}
                                    render={({ field, fieldState: { error } }) => (
                                        <>
                                            <div className="relative">
                                                <Input 
                                                    {...field}
                                                    id="password" 
                                                    type={showPassword ? "text" : "password"}
                                                    className={error ? "border-red-500" : ""}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                    onClick={toggleShowPassword}
                                                >
                                                    {showPassword ? (
                                                        <Eye className="h-4 w-4" />
                                                    ) : (
                                                        <EyeOff className="h-4 w-4" />
                                                    )}
                                                </Button>
                                            </div>
                                            {error && <p className="text-sm text-red-500">{error.message}</p>}
                                        </>
                                    )}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirmar senha</Label>
                                <Controller
                                    name="confirmPassword"
                                    control={control}
                                    render={({ field, fieldState: { error } }) => (
                                        <>
                                            <div className="relative">
                                                <Input 
                                                    {...field}
                                                    id="confirmPassword" 
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    className={error ? "border-red-500" : ""}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                    onClick={toggleShowConfirmPassword}
                                                >
                                                    {showConfirmPassword ? (
                                                        <Eye className="h-4 w-4" />
                                                    ) : (
                                                        <EyeOff className="h-4 w-4" />
                                                    )}
                                                </Button>
                                            </div>
                                            {error && <p className="text-sm text-red-500">{error.message}</p>}
                                        </>
                                    )}
                                />
                            </div>
                            <div className="flex items-start space-x-2">
                                <Controller
                                    name="termsAccepted"
                                    control={control}
                                    render={({ field, fieldState: { error } }) => (
                                        <>
                                            <div className="flex items-start space-x-2">
                                                <Checkbox 
                                                    id="terms" 
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                                <div>
                                                    <Label htmlFor="terms" className="text-sm">
                                                        Eu concordo com os{" "}
                                                        <Button type="button" variant="link" className="p-0 h-auto">
                                                            Termos de uso
                                                        </Button>
                                                    </Label>
                                                    {error && <p className="text-sm text-red-500">{error.message}</p>}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                />
                            </div>
                            <Button className="w-full" type="submit" disabled={loading}>
                                {loading ? (
                                    <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                                ) : (
                                    <LogIn className="mr-2 h-4 w-4" />
                                )}
                                Cadastrar
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default Register