import { useState } from "react";
import PageBreadcrumbNav from "@/components/BreadcrumbNav";
import { WalletDialog } from "@/pages/wallet/components/wallet-dialog";
import { WalletCard } from "@/pages/wallet/components/wallet-card";
import { useWallets } from "./hooks/use-wallets";
import { WalletRequest } from "@/api/dtos/wallet/wallet-request";
import { toast } from "sonner";
import { WalletResponse } from "@/api/dtos/wallet/wallet-response";
import { ConfirmDelete } from "@/components/confirm-delete";

const Wallet = () => {
	const { wallets, loading, error, createWallet, updateWallet, deleteWallet } = useWallets();
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [walletToDelete, setWalletToDelete] = useState<string | null>(null);
	const [editingWallet, setEditingWallet] = useState<string | null>(null);
	const [formData, setFormData] = useState<Partial<WalletResponse>>({
		name: "",
		description: "",
		color: "#000000",
		icon: "wallet",
		balance: 0,
		walletType: "personal",
	});

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			if (editingWallet) {
				await updateWallet(editingWallet, formData as WalletRequest);
				toast.success("Carteira atualizada com sucesso!");
			} else {
				await createWallet(formData as WalletRequest);
				toast.success("Carteira criada com sucesso!");
			}
			setIsDialogOpen(false);
			setFormData({
				name: "",
				description: "",
				color: "#000000",
				icon: "wallet",
				balance: 0,
				walletType: "personal",
			});
			setEditingWallet(null);
		} catch (error) {
			toast.error("Erro ao salvar carteira");
		}
	};

	const handleInputChange = (field: string | number | symbol, value: string | number) => {
		setFormData(prev => ({ ...prev, [field]: value }));
	};

	const handleEdit = (walletId: string) => {
		const wallet = wallets.find(w => w.id === walletId);
		if (wallet) {
			setEditingWallet(walletId);
			setFormData(wallet);
			setIsDialogOpen(true);
		}
	};

	const handleDelete = async (id: string) => {
		setWalletToDelete(id);
		setIsDeleteDialogOpen(true);
	};

	const confirmDelete = async () => {
		if (!walletToDelete) return;
		
		try {
			await deleteWallet(walletToDelete);
			toast.success("Carteira excluída com sucesso!");
		} catch (error) {
			toast.error("Erro ao excluir carteira");
		} finally {
			setIsDeleteDialogOpen(false);
			setWalletToDelete(null);
		}
	};

	if (loading) {
		return <div className="container mx-auto p-4">Carregando...</div>;
	}

	if (error) {
		return <div className="container mx-auto p-4 text-red-500">Erro: {error}</div>;
	}

	return (
		<div className="container mx-auto p-4">
			<PageBreadcrumbNav title="Carteiras" />
			
			<div className="flex justify-end mb-4">
				<WalletDialog
					isOpen={isDialogOpen}
					onOpenChange={setIsDialogOpen}
					formData={formData}
					onSubmit={handleSubmit}
					onInputChange={handleInputChange}
					isEditing={!!editingWallet}
				/>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{wallets.map((wallet) => (
					<WalletCard
						key={wallet.id}
						wallet={wallet}
						onEdit={() => handleEdit(wallet.id)}
						onDelete={() => handleDelete(wallet.id)}
					/>
				))}
			</div>

			<ConfirmDelete
				isDeleteDialogOpen={isDeleteDialogOpen}
				setIsDeleteDialogOpen={setIsDeleteDialogOpen}
				confirmDelete={confirmDelete}
			/>

		</div>
	);
};

export default Wallet;