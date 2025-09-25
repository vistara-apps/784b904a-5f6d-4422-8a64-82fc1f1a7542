'use client';

import { useState } from 'react';
import { DollarSign, Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { usePayments } from '@/lib/hooks/usePayments';
import { useAccount } from 'wagmi';

interface PaymentDemoProps {
  className?: string;
}

export function PaymentDemo({ className = '' }: PaymentDemoProps) {
  const { isConnected } = useAccount();
  const { paymentClient, paymentState, makePayment, verifyTransaction, resetError } = usePayments();
  const [testUrl, setTestUrl] = useState('/api/test-payment');
  const [amount, setAmount] = useState('0.01');
  const [verificationResult, setVerificationResult] = useState<boolean | null>(null);

  const handleTestPayment = async () => {
    if (!paymentClient) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      resetError();
      const result = await makePayment(testUrl, amount);
      console.log('Payment successful:', result);
    } catch (error) {
      console.error('Payment failed:', error);
    }
  };

  const handleVerifyTransaction = async () => {
    if (!paymentState.lastPayment?.txHash || paymentState.lastPayment.txHash === 'unknown') {
      alert('No transaction hash available for verification');
      return;
    }

    const isValid = await verifyTransaction(paymentState.lastPayment.txHash);
    setVerificationResult(isValid);
  };

  if (!isConnected) {
    return (
      <div className={`glass-card p-6 ${className}`}>
        <div className="text-center">
          <DollarSign className="w-12 h-12 text-accent mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            Payment Demo
          </h3>
          <p className="text-text-secondary">
            Connect your wallet to test the x402 payment flow
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`glass-card p-6 ${className}`}>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <DollarSign className="w-12 h-12 text-accent mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            x402 Payment Flow Demo
          </h3>
          <p className="text-text-secondary">
            Test USDC payments on Base using the x402 protocol
          </p>
        </div>

        {/* Test Configuration */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Test API Endpoint
            </label>
            <input
              type="url"
              value={testUrl}
              onChange={(e) => setTestUrl(e.target.value)}
              className="w-full px-3 py-2 bg-surface border border-gray-600 rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="/api/test-payment"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Payment Amount (USDC)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 bg-surface border border-gray-600 rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="0.01"
            />
          </div>
        </div>

        {/* Payment Status */}
        {paymentState.error && (
          <div className="flex items-center space-x-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <XCircle className="w-5 h-5 text-red-400" />
            <span className="text-red-400 text-sm">{paymentState.error}</span>
          </div>
        )}

        {paymentState.lastPayment && (
          <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-green-400 font-medium">Payment Completed</span>
            </div>
            <div className="text-sm text-text-secondary space-y-1">
              <p>Amount: {paymentState.lastPayment.amount} USDC</p>
              <p>Time: {paymentState.lastPayment.timestamp.toLocaleString()}</p>
              <p className="break-all">
                Tx Hash: {paymentState.lastPayment.txHash}
              </p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={handleTestPayment}
            disabled={paymentState.isLoading || !paymentClient}
            className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {paymentState.isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Processing Payment...</span>
              </>
            ) : (
              <>
                <DollarSign className="w-5 h-5" />
                <span>Test x402 Payment</span>
              </>
            )}
          </button>

          {paymentState.lastPayment && (
            <button
              onClick={handleVerifyTransaction}
              className="w-full btn-secondary flex items-center justify-center space-x-2"
            >
              <AlertCircle className="w-5 h-5" />
              <span>Verify Transaction</span>
            </button>
          )}
        </div>

        {/* Verification Result */}
        {verificationResult !== null && (
          <div className={`flex items-center space-x-2 p-3 rounded-lg ${
            verificationResult 
              ? 'bg-green-500/10 border border-green-500/20' 
              : 'bg-red-500/10 border border-red-500/20'
          }`}>
            {verificationResult ? (
              <>
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-green-400">Transaction verified successfully</span>
              </>
            ) : (
              <>
                <XCircle className="w-5 h-5 text-red-400" />
                <span className="text-red-400">Transaction verification failed</span>
              </>
            )}
          </div>
        )}

        {/* Info */}
        <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <h4 className="font-medium text-blue-400 mb-2">How it works:</h4>
          <ul className="text-sm text-text-secondary space-y-1">
            <li>• Makes HTTP request to API endpoint</li>
            <li>• Handles 402 Payment Required responses automatically</li>
            <li>• Signs USDC transaction on Base network</li>
            <li>• Retries request with payment proof</li>
            <li>• Returns API response with payment confirmation</li>
          </ul>
        </div>
      </div>
    </div>
  );
}