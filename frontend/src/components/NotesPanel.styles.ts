import styled, { css } from 'styled-components'

export const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 14px;
`

export const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: ${(p) => p.theme.color.ink};
`

export const NoteForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

export const NotesGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const GroupLabel = styled.h3`
  font-size: 13px;
  font-weight: 600;
  color: ${(p) => p.theme.color.ink3};
`

// 참고 이미지처럼 작은 정사각형 타일을 그리드로 늘어놓는다. 색은 팔레트를
// 순환시켜서 타일마다 다른 파스텔 톤이 되게 한다.
export const NotesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(92px, 1fr));
  gap: 10px;
`

const PALETTE_LIGHT = ['#ffd6d6', '#fff2b0', '#d8f5cd', '#e3daf9', '#dfe7fb']
const PALETTE_DARK = ['rgb(131 57 64)', '#4a4326', '#25422c', '#332a4a', '#28324a']

const paletteRules = (palette: string[]) =>
  palette.map(
    (color, i) => css`
      &:nth-of-type(${palette.length}n + ${i + 1}) {
        background: ${color};
      }
    `,
  )

export const NoteTile = styled.button`
  position: relative;
  aspect-ratio: 1;
  display: flex;
  align-items: flex-start;
  padding: 10px;
  border: none;
  border-radius: ${(p) => p.theme.radius.md};
  color: ${(p) => p.theme.color.ink2};
  cursor: pointer;
  text-align: left;
  transition: transform 0.15s;

  &:hover {
    transform: translateY(-3px);
  }

  ${(p) => paletteRules(p.theme.name === 'light' ? PALETTE_LIGHT : PALETTE_DARK)}
`

// 문서/링크 아이콘은 타일 우측 상단에 작게, 살짝 흐리게
export const NoteTileIcon = styled.span`
  position: absolute;
  top: 8px;
  right: 8px;
  font-size: 13px;
  display: flex;
  opacity: 0.55;
`

export const NoteTileLabel = styled.span`
  font-size: 11px;
  font-weight: 500;
  line-height: 1.35;
  padding-right: 14px;
  color:${(p)=>p.theme.color.fontMain};
  /* 세 줄까지 보여주고 그 이상은 잘라낸다 */
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

// 평소엔 숨어있다가 타일에 마우스를 올리면 우측 하단에 나타나는 이동 화살표
export const NoteTileArrow = styled.span`
  position: absolute;
  bottom: 8px;
  right: 8px;
  display: flex;
  font-size: 14px;
  color: ${(p) => p.theme.color.ink};
  opacity: 0;
  transform: translate(-3px, 3px);
  transition: opacity 0.15s, transform 0.15s;

  ${NoteTile}:hover & {
    opacity: 0.8;
    transform: translate(0, 0);
  }
`
