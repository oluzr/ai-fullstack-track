from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.schemas import (
    ConceptCreate,
    ConceptOut,
    ExplainOut,
    InterpretOut,
    InterpretRequest,
    QuizAnswerOut,
    QuizAnswerRequest,
    QuizOut,
    QuizRequest,
)
from db.base import get_db
from db.models import Concept, QuizAttempt
from tools import explain as explain_tools
from tools import gauge as gauge_tools
from tools import meanings as meaning_tools
from tools import quiz as quiz_tools

router = APIRouter()


@router.post("/concepts/interpret", response_model=InterpretOut)
def interpret_term(payload: InterpretRequest):
    result = meaning_tools.infer_meanings(payload.term, payload.exclude)
    return InterpretOut(**result)


@router.post("/concepts", response_model=ConceptOut)
def create_concept(payload: ConceptCreate, db: Session = Depends(get_db)):
    existing = db.query(Concept).filter(Concept.term == payload.term).first()
    if existing:
        raise HTTPException(status_code=400, detail="이미 등록된 개념입니다")

    concept = Concept(term=payload.term, definition=payload.definition)
    db.add(concept)
    db.commit()
    db.refresh(concept)
    return concept


@router.get("/concepts", response_model=list[ConceptOut])
def list_concepts(status: str = "active", db: Session = Depends(get_db)):
    return db.query(Concept).filter(Concept.status == status).all()


@router.post("/concepts/{concept_id}/explain", response_model=ExplainOut)
def explain_concept(concept_id: int, db: Session = Depends(get_db)):
    concept = db.get(Concept, concept_id)
    if not concept:
        raise HTTPException(status_code=404, detail="concept not found")

    result = explain_tools.explain_concept(concept.term, concept.definition)
    return ExplainOut(**result)


@router.post("/concepts/{concept_id}/quiz", response_model=QuizOut)
def create_quiz(concept_id: int, payload: QuizRequest, db: Session = Depends(get_db)):
    concept = db.get(Concept, concept_id)
    if not concept:
        raise HTTPException(status_code=404, detail="concept not found")

    if payload.type == "mc":
        generated = quiz_tools.generate_mc_question(db, concept_id)
        question = generated["question"]
        choices = generated["choices"]
        correct_answer = generated["correct_answer"]
    else:
        question = quiz_tools.generate_free_prompt(db, concept_id)
        choices = None
        correct_answer = None

    attempt = QuizAttempt(
        concept_id=concept_id,
        type=payload.type,
        question=question,
        choices=choices,
        correct_answer=correct_answer,
    )
    db.add(attempt)
    db.commit()

    return QuizOut(type=payload.type, question=question, choices=choices)


@router.post("/concepts/{concept_id}/quiz/answer", response_model=QuizAnswerOut)
def answer_quiz(
    concept_id: int, payload: QuizAnswerRequest, db: Session = Depends(get_db)
):
    concept = db.get(Concept, concept_id)
    if not concept:
        raise HTTPException(status_code=404, detail="concept not found")

    attempt = (
        db.query(QuizAttempt)
        .filter(
            QuizAttempt.concept_id == concept_id,
            QuizAttempt.question == payload.question,
            QuizAttempt.user_answer.is_(None),
        )
        .order_by(QuizAttempt.created_at.desc())
        .first()
    )
    if not attempt:
        raise HTTPException(status_code=404, detail="해당 문제를 찾을 수 없습니다")

    feedback = None
    is_correct = None
    score = None

    if attempt.type == "mc":
        is_correct = payload.user_answer == attempt.correct_answer
    else:
        result = quiz_tools.grade_free_answer(db, concept_id, payload.user_answer)
        score = result["score"]
        feedback = result.get("feedback")

    attempt.user_answer = payload.user_answer
    attempt.is_correct = is_correct
    attempt.score = score
    db.commit()

    gauge_result = gauge_tools.apply_result(db, concept_id, is_correct, score)

    return QuizAnswerOut(
        is_correct=is_correct,
        score=score,
        feedback=feedback,
        mastery_gauge=gauge_result["new_gauge"],
        mastery_ready=gauge_result["mastery_ready"],
    )


@router.post("/concepts/{concept_id}/master", response_model=ConceptOut)
def master_concept(concept_id: int, db: Session = Depends(get_db)):
    concept = db.get(Concept, concept_id)
    if not concept:
        raise HTTPException(status_code=404, detail="concept not found")

    concept.status = "mastered"
    db.commit()
    db.refresh(concept)
    return concept
