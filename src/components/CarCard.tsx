import { Link } from "react-router-dom";
import { Car } from "@/types/car";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Gauge, Fuel, Settings, Sparkles, DollarSign } from "lucide-react";

interface CarCardProps {
  car: Car;
}

export const CarCard = ({ car }: CarCardProps) => {
  return (
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
          <p className="text-sm font-semibold text-primary mb-1">{car.year} Toyota</p>
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
          <div className="flex gap-2">
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
      </div>
    </Card>
  );
};
