"""코드 문제는 사용자가 등록하는 게 아니라 미리 준비된 콘텐츠라, concepts처럼
API로 생성하는 대신 앱 기동 시 없으면 채워 넣는다."""

from sqlalchemy.orm import Session

from db.models import CodeProblem

SEED_PROBLEMS = [
    {
        "title": "두 수의 합",
        "prompt": (
            "정수 배열 numbers와 목표값 target이 주어질 때, 더해서 target이 되는 "
            "두 원소의 인덱스를 오름차순으로 반환하세요."
        ),
        "constraints": "2 ≤ len(numbers) ≤ 10000\n정답은 유일\n같은 원소 재사용 불가",
        "examples": [
            {"input": "numbers=[2,7,11,15], target=9", "output": "[0,1]"},
            {"input": "numbers=[3,2,4], target=6", "output": "[1,2]"},
        ],
        "difficulty": "lv2",
    },
    {
        "title": "괄호 유효성 검사",
        "prompt": (
            "문자열 s가 주어질 때, 괄호가 올바르게 짝지어져 있으면 true, 아니면 "
            "false를 반환하세요. 괄호는 (), {}, [] 세 종류입니다."
        ),
        "constraints": "1 ≤ len(s) ≤ 10000\n문자열은 괄호 문자로만 구성",
        "examples": [
            {"input": 's="()[]{}"', "output": "true"},
            {"input": 's="(]"', "output": "false"},
        ],
        "difficulty": "lv1",
    },
]


def seed_code_problems(db: Session) -> None:
    if db.query(CodeProblem).first():
        return
    for data in SEED_PROBLEMS:
        db.add(CodeProblem(**data))
    db.commit()
