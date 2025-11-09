import { useState } from "react";
import { Link } from "react-router-dom";
import { Gauge, Fuel, Settings, Sparkles, DollarSign, MessageSquare, Wrench, Shield, TrendingUp } from "lucide-react";
import { Car } from "@/types/car";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CarCardProps {
  car: Car;
}

export const CarCard = ({ car }: CarCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [milesPerYear, setMilesPerYear] = useState(12000);
  const [gasPrice, setGasPrice] = useState(3.50);
  const [yearsOwned, setYearsOwned] = useState(5);

  // Calculate costs
  const mpg = (car.specs as { mpg?: number }).mpg ?? 28; // Default to 28 MPG if not provided
  const annualGasCost = (milesPerYear / mpg) * gasPrice;
  const annualMaintenanceCost = car.price * 0.015; // ~1.5% of car price
  const annualInsuranceCost = car.price * 0.02; // ~2% of car price
  const annualRegistrationCost = 150;
  const depreciation = car.price * 0.15 * yearsOwned; // ~15% per year

  const totalAnnualCost = annualGasCost + annualMaintenanceCost + annualInsuranceCost + annualRegistrationCost;
  const totalOwnershipCost = car.price + (totalAnnualCost * yearsOwned) + depreciation;

  return (
    <>
      <Card className="group overflow-hidden bg-gradient-card border-border hover:border-primary/50 transition-all duration-500 hover:shadow-card">
        <div className="relative h-56 overflow-hidden bg-muted">
          <img
            src={car.image}
            alt={`${car.brand} ${car.model}`}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-overlay opacity-60" />
          <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">
            {car.year}
          </Badge>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <p className="text-sm font-semibold text-primary mb-1">{car.year} {car.brand}</p>
            <h3 className="text-2xl font-bold text-foreground">{car.model}</h3>
          </div>
          
          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Gauge className="w-4 h-4 text-primary" />
              <span>{car.specs.horsepower} HP</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Settings className="w-4 h-4 text-primary" />
              <span>{car.specs.transmission}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Fuel className="w-4 h-4 text-primary" />
              <span>{car.specs.fuelType}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div>
              <p className="text-sm text-muted-foreground">Starting at</p>
              <p className="text-2xl font-bold text-primary">
                ${car.price.toLocaleString()}
              </p>
            </div>
            <Button 
              variant="outline" 
              className="group-hover:bg-primary group-hover:text-primary-foreground"
              onClick={() => setIsOpen(true)}
            >
              View Details
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to={`/reviews/${car.id}`}>
              <Button variant="ghost" size="sm" className="group-hover:text-primary">
                <MessageSquare className="w-4 h-4 mr-1" />
                Reviews
              </Button>
            </Link>
            <Link to="/matching">
              <Button variant="ghost" size="sm" className="group-hover:text-primary">
                <Sparkles className="w-4 h-4 mr-1" />
                Find My Match
              </Button>
            </Link>
            <Link to={`/financial/${car.id}`}>
              <Button variant="ghost" size="sm" className="group-hover:text-primary">
                <DollarSign className="w-4 h-4 mr-1" />
                Financing
              </Button>
            </Link>
            <Button variant="outline" className="group-hover:bg-primary group-hover:text-primary-foreground">
              View Details
            </Button>
          </div>
        </div>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">True Cost Calculator</DialogTitle>
            <DialogDescription>
              {car.year} {car.brand} {car.model}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            {/* Input Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
              <div className="space-y-2">
                <Label htmlFor="miles">Miles per year</Label>
                <Input
                  id="miles"
                  type="number"
                  value={milesPerYear}
                  onChange={(e) => setMilesPerYear(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gas">Gas price ($/gal)</Label>
                <Input
                  id="gas"
                  type="number"
                  step="0.10"
                  value={gasPrice}
                  onChange={(e) => setGasPrice(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="years">Years owned</Label>
                <Input
                  id="years"
                  type="number"
                  value={yearsOwned}
                  onChange={(e) => setYearsOwned(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>

            {/* Annual Costs Breakdown */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Annual Costs</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <Fuel className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">Fuel</p>
                      <p className="text-sm text-muted-foreground">{mpg} MPG</p>
                    </div>
                  </div>
                  <p className="font-bold text-lg">${annualGasCost.toFixed(0)}</p>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <Wrench className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">Maintenance</p>
                      <p className="text-sm text-muted-foreground">Oil, tires, repairs</p>
                    </div>
                  </div>
                  <p className="font-bold text-lg">${annualMaintenanceCost.toFixed(0)}</p>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">Insurance</p>
                      <p className="text-sm text-muted-foreground">Estimated average</p>
                    </div>
                  </div>
                  <p className="font-bold text-lg">${annualInsuranceCost.toFixed(0)}</p>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">Registration & Fees</p>
                      <p className="text-sm text-muted-foreground">Annual renewal</p>
                    </div>
                  </div>
                  <p className="font-bold text-lg">${annualRegistrationCost}</p>
                </div>
              </div>
            </div>

            {/* Total Summary */}
            <div className="border-t pt-4">
              <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg mb-3">
                <div>
                  <p className="text-sm text-muted-foreground">Total Annual Cost</p>
                  <p className="text-2xl font-bold text-primary">${totalAnnualCost.toFixed(0)}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>

              <div className="space-y-2 p-4 bg-muted rounded-lg">
                <div className="flex justify-between text-sm">
                  <span>Purchase Price</span>
                  <span className="font-semibold">${car.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Total Operating Costs ({yearsOwned} years)</span>
                  <span className="font-semibold">${(totalAnnualCost * yearsOwned).toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Estimated Depreciation</span>
                  <span className="font-semibold text-destructive">-${depreciation.toFixed(0)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-border">
                  <span className="font-bold">True Total Cost of Ownership</span>
                  <span className="font-bold text-lg text-primary">${totalOwnershipCost.toFixed(0)}</span>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};