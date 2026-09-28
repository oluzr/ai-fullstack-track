from datetime import datetime, timezone

from sqlalchemy import JSON, Boolean, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from db.base import Base


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


class Concept(Base):
    __tablename__ = "concepts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    term: Mapped[str] = mapped_column(String, nullable=False, unique=True, index=True)
    definition: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[str] = mapped_column(String, nullable=False, default="active")
    mastery_gauge: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow)

    quiz_attempts: Mapped[list["QuizAttempt"]] = relationship(
        back_populates="concept", cascade="all, delete-orphan"
    )
    notes: Mapped[list["Note"]] = relationship(
        back_populates="concept", cascade="all, delete-orphan"
    )


class QuizAttempt(Base):
    __tablename__ = "quiz_attempts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    concept_id: Mapped[int] = mapped_column(ForeignKey("concepts.id"), nullable=False)
    type: Mapped[str] = mapped_column(String, nullable=False)  # mc | free
    question: Mapped[str] = mapped_column(Text, nullable=False)
    choices: Mapped[list[str] | None] = mapped_column(JSON, nullable=True)
    correct_answer: Mapped[str | None] = mapped_column(Text, nullable=True)
    user_answer: Mapped[str | None] = mapped_column(Text, nullable=True)
    score: Mapped[int | None] = mapped_column(Integer, nullable=True)
    is_correct: Mapped[bool | None] = mapped_column(Boolean, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow)

    concept: Mapped["Concept"] = relationship(back_populates="quiz_attempts")


class Note(Base):
    __tablename__ = "notes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    concept_id: Mapped[int] = mapped_column(ForeignKey("concepts.id"), nullable=False)
    body: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow)

    concept: Mapped["Concept"] = relationship(back_populates="notes")
    links: Mapped[list["NoteLink"]] = relationship(
        back_populates="note", cascade="all, delete-orphan"
    )


class NoteLink(Base):
    __tablename__ = "note_links"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    note_id: Mapped[int] = mapped_column(ForeignKey("notes.id"), nullable=False)
    mentioned_concept_id: Mapped[int] = mapped_column(
        ForeignKey("concepts.id"), nullable=False
    )

    note: Mapped["Note"] = relationship(back_populates="links")
    mentioned_concept: Mapped["Concept"] = relationship()


class CodeProblem(Base):
    __tablename__ = "code_problems"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String, nullable=False)
    prompt: Mapped[str] = mapped_column(Text, nullable=False)
    constraints: Mapped[str] = mapped_column(Text, nullable=False)
    examples: Mapped[list[dict]] = mapped_column(JSON, nullable=False)
    difficulty: Mapped[str] = mapped_column(String, nullable=False, default="lv1")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow)

    submissions: Mapped[list["CodeSubmission"]] = relationship(
        back_populates="problem", cascade="all, delete-orphan"
    )


class CodeSubmission(Base):
    __tablename__ = "code_submissions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    problem_id: Mapped[int] = mapped_column(ForeignKey("code_problems.id"), nullable=False)
    language: Mapped[str] = mapped_column(String, nullable=False)
    code: Mapped[str] = mapped_column(Text, nullable=False)
    passed: Mapped[bool] = mapped_column(Boolean, nullable=False)
    score: Mapped[int] = mapped_column(Integer, nullable=False)
    feedback: Mapped[dict] = mapped_column(JSON, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow)

    problem: Mapped["CodeProblem"] = relationship(back_populates="submissions")


class ChatSession(Base):
    """채팅 패널을 한 번 열어 나눈 대화 묶음. title은 첫 사용자 메시지에서 따온다."""

    __tablename__ = "chat_sessions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow)

    messages: Mapped[list["ChatMessage"]] = relationship(
        back_populates="session",
        cascade="all, delete-orphan",
        order_by="ChatMessage.id",
    )


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    session_id: Mapped[int] = mapped_column(ForeignKey("chat_sessions.id"), nullable=False)
    role: Mapped[str] = mapped_column(String, nullable=False)  # user | assistant
    text: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow)

    session: Mapped["ChatSession"] = relationship(back_populates="messages")
