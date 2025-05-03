import { useState } from "react";
import PageBreadcrumbNav from "@/components/BreadcrumbNav";
import { WalletDialog } from "@/components/wallet/wallet-dialog";
import { WalletCard } from "@/components/wallet/wallet-card";
import type { Wallet } from "@/types/wallet";

const Wallet = () => {
	const [wallets, setWallets] = useState<Wallet[]>([]);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [editingWallet, setEditingWallet] = useState<Wallet | null>(null);
	const [formData, setFormData] = useState<Partial<Wallet>>({
		name: "",
		description: "",
		color: "#000000",
		icon: "wallet",
		type: "personal",
		initialBalance: 0,
	});

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (editingWallet) {
			setWallets(wallets.map(w => w.id === editingWallet.id ? { ...formData, id: w.id } as Wallet : w));
		} else {
			setWallets([...wallets, { ...formData, id: Date.now().toString() } as Wallet]);
		}
		setIsDialogOpen(false);
		setFormData({
			name: "",
			description: "",
			color: "#000000",
			icon: "wallet",
			type: "personal",
			initialBalance: 0,
		});
		setEditingWallet(null);
	};

	const handleInputChange = (field: keyof Wallet, value: string | number) => {
		setFormData(prev => ({ ...prev, [field]: value }));
	};

	const handleEdit = (wallet: Wallet) => {
		setEditingWallet(wallet);
		setFormData(wallet);
		setIsDialogOpen(true);
	};

	const handleDelete = (id: string) => {
		setWallets(wallets.filter(w => w.id !== id));
	};

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
						onEdit={handleEdit}
						onDelete={handleDelete}
					/>
				))}
			</div>
		</div>
	);
};

export default Wallet;