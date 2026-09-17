from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.schemas import NoteCreate, NoteOut
from db.base import get_db
from db.models import Concept, Note, NoteLink
from tools.notes import extract_mentions

router = APIRouter()


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
