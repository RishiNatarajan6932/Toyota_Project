import { useMemo, useState } from "react";
import { QuizQuestion } from "@/types/behavior";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export type QuizSelections = Record<string, string>;

interface BehaviorQuizProps {
  questions: QuizQuestion[];
  onFinish: (selections: QuizSelections) => void;
}

export const BehaviorQuiz = ({ questions, onFinish }: BehaviorQuizProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selections, setSelections] = useState<QuizSelections>({});

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
      onFinish(selections);
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

      <Card className="p-6 overflow-hidden">
        <div className="space-y-6">
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
        </div>
      </Card>

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
