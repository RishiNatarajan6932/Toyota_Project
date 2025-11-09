import { useMemo, useState } from "react";
import { QuizQuestion } from "@/types/behavior";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export type QuizSelections = Record<string, string>;

interface BehaviorQuizProps {
  questions: QuizQuestion[];
  onFinish: (
    selections: QuizSelections,
    priorities: { safety: number; performance: number; cargo: number },
    budget: number
  ) => void;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);

export const BehaviorQuiz = ({ questions, onFinish }: BehaviorQuizProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selections, setSelections] = useState<QuizSelections>({});
  const [priorities, setPriorities] = useState({ safety: 7, performance: 5, cargo: 5 });
  const [budget, setBudget] = useState(45000);

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const progress = useMemo(() => Math.round(((currentIndex + 1) / totalQuestions) * 100), [currentIndex, totalQuestions]);

  const handleChange = (questionId: string, value: string) => {
    setSelections((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (!currentQuestion) return;
    if (!selections[currentQuestion.id]) return;

    if (currentIndex === totalQuestions - 1) {
      onFinish(selections, priorities, budget);
    } else {
      setCurrentIndex((prev) => Math.min(prev + 1, totalQuestions - 1));
    }
  };

  const handleBack = () => setCurrentIndex((prev) => Math.max(prev - 1, 0));

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">Step {currentIndex + 1} of {totalQuestions}</p>
          <p className="text-sm text-muted-foreground">{progress}% complete</p>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card className="p-6 space-y-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold text-foreground">{currentQuestion.title}</h2>
          {currentQuestion.description && (
            <p className="text-sm text-muted-foreground">{currentQuestion.description}</p>
          )}
        </div>

        <RadioGroup
          value={selections[currentQuestion.id] ?? ""}
          onValueChange={(value) => handleChange(currentQuestion.id, value)}
          className="space-y-3"
        >
          {currentQuestion.options.map((option) => (
            <Label
              key={option.value}
              htmlFor={`${currentQuestion.id}-${option.value}`}
              className="flex w-full cursor-pointer items-start gap-3 rounded-lg border border-border bg-card p-4 text-left transition hover:border-primary"
            >
              <RadioGroupItem
                id={`${currentQuestion.id}-${option.value}`}
                value={option.value}
                className="mt-1"
              />
              <span className="text-sm text-foreground leading-relaxed">{option.label}</span>
            </Label>
          ))}
        </RadioGroup>
      </Card>

      {currentIndex === totalQuestions - 1 && (
        <Card className="p-6 space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-foreground">Fine-tune your match</h3>
            <p className="text-sm text-muted-foreground">
              Adjust the sliders to tell us which factors matter most and share a target budget. We’ll weight your results accordingly.
            </p>
          </div>

          <div className="space-y-5">
            {[{
              key: "safety", label: "Safety & driver assistance", description: "Crash protection, active safety, overall peace of mind",
            }, {
              key: "performance", label: "Performance & acceleration", description: "Power delivery, passing confidence, fun-to-drive",
            }, {
              key: "cargo", label: "Cargo & versatility", description: "Storage flexibility, seating configurations, utility",
            }].map(({ key, label, description }) => (
              <div key={key} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">{label}</span>
                  <Badge variant="outline">{priorities[key as keyof typeof priorities]}</Badge>
                </div>
                <Slider
                  value={[priorities[key as keyof typeof priorities]]}
                  onValueChange={([value]) => setPriorities((prev) => ({ ...prev, [key]: value }))}
                  min={0}
                  max={10}
                  step={1}
                />
                <p className="text-xs text-muted-foreground">{description}</p>
                <Separator />
              </div>
            ))}

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-foreground">Target budget</span>
                <Badge variant="outline">{formatCurrency(budget)}</Badge>
              </div>
              <Slider
                value={[budget]}
                onValueChange={([value]) => setBudget(value)}
                min={20000}
                max={90000}
                step={1000}
              />
              <p className="text-xs text-muted-foreground">
                Tell us the maximum budget you’d like to stay under. We will prioritize vehicles priced at or below this number.
              </p>
            </div>
          </div>
        </Card>
      )}

      <div className="flex items-center justify-between">
        <Button variant="ghost" disabled={currentIndex === 0} onClick={handleBack}>
          Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={!selections[currentQuestion.id]}
        >
          {currentIndex === totalQuestions - 1 ? "See My Matches" : "Next"}
        </Button>
      </div>
    </div>
  );
};
