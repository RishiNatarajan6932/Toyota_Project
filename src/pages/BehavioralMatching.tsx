import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BehaviorQuiz, QuizSelections } from "@/components/BehaviorQuiz";
import { BehaviorMatchResults } from "@/components/BehaviorMatchResults";
import { behavioralQuestions } from "@/data/behavioral-quiz";
import { behavioralProfiles } from "@/data/behavior-profiles";
import {
  deriveQuizResponses,
  rankCarsByBehavioralFit,
} from "@/lib/behavior-engine";
import {
  MatchResult,
  QuizResponses,
} from "@/types/behavior";
import { Compass, Target } from "lucide-react";

const labelMap = {
  driving: {
    cautious: "Cautious",
    balanced: "Balanced",
    spirited: "Spirited",
  },
  sensory: {
    quiet: "Serene cabin",
    balanced: "Balanced feel",
    sporty: "Sporty feedback",
  },
  tech: {
    minimal: "Essential tech",
    connected: "Connected features",
    cuttingEdge: "Cutting-edge tech",
  },
  maintenance: {
    handsOff: "Low-effort ownership",
    balanced: "Routine maintenance",
    enthusiast: "Hands-on maintainer",
  },
} as const;

const BehavioralMatchingPage = () => {
  const [selections, setSelections] = useState<QuizSelections | null>(null);
  const [responses, setResponses] = useState<QuizResponses | null>(null);
  const [results, setResults] = useState<MatchResult[] | null>(null);

  const handleFinish = (answers: QuizSelections) => {
    const quizResponses = deriveQuizResponses(behavioralQuestions, answers);
    const ranked = rankCarsByBehavioralFit(behavioralProfiles, quizResponses);

    setSelections(answers);
    setResponses(quizResponses);
    setResults(ranked);
  };

  const handleRetake = () => {
    setSelections(null);
    setResponses(null);
    setResults(null);
  };

  return (
    <div className="min-h-screen bg-background">
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
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          <header className="space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Compass className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-foreground">Behavioral & Preference Matching</h1>
                  <p className="text-muted-foreground mt-1 max-w-2xl">
                    Tell us about your driving style, sensory preferences, tech comfort, and maintenance habits. We will pair you with the Toyota that fits your lifestyle.
                  </p>
                </div>
              </div>
            </div>

            {responses && (
              <Card className="p-4 space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Target className="h-4 w-4" />
                  Your driving persona snapshot
                </div>
                <Separator />
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Driving style: {labelMap.driving[responses.driving]}</Badge>
                  <Badge variant="outline">Cabin vibe: {labelMap.sensory[responses.sensory]}</Badge>
                  <Badge variant="outline">Tech comfort: {labelMap.tech[responses.tech]}</Badge>
                  <Badge variant="outline">Ownership: {labelMap.maintenance[responses.maintenance]}</Badge>
                </div>
              </Card>
            )}
          </header>

          {!results && (
            <section className="space-y-6">
              <BehaviorQuiz questions={behavioralQuestions} onFinish={handleFinish} />
            </section>
          )}

          {results && (
            <section className="space-y-6">
              <BehaviorMatchResults results={results} onRetake={handleRetake} />
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default BehavioralMatchingPage;
