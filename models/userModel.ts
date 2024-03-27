import { Bond, Currency, Organization } from "./OrganizationModel";

export type UserPortfolio = UserStock[];

export type UserStock = {
  user_id: number;
  symbol: string;
  market: string;
  final_amount: number;
  purchase_price: number;
  current_price: number;
  price_currency: "ARS" | "USD";
  organization?: Organization;
  bond_info?: Bond;
  currency_info?: Currency;
  hasError?: boolean;
  type: "Stock" | "Bond" | "Currency";
};

export type User = {
  user_id: number;
  name: string;
  email: string;
  accessToken: string;
  refreshToken: string;
  roles: {
    user_id: number;
    role: UserRole;
  }[];
};

export type UserRole = "ADMIN" | "USER";
