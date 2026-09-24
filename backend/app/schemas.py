from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, ConfigDict


class InterpretRequest(BaseModel):
    term: str
    exclude: list[str] = []


class InterpretOut(BaseModel):
    is_ambiguous: bool
    meanings: list[str]


class ConceptCreate(BaseModel):
    term: str
    definition: str


class ConceptOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    term: str
    definition: str
    status: str
    mastery_gauge: int
    created_at: datetime


class QuizRequest(BaseModel):
    type: Literal["mc", "free"]


class QuizOut(BaseModel):
    type: Literal["mc", "free"]
    question: str
    choices: Optional[list[str]] = None


class QuizAnswerRequest(BaseModel):
    question: str
    user_answer: str


class QuizAnswerOut(BaseModel):
    is_correct: Optional[bool] = None
    score: Optional[int] = None
    feedback: Optional[str] = None
    mastery_gauge: int
    mastery_ready: bool


class ExplainOut(BaseModel):
    explanation: str


class NoteCreate(BaseModel):
    body: str


class NoteOut(BaseModel):
    id: int
    concept_id: int
    concept_term: str
    body: str
    created_at: datetime
    is_backlink: bool


class CodeExample(BaseModel):
    input: str
    output: str


class CodeProblemListOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    difficulty: str


class CodeProblemOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    prompt: str
    constraints: str
    examples: list[CodeExample]
    difficulty: str


class CodeSubmitRequest(BaseModel):
    language: str
    code: str


class CodeFeedback(BaseModel):
    correctness: str
    complexity: str
    improvement: str


class CodeSubmitOut(BaseModel):
    passed: bool
    score: int
    feedback: CodeFeedback


class CodeSubmissionOut(BaseModel):
    id: int
    problem_id: int
    problem_title: str
    language: str
    passed: bool
    score: int
    feedback: CodeFeedback
    created_at: datetime
