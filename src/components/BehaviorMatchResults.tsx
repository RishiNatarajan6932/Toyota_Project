import { useMemo, useState } from "react";
import { MatchResult } from "@/types/behavior";
import { cars } from "@/data/cars";
import { behavioralProfiles } from "@/data/behavior-profiles";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Gauge, Fuel, Shield, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

interface BehaviorMatchResultsProps {
  results: MatchResult[];
  onRetake: () => void;
  budget: number;
}

const formatScore = (value: number) => `${value}% match`;
const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);

type UpsellInfo = {
  currentCarId: string;
  upgradeCarId: string;
  priceDelta: number;
  priceDeltaPercent: number;
  highlights: string[];
};

type AttributeKey = "powerScore" | "techScore" | "comfortScore" | "safetyScore" | "cargoScore";

const attributeKeys: Array<{ key: AttributeKey; label: string }> = [
  { key: "powerScore", label: "Power & acceleration" },
  { key: "techScore", label: "Tech & connectivity" },
  { key: "comfortScore", label: "Ride comfort" },
  { key: "safetyScore", label: "Safety systems" },
  { key: "cargoScore", label: "Cargo versatility" },
];

const buildUpsellInfo = (currentId: string, budget: number): UpsellInfo | undefined => {
  const profilesById = new Map(behavioralProfiles.map((profile) => [profile.carId, profile]));
  const current = profilesById.get(currentId);
  if (!current) return undefined;

  const candidates = behavioralProfiles
    .filter((profile) => profile.msrp > current.msrp)
    .sort((a, b) => a.msrp - b.msrp);

  const targetMsrp = Math.max(current.msrp * 1.05, Math.min(budget * 1.15, current.msrp * 1.25));
  const upgrade = candidates.find((profile) => profile.msrp <= targetMsrp) ?? candidates[candidates.length - 1];
  if (!upgrade) return undefined;

  const priceDelta = upgrade.msrp - current.msrp;
  const priceDeltaPercent = Math.round((priceDelta / current.msrp) * 100);

  const highlights: string[] = [];
  attributeKeys.forEach(({ key, label }) => {
    const currentValue = current[key] as number | undefined;
    const upgradeValue = upgrade[key] as number | undefined;
    if (typeof currentValue === "number" && typeof upgradeValue === "number" && upgradeValue - currentValue >= 2) {
      highlights.push(`${label} +${upgradeValue - currentValue}`);
    }
  });

  if (highlights.length === 0) {
    highlights.push("More premium features and materials");
  }

  return {
    currentCarId: current.carId,
    upgradeCarId: upgrade.carId,
    priceDelta,
    priceDeltaPercent,
    highlights,
  };
};

export const BehaviorMatchResults = ({ results, onRetake, budget }: BehaviorMatchResultsProps) => {
  const carsById = useMemo(() => new Map(cars.map((car) => [car.id, car])), []);
  const profilesById = useMemo(() => new Map(behavioralProfiles.map((profile) => [profile.carId, profile])), []);
  const topResults = results.slice(0, 3);

  const [upsellOpen, setUpsellOpen] = useState(false);
  const [activeUpsell, setActiveUpsell] = useState<UpsellInfo | undefined>(undefined);

  const handleUpsellTrigger = (carId: string) => {
    const suggestion = buildUpsellInfo(carId, budget);
    if (suggestion) {
      setActiveUpsell(suggestion);
      setUpsellOpen(true);
    }
  };

  const budgetStatus = (price: number) => {
    if (price <= budget) {
      return {
        label: "Within budget",
        variant: "default" as const,
      };
    }

    const percentageOver = Math.round(((price - budget) / budget) * 100);
    return {
      label: `Over budget by ${percentageOver}%`,
      variant: "destructive" as const,
    };
  };

  const renderActionButtons = (carId: string, small?: boolean) => (
    <div className="flex gap-2 pt-2">
      <Button
        variant="ghost"
        size={small ? "sm" : undefined}
        onClick={() => handleUpsellTrigger(carId)}
        type="button"
      >
        Explore inventory
      </Button>
      <Button
        size={small ? "sm" : undefined}
        onClick={() => handleUpsellTrigger(carId)}
        type="button"
      >
        Build & price
      </Button>
    </div>
  );

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-foreground">Your top Toyota matches</h2>
            <p className="text-sm text-muted-foreground">
              We looked at power delivery, safety tech, cabin experience, ownership fit, and your budget priorities.
            </p>
          </div>
          <Button variant="outline" onClick={onRetake}>
            Retake quiz
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.2fr_1fr]">
          {topResults[0] && (() => {
            const car = carsById.get(topResults[0].carId);
            if (!car) return null;
            const budgetInfo = budgetStatus(car.price);
            return (
              <Card className="p-6 space-y-5 border-primary/40">
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

                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span>{formatCurrency(car.price)}</span>
                  <Badge variant={budgetInfo.variant}>{budgetInfo.label}</Badge>
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

                {renderActionButtons(car.id)}
              </Card>
            );
          })()}

          <div className="space-y-4">
            {topResults.slice(1).map((result) => {
              const car = carsById.get(result.carId);
              if (!car) return null;
              const budgetInfo = budgetStatus(car.price);
              return (
                <Card key={result.carId} className="p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Strong match</p>
                      <p className="text-lg font-semibold text-foreground">{car.year} {car.model}</p>
                    </div>
                    <Badge variant="outline">{formatScore(result.matchScore)}</Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{formatCurrency(car.price)}</span>
                    <Badge variant={budgetInfo.variant}>{budgetInfo.label}</Badge>
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
                  {renderActionButtons(car.id, true)}
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      <Dialog open={upsellOpen} onOpenChange={setUpsellOpen}>
        <DialogContent>
          {activeUpsell ? (
            <UpsellContent upsell={activeUpsell} onClose={() => setUpsellOpen(false)} />
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
};

interface UpsellContentProps {
  upsell: UpsellInfo;
  onClose: () => void;
}

const UpsellContent = ({ upsell, onClose }: UpsellContentProps) => {
  const carsById = useMemo(() => new Map(cars.map((car) => [car.id, car])), []);
  const profilesById = useMemo(() => new Map(behavioralProfiles.map((profile) => [profile.carId, profile])), []);

  const currentCar = carsById.get(upsell.currentCarId);
  const upgradeCar = carsById.get(upsell.upgradeCarId);
  const upgradeProfile = profilesById.get(upsell.upgradeCarId);

  if (!currentCar || !upgradeCar || !upgradeProfile) return null;

  return (
    <div className="space-y-4">
      <DialogHeader>
        <DialogTitle>See what a little extra unlocks</DialogTitle>
        <DialogDescription>
          For just {formatCurrency(upsell.priceDelta)} more ({upsell.priceDeltaPercent}% upgrade), step up to the {upgradeCar.year} {upgradeCar.model} with premium enhancements tailored to your persona.
        </DialogDescription>
      </DialogHeader>

      <Card className="p-4 space-y-2 bg-muted/40">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-foreground">{upgradeCar.year} {upgradeCar.model}</p>
            <p className="text-xs text-muted-foreground">{upgradeCar.type.toUpperCase()} • {upgradeCar.specs.engine} • {upgradeCar.specs.transmission}</p>
          </div>
          <Badge>{formatCurrency(upgradeCar.price)}</Badge>
        </div>
        <ul className="list-disc pl-5 text-xs text-muted-foreground space-y-1">
          {upsell.highlights.map((highlight, idx) => (
            <li key={idx}>{highlight}</li>
          ))}
          <li>Keep your current match or preview this upgraded build in the configurator.</li>
        </ul>
      </Card>

      <DialogFooter className="flex flex-col sm:flex-row sm:justify-between sm:space-x-2">
        <Button variant="ghost" onClick={onClose} className="w-full sm:w-auto">
          Stick with my current match
        </Button>
        <Link to="/" className="w-full sm:w-auto">
          <Button className="w-full" onClick={onClose}>
            Show me this upgraded build
          </Button>
        </Link>
      </DialogFooter>
    </div>
  );
};
