import { WalletClient } from 'viem';
import { base } from 'viem/chains';

// Create a signer adapter for x402 that works with wagmi
export function createWagmiSigner(walletClient: WalletClient) {
  if (!walletClient) {
    throw new Error('Wallet client is required');
  }
  return {
    // This is a simplified signer that implements the basic interface
    account: walletClient.account,
    chain: base,
    
    async signMessage(message: string) {
      if (!walletClient.account) {
        throw new Error('No account connected');
      }
      return await walletClient.signMessage({
        account: walletClient.account,
        message,
      });
    },

    async signTransaction(transaction: any) {
      if (!walletClient.account) {
        throw new Error('No account connected');
      }
      return await walletClient.signTransaction({
        account: walletClient.account,
        ...transaction,
      });
    },

    async sendTransaction(transaction: any) {
      if (!walletClient.account) {
        throw new Error('No account connected');
      }
      return await walletClient.sendTransaction({
        account: walletClient.account,
        chain: base,
        ...transaction,
      });
    },

    // Additional methods that might be required by x402
    getAddress() {
      return walletClient.account?.address;
    },

    getChainId() {
      return base.id;
    },
  };
}