export interface WalletResponse {
    id: string;
    name: string;
    description: string;
    walletType: string;
    icon: string;
    color: string;
    balance: number;
    userId: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}