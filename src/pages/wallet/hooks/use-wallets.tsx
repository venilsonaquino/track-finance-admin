import { useEffect } from "react";
import { WalletResponse } from "@/api/dtos/wallet/wallet-response";
import { useState } from "react";
import { WalletService } from "@/api/services/walletService";
import { WalletRequest } from "@/api/dtos/wallet/wallet-request";

export const useWallets = () => {
  const [wallets, setWallets] = useState<WalletResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWallets = async () => {
    try {
      setLoading(true);
      const response = await WalletService.getWallets();
      const { data } = response;
      setWallets(Array.isArray(data) ? data : []);
    } catch (error) {
      setError(error as string);
      setWallets([]);
    } finally {
      setLoading(false);
    } 
  };

  useEffect(() => {
    fetchWallets();
  }, []);

  const createWallet = async (wallet: WalletRequest) => {
    try {
      const response = await WalletService.createWallet(wallet);
      setWallets(prev => [...prev, response.data]);
    } catch (error) {
      setError(error as string);
    }
  };  

  const updateWallet = async (id: string, wallet: WalletRequest) => {
    try {
      const response = await WalletService.updateWallet(id, wallet);
      setWallets(prev => prev.map((w) => (w.id === id ? response.data : w)));
    } catch (error) {
      setError(error as string);
    }
  };

  const deleteWallet = async (id: string) => {
    try {
      await WalletService.deleteWallet(id);
      setWallets(prev => prev.filter((w) => w.id !== id));
    } catch (error) {
      setError(error as string);
    }
  };

  return { wallets, loading, error, createWallet, updateWallet, deleteWallet };
};
