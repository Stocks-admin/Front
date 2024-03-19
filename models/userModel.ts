import { Bond, Organization } from "./OrganizationModel";

export type UserPortfolio = UserStock[];

export type UserStock = {
  user_id: number;
  symbol: string;
  market: string;
  final_amount: number;
  purchase_price: number;
  current_price: number;
  organization?: Organization;
  bond_info?: Bond;
  hasError?: boolean;
};
