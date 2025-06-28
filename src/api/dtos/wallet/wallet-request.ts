export interface WalletRequest {
    name: string;
    description: string;
    walletType: string;
    color: string;
    balance: number;
    bankId?: string;
}