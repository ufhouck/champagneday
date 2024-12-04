import { connect, Contract, keyStores, WalletConnection } from 'near-api-js';
import type { Moment, MomentInput } from '../types/moments';

const CONTRACT_NAME = 'dev-1709825000000-00000000000000';

const config = {
  networkId: 'testnet',
  keyStore: new keyStores.BrowserLocalStorageKeyStore(),
  nodeUrl: 'https://rpc.testnet.near.org',
  walletUrl: 'https://wallet.testnet.near.org',
  helperUrl: 'https://helper.testnet.near.org',
  explorerUrl: 'https://explorer.testnet.near.org',
  contractName: CONTRACT_NAME,
};

class MomentsContract extends Contract {
  constructor(account: any) {
    super(account, CONTRACT_NAME, {
      viewMethods: ['getMoments'],
      changeMethods: ['addMoment', 'deleteMoment', 'likeMoment'],
    });
  }
}

let near: any;
let wallet: WalletConnection;
let contract: any;

export async function initNear() {
  if (near) return { near, wallet, contract };

  near = await connect(config);
  wallet = new WalletConnection(near, 'champagne-bay');

  if (!wallet.isSignedIn()) {
    await wallet.requestSignIn({
      contractId: CONTRACT_NAME,
      methodNames: ['addMoment', 'deleteMoment', 'likeMoment'],
    });
  }

  const account = wallet.account();
  contract = new MomentsContract(account);

  return { near, wallet, contract };
}

export async function addMoment({ text, weather }: MomentInput): Promise<Moment> {
  const { contract } = await initNear();
  const moment = {
    text,
    timestamp: Date.now(),
    likes: 0,
    weather,
  };
  
  return contract.addMoment({ moment });
}

export async function getMoments(): Promise<Moment[]> {
  const { contract } = await initNear();
  return contract.getMoments();
}

export async function deleteMoment(id: string): Promise<void> {
  const { contract } = await initNear();
  return contract.deleteMoment({ id });
}

export async function likeMoment(id: string): Promise<void> {
  const { contract } = await initNear();
  return contract.likeMoment({ id });
}