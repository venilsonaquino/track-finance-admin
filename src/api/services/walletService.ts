import HttpClient from "@/api/httpClient";
import { WalletRequest } from "../dtos/wallet/wallet-request";

export const WalletService = {
  getWallets: () => HttpClient.get("/wallets"),
  createWallet: (wallet: WalletRequest) => HttpClient.post("/wallets", wallet),
  updateWallet: (id: string, wallet: WalletRequest) => HttpClient.put(`/wallets/${id}`, wallet),
  deleteWallet: (id: string) => HttpClient.delete(`/wallets/${id}`),
};
