import { useState } from "react";
import { Plus, Trash2, CheckCircle2, Circle } from "lucide-react";
import type { QuestionBase, ChoiceBase } from "../types";
import { Badge, Input, Button } from "../components/ui";

interface QuestionFormProps {
  initial?: QuestionBase;
  onSubmit: (data: QuestionBase) => void;
  onCancel: () => void;
  loading?: boolean;
}

const emptyChoice = (): ChoiceBase => ({ choice_text: "", is_correct: false });

export function QuestionForm({
  initial,
  onSubmit,
  onCancel,
  loading,
}: QuestionFormProps) {
  const [questionText, setQuestionText] = useState(
    initial?.question_text ?? "",
  );
  const [choices, setChoices] = useState<ChoiceBase[]>(
    initial?.choices ?? [
      emptyChoice(),
      emptyChoice(),
      emptyChoice(),
      emptyChoice(),
    ],
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!questionText.trim()) e.question = "Question text is required";
    const filled = choices.filter((c) => c.choice_text.trim());
    if (filled.length < 2) e.choices = "At least 2 choices are required";
    if (!choices.some((c) => c.is_correct && c.choice_text.trim()))
      e.correct = "Mark at least one correct answer";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    onSubmit({
      question_text: questionText.trim(),
      choices: choices.filter((c) => c.choice_text.trim()),
    });
  };

  const updateChoice = (i: number, patch: Partial<ChoiceBase>) => {
    setChoices((cs) =>
      cs.map((c, idx) => (idx === i ? { ...c, ...patch } : c)),
    );
  };

  const toggleCorrect = (i: number) => {
    updateChoice(i, { is_correct: !choices[i].is_correct });
  };

  const removeChoice = (i: number) => {
    setChoices((cs) => cs.filter((_, idx) => idx !== i));
  };

  const correctCount = choices.filter(
    (c) => c.is_correct && c.choice_text.trim(),
  ).length;

  return (
    <div className="flex flex-col gap-5">
      <div>
        <Input
          label="Question"
          placeholder="What is the capital of France?"
          value={questionText}
          onChange={(e) => {
            setQuestionText(e.target.value);
            setErrors((x) => ({ ...x, question: "" }));
          }}
          error={errors.question}
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-(--muted) uppercase tracking-wider">
            Choices
          </span>
          <div className="flex items-center gap-2">
            {correctCount > 0 && (
              <Badge variant="correct">{correctCount} correct</Badge>
            )}
            <button
              type="button"
              onClick={() => setChoices((cs) => [...cs, emptyChoice()])}
              className="text-xs text-(--accent) hover:underline flex items-center gap-1"
            >
              <Plus size={12} /> Add choice
            </button>
          </div>
        </div>

        {(errors.choices || errors.correct) && (
          <p className="text-xs text-(--wrong) mb-2">
            {errors.choices || errors.correct}
          </p>
        )}

        <div className="flex flex-col gap-2">
          {choices.map((choice, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-150
                ${
                  choice.is_correct && choice.choice_text.trim()
                    ? "border-(--correct)/40 bg-(--correct)/5"
                    : "border-(--border) bg-(--surface-2)"
                }`}
            >
              <button
                type="button"
                onClick={() => toggleCorrect(i)}
                className={`shrink-0 transition-colors ${
                  choice.is_correct
                    ? "text-(--correct)"
                    : "text-(--muted) hover:text-(--text)"
                }`}
                title="Mark as correct"
              >
                {choice.is_correct ? (
                  <CheckCircle2 size={18} />
                ) : (
                  <Circle size={18} />
                )}
              </button>

              <input
                className="flex-1 bg-transparent text-sm text-(--text) outline-none placeholder:text-(--muted)"
                placeholder={`Choice ${i + 1}…`}
                value={choice.choice_text}
                onChange={(e) =>
                  updateChoice(i, { choice_text: e.target.value })
                }
              />

              {choices.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeChoice(i)}
                  className="text-(--muted) hover:text-(--wrong) transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
        <p className="text-xs text-(--muted) mt-2 flex items-center gap-1">
          <CheckCircle2 size={11} /> Click the circle to mark correct answer(s)
        </p>
      </div>

      <div className="flex gap-3 justify-end pt-2 border-t border-(--border)">
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} loading={loading}>
          {initial ? "Save Changes" : "Create Question"}
        </Button>
      </div>
    </div>
  );
}
