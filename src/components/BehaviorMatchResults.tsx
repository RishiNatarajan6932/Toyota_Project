import { MatchResult } from "@/types/behavior";
import { cars } from "@/data/cars";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Gauge, Fuel, Shield, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

interface BehaviorMatchResultsProps {
  results: MatchResult[];
  onRetake: () => void;
}

const formatScore = (value: number) => `${value}% match`;

export const BehaviorMatchResults = ({ results, onRetake }: BehaviorMatchResultsProps) => {
  const carsById = new Map(cars.map((car) => [car.id, car]));
  const topResults = results.slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-foreground">Your top Toyota matches</h2>
          <p className="text-sm text-muted-foreground">
            We looked at power delivery, safety tech, cabin experience, and ownership fit based on your preferences.
          </p>
        </div>
        <Button variant="outline" onClick={onRetake}>
          Retake quiz
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.2fr_1fr]">
        {topResults[0] && (
          <Card className="p-6 space-y-5 border-primary/40">
            {(() => {
              const car = carsById.get(topResults[0].carId);
              if (!car) return null;

              return (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-primary/10 text-primary">Best overall match</Badge>
                    <span className="text-sm font-medium text-primary">{formatScore(topResults[0].matchScore)}</span>
                  </div>
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-6">
                    <Avatar className="h-20 w-20 rounded-xl border border-border">
                      <AvatarFallback>{car.model.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <h3 className="text-2xl font-semibold text-foreground">{car.year} {car.model}</h3>
                      <p className="text-sm text-muted-foreground">
                        {car.type.toUpperCase()} • {car.specs.engine} • {car.specs.transmission}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    {topResults[0].highlights.map((highlight, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Sparkles className="mt-0.5 h-4 w-4 text-primary" />
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-3 pt-4">
                    <Link to="/">
                      <Button variant="ghost" size="sm">Explore inventory</Button>
                    </Link>
                    <Link to="/">
                      <Button size="sm">Build & price</Button>
                    </Link>
                  </div>
                </div>
              );
            })()}
          </Card>
        )}

        <div className="space-y-4">
          {topResults.slice(1).map((result) => {
            const car = carsById.get(result.carId);
            if (!car) return null;
            return (
              <Card key={result.carId} className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Strong match</p>
                    <p className="text-lg font-semibold text-foreground">{car.year} {car.model}</p>
                  </div>
                  <Badge variant="outline">{formatScore(result.matchScore)}</Badge>
                </div>
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Gauge className="h-3.5 w-3.5" /> {car.specs.horsepower} hp</span>
                  <span className="flex items-center gap-1"><Shield className="h-3.5 w-3.5" /> Toyota Safety Sense</span>
                  <span className="flex items-center gap-1"><Fuel className="h-3.5 w-3.5" /> {car.specs.fuelType}</span>
                </div>
                <ul className="list-disc pl-5 text-xs text-muted-foreground space-y-1">
                  {result.highlights.slice(0, 2).map((highlight, idx) => (
                    <li key={idx}>{highlight}</li>
                  ))}
                </ul>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};
