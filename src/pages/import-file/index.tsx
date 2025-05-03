import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Upload, CheckCircle2 } from "lucide-react";
import PageBreadcrumbNav from "@/components/BreadcrumbNav";
import { toast } from "sonner";

const ImportFile = () => {
	const [file, setFile] = useState<File | null>(null);
	const [isValid, setIsValid] = useState(false);
	const [isUploading, setIsUploading] = useState(false);
	const [progress, setProgress] = useState(0);

	const onDrop = useCallback((acceptedFiles: File[]) => {
		const selectedFile = acceptedFiles[0];
		if (selectedFile) {
			const isValidSize = selectedFile.size <= 5 * 1024 * 1024; // 5MB
			const isValidType = selectedFile.name.toLowerCase().endsWith('.ofx');
			
			if (isValidSize && isValidType) {
				setFile(selectedFile);
				setIsValid(true);
			} else {
				setFile(null);
				setIsValid(false);
				toast.error("Arquivo inválido. Por favor, selecione um arquivo OFX com até 5MB.");
			}
		}
	}, []);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: {
			'application/vnd.ofx': ['.ofx']
		},
		maxSize: 5 * 1024 * 1024,
		multiple: false
	});

	const handleUpload = async () => {
		if (!file) return;

		setIsUploading(true);
		setProgress(0);

		// Simulando o upload do arquivo
		const interval = setInterval(() => {
			setProgress((prev) => {
				if (prev >= 100) {
					clearInterval(interval);
					setIsUploading(false);
					toast.success("Arquivo importado com sucesso!", {
						icon: <CheckCircle2 className="text-green-500" />,
					});
					return 100;
				}
				return prev + 10;
			});
		}, 300);
	};

	return (
		<>
			<PageBreadcrumbNav title="Importar Arquivo" />
			
			<div className="mt-8 max-w-2xl mx-auto">
				<Tabs defaultValue="ofx" className="w-full">
					<TabsList className="grid w-full grid-cols-1">
						<TabsTrigger value="ofx">Importar OFX</TabsTrigger>
					</TabsList>
					
					<TabsContent value="ofx">
						<Card className="p-6">
							<div
								{...getRootProps()}
								className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
									${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary'}`}
							>
								<input {...getInputProps()} />
								<Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
								<p className="text-gray-600">
									{isDragActive
										? "Solte o arquivo aqui..."
										: "Arraste e solte arquivos OFX aqui ou clique para fazer upload. (Limite de 5MB.)"}
								</p>
								{file && (
									<p className="mt-2 text-sm text-gray-500">
										Arquivo selecionado: {file.name}
									</p>
								)}
							</div>
							
							{isUploading && (
								<div className="mt-4">
									<Progress value={progress} className="h-2" />
									<p className="text-sm text-gray-500 mt-2 text-center">
										Importando arquivo... {progress}%
									</p>
								</div>
							)}
							
							<div className="mt-6 flex justify-end">
								<Button 
									disabled={!isValid || isUploading}
									onClick={handleUpload}
								>
									{isUploading ? "IMPORTANDO..." : "ENVIAR"}
								</Button>
							</div>
						</Card>
					</TabsContent>
				</Tabs>
			</div>
		</>
	);
};

export default ImportFile;
