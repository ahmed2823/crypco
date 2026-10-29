export type Property = {
  id: string;
  name: string;
  location: string;
  kind: string;
  priceAed: number;
  minimumAed: number;
  annualYieldPercent: number;
  fundedPercent: number;
  status: string;
  bedrooms: number;
  bathrooms: number;
  areaSqFt: number;
  imageUrl: string;
  description: string;
  highlights: string[];
};

export type DemoInvestment = {
  id: string;
  propertyId: string;
  amountAed: number;
  createdAt: string;
  status: "demo";
};
