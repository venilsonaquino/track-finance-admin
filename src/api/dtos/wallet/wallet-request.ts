export interface WalletRequest {
    name: string;
    description: string;
    walletType: string;
    balance: number;
    bankId?: string;
}