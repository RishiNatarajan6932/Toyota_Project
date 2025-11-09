export type FinancingType = "lease" | "finance" | "used";

export interface FinanceOption {
  termMonths: number;
  interestRate: number; // APR
  downPayment: number; // Percentage
  tradeInValue?: number;
}

export interface LeaseOption {
  termMonths: number;
  moneyFactor: number;
  downPayment: number; // Percentage
  residualValue: number; // Percentage of MSRP
  mileageLimit: number; // Annual miles
  tradeInValue?: number;
}

export interface UsedCarOption {
  price: number;
  year: number;
  mileage: number;
  condition: "excellent" | "good" | "fair";
  financing?: {
    termMonths: number;
    interestRate: number;
    downPayment: number;
  };
}

export interface PaymentCalculation {
  monthlyPayment: number;
  totalCost: number;
  downPayment: number;
  totalInterest?: number;
  tradeInValue?: number;
  residualValue?: number; // For leases
  totalSavings?: number; // Compared to new car
}

export interface ComparisonResult {
  type: FinancingType;
  label: string;
  monthlyPayment: number;
  totalCost: number;
  downPayment: number;
  pros: string[];
  cons: string[];
  bestFor: string;
  calculation: PaymentCalculation;
}

