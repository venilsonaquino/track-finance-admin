import { useEffect } from "react";
import { WalletResponse } from "@/api/dtos/wallet/wallet-response";
import { useState } from "react";
import { WalletService } from "@/api/services/walletService";

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

  return { wallets, loading, error };
};
