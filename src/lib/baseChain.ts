import { createConfig, http } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { createPublicClient, http as viemHttp } from 'viem';

// Base Sepolia testnet configuration
export const config = createConfig({
  chains: [baseSepolia],
  transports: {
    [baseSepolia.id]: http(),
  },
});

// Contract address on Base Sepolia testnet
export const MOMENTS_CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000000';

// ABI for the moments contract
export const MOMENTS_ABI = [
  {
    inputs: [
      { name: 'text', type: 'string' },
      { name: 'timestamp', type: 'uint256' },
      { name: 'weather', type: 'tuple', components: [
        { name: 'temp', type: 'int256' },
        { name: 'windSpeed', type: 'int256' },
        { name: 'precipMm', type: 'int256' },
        { name: 'condition', type: 'string' }
      ]}
    ],
    name: 'createMoment',
    outputs: [{ name: 'id', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getMoments',
    outputs: [
      {
        components: [
          { name: 'id', type: 'uint256' },
          { name: 'author', type: 'address' },
          { name: 'text', type: 'string' },
          { name: 'timestamp', type: 'uint256' },
          { name: 'likes', type: 'uint256' },
          { name: 'weather', type: 'tuple', components: [
            { name: 'temp', type: 'int256' },
            { name: 'windSpeed', type: 'int256' },
            { name: 'precipMm', type: 'int256' },
            { name: 'condition', type: 'string' }
          ]}
        ],
        name: 'moments',
        type: 'tuple[]'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ name: 'id', type: 'uint256' }],
    name: 'likeMoment',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  }
] as const;

// Create a public client for reading from the blockchain
export const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: viemHttp(),
});

// Function to format moment data from the blockchain
export function formatMomentFromChain(moment: any) {
  return {
    id: moment.id.toString(),
    text: moment.text,
    timestamp: Number(moment.timestamp),
    likes: Number(moment.likes),
    author: moment.author,
    weather: {
      temp: Number(moment.weather.temp) / 100,
      windSpeed: Number(moment.weather.windSpeed) / 100,
      precipMm: Number(moment.weather.precipMm) / 100,
      condition: moment.weather.condition
    }
  };
}