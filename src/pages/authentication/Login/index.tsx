import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

const Login = () => {
    return (
        <div className="min-h-screen flex">
            {/* Lado esquerdo */}
            <div className="hidden lg:flex w-1/2 bg-primary items-center justify-center">
                <div className="text-center text-white space-y-4">
                    <div className="w-32 h-32 bg-white rounded-full mx-auto flex items-center justify-center">
                        <span className="text-primary text-4xl font-bold">TF</span>
                    </div>
                    <h1 className="text-4xl font-bold">Track Finance</h1>
                    <p className="text-lg">Gerencie suas finanças de forma simples e eficiente</p>
                </div>
            </div>

            {/* Lado direito */}
            <div className="w-full lg:w-1/2 flex flex-col p-8">
                <div className="flex justify-end space-x-4 mb-8">
                    <Button variant="outline">Entrar</Button>
                    <Button variant="outline">Cadastrar</Button>
                </div>

                <div className="flex-1 flex items-center justify-center">
                    <Card className="w-full max-w-md">
                        <CardHeader>
                            <CardTitle className="text-2xl">Bem-vindo de volta</CardTitle>
                            <CardDescription>
                                Entre com suas credenciais para acessar sua conta
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" placeholder="seu@email.com" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password">Senha</Label>
                                    <Input id="password" type="password" />
                                </div>
                                <Button className="w-full">Entrar</Button>
                                <div className="text-center">
                                    <Button variant="link" className="text-sm">
                                        Esqueceu sua senha?
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default Login