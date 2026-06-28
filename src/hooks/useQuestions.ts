import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getQuestions,
  getQuestion,
  getChoices,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} from "../api/questions";
import type { QuestionBase } from "../types";

// Query keys
export const questionKeys = {
  all: () => ["questions"] as const,
  detail: (id: number) => ["questions", id] as const,
  choices: (id: number) => ["choices", id] as const,
};

function unwrap<T>(
  result:
    | { ok: true; data: T }
    | { ok: false; status: number; message: string },
): T {
  if (!result.ok) throw new Error(result.message);
  return result.data;
}

// Queries
export function useQuestions() {
  return useQuery({
    queryKey: questionKeys.all(),
    queryFn: () => getQuestions().then(unwrap),
  });
}

export function useQuestion(id: number) {
  return useQuery({
    queryKey: questionKeys.detail(id),
    queryFn: () => getQuestion(id).then(unwrap),
    enabled: !!id,
  });
}

export function useChoices(questionId: number) {
  return useQuery({
    queryKey: questionKeys.choices(questionId),
    queryFn: () => getChoices(questionId).then(unwrap),
    enabled: !!questionId,
  });
}

// Mutations
export function useCreateQuestion(callbacks?: {
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (question: QuestionBase) => createQuestion(question),
    onSuccess: (result) => {
      if (result.ok) {
        queryClient.invalidateQueries({ queryKey: questionKeys.all() });
        callbacks?.onSuccess?.(result.data.message);
      } else {
        callbacks?.onError?.(result.message);
      }
    },
    onError: () => callbacks?.onError?.("Unexpected error"),
  });
}

export function useUpdateQuestion(callbacks?: {
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, question }: { id: number; question: QuestionBase }) =>
      updateQuestion({ id, question }),
    onSuccess: (result, { id }) => {
      if (result.ok) {
        queryClient.invalidateQueries({ queryKey: questionKeys.all() });
        queryClient.invalidateQueries({ queryKey: questionKeys.choices(id) });
        callbacks?.onSuccess?.(result.data.message);
      } else {
        callbacks?.onError?.(result.message);
      }
    },
    onError: () => callbacks?.onError?.("Unexpected error"),
  });
}

export function useDeleteQuestion(callbacks?: {
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteQuestion(id),
    onSuccess: (result) => {
      if (result.ok) {
        queryClient.invalidateQueries({ queryKey: questionKeys.all() });
        callbacks?.onSuccess?.(result.data.message);
      } else {
        callbacks?.onError?.(result.message);
      }
    },
    onError: () => callbacks?.onError?.("Unexpected error"),
  });
}
