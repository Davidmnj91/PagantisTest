export interface User {
  id: string;
  name: string;
  wallets: Wallet[];
}

export interface Wallet {
  id: string;
  name: string;
  amount: number;
}

export interface CreditTransFer {
  fromWalletId: string;
  toWalletId: string;
  amount: number;
}
