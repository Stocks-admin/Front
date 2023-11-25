export type Transaction = {
  transaction_id: number;
  user_id: number;
  symbol: string;
  market: string;
  transaction_type: string;
  symbol_price: number;
  amount_sold: number;
  transaction_date: string;
};

export type SymbolQuery = {
  symbol: string;
  full_name?: string;
  logo?: string;
  type: string;
  market: string;
};
