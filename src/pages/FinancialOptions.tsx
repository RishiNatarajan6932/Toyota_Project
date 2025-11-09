import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FinancialComparison } from "@/components/FinancialComparison";
import { cars } from "@/data/cars";
import { Car } from "@/types/car";
import { DollarSign } from "lucide-react";

const FinancialOptionsPage = () => {
  const { carId } = useParams<{ carId?: string }>();
  const navigate = useNavigate();

  // Get selected car or default to first car
  const selectedCar: Car | undefined = carId
    ? cars.find((car) => car.id === carId)
    : cars[0];

  if (!selectedCar) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Car not found</h2>
          <Link to="/financial">
            <Button>Back to Financial Options</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/">
              <h1 className="text-3xl font-bold text-primary tracking-tight">
                TOYOTA
              </h1>
            </Link>
            <div className="flex items-center gap-6">
              <Link to="/">
                <Button variant="ghost">Home</Button>
              </Link>
              <Link to="/financial">
                <Button variant="ghost">All Options</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <DollarSign className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-foreground">
                  Financial Options Comparison
                </h1>
                <p className="text-muted-foreground mt-1">
                  Compare Finance vs. Lease vs. Buy Used for the {selectedCar.year} {selectedCar.brand} {selectedCar.model}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Starting at ${selectedCar.price.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Car Selection */}
          <div className="mb-6">
            <Select
              value={selectedCar.id}
              onValueChange={(value) => navigate(`/financial/${value}`)}
            >
              <SelectTrigger className="w-full md:w-[300px]">
                <SelectValue placeholder="Select a vehicle" />
              </SelectTrigger>
              <SelectContent>
                {cars.map((car) => (
                  <SelectItem key={car.id} value={car.id}>
                    {car.year} {car.model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Main Comparison Component */}
          <FinancialComparison car={selectedCar} />
        </div>
      </div>
    </div>
  );
};

export default FinancialOptionsPage;

