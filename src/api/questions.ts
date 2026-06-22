import axios from "axios";
import type { Question, Choice, QuestionBase } from "../types";

// Result type
type Ok<T> = { ok: true; data: T };
type Err = { ok: false; status: number; message: string };
export type Result<T> = Ok<T> | Err;

function ok<T>(data: T): Ok<T> {
  return { ok: true, data };
}
function err(status: number, message: string): Err {
  return { ok: false, status, message };
}

const STATUS_MESSAGES: Record<number, string> = {
  0: "Network error — check your connection",
  400: "Bad request",
  404: "Not found",
  422: "Validation error",
  500: "Server error — try again later",
};

async function request<T>(call: () => Promise<T>): Promise<Result<T>> {
  try {
    return ok(await call());
  } catch (e) {
    if (axios.isAxiosError(e)) {
      const status = e.response?.status ?? 0;
      const message =
        e.response?.data?.detail ??
        STATUS_MESSAGES[status] ??
        `Unexpected error (${status})`;
      return err(status, message);
    }
    return err(-1, e instanceof Error ? e.message : "Unknown error");
  }
}

const api = axios.create({ baseURL: "/api" });

// API functions
export const getQuestions = () =>
  request<Question[]>(() => api.get("/questions").then((r) => r.data));

export const getQuestion = (id: number) =>
  request<Question>(() => api.get(`/questions/${id}`).then((r) => r.data));

export const getChoices = (questionId: number) =>
  request<Choice[]>(() =>
    api.get(`/choices/${questionId}`).then((r) => r.data),
  );

export const createQuestion = (question: QuestionBase) =>
  request<{ message: string }>(() =>
    api.post("/questions", question).then((r) => r.data),
  );

export const updateQuestion = ({
  id,
  question,
}: {
  id: number;
  question: QuestionBase;
}) =>
  request<{ message: string }>(() =>
    api.put(`/questions/${id}`, question).then((r) => r.data),
  );

export const deleteQuestion = (id: number) =>
  request<{ message: string }>(() =>
    api.delete(`/questions/${id}`).then((r) => r.data),
  );
