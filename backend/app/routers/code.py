from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.schemas import (
    CodeProblemListOut,
    CodeProblemOut,
    CodeSubmissionOut,
    CodeSubmitOut,
    CodeSubmitRequest,
)
from db.base import get_db
from db.models import CodeProblem, CodeSubmission
from tools import code_review as code_review_tools

router = APIRouter(prefix="/code")


@router.get("/problems", response_model=list[CodeProblemListOut])
def list_problems(db: Session = Depends(get_db)):
    return db.query(CodeProblem).order_by(CodeProblem.id).all()


@router.get("/problems/{problem_id}", response_model=CodeProblemOut)
def get_problem(problem_id: int, db: Session = Depends(get_db)):
    problem = db.get(CodeProblem, problem_id)
    if not problem:
        raise HTTPException(status_code=404, detail="problem not found")
    return problem


@router.post("/problems/{problem_id}/submit", response_model=CodeSubmitOut)
def submit_solution(
    problem_id: int, payload: CodeSubmitRequest, db: Session = Depends(get_db)
):
    problem = db.get(CodeProblem, problem_id)
    if not problem:
        raise HTTPException(status_code=404, detail="problem not found")

    result = code_review_tools.review_submission(
        {
            "title": problem.title,
            "prompt": problem.prompt,
            "constraints": problem.constraints,
            "examples": problem.examples,
        },
        payload.language,
        payload.code,
    )

    submission = CodeSubmission(
        problem_id=problem_id,
        language=payload.language,
        code=payload.code,
        passed=result["passed"],
        score=result["score"],
        feedback=result["feedback"],
    )
    db.add(submission)
    db.commit()

    return CodeSubmitOut(**result)


@router.get("/submissions", response_model=list[CodeSubmissionOut])
def list_submissions(db: Session = Depends(get_db)):
    rows = (
        db.query(CodeSubmission, CodeProblem)
        .join(CodeProblem, CodeProblem.id == CodeSubmission.problem_id)
        .order_by(CodeSubmission.created_at.desc())
        .all()
    )
    return [
        CodeSubmissionOut(
            id=submission.id,
            problem_id=submission.problem_id,
            problem_title=problem.title,
            language=submission.language,
            passed=submission.passed,
            score=submission.score,
            feedback=submission.feedback,
            created_at=submission.created_at,
        )
        for submission, problem in rows
    ]
