import { useState, useMemo } from "react";
import { Car } from "@/types/car";
import { FinanceOption, LeaseOption, UsedCarOption, ComparisonResult, FinancingType } from "@/types/financial";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, XCircle, TrendingUp, DollarSign, Calendar, Award } from "lucide-react";

interface FinancialComparisonProps {
  car: Car;
}

export const FinancialComparison = ({ car }: FinancialComparisonProps) => {
  const [financeOption, setFinanceOption] = useState<FinanceOption>({
    termMonths: 60,
    interestRate: 4.99,
    downPayment: 10,
    tradeInValue: 0,
  });

  const [leaseOption, setLeaseOption] = useState<LeaseOption>({
    termMonths: 36,
    moneyFactor: 0.0015,
    downPayment: 0,
    residualValue: 60,
    mileageLimit: 12000,
    tradeInValue: 0,
  });

  const [usedCarOption, setUsedCarOption] = useState<UsedCarOption>({
    price: car.price * 0.75, // 25% less than new
    year: car.year - 2,
    mileage: 30000,
    condition: "excellent",
    financing: {
      termMonths: 60,
      interestRate: 5.49, // Slightly higher for used
      downPayment: 10,
    },
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate Finance Payment
  const calculateFinance = (): ComparisonResult => {
    const principal = car.price - (car.price * financeOption.downPayment) / 100 - (financeOption.tradeInValue || 0);
    const monthlyRate = financeOption.interestRate / 100 / 12;
    const numPayments = financeOption.termMonths;

    let monthlyPayment = 0;
    if (monthlyRate > 0) {
      monthlyPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
        (Math.pow(1 + monthlyRate, numPayments) - 1);
    } else {
      monthlyPayment = principal / numPayments;
    }

    const totalCost = monthlyPayment * numPayments + (car.price * financeOption.downPayment) / 100 + (financeOption.tradeInValue || 0);
    const totalInterest = totalCost - car.price;

    return {
      type: "finance",
      label: "Finance (Buy New)",
      monthlyPayment,
      totalCost,
      downPayment: (car.price * financeOption.downPayment) / 100,
      pros: [
        "Own the vehicle after payments",
        "No mileage restrictions",
        "Can customize and modify",
        "Build equity over time",
        "No lease-end fees",
      ],
      cons: [
        "Higher monthly payments",
        "Full responsibility for maintenance",
        "Depreciation affects resale value",
        "Longer commitment",
      ],
      bestFor: "Long-term ownership, high mileage drivers, customization needs",
      calculation: {
        monthlyPayment,
        totalCost,
        downPayment: (car.price * financeOption.downPayment) / 100,
        totalInterest,
        tradeInValue: financeOption.tradeInValue,
      },
    };
  };

  // Calculate Lease Payment
  const calculateLease = (): ComparisonResult => {
    const capitalizedCost = car.price - (car.price * leaseOption.downPayment) / 100 - (leaseOption.tradeInValue || 0);
    const residualValue = (car.price * leaseOption.residualValue) / 100;
    const depreciation = capitalizedCost - residualValue;
    const monthlyDepreciation = depreciation / leaseOption.termMonths;
    const monthlyRent = (capitalizedCost + residualValue) * leaseOption.moneyFactor;
    const monthlyPayment = monthlyDepreciation + monthlyRent;

    const totalCost = monthlyPayment * leaseOption.termMonths + (car.price * leaseOption.downPayment) / 100 + (leaseOption.tradeInValue || 0);

    return {
      type: "lease",
      label: "Lease (New Car)",
      monthlyPayment,
      totalCost,
      downPayment: (car.price * leaseOption.downPayment) / 100,
      pros: [
        "Lower monthly payments",
        "Drive a new car every few years",
        "Warranty coverage during lease",
        "No resale concerns",
        "Latest technology and features",
      ],
      cons: [
        "No ownership at lease end",
        "Mileage restrictions",
        "Wear and tear charges",
        "Ongoing payments forever",
        "Early termination fees",
      ],
      bestFor: "Short-term needs, low mileage, want latest features",
      calculation: {
        monthlyPayment,
        totalCost,
        downPayment: (car.price * leaseOption.downPayment) / 100,
        residualValue,
        tradeInValue: leaseOption.tradeInValue,
      },
    };
  };

  // Calculate Used Car Option
  const calculateUsedCar = (): ComparisonResult => {
    if (!usedCarOption.financing) {
      return {
        type: "used",
        label: "Buy Used",
        monthlyPayment: 0,
        totalCost: usedCarOption.price,
        downPayment: 0,
        pros: [],
        cons: [],
        bestFor: "",
        calculation: {
          monthlyPayment: 0,
          totalCost: usedCarOption.price,
          downPayment: 0,
        },
      };
    }

    const principal = usedCarOption.price - (usedCarOption.price * usedCarOption.financing.downPayment) / 100;
    const monthlyRate = usedCarOption.financing.interestRate / 100 / 12;
    const numPayments = usedCarOption.financing.termMonths;

    let monthlyPayment = 0;
    if (monthlyRate > 0) {
      monthlyPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
        (Math.pow(1 + monthlyRate, numPayments) - 1);
    } else {
      monthlyPayment = principal / numPayments;
    }

    const totalCost = monthlyPayment * numPayments + (usedCarOption.price * usedCarOption.financing.downPayment) / 100;
    const totalInterest = totalCost - usedCarOption.price;
    const totalSavings = car.price - totalCost;

    return {
      type: "used",
      label: "Buy Used",
      monthlyPayment,
      totalCost,
      downPayment: (usedCarOption.price * usedCarOption.financing.downPayment) / 100,
      pros: [
        "Significantly lower purchase price",
        "Lower monthly payments",
        "Less depreciation loss",
        "Own the vehicle",
        "No mileage restrictions",
      ],
      cons: [
        "No warranty (may need extended)",
        "Unknown maintenance history",
        "Older technology/features",
        "Higher interest rates possible",
        "May need repairs sooner",
      ],
      bestFor: "Budget-conscious buyers, value seekers, don't need latest features",
      calculation: {
        monthlyPayment,
        totalCost,
        downPayment: (usedCarOption.price * usedCarOption.financing.downPayment) / 100,
        totalInterest,
        totalSavings,
      },
    };
  };

  const financeResult = useMemo(() => calculateFinance(), [car.price, financeOption]);
  const leaseResult = useMemo(() => calculateLease(), [car.price, leaseOption]);
  const usedResult = useMemo(() => calculateUsedCar(), [car.price, usedCarOption]);

  // Determine best option
  const bestOption = useMemo(() => {
    const options = [financeResult, leaseResult, usedResult];
    // Best option is the one with lowest total cost
    return options.reduce((best, current) => 
      current.totalCost < best.totalCost ? current : best
    );
  }, [financeResult, leaseResult, usedResult]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-lg">
          <TrendingUp className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-foreground">Compare Your Options</h3>
          <p className="text-sm text-muted-foreground">
            Side-by-side comparison: Finance vs. Lease vs. Buy Used
          </p>
        </div>
      </div>

      <Tabs defaultValue="comparison" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="comparison">Side-by-Side Comparison</TabsTrigger>
          <TabsTrigger value="calculator">Customize Options</TabsTrigger>
        </TabsList>

        <TabsContent value="comparison" className="space-y-6">
          {/* Comparison Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Finance Option */}
            <Card className={`p-6 ${bestOption.type === "finance" ? "border-primary border-2" : ""}`}>
              {bestOption.type === "finance" && (
                <Badge className="mb-4 bg-primary">Best Value</Badge>
              )}
              <div className="space-y-4">
                <div>
                  <h4 className="text-xl font-bold text-foreground mb-2">Finance (Buy New)</h4>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-primary">
                      {formatCurrency(financeResult.monthlyPayment)}
                    </span>
                    <span className="text-sm text-muted-foreground">/month</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Total: {formatCurrency(financeResult.totalCost)}
                  </p>
                </div>

                <div className="space-y-2 pt-4 border-t border-border">
                  <p className="text-sm font-semibold text-foreground">Pros:</p>
                  <ul className="space-y-1">
                    {financeResult.pros.map((pro, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2 pt-4 border-t border-border">
                  <p className="text-sm font-semibold text-foreground">Cons:</p>
                  <ul className="space-y-1">
                    {financeResult.cons.map((con, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-1">Best for:</p>
                  <p className="text-sm text-foreground">{financeResult.bestFor}</p>
                </div>
              </div>
            </Card>

            {/* Lease Option */}
            <Card className={`p-6 ${bestOption.type === "lease" ? "border-primary border-2" : ""}`}>
              {bestOption.type === "lease" && (
                <Badge className="mb-4 bg-primary">Best Value</Badge>
              )}
              <div className="space-y-4">
                <div>
                  <h4 className="text-xl font-bold text-foreground mb-2">Lease (New Car)</h4>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-primary">
                      {formatCurrency(leaseResult.monthlyPayment)}
                    </span>
                    <span className="text-sm text-muted-foreground">/month</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Total: {formatCurrency(leaseResult.totalCost)}
                  </p>
                </div>

                <div className="space-y-2 pt-4 border-t border-border">
                  <p className="text-sm font-semibold text-foreground">Pros:</p>
                  <ul className="space-y-1">
                    {leaseResult.pros.map((pro, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2 pt-4 border-t border-border">
                  <p className="text-sm font-semibold text-foreground">Cons:</p>
                  <ul className="space-y-1">
                    {leaseResult.cons.map((con, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-1">Best for:</p>
                  <p className="text-sm text-foreground">{leaseResult.bestFor}</p>
                </div>
              </div>
            </Card>

            {/* Used Car Option */}
            <Card className={`p-6 ${bestOption.type === "used" ? "border-primary border-2" : ""}`}>
              {bestOption.type === "used" && (
                <Badge className="mb-4 bg-primary">Best Value</Badge>
              )}
              <div className="space-y-4">
                <div>
                  <h4 className="text-xl font-bold text-foreground mb-2">Buy Used</h4>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-primary">
                      {formatCurrency(usedResult.monthlyPayment)}
                    </span>
                    <span className="text-sm text-muted-foreground">/month</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Total: {formatCurrency(usedResult.totalCost)}
                  </p>
                  {usedResult.calculation.totalSavings && (
                    <p className="text-sm text-green-600 font-semibold mt-1">
                      Save: {formatCurrency(usedResult.calculation.totalSavings)}
                    </p>
                  )}
                </div>

                <div className="space-y-2 pt-4 border-t border-border">
                  <p className="text-sm font-semibold text-foreground">Pros:</p>
                  <ul className="space-y-1">
                    {usedResult.pros.map((pro, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2 pt-4 border-t border-border">
                  <p className="text-sm font-semibold text-foreground">Cons:</p>
                  <ul className="space-y-1">
                    {usedResult.cons.map((con, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-1">Best for:</p>
                  <p className="text-sm text-foreground">{usedResult.bestFor}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Summary */}
          <Card className="p-6 bg-muted/50">
            <div className="flex items-center gap-3 mb-4">
              <Award className="w-6 h-6 text-primary" />
              <h4 className="text-xl font-bold text-foreground">Recommendation</h4>
            </div>
            <p className="text-foreground mb-2">
              Based on your current settings, <strong>{bestOption.label}</strong> offers the best overall value with a total cost of <strong>{formatCurrency(bestOption.totalCost)}</strong>.
            </p>
            <p className="text-sm text-muted-foreground">
              {bestOption.bestFor}
            </p>
          </Card>
        </TabsContent>

        <TabsContent value="calculator" className="space-y-6">
          {/* Finance Calculator */}
          <Card className="p-6">
            <h4 className="text-xl font-bold mb-4">Finance Options</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Loan Term</Label>
                <Select
                  value={financeOption.termMonths.toString()}
                  onValueChange={(v) => setFinanceOption({ ...financeOption, termMonths: parseInt(v) })}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="36">36 months</SelectItem>
                    <SelectItem value="48">48 months</SelectItem>
                    <SelectItem value="60">60 months</SelectItem>
                    <SelectItem value="72">72 months</SelectItem>
                    <SelectItem value="84">84 months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Interest Rate (APR)</Label>
                <div className="flex items-center gap-2 mt-2">
                  <Slider
                    value={[financeOption.interestRate]}
                    onValueChange={([v]) => setFinanceOption({ ...financeOption, interestRate: v })}
                    min={0}
                    max={15}
                    step={0.1}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    value={financeOption.interestRate.toFixed(2)}
                    onChange={(e) => setFinanceOption({ ...financeOption, interestRate: parseFloat(e.target.value) || 0 })}
                    className="w-24"
                  />
                  <span className="text-sm">%</span>
                </div>
              </div>
              <div>
                <Label>Down Payment</Label>
                <div className="flex items-center gap-2 mt-2">
                  <Slider
                    value={[financeOption.downPayment]}
                    onValueChange={([v]) => setFinanceOption({ ...financeOption, downPayment: v })}
                    min={0}
                    max={50}
                    step={1}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    value={financeOption.downPayment}
                    onChange={(e) => setFinanceOption({ ...financeOption, downPayment: parseInt(e.target.value) || 0 })}
                    className="w-24"
                  />
                  <span className="text-sm">%</span>
                </div>
              </div>
              <div>
                <Label>Trade-In Value</Label>
                <Input
                  type="number"
                  value={financeOption.tradeInValue || 0}
                  onChange={(e) => setFinanceOption({ ...financeOption, tradeInValue: parseFloat(e.target.value) || 0 })}
                  className="mt-2"
                />
              </div>
            </div>
          </Card>

          {/* Lease Calculator */}
          <Card className="p-6">
            <h4 className="text-xl font-bold mb-4">Lease Options</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Lease Term</Label>
                <Select
                  value={leaseOption.termMonths.toString()}
                  onValueChange={(v) => setLeaseOption({ ...leaseOption, termMonths: parseInt(v) })}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24">24 months</SelectItem>
                    <SelectItem value="36">36 months</SelectItem>
                    <SelectItem value="39">39 months</SelectItem>
                    <SelectItem value="48">48 months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Residual Value</Label>
                <div className="flex items-center gap-2 mt-2">
                  <Slider
                    value={[leaseOption.residualValue]}
                    onValueChange={([v]) => setLeaseOption({ ...leaseOption, residualValue: v })}
                    min={40}
                    max={80}
                    step={1}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    value={leaseOption.residualValue}
                    onChange={(e) => setLeaseOption({ ...leaseOption, residualValue: parseInt(e.target.value) || 60 })}
                    className="w-24"
                  />
                  <span className="text-sm">%</span>
                </div>
              </div>
              <div>
                <Label>Down Payment</Label>
                <div className="flex items-center gap-2 mt-2">
                  <Slider
                    value={[leaseOption.downPayment]}
                    onValueChange={([v]) => setLeaseOption({ ...leaseOption, downPayment: v })}
                    min={0}
                    max={20}
                    step={1}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    value={leaseOption.downPayment}
                    onChange={(e) => setLeaseOption({ ...leaseOption, downPayment: parseInt(e.target.value) || 0 })}
                    className="w-24"
                  />
                  <span className="text-sm">%</span>
                </div>
              </div>
              <div>
                <Label>Mileage Limit</Label>
                <Select
                  value={leaseOption.mileageLimit.toString()}
                  onValueChange={(v) => setLeaseOption({ ...leaseOption, mileageLimit: parseInt(v) })}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10000">10,000 miles/year</SelectItem>
                    <SelectItem value="12000">12,000 miles/year</SelectItem>
                    <SelectItem value="15000">15,000 miles/year</SelectItem>
                    <SelectItem value="18000">18,000 miles/year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Used Car Calculator */}
          <Card className="p-6">
            <h4 className="text-xl font-bold mb-4">Used Car Options</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Used Car Price</Label>
                <Input
                  type="number"
                  value={usedCarOption.price}
                  onChange={(e) => setUsedCarOption({ ...usedCarOption, price: parseFloat(e.target.value) || 0 })}
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Year</Label>
                <Input
                  type="number"
                  value={usedCarOption.year}
                  onChange={(e) => setUsedCarOption({ ...usedCarOption, year: parseInt(e.target.value) || car.year - 2 })}
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Mileage</Label>
                <Input
                  type="number"
                  value={usedCarOption.mileage}
                  onChange={(e) => setUsedCarOption({ ...usedCarOption, mileage: parseInt(e.target.value) || 0 })}
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Condition</Label>
                <Select
                  value={usedCarOption.condition}
                  onValueChange={(v) => setUsedCarOption({ ...usedCarOption, condition: v as UsedCarOption["condition"] })}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="excellent">Excellent</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="fair">Fair</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {usedCarOption.financing && (
                <>
                  <div>
                    <Label>Loan Term</Label>
                    <Select
                      value={usedCarOption.financing.termMonths.toString()}
                      onValueChange={(v) => setUsedCarOption({
                        ...usedCarOption,
                        financing: { ...usedCarOption.financing!, termMonths: parseInt(v) }
                      })}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="36">36 months</SelectItem>
                        <SelectItem value="48">48 months</SelectItem>
                        <SelectItem value="60">60 months</SelectItem>
                        <SelectItem value="72">72 months</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Interest Rate (APR)</Label>
                    <Input
                      type="number"
                      value={usedCarOption.financing.interestRate}
                      onChange={(e) => setUsedCarOption({
                        ...usedCarOption,
                        financing: { ...usedCarOption.financing!, interestRate: parseFloat(e.target.value) || 0 }
                      })}
                      className="mt-2"
                    />
                  </div>
                </>
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

