export type Transaction = {
  transaction_id: number;
  user_id: number;
  symbol: string;
  market: StockMarket;
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
  market: StockMarket;
};

export type ItemPrice = {
  id: number;
  type: string;
  date: string;
  market: StockMarket;
  value: number;
  price_currency: string;
  stock_symbol: string;
};

export type StockMarket = "CEDEARS" | "NASDAQ" | "BCBA";
