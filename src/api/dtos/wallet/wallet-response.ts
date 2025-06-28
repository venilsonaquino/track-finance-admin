export interface WalletResponse {
    id?: string;
    name: string;
    description: string;
    walletType: string;
    balance: number;
    bankId?: string;
    userId: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}