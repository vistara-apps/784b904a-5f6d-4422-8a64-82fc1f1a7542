'use client';

import { useWalletClient, usePublicClient } from 'wagmi';
import { useEffect, useState, useCallback } from 'react';
import axios, { AxiosInstance } from 'axios';
import { withPaymentInterceptor } from 'x402-axios';
import { createWagmiSigner } from '@/lib/adapters/x402Signer';
import { base } from 'viem/chains';

// USDC contract address on Base
export const USDC_BASE_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';

interface PaymentState {
  isLoading: boolean;
  error: string | null;
  lastPayment: {
    amount: string;
    txHash: string;
    timestamp: Date;
  } | null;
}

interface UsePaymentsReturn {
  paymentClient: AxiosInstance | null;
  paymentState: PaymentState;
  makePayment: (url: string, amount?: string) => Promise<any>;
  verifyTransaction: (txHash: string) => Promise<boolean>;
  resetError: () => void;
}

export function usePayments(): UsePaymentsReturn {
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const [paymentClient, setPaymentClient] = useState<AxiosInstance | null>(null);
  const [paymentState, setPaymentState] = useState<PaymentState>({
    isLoading: false,
    error: null,
    lastPayment: null,
  });

  // Create payment-enabled axios client when wallet is connected
  useEffect(() => {
    if (!walletClient) {
      setPaymentClient(null);
      return;
    }

    async function initializePaymentClient() {
      try {
        // Create a signer from the wallet client for x402
        const signer = createWagmiSigner(walletClient!);

        // Create axios instance with payment interceptor
        const axiosInstance = axios.create({
          timeout: 30000,
          headers: {
            'Content-Type': 'application/json',
          },
        });

        // Add x402 payment interceptor
        const paymentEnabledClient = withPaymentInterceptor(axiosInstance, signer as any);

        setPaymentClient(paymentEnabledClient);
      } catch (error) {
        console.error('Failed to create payment client:', error);
        setPaymentState(prev => ({
          ...prev,
          error: 'Failed to initialize payment system',
        }));
      }
    }

    initializePaymentClient();
  }, [walletClient]);

  // Make a payment request
  const makePayment = useCallback(async (url: string, amount?: string) => {
    if (!paymentClient) {
      throw new Error('Payment client not initialized');
    }

    setPaymentState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await paymentClient.get(url);
      
      // Extract payment information from response headers
      const xPaymentResponse = response.headers['x-payment-response'];
      let txHash = null;
      
      if (xPaymentResponse) {
        try {
          const paymentData = JSON.parse(xPaymentResponse);
          txHash = paymentData.transactionHash || paymentData.txHash;
        } catch (e) {
          console.warn('Could not parse x-payment-response header:', e);
        }
      }

      setPaymentState(prev => ({
        ...prev,
        isLoading: false,
        lastPayment: {
          amount: amount || 'unknown',
          txHash: txHash || 'unknown',
          timestamp: new Date(),
        },
      }));

      return response.data;
    } catch (error: any) {
      setPaymentState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Payment failed',
      }));
      throw error;
    }
  }, [paymentClient]);

  // Verify transaction on Base network
  const verifyTransaction = useCallback(async (txHash: string): Promise<boolean> => {
    if (!publicClient) {
      return false;
    }

    try {
      const receipt = await publicClient.getTransactionReceipt({ 
        hash: txHash as `0x${string}` 
      });
      return receipt.status === 'success';
    } catch (error) {
      console.error('Transaction verification failed:', error);
      return false;
    }
  }, [publicClient]);

  const resetError = useCallback(() => {
    setPaymentState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    paymentClient,
    paymentState,
    makePayment,
    verifyTransaction,
    resetError,
  };
}