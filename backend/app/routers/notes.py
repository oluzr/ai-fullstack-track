from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session

from app.schemas import NoteCreate, NoteOut
from db.base import get_db
from db.models import Concept, Note, NoteLink
from tools.notes import extract_mentions

router = APIRouter()


@router.get("/notes", response_model=list[NoteOut])
def list_all_notes(db: Session = Depends(get_db)):
    rows = (
        db.query(Note, Concept)
        .join(Concept, Concept.id == Note.concept_id)
        .order_by(Note.created_at.desc())
        .all()
    )
    return [
        NoteOut(
            id=n.id,
            concept_id=n.concept_id,
            concept_term=c.term,
            body=n.body,
            created_at=n.created_at,
            is_backlink=False,
        )
        for n, c in rows
    ]


@router.post("/concepts/{concept_id}/notes", response_model=NoteOut)
def create_note(concept_id: int, payload: NoteCreate, db: Session = Depends(get_db)):
    concept = db.get(Concept, concept_id)
    if not concept:
        raise HTTPException(status_code=404, detail="concept not found")

    note = Note(concept_id=concept_id, body=payload.body)
    db.add(note)
    db.commit()
    db.refresh(note)

    extract_mentions(db, note)

    return NoteOut(
        id=note.id,
        concept_id=note.concept_id,
        concept_term=concept.term,
        body=note.body,
        created_at=note.created_at,
        is_backlink=False,
    )


@router.get("/concepts/{concept_id}/notes", response_model=list[NoteOut])
def list_notes(concept_id: int, db: Session = Depends(get_db)):
    concept = db.get(Concept, concept_id)
    if not concept:
        raise HTTPException(status_code=404, detail="concept not found")

    own_notes = db.query(Note).filter(Note.concept_id == concept_id).all()
    own_out = [
        NoteOut(
            id=n.id,
            concept_id=n.concept_id,
            concept_term=concept.term,
            body=n.body,
            created_at=n.created_at,
            is_backlink=False,
        )
        for n in own_notes
    ]

    backlinked = (
        db.query(Note, Concept)
        .join(NoteLink, NoteLink.note_id == Note.id)
        .join(Concept, Concept.id == Note.concept_id)
        .filter(NoteLink.mentioned_concept_id == concept_id)
        .all()
    )
    backlink_out = [
        NoteOut(
            id=n.id,
            concept_id=n.concept_id,
            concept_term=c.term,
            body=n.body,
            created_at=n.created_at,
            is_backlink=True,
        )
        for n, c in backlinked
    ]

    return own_out + backlink_out


@router.delete("/notes/{note_id}", status_code=204)
def delete_note(note_id: int, db: Session = Depends(get_db)):
    """메모와 그 메모가 만든 백링크(note_links)를 함께 지운다 — cascade는 Note.links 참고."""
    note = db.get(Note, note_id)
    if not note:
        raise HTTPException(status_code=404, detail="note not found")
    db.delete(note)
    db.commit()
    return Response(status_code=204)
