export interface Choice {
  id: number;
  choice_text: string;
  is_correct: boolean;
  question_id: number;
}

export interface Question {
  id: number;
  question_text: string;
}

export interface ChoiceBase {
  choice_text: string;
  is_correct: boolean;
}

export interface QuestionBase {
  question_text: string;
  choices: ChoiceBase[];
}
