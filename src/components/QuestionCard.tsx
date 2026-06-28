import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Pencil,
  Trash2,
  CheckCircle2,
  Circle,
} from "lucide-react";
import type { Question, QuestionBase } from "../types";
import { QuestionForm } from "./QuestionForm";
import {
  useChoices,
  useUpdateQuestion,
  useDeleteQuestion,
} from "../hooks/useQuestions";
import { Badge, useToast, Skeleton, Modal, Confirm } from "../components/ui";
interface QuestionCardProps {
  question: Question;
  index: number;
}

export function QuestionCard({ question, index }: QuestionCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { toast } = useToast();

  const { data: choices, isLoading: choicesLoading } = useChoices(
    expanded || editOpen ? question.id : 0,
  );

  const updateMutation = useUpdateQuestion({
    onSuccess: () => {
      toast("Question updated!");
      setEditOpen(false);
    },
    onError: (msg) => toast(msg, "error"),
  });

  const deleteMutation = useDeleteQuestion({
    onSuccess: () => {
      toast("Question deleted");
      setDeleteOpen(false);
    },
    onError: (msg) => toast(msg, "error"),
  });

  const correctCount = choices?.filter((c) => c.is_correct).length ?? 0;

  return (
    <>
      <div
        className="bg-(--surface) border border-(--border) rounded-xl overflow-hidden transition-all duration-200 hover:border-(--accent)/30 animate-slide-in"
        style={{ animationDelay: `${index * 40}ms` }}
      >
        <div
          className="flex items-start gap-4 px-5 py-4 cursor-pointer select-none"
          onClick={() => setExpanded((x) => !x)}
        >
          <span
            className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
            style={{ background: "var(--accent)", color: "white" }}
          >
            {index + 1}
          </span>

          <p className="flex-1 text-sm font-medium text-(--text) leading-relaxed pt-0.5">
            {question.question_text}
          </p>

          <div className="flex items-center gap-2 ml-2 shrink-0">
            <button
              className="text-(--muted) hover:text-(--accent) transition-colors p-1 rounded"
              onClick={(e) => {
                e.stopPropagation();
                setEditOpen(true);
              }}
              title="Edit"
            >
              <Pencil size={14} />
            </button>
            <button
              className="text-(--muted) hover:text-(--wrong) transition-colors p-1 rounded"
              onClick={(e) => {
                e.stopPropagation();
                setDeleteOpen(true);
              }}
              title="Delete"
            >
              <Trash2 size={14} />
            </button>
            <span className="text-(--muted)">
              {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </span>
          </div>
        </div>

        {expanded && (
          <div className="px-5 pb-4 border-t border-(--border) pt-3 animate-fade-in">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-(--muted) uppercase tracking-wider font-medium">
                Choices
              </span>
              {choices && (
                <Badge variant="correct">{correctCount} correct</Badge>
              )}
            </div>

            {choicesLoading ? (
              <div className="flex flex-col gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-9 w-full" />
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {choices?.map((choice) => (
                  <div
                    key={choice.id}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg border text-sm"
                    style={{
                      borderColor: choice.is_correct
                        ? "var(--correct)"
                        : "var(--border)",
                      background: choice.is_correct
                        ? "rgba(34,197,94,0.05)"
                        : "var(--surface-2)",
                    }}
                  >
                    {choice.is_correct ? (
                      <CheckCircle2
                        size={15}
                        style={{ color: "var(--correct)", flexShrink: 0 }}
                      />
                    ) : (
                      <Circle
                        size={15}
                        style={{ color: "var(--muted)", flexShrink: 0 }}
                      />
                    )}
                    <span
                      style={{
                        color: choice.is_correct
                          ? "var(--text)"
                          : "var(--muted)",
                      }}
                    >
                      {choice.choice_text}
                    </span>
                    {choice.is_correct && (
                      <Badge variant="correct">Correct</Badge>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit Question"
        maxWidth="max-w-2xl"
      >
        {editOpen && choicesLoading && (
          <div className="flex flex-col gap-3">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        )}

        {editOpen && choices && (
          <QuestionForm
            initial={{
              question_text: question.question_text,
              choices: choices.map((c) => ({
                choice_text: c.choice_text,
                is_correct: c.is_correct,
              })),
            }}
            onSubmit={(data: QuestionBase) =>
              updateMutation.mutate({ id: question.id, question: data })
            }
            onCancel={() => setEditOpen(false)}
            loading={updateMutation.isPending}
          />
        )}
      </Modal>

      <Confirm
        open={deleteOpen}
        onCancel={() => setDeleteOpen(false)}
        onConfirm={() => deleteMutation.mutate(question.id)}
        loading={deleteMutation.isPending}
        title="Delete Question"
        message={`Delete "${question.question_text}"? This action cannot be undone.`}
      />
    </>
  );
}
