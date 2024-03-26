export type Organization = {
  symbol: string;
  org_category: string;
  logo: string;
  name?: string;
  market?: string;
};

export type Country = {
  id: number;
  name: string;
  flag: string;
};

export type Currency = {
  symbol: string;
  name: string;
  country: Country;
};

export type Bond = {
  country: Country;
  batch: number;
  symbol: string;
};
