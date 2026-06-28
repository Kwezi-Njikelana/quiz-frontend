import { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  ChevronRight,
  Trophy,
  RotateCcw,
  Loader2,
} from "lucide-react";
import type { Choice } from "../types";
import { useQuestions, useChoices } from "../hooks/useQuestions";
import { Button, Card } from "../components/ui";

interface QuizState {
  currentIdx: number;
  selected: number | null;
  revealed: boolean;
  score: number;
  answers: { questionId: number; correct: boolean }[];
}

export function QuizMode({ onExit }: { onExit: () => void }) {
  const { data: questions, isLoading } = useQuestions();

  const [state, setState] = useState<QuizState>({
    currentIdx: 0,
    selected: null,
    revealed: false,
    score: 0,
    answers: [],
  });

  const currentQuestion = questions?.[state.currentIdx];

  const { data: choices, isLoading: choicesLoading } = useChoices(
    currentQuestion?.id ?? 0,
  );

  const isFinished = questions && state.currentIdx >= questions.length;

  const handleSelect = (choice: Choice) => {
    if (state.revealed) return;
    setState((s) => ({ ...s, selected: choice.id }));
  };

  const handleReveal = () => {
    if (state.selected === null) return;
    const correct =
      choices?.find((c) => c.id === state.selected)?.is_correct ?? false;
    setState((s) => ({
      ...s,
      revealed: true,
      score: correct ? s.score + 1 : s.score,
      answers: [...s.answers, { questionId: currentQuestion!.id, correct }],
    }));
  };

  const handleNext = () => {
    setState((s) => ({
      ...s,
      currentIdx: s.currentIdx + 1,
      selected: null,
      revealed: false,
    }));
  };

  const handleRestart = () => {
    setState({
      currentIdx: 0,
      selected: null,
      revealed: false,
      score: 0,
      answers: [],
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-(--muted)">
        <Loader2 className="animate-spin mr-2" size={20} /> Loading quiz…
      </div>
    );
  }

  if (!questions?.length) {
    return (
      <div className="text-center py-20">
        <p className="text-(--muted) mb-4">
          No questions available. Add some first!
        </p>
        <Button variant="outline" onClick={onExit}>
          Go Back
        </Button>
      </div>
    );
  }

  if (isFinished) {
    const pct = Math.round((state.score / questions.length) * 100);
    const grade =
      pct >= 80 ? "excellent" : pct >= 60 ? "good" : "keep practicing";
    return (
      <div className="flex flex-col items-center gap-6 py-10 animate-slide-in max-w-md mx-auto">
        <div className="relative">
          <div
            className="w-28 h-28 rounded-full flex items-center justify-center text-4xl font-bold"
            style={{
              background: `conic-gradient(var(--accent) ${pct}%, var(--surface-2) ${pct}%)`,
            }}
          >
            <div className="w-20 h-20 rounded-full bg-(--surface) flex items-center justify-center">
              <Trophy size={28} style={{ color: "var(--accent-2)" }} />
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold mb-1">
            {state.score}/{questions.length}
          </h2>
          <p className="text-(--muted) text-sm capitalize">{grade}</p>
        </div>

        <div className="flex flex-col gap-2 w-full">
          {state.answers.map((a, i) => (
            <div
              key={i}
              className="flex items-center justify-between px-4 py-2.5 rounded-lg border"
              style={{
                borderColor: a.correct ? "var(--correct)" : "var(--wrong)",
                background: a.correct
                  ? "rgba(34,197,94,0.05)"
                  : "rgba(239,68,68,0.05)",
              }}
            >
              <span className="text-xs text-(--muted)">Q{i + 1}</span>
              {a.correct ? (
                <CheckCircle2 size={14} style={{ color: "var(--correct)" }} />
              ) : (
                <XCircle size={14} style={{ color: "var(--wrong)" }} />
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-3 w-full">
          <Button variant="outline" className="flex-1" onClick={onExit}>
            Exit
          </Button>
          <Button className="flex-1" onClick={handleRestart}>
            <RotateCcw size={14} /> Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto animate-slide-in">
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs text-(--muted) mb-2">
          <span>
            Question {state.currentIdx + 1} of {questions.length}
          </span>
          <span className="font-medium" style={{ color: "var(--accent)" }}>
            Score: {state.score}
          </span>
        </div>
        <div className="h-1.5 bg-(--surface-2) rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${(state.currentIdx / questions.length) * 100}%`,
              background: "var(--accent)",
            }}
          />
        </div>
      </div>

      {/* Question */}
      <Card className="mb-5">
        <p className="text-base font-semibold leading-relaxed">
          {currentQuestion?.question_text}
        </p>
      </Card>

      {/* Choices */}
      {choicesLoading ? (
        <div className="flex items-center justify-center py-8 text-(--muted)">
          <Loader2 className="animate-spin" size={18} />
        </div>
      ) : (
        <div className="flex flex-col gap-2 mb-6">
          {choices?.map((choice) => {
            const isSelected = state.selected === choice.id;
            const showResult = state.revealed;
            let borderColor = "var(--border)";
            let bg = "var(--surface)";
            if (showResult && choice.is_correct) {
              borderColor = "var(--correct)";
              bg = "rgba(34,197,94,0.08)";
            } else if (showResult && isSelected && !choice.is_correct) {
              borderColor = "var(--wrong)";
              bg = "rgba(239,68,68,0.08)";
            } else if (!showResult && isSelected) {
              borderColor = "var(--accent)";
              bg = "var(--accent-glow)";
            }

            return (
              <button
                key={choice.id}
                onClick={() => handleSelect(choice)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all duration-150 w-full text-sm"
                style={{
                  borderColor,
                  background: bg,
                  cursor: showResult ? "default" : "pointer",
                }}
              >
                <span className="flex-1 text-(--text)">
                  {choice.choice_text}
                </span>
                {showResult && choice.is_correct && (
                  <CheckCircle2 size={16} style={{ color: "var(--correct)" }} />
                )}
                {showResult && isSelected && !choice.is_correct && (
                  <XCircle size={16} style={{ color: "var(--wrong)" }} />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Actions */}
      {!state.revealed ? (
        <Button
          className="w-full"
          onClick={handleReveal}
          disabled={state.selected === null}
        >
          Check Answer
        </Button>
      ) : (
        <Button className="w-full" onClick={handleNext}>
          {state.currentIdx + 1 < questions.length ? (
            <>
              Next <ChevronRight size={14} />
            </>
          ) : (
            "See Results"
          )}
        </Button>
      )}
    </div>
  );
}
