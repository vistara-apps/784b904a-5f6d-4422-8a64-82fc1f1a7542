import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  console.log('Test payment endpoint called');
  console.log('Headers:', Object.fromEntries(request.headers.entries()));
  
  // Check if payment header exists
  const paymentHeader = request.headers.get('x-payment');
  
  if (!paymentHeader) {
    console.log('No payment header found, returning 402');
    // Return 402 Payment Required with payment requirements
    const paymentRequirements = {
      networks: ['base'],
      assets: [{
        chainId: 8453, // Base mainnet
        assetAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // USDC on Base
        amount: '10000', // 0.01 USDC (6 decimals)
        recipient: '0x742d35Cc6570C7fc9E0C8b19B8FfE3D4D9Fe0Ee9',
      }],
      description: 'Premium API access',
    };

    return NextResponse.json(
      { 
        error: 'Payment Required',
        message: 'This endpoint requires payment to access premium content',
        paymentRequirements 
      },
      { 
        status: 402,
        headers: {
          'Content-Type': 'application/json',
          'WWW-Authenticate': 'x402',
          'X-Accept-Payment': JSON.stringify(paymentRequirements),
        }
      }
    );
  }

  // If payment header exists, simulate successful response
  console.log('Payment header found:', paymentHeader);
  try {
    const paymentData = JSON.parse(paymentHeader);
    console.log('Parsed payment data:', paymentData);
    
    // In a real implementation, you would verify the payment here
    // For demo purposes, we'll just return success
    
    const premiumContent = {
      success: true,
      message: 'Payment verified! Here is your premium content.',
      data: {
        exclusiveTrack: 'premium-audio-file.mp3',
        artistInfo: {
          name: 'Premium Artist',
          bio: 'This is exclusive content only available to paying users.',
        },
        downloadUrl: 'https://example.com/premium-download',
        timestamp: new Date().toISOString(),
      },
      payment: {
        verified: true,
        amount: paymentData.amount || '0.01',
        transactionHash: paymentData.transactionHash || 'mock-tx-hash',
        chain: 'base',
      }
    };

    return NextResponse.json(premiumContent, {
      headers: {
        'X-Payment-Response': JSON.stringify({
          transactionHash: paymentData.transactionHash || 'mock-tx-hash',
          amount: paymentData.amount || '0.01',
          verified: true,
        }),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid payment data' },
      { status: 400 }
    );
  }
}

export async function POST(request: NextRequest) {
  // Handle POST requests similarly
  return GET(request);
}