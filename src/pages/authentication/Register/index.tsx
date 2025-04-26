import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LogIn } from "lucide-react"

interface RegisterProps {
    onShowLogin: () => void
}

const Register = ({ onShowLogin }: RegisterProps) => {
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
                        <form className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nome completo</Label>
                                <Input id="name" type="text" placeholder="Seu nome completo" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" placeholder="seu@email.com" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Senha</Label>
                                <div className="relative">
                                    <Input id="password" type="password" />
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    >
                                        Mostrar
                                    </Button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirmar senha</Label>
                                <div className="relative">
                                    <Input id="confirmPassword" type="password" />
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    >
                                        Mostrar
                                    </Button>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="terms" />
                                <Label htmlFor="terms" className="text-sm">
                                    Eu concordo com os{" "}
                                    <Button variant="link" className="p-0 h-auto">
                                        Termos de uso
                                    </Button>
                                </Label>
                            </div>
                            <Button className="w-full">
                                <LogIn className="mr-2 h-4 w-4" />
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